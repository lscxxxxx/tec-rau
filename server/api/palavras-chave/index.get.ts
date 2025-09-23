import prisma from '~/server/lib/prisma'

export default defineEventHandler(async () => {
    return await prisma.palavraChave.findMany({
        orderBy: { palavra: 'asc' }
    })
})