import prisma from '~/server/lib/prisma'

export default defineEventHandler(async () => {
    try {
        // Usamos $transaction para rodar todas as contagens em paralelo
        // em uma única transação no banco de dados. É muito rápido.
        const [totalTrabalhos, totalAutores, totalCursos] = await prisma.$transaction([
            // 1. Conta o total de trabalhos publicados
            prisma.trabalho.count(),
            // 2. Conta o total de pessoas que são 'AUTOR'
            prisma.pessoa.count({ where: { trabalhos: { some: { papel: 'AUTOR' } } } }),
            prisma.curso.count()
        ])
        return { totalTrabalhos, totalAutores, totalCursos }
    } catch (error: any) {
        console.error("Erro ao buscar estatísticas:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível buscar as estatísticas.'
        })
    }
})