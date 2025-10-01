import prisma from '~/server/lib/prisma';

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id);

    const trabalho = await prisma.trabalho.findUnique({
        where: { id },
        include: {
            tipoTrabalho: true,
            curso: true,
            palavrasChave: true
        }
    })

    if (!trabalho) {
        throw createError({
            statusCode: 404,
            statusMessage: "Trabalho não encontrado"
        })
    }

    return {
        ...trabalho,
        palavrasChave: trabalho.palavrasChave.map((p) => p.palavra),
        arquivo: trabalho.arquivo ?? null,
    }
});