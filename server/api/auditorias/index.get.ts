import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    const where: Prisma.AuditoriaWhereInput = {}

    try {
        const [items, totalItems] = await prisma.$transaction([
            prisma.auditoria.findMany({
                skip: skip,
                take: limit,
                where: where,
                orderBy: { dataModificacao: 'desc' },
                include: {
                    admin: { select: { nome: true } }
                }
            }),
            prisma.auditoria.count({ where: where })
        ])

        return { items, totalItems, page, limit }
    } catch (error: any) {
        console.error('Erro ao buscar auditorias paginadas:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível buscar as auditorias.'
        })
    }
})