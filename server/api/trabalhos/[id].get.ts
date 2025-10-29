import { PapelPessoa } from '@prisma/client'
import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id);

    if (isNaN(id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "ID inválido"
        })
    }

    const trabalho = await prisma.trabalho.findUnique({
        where: { id },
        include: {
            tipoDocumental: true,
            curso: true,
            palavrasChave: { select: { palavraChave: { select: { nome: true } } } },
            pessoas: { select: { papel: true, pessoa: true } }
        }
    })

    if (!trabalho) {
        throw createError({
            statusCode: 404,
            statusMessage: "Trabalho não encontrado"
        })
    }

    const autores = trabalho.pessoas
        .filter(p => p.papel === PapelPessoa.AUTOR)
        .map(p => p.pessoa);

    const orientadores = trabalho.pessoas
        .filter(p => p.papel === PapelPessoa.ORIENTADOR)
        .map(p => p.pessoa);

    return {
        ...trabalho,
        palavrasChave: trabalho.palavrasChave.map(p => p.palavraChave.nome),
        autores,
        orientadores,
        arquivo: trabalho.arquivo ?? null,
    }
});