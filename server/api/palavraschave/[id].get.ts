import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }

    if (!id || isNaN(Number(id))) {
        throw createError({
            statusCode: 400,
            message: 'ID da palavra-chave é inválido.',
        })
    }
    try {
        const palavraChave = await prisma.palavraChave.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (!palavraChave) {
            throw createError({
                statusCode: 404,
                message: 'Palavra-chave não encontrada.',
            })
        }
        return palavraChave
    } catch (error: any) {
        if (error.statusCode === 404) {
             throw createError({
                statusCode: 404,
                message: error.message || 'Palavra-chave não encontrada.',
                statusMessage: `Page not found: /api/palavraschave/${id}`
            })
        }
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar palavra-chave.',
        })
    }
})