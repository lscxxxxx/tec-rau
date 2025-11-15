import prisma from '~/server/lib/prisma'

export default defineEventHandler(async () => {
    try {
        const autores = await prisma.pessoa.findMany({
            include: { _count: { select: { trabalhos: { where: { papel: 'AUTOR' } } }, }, },
            where: { trabalhos: { some: { papel: 'AUTOR' } } },
            orderBy: { trabalhos: { _count: 'desc' } },
            take: 5
        })
        return autores;
    } catch (error) {
        console.error("Erro ao buscar autores populares:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível buscar os autores.'
        })
    }
})