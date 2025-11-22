import { PapelPessoa } from '@prisma/client'
import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id);

    if (isNaN(id)) {
        throw createError({ statusCode: 400, statusMessage: "ID inválido" })
    }

    const trabalho = await prisma.trabalho.findUnique({
        where: { id },
        include: {
            tipoDocumental: true,
            curso: true,
            palavrasChave: { select: { palavraChave: { select: { id: true, nome: true } } } },
            pessoas: { select: { papel: true, pessoa: { select: { id: true, nome: true, sobrenome: true }, }, } }
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
        id: trabalho.id,
        titulo: trabalho.titulo,
        resumo: trabalho.resumo,
        dataDefesa: trabalho.dataDefesa,
        tipoDocumental: trabalho.tipoDocumental,
        curso: trabalho.curso,
        palavrasChave: trabalho.palavrasChave.map((p) => ({ id: p.palavraChave.id, nome: p.palavraChave.nome })),
        autores,
        orientadores,
        pessoas: trabalho.pessoas,
        arquivo: trabalho.arquivo ?? null,
    }
});