import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    const [items, totalItems] = await Promise.all([
        prisma.admin.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' }
        }),
        prisma.admin.count()
    ])

    return {
        items,
        totalItems,
        page,
        limit
    }
})