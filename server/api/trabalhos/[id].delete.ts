import prisma from '~/server/lib/prisma'
import { registrarAuditoria } from '~/server/lib/auditoria'
import { AcaoAuditoria } from '@prisma/client'

export default defineEventHandler(async (event) => {
    const { id: admin_id } = event.context.auth
    const trabalho_id = Number(event.context.params?.id)

    if (isNaN(trabalho_id)) {
        throw createError({ statusCode: 400, message: 'ID inválido' })
    }

    try {
        // Usamos transação para garantir atomicidade (ou deleta tudo ou nada)
        await prisma.$transaction(async (tx) => {
            // 1. Busca dados básicos para o log ANTES de deletar
            const trabalho = await tx.trabalho.findUnique({
                where: { id: trabalho_id },
                select: { id: true, titulo: true }
            })

            if (!trabalho) {
                const error: any = new Error('Trabalho não encontrado')
                error.code = 'P2025' // Simulando código do Prisma para o catch
                throw error
            }
            // 2. Limpeza manual de tabelas pivot (Boa prática para evitar erros de FK pendentes)
            // Se o seu banco estiver com Cascade configurado, isso é opcional, mas seguro fazer via código.
            await tx.trabalhoPessoa.deleteMany({ where: { trabalho_id } })
            await tx.trabalhoPalavraChave.deleteMany({ where: { trabalho_id } })
            // 3. Deleta o trabalho
            await tx.trabalho.delete({ where: { id: trabalho_id } })
            // 4. Registra Auditoria
            // AGORA FUNCIONA: O banco aceita salvar o ID 'morto' na coluna trabalho_id
            await registrarAuditoria(
                tx,
                admin_id,
                AcaoAuditoria.DELETE,
                trabalho.id,
                `Trabalho "${trabalho.titulo}" (ID Histórico: ${trabalho.id}) foi excluído.`
            )
        })

        setResponseStatus(event, 204)
        return
    } catch (error: any) {
        if (error.code === 'P2025') {
            throw createError({
                statusCode: 404,
                statusMessage: 'Trabalho não encontrado',
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível excluir o trabalho',
        })
    }
})