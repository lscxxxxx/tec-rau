import { PrismaClient } from '@prisma/client'

import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }

    if (!id || isNaN(Number(id))) {
        throw createError({
            statusCode: 400,
            message: 'ID do curso é inválido.',
        })
    }
    try {
        const curso = await prisma.curso.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (!curso) {
            throw createError({
                statusCode: 404,
                message: 'Curso não encontrado.',
            })
        }
        return curso

    } catch (error: any) {
        if (error.statusCode === 404) {
             throw createError({
                statusCode: 404,
                message: error.message || 'Curso não encontrado.',
                statusMessage: `Page not found: /api/cursos/${id}`
            })
        }
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar curso.',
        })
    }
})