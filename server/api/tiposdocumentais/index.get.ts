import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const tiposDocumentais = await prisma.tipoDocumental.findMany()
    return {
      items: tiposDocumentais,
      totalItems: tiposDocumentais.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar cursos.',
      data: error
    })
  }
})