import prisma from '~/server/lib/prisma';

export default defineEventHandler(async (event) => {
  console.log('[API /api/cursos] Endpoint atingido. A tentar buscar dados...');
  try {
    const cursos = await prisma.curso.findMany();

    if (!cursos) {
      console.log('[API /api/cursos] A consulta retornou um valor nulo, mas sem erro.');
      return [];
    }

    console.log(`[API /api/cursos] Sucesso! ${cursos.length} cursos encontrados.`);
    return cursos;

  } catch (error) {
    console.error('[API /api/cursos] OCORREU UM ERRO GRAVE:', error);

    // Lança um erro estruturado para o Nuxt
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar cursos.',
      data: error // Envia os detalhes do erro para o frontend se necessário
    });
  }
});