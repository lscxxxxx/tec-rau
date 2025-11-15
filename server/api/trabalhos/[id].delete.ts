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
        const trabalho = await prisma.trabalho.findUnique({
            where: { id: trabalho_id },
            select: { id: true, titulo: true } // Só precisamos do título e id
        })

        if (!trabalho) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Trabalho não encontrado para exclusão',
            })
        }
        
        await prisma.trabalho.delete({
            where: { id: Number(trabalho_id), }
        })

        await registrarAuditoria(
            prisma,
            admin_id,
            AcaoAuditoria.DELETE,
            trabalho.id, // Passamos o ID que não existe mais
            `Trabalho "${trabalho.titulo}" (ID: ${trabalho.id}) foi excluído.`
        )
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