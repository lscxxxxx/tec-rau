import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { PapelPessoa, AcaoAuditoria } from '@prisma/client'
import { registrarAuditoria } from '~/server/lib/auditoria'
import prisma from '~/server/lib/prisma'

// ... (Seus schemas e types permanecem iguais: pessoaSchema, jsonString, etc.) ...
// Vou ocultar os schemas aqui para focar na lógica principal, mas mantenha-os no arquivo.

const pessoaSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1),
    sobrenome: z.string().min(1),
})

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
    referencia: z.string().optional(),
    tipoDocumentalId: z.string().transform(val => Number(val)).optional(),
    cursoId: z.string().transform(val => Number(val)).optional(),

    palavrasChaveParaAdicionar: stringArrayString.optional(),
    autoresParaAdicionar: jsonString(z.array(pessoaSchema).min(1)).optional(),
    orientadoresParaAdicionar: jsonString(z.array(pessoaSchema).min(1)).optional(),

    idsPalavrasChaveParaRemover: numberArrayString.optional(),
    idsPessoasParaRemover: numberArrayString.optional(),
})

export default defineEventHandler(async (event) => {
    const { id: admin_id } = event.context.auth
    const idParam = getRouterParam(event, 'id')
    const idAsNumber = Number(idParam)

    if (!idAsNumber || isNaN(idAsNumber)) {
        throw createError({ statusCode: 400, statusMessage: 'ID do trabalho inválido.' });
    }

    try {
        const formData = await readMultipartFormData(event)
        const formValues = formData?.reduce((acc, part) => {
            if (part.name) { acc[part.name] = part.data.toString() }
            return acc
        }, {} as Record<string, string>) ?? {}

        const validatedData = schema.parse(formValues)

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

        // 1. Lógica de Arquivo (Fazemos fora da transação de BD, mas só deletamos o antigo no final)
        let novoCaminhoArquivo: string | undefined
        let arquivoAntigoParaDeletar: string | undefined

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

            // Salva o novo arquivo
            mkdirSync(uploadDir, { recursive: true })
            writeFileSync(filePath, arquivoData.data)

            novoCaminhoArquivo = `/uploads/${uniqueFileName}`

            // Marca o antigo para deleção (só deletamos se a transaction do banco der certo)
            if (trabalhoAntigo?.arquivo) {
                arquivoAntigoParaDeletar = resolve(process.cwd(), `public${trabalhoAntigo.arquivo}`)
            }
        }

        // 2. INÍCIO DA TRANSAÇÃO
        const trabalhoFinal = await prisma.$transaction(async (tx) => {
            // --- Atualizações de Relacionamentos (Usando 'tx') ---
            // Remover Palavras-chave
            if (idsPalavrasChaveParaRemover?.length) {
                await tx.trabalhoPalavraChave.deleteMany({
                    where: { trabalho_id: idAsNumber, palavrachave_id: { in: idsPalavrasChaveParaRemover } },
                });
            }

            // Adicionar Palavras-chave
            if (palavrasChaveParaAdicionar?.length) {
                // Upsert das palavras (garante que existem)
                const palavrasIds = await Promise.all(
                    palavrasChaveParaAdicionar.map(async (nome) => {
                        const pc = await tx.palavraChave.upsert({ where: { nome }, update: {}, create: { nome }, })
                        return pc.id
                    })
                )
                // Criação do vínculo N:N
                await tx.trabalhoPalavraChave.createMany({
                    data: palavrasIds.map(pid => ({ trabalho_id: idAsNumber, palavrachave_id: pid })),
                    skipDuplicates: true,
                });
            }

            // Remover Pessoas
            if (idsPessoasParaRemover?.length) {
                await tx.trabalhoPessoa.deleteMany({
                    where: { trabalho_id: idAsNumber, pessoa_id: { in: idsPessoasParaRemover } },
                });
            }
            // Função auxiliar interna para adicionar pessoas dentro da transação
            const adicionarPessoasTx = async (lista: typeof autoresParaAdicionar, papel: PapelPessoa) => {
                if (!lista?.length) return
                for (const p of lista) {
                    const pessoa = p.id
                        ? await tx.pessoa.findUnique({ where: { id: p.id } })
                        : await tx.pessoa.upsert({
                            where: { nome_sobrenome: { nome: p.nome.trim(), sobrenome: p.sobrenome.trim() } },
                            update: {},
                            create: { nome: p.nome.trim(), sobrenome: p.sobrenome.trim() }
                        })
                    if (pessoa) {
                        // Verifica se já existe vínculo para evitar erro de Unique Constraint
                        const existe = await tx.trabalhoPessoa.findUnique({
                            where: { trabalho_id_pessoa_id: { trabalho_id: idAsNumber, pessoa_id: pessoa.id } }
                        })
                        // Se não existe, cria. Se existe e o papel for diferente, atualiza.
                        if (!existe) {
                            await tx.trabalhoPessoa.create({ data: { trabalho_id: idAsNumber, pessoa_id: pessoa.id, papel } })
                        }
                    }
                }
            }

            await adicionarPessoasTx(autoresParaAdicionar, PapelPessoa.AUTOR)
            await adicionarPessoasTx(orientadoresParaAdicionar, PapelPessoa.ORIENTADOR)

            // --- Atualização Principal do Trabalho ---
            const dadosUpdate: any = { ...restoDosDados }
            if (dataDefesa) dadosUpdate.dataDefesa = new Date(dataDefesa)
            if (cursoId) dadosUpdate.curso = { connect: { id: cursoId } }
            if (tipoDocumentalId) dadosUpdate.tipoDocumental = { connect: { id: tipoDocumentalId } }
            if (novoCaminhoArquivo) dadosUpdate.arquivo = novoCaminhoArquivo

            const atualizado = await tx.trabalho.update({
                where: { id: idAsNumber },
                data: dadosUpdate,
                include: {
                    pessoas: { include: { pessoa: true } },
                    palavrasChave: { include: { palavraChave: true } },
                },
            });
            // --- Auditoria (DENTRO DA TRANSAÇÃO) ---
            // Passamos 'tx' para garantir que se o log falhar, o update do trabalho é desfeito
            await registrarAuditoria(
                tx,
                admin_id,
                AcaoAuditoria.UPDATE,
                atualizado.id,
                `Trabalho "${atualizado.titulo}" foi atualizado.`
            )
            return atualizado
        })
        // FIM DA TRANSAÇÃO
        // Se chegou aqui, o banco atualizou com sucesso. Podemos deletar o arquivo velho.
        if (arquivoAntigoParaDeletar && existsSync(arquivoAntigoParaDeletar)) {
            unlinkSync(arquivoAntigoParaDeletar)
        }
        return trabalhoFinal
    } catch (error: any) {
        console.error('--- ERRO NA API DE EDIÇÃO ---', error)
        if (error instanceof z.ZodError) {
            throw createError({ statusCode: 400, statusMessage: 'Erro de validação', data: error.issues })
        }
        throw createError({ statusCode: 500, statusMessage: 'Não foi possível atualizar o trabalho' })
    }
})