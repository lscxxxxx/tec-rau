import prisma from '~/server/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const cursos = await prisma.curso.findMany();
    return cursos;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar cursos.',
      data: error
    });
  }
});