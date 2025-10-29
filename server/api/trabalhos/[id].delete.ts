import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    try {
        const trabalhoId = event.context.params?.id
        if (!trabalhoId) {
            throw new Error('ID do trabalho não fornecido')
        }
        await prisma.trabalho.delete({
            where: {
                id: Number(trabalhoId),
            }
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