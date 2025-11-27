import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { PapelPessoa, AcaoAuditoria } from '@prisma/client'
import { registrarAuditoria } from '~/server/lib/auditoria'
import prisma from '~/server/lib/prisma'


const pessoaSchema = z.object({
    nome: z.string().min(1),
    sobrenome: z.string().min(1),
})

type PessoaInput = z.infer<typeof pessoaSchema>

function jsonString<T extends z.ZodTypeAny>(schema: T) {
    return z.string().transform((val, ctx): z.infer<T> => {
        try {
            const parsed = JSON.parse(val)
            const result = schema.safeParse(parsed)
            if (!result.success) {
                ctx.addIssue({ code: 'custom', message: 'JSON inválido' })
                return z.NEVER as any
            }
            return result.data
        } catch {
            ctx.addIssue({ code: 'custom', message: 'JSON inválido' })
            return z.NEVER as any
        }
    })
}

const schemaBase = z.object({
    titulo: z.string().min(1),
    dataDefesa: z.string().min(1),
    resumo: z.string().optional(),
    referencia: z.string().optional(),
    tipoDocumentalId: z.string().transform(val => Number(val)),
    cursoId: z.string().transform(val => Number(val)),
    palavrasChave: z.string()
        .transform(val => val.split(',').map(p => p.trim()).filter(Boolean)).optional(),
    autores: jsonString(z.array(pessoaSchema).min(1)),
    orientadores: jsonString(z.array(pessoaSchema)).optional(),
})

// SuperRefine para aplicar a regra de negócio
const schema = schemaBase.superRefine((data, ctx) => {
    const ID_CURSO_DS = 1
    const ID_TIPO_PI = 1

    const ehDevSistemas = data.cursoId === ID_CURSO_DS
    const ehProjetoIntegrador = data.tipoDocumentalId === ID_TIPO_PI

    const camposSaoObrigatorios = ehDevSistemas || !ehProjetoIntegrador

    if (camposSaoObrigatorios) {
        if (!data.resumo || data.resumo.length < 10) {
            ctx.addIssue({ code: 'custom', path: ['resumo'], message: 'Resumo é obrigatório' })
        }
        if (!data.referencia || data.referencia.length < 5) {
            ctx.addIssue({ code: 'custom', path: ['referencia'], message: 'Referência bibliográfica é obrigatória' })
        }
        if (!data.palavrasChave || data.palavrasChave.length < 3) {
            ctx.addIssue({ code: 'custom', path: ['palavrasChave'], message: 'Mínimo de 3 palavras-chave obrigatórias' })
        }
        if (!data.orientadores || data.orientadores.length === 0) {
             ctx.addIssue({ code: 'custom', path: ['orientadores'], message: 'Orientador é obrigatório.' })
        }
    }
})

type ValidatedSchema = z.infer<typeof schema>

async function processarPessoas(
    prismaClient: any,
    trabalhoId: number,
    pessoas: PessoaInput[] | undefined,
    papel: PapelPessoa
) {
    if (!pessoas || pessoas.length === 0) return;

    for (const p of pessoas) {
        const pessoa = await prismaClient.pessoa.upsert({
            where: { nome_sobrenome: { nome: p.nome.trim(), sobrenome: p.sobrenome.trim() } },
            update: {},
            create: { nome: p.nome.trim(), sobrenome: p.sobrenome.trim() },
        })
        await prismaClient.trabalhoPessoa.create({
            data: {
                trabalho_id: trabalhoId,
                pessoa_id: pessoa.id,
                papel: papel,
            },
        })
    }
}

export default defineEventHandler(async (event) => {
    const { id: admin_id } = event.context.auth
    try {
        const formData = await readMultipartFormData(event)
        const arquivoData = formData?.find(d => d.name === 'arquivo')
        const textFields = formData?.filter(d => d.name !== 'arquivo')

        if (!arquivoData || !textFields)
            throw new Error('Arquivo ou campos de texto faltando')

        const formValues: Record<string, any> = {}
        for (const field of textFields) {
            if (field.name)
                formValues[field.name] = field.data.toString()
        }

        const validatedData: ValidatedSchema = schema.parse(formValues)

        const fileExtension = arquivoData.filename?.split('.').pop() || 'pdf'
        const uniqueFileName = `${nanoid()}.${fileExtension}`
        const uploadDir = resolve(process.cwd(), 'public/uploads')
        const filePath = `${uploadDir}/${uniqueFileName}`
        mkdirSync(uploadDir, { recursive: true })
        writeFileSync(filePath, arquivoData.data)

        const {
            cursoId,
            tipoDocumentalId,
            palavrasChave,
            autores,
            orientadores,
            ...restoDosDados
        } = validatedData;

        const novoTrabalho = await prisma.$transaction(async (tx) => {

            const trabalho = await tx.trabalho.create({
                data: {
                    ...restoDosDados,
                    dataDefesa: new Date(validatedData.dataDefesa),
                    arquivo: `/uploads/${uniqueFileName}`,
                    curso: { connect: { id: cursoId }, },
                    tipoDocumental: { connect: { id: tipoDocumentalId }, },
                    palavrasChave: {
                        create: (palavrasChave ?? []).map((palavraNome: string) => ({
                            palavraChave: { connectOrCreate: { where: { nome: palavraNome }, create: { nome: palavraNome } } }
                        }))
                    },
                }
            })

            await processarPessoas(tx, trabalho.id, autores, PapelPessoa.AUTOR)
            await processarPessoas(tx, trabalho.id, orientadores, PapelPessoa.ORIENTADOR)

            await registrarAuditoria(
                tx,
                admin_id,
                AcaoAuditoria.CREATE,
                trabalho.id,
                `Trabalho "${trabalho.titulo}" foi criado.`
            )

            return trabalho;
        })

        setResponseStatus(event, 201)
        return novoTrabalho

    } catch (error: any) {
        console.error('--- ERRO NA API DE CADASTRO DE TRABALHO ---');
        console.error(error);

        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: `Erro de validação`,
                data: error.issues,
            })
        }

        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                statusMessage: 'Erro de conflito. Verifique se o título ou outros dados únicos já existem.',
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível criar o trabalho.',
        })
    }
})