import prisma from '~/server/lib/prisma'

export default defineEventHandler(async () => {
    return await prisma.palavraChave.findMany({
        include: {
            _count: {
                select: { trabalhos: true },
            },
        },
        orderBy: { nome: 'asc' }
    })
})