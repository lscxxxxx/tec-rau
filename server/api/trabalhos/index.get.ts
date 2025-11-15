import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

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

    let camposIds: number[] = [1]
    const camposQuery = query.campos
    if (Array.isArray(camposQuery)) {
        camposIds = camposQuery.map(c => Number(c))
    } else if (camposQuery) {
        camposIds = [Number(camposQuery)]
    }

    const where: Prisma.TrabalhoWhereInput = {}

    if (cursoId) { where.curso_id = cursoId }
    if (tipoDocumentalId) { where.tipodocumental_id = tipoDocumentalId }
    if (pessoaId) { where.pessoas = { some: { pessoa_id: pessoaId } } }
    if (palavraChaveId) { where.palavrasChave = { some: { palavrachave_id: palavraChaveId } } }

    if (q) {
        const orConditions: Prisma.TrabalhoWhereInput[] = []
        const search = { contains: q, mode: Prisma.QueryMode.insensitive }
        const searchPessoa = { pessoa: { OR: [{ nome: search }, { sobrenome: search }] } }
        // Mapeia os IDs do frontend para as queries do Prisma
        // 1: Todos, 2: Título, 3: Autores, 4: Orientadores, 5: Ano, 6: Resumo
        if (camposIds.includes(1) || camposIds.includes(2)) { // Título
            orConditions.push({ titulo: search })
        }
        if (camposIds.includes(1) || camposIds.includes(6)) { // Resumo
            orConditions.push({ resumo: search })
        }
        if (camposIds.includes(1) || camposIds.includes(3)) { // Autores
            orConditions.push({ pessoas: { some: { papel: 'AUTOR', ...searchPessoa } } })
        }
        if (camposIds.includes(1) || camposIds.includes(4)) { // Orientadores
            orConditions.push({ pessoas: { some: { papel: 'ORIENTADOR', ...searchPessoa } } })
        }
        if (camposIds.includes(1) || camposIds.includes(5)) { // Ano
            const ano = parseInt(q);
            if (!isNaN(ano)) {
                orConditions.push({
                    dataDefesa: {
                        gte: new Date(`${ano}-01-01T00:00:00.000Z`),
                        lt: new Date(`${ano + 1}-01-01T00:00:00.000Z`)
                    }
                });
            }
        }
        if (orConditions.length > 0) {
            where.OR = orConditions
        }
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