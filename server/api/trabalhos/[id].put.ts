import prisma from '~/server/lib/prisma';
import { object, string, number, date } from 'yup';

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    const body = await readBody(event);

    if (!id || isNaN(parseInt(id))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do trabalho é inválido.',
        });
    }

    const schema = object({
        titulo: string().required(),
        data: date().required(),
        resumo: string().required(),
        status: string().oneOf(['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']).required(),
        arquivo: string().url().required(),
        autor1: string().required(),
        orientador: string().required(),
        refbibliografica: string().required(),
        tipoTrabalhoId: number().required(),
        cursoId: number().required(),
    });

    try {
        await schema.validate(body);
    } catch (error: any) {
        throw createError({
            statusCode: 400,
            statusMessage: `Erro de validação: ${error.message}`,
        });
    }

    try {
        const {
            id: _,
            curso,
            tipoTrabalho,
            ...cleanBody
        } = body;

        const updatedTrabalho = await prisma.trabalho.update({
            where: {
                id: parseInt(id),
            },
            data: {
                ...cleanBody,
                data: new Date(cleanBody.data),
            },
        });

        return updatedTrabalho;
    } catch (error) {
        console.error('[API] Erro ao atualizar trabalho:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível atualizar o trabalho.',
        });
    }
});