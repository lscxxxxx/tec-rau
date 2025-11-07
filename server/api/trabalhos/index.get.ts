import prisma from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  try {
        const [items, totalItems] = await prisma.$transaction([
            prisma.trabalho.findMany({
                skip: skip, 
                take: limit,
                orderBy: { dataDefesa: 'desc' },
                include: {
                    curso: true,
                    tipoDocumental: true,
                    pessoas: { include: { pessoa: true } }
                }
            }),
            prisma.trabalho.count()
        ])

        return { items, totalItems, page, limit }
    } catch (error: any) {
        console.error('Erro ao buscar trabalhos paginados:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível buscar os trabalhos.'
        })
    }
})