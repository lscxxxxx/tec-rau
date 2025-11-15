import prisma from '~/server/lib/prisma'

export default defineEventHandler(async () => {
    try {
        const palavras = await prisma.palavraChave.findMany({
            include: { _count: { select: { trabalhos: true }, }, },
            orderBy: { trabalhos: { _count: 'desc' } },
            take: 5
        })
        return palavras;
    } catch (error) {
        console.error("Erro ao buscar palavras-chave populares:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível buscar as palavras-chave.'
        })
    }
})