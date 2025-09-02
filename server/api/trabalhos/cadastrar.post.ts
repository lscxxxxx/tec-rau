import prisma from '~/server/lib/prisma'

export default defineEventHandler(async (event) => {
    try {
        // 1. Lê o corpo (body) da requisição enviado pelo formulário.
        const body = await readBody(event)

        // 2. O Prisma espera tipos de dados específicos. Convertemos o que for necessário.
        const dadosFormatados = {
            ...body,
            data: new Date(body.data), // Converte a string 'YYYY-MM-DD' para um objeto Date
            tipoTrabalhoId: Number(body.tipoTrabalhoId), // Garante que o ID seja um número
            cursoId: Number(body.cursoId) // Garante que o ID seja um número
        }

        // 3. Usa o Prisma para criar um novo registro na tabela 'trabalho'.
        const novoTrabalho = await prisma.trabalho.create({
            data: dadosFormatados
        })

        // 4. Retorna o trabalho recém-criado com um status de sucesso (201 Created).
        setResponseStatus(event, 201)
        return novoTrabalho

    } catch (error: any) {
        console.error('Erro ao criar trabalho:', error)

        throw createError({
            statusCode: 400,
            statusMessage: 'Não foi possível criar o trabalho. Verifique os dados enviados.',
        })
    }
})