import prisma from '~/server/lib/prisma';

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;

    if (!id || isNaN(parseInt(id))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do trabalho é inválido.',
        });
    }

    try {
        const trabalho = await prisma.trabalho.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!trabalho) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Trabalho não encontrado.',
            });
        }

        return trabalho;
    } catch (error) {
        console.error('[API] Erro ao buscar trabalho por ID:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível buscar os dados do trabalho.',
        });
    }
});