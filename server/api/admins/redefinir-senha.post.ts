import bcrypt from 'bcrypt'
import { z } from 'zod'
import prisma from '~/server/lib/prisma'
import { verificarToken } from '~/server/lib/auth' // Usamos a sua função existente!

interface ResetTokenPayload {
    id: number;
    purpose: 'password-reset';
}

const schema = z.object({
    token: z.string().min(1),
    novaSenha: z.string().min(8),
})

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, schema.safeParse)

    if (!body.success)
        throw body.error

    const { token, novaSenha } = body.data

    // 1. Valida o token (verifica assinatura e se não expirou)
    const decodedToken = verificarToken<ResetTokenPayload>(token)

    // 2. Verifica se o token é válido e se foi criado para este propósito
    if (!decodedToken || decodedToken.purpose !== 'password-reset') {
        throw createError({
            statusCode: 400,
            message: 'Token inválido ou expirado.',
        })
    }

    // 3. Criptografa a nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10)

    // 4. Atualiza a senha do usuário identificado pelo ID dentro do token
    await prisma.admin.update({
        where: {
            id: decodedToken.id,
        },
        data: {
            senha: senhaHash,
        },
    })

    return { message: 'Senha redefinida com sucesso!' }
})