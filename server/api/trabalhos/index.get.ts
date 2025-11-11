import { PrismaClient, Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    const cursoId = query.cursoId ? parseInt(query.cursoId as string, 10) : undefined
    const tipoDocumentalId = query.tipoDocumentalId ? parseInt(query.tipoDocumentalId as string, 10) : undefined
    const pessoaId = query.pessoaId ? parseInt(query.pessoaId as string, 10) : undefined
    const palavraChaveId = query.palavraChaveId ? parseInt(query.palavraChaveId as string, 10) : undefined

    const q = query.q as string | undefined

    const where: Prisma.TrabalhoWhereInput = {}

    if (cursoId) { where.curso_id = cursoId }
    if (tipoDocumentalId) { where.tipodocumental_id = tipoDocumentalId }
    if (pessoaId) { where.pessoas = { some: { pessoa_id: pessoaId } } }
    if (palavraChaveId) { where.palavrasChave = { some: { palavrachave_id: palavraChaveId } } }
    if (q) {
        where.OR = [
            { titulo: { contains: q, mode: 'insensitive' } },
            { resumo: { contains: q, mode: 'insensitive' } },
            // Você pode expandir isso para buscar nomes de autores também
            // { pessoas: { some: { pessoa: { nome: { contains: q, mode: 'insensitive' } } } } }
        ]
    }

    try {
        const [items, totalItems] = await prisma.$transaction([
            prisma.trabalho.findMany({
                skip: skip,
                take: limit,
                where: where,
                orderBy: { dataDefesa: 'desc' },
                include: {
                    curso: true,
                    tipoDocumental: true,
                    pessoas: { include: { pessoa: true } }
                }
            }),
            prisma.trabalho.count({ where: where })
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