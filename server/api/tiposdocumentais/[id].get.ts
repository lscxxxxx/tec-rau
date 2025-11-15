import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }

    if (!id || isNaN(Number(id))) {
        throw createError({
            statusCode: 400,
            message: 'ID do tipo documental é inválido.',
        })
    }
    try {
        const tipoDocumental = await prisma.tipoDocumental.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (!tipoDocumental) {
            throw createError({
                statusCode: 404,
                message: 'Tipo documental não encontrado.',
            })
        }
        return tipoDocumental
    } catch (error: any) {
        if (error.statusCode === 404) {
             throw createError({
                statusCode: 404,
                message: error.message || 'Tipo documental não encontrado.',
                statusMessage: `Page not found: /api/tiposdocumentais/${id}`
            })
        }
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar tipo documental.',
        })
    }
})