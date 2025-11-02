import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { PapelPessoa } from '@prisma/client'
import prisma from '~/server/lib/prisma'

const pessoaSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1),
    sobrenome: z.string().min(1),
})

type PessoaInput = z.infer<typeof pessoaSchema>;

const jsonString = <T extends z.ZodTypeAny>(schema: T) =>
    z.string().transform((val) => {
        try { return JSON.parse(val) }
        catch (e) { return val }
    }).pipe(schema);
const numberArrayString = z.string().transform(val => val.split(',').map(Number).filter(n => !isNaN(n)));
const stringArrayString = z.string().transform(val => val.split(',').map(p => p.trim()).filter(Boolean));

const schema = z.object({
    titulo: z.string().min(1).optional(),
    dataDefesa: z.string().min(1).optional(),
    resumo: z.string().min(1).optional(),
    tipoDocumentalId: z.string().transform(val => Number(val)).optional(),
    cursoId: z.string().transform(val => Number(val)).optional(),

    palavrasChaveParaAdicionar: stringArrayString.optional(),
    autoresParaAdicionar: jsonString(z.array(pessoaSchema).min(1)).optional(),
    orientadoresParaAdicionar: jsonString(z.array(pessoaSchema).min(1)).optional(),

    idsPalavrasChaveParaRemover: numberArrayString.optional(),
    idsPessoasParaRemover: numberArrayString.optional(),
})

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id')
    const idAsNumber = Number(idParam)

    if (!idAsNumber || isNaN(idAsNumber)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do trabalho é inválido.',
        });
    }

    try {
        const formData = await readMultipartFormData(event)
        const formValues = formData?.reduce((acc, part) => {
            if (part.name) { acc[part.name] = part.data.toString() }
            return acc
        }, {} as Record<string, string>) ?? {}

        const validatedData = schema.parse(formValues)
        console.log('=== FORM VALUES PARSED ===')
        console.dir(validatedData, { depth: null })


        const {
            cursoId,
            tipoDocumentalId,
            autoresParaAdicionar,
            orientadoresParaAdicionar,
            palavrasChaveParaAdicionar,
            idsPessoasParaRemover,
            idsPalavrasChaveParaRemover,
            dataDefesa,
            ...restoDosDados
        } = validatedData

        const dadosParaPrisma: any = { ...restoDosDados }

        if (dataDefesa) dadosParaPrisma.dataDefesa = new Date(dataDefesa)
        if (cursoId) dadosParaPrisma.curso = { connect: { id: cursoId } }
        if (tipoDocumentalId) dadosParaPrisma.tipoDocumental = { connect: { id: tipoDocumentalId } }

        if (palavrasChaveParaAdicionar || idsPalavrasChaveParaRemover) {
            if (idsPalavrasChaveParaRemover && idsPalavrasChaveParaRemover.length > 0) {
                await prisma.trabalhoPalavraChave.deleteMany({
                    where: {
                        trabalho_id: idAsNumber,
                        palavrachave_id: { in: idsPalavrasChaveParaRemover },
                    },
                });
            }
            if (palavrasChaveParaAdicionar && palavrasChaveParaAdicionar.length > 0) {
                const palavrasChaveSalvas = await Promise.all(
                    palavrasChaveParaAdicionar.map((nome: string) =>
                        prisma.palavraChave.upsert({
                            where: { nome },
                            update: {},
                            create: { nome },
                        })
                    )
                );
                await prisma.trabalhoPalavraChave.createMany({
                    data: palavrasChaveSalvas.map(pc => ({
                        trabalho_id: idAsNumber,
                        palavrachave_id: pc.id,
                    })),
                    skipDuplicates: true,
                });
            }
        }

        const trabalhoExistente = await prisma.trabalho.findUnique({
            where: { id: idAsNumber },
            include: { pessoas: true }
        })

        if (idsPessoasParaRemover?.length) {
            await prisma.trabalhoPessoa.deleteMany({
                where: {
                    trabalho_id: idAsNumber,
                    pessoa_id: { in: idsPessoasParaRemover },
                },
            });
        }
        if (autoresParaAdicionar?.length) {
            for (const a of autoresParaAdicionar) {
                const pessoa = a.id ? await prisma.pessoa.findUnique({ where: { id: a.id } })
                : await prisma.pessoa.upsert({
                    where: { nome_sobrenome: { nome: a.nome.trim(), sobrenome: a.sobrenome.trim() } },
                    update: {},
                    create: { nome: a.nome.trim(), sobrenome: a.sobrenome.trim() }
                })
                const jaExiste = await prisma.trabalhoPessoa.findFirst({
                    where: {
                        trabalho_id: idAsNumber,
                        pessoa_id: pessoa!.id,
                        papel: PapelPessoa.AUTOR,
                    },
                })
                if (!jaExiste) {
                    await prisma.trabalhoPessoa.create({
                        data: {
                            trabalho_id: idAsNumber,
                            pessoa_id: pessoa!.id,
                            papel: PapelPessoa.AUTOR,
                        },
                    })
                }
            }
        }
        if (orientadoresParaAdicionar?.length) {
            for (const o of orientadoresParaAdicionar) {
                const pessoa = o.id ? await prisma.pessoa.findUnique({ where: { id: o.id } })
                : await prisma.pessoa.upsert({
                    where: { nome_sobrenome: { nome: o.nome.trim(), sobrenome: o.sobrenome.trim() } },
                    update: {},
                    create: { nome: o.nome.trim(), sobrenome: o.sobrenome.trim() }
                })
                const jaExiste = await prisma.trabalhoPessoa.findFirst({
                    where: {
                        trabalho_id: idAsNumber,
                        pessoa_id: pessoa!.id,
                        papel: PapelPessoa.ORIENTADOR,
                    },
                })
                if (!jaExiste) {
                    await prisma.trabalhoPessoa.create({
                        data: {
                            trabalho_id: idAsNumber,
                            pessoa_id: pessoa!.id,
                            papel: PapelPessoa.ORIENTADOR,
                        },
                    })
                }
            }
        }


        const arquivoData = formData?.find(d => d.name === 'arquivo')
        if (arquivoData) {
            const trabalhoAntigo = await prisma.trabalho.findUnique({
                where: { id: idAsNumber },
                select: { arquivo: true }
            })

            const fileExtension = arquivoData.filename?.split('.').pop() || 'pdf'
            const uniqueFileName = `${nanoid()}.${fileExtension}`
            const uploadDir = resolve(process.cwd(), 'public/uploads')
            const filePath = `${uploadDir}/${uniqueFileName}`

            mkdirSync(uploadDir, { recursive: true })
            writeFileSync(filePath, arquivoData.data)

            dadosParaPrisma.arquivo = `/uploads/${uniqueFileName}`

            if (trabalhoAntigo?.arquivo) {
                const oldFilePath = resolve(process.cwd(), `public${trabalhoAntigo.arquivo}`)
                if (existsSync(oldFilePath)) {
                    unlinkSync(oldFilePath)
                }
            }
        }

        const trabalhoAtualizado = await prisma.trabalho.update({
            where: { id: idAsNumber },
            data: dadosParaPrisma,
            include: {
                pessoas: { include: { pessoa: true }, },
                palavrasChave: { include: { palavraChave: true }, },
            },
        });
        return trabalhoAtualizado
    } catch (error: any) {
        console.error('--- ERRO NA API DE EDIÇÃO DE TRABALHO ---', error)
        if (error instanceof z.ZodError) {
            throw createError({ statusCode: 400, statusMessage: 'Erro de validação', data: error.issues })
        }
        throw createError({ statusCode: 500, statusMessage: 'Não foi possível atualizar o trabalho' })
    }
})