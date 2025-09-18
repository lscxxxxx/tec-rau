import { z } from 'zod'
import prisma from '~/server/lib/prisma'
import { gerarResetToken } from '~/server/lib/auth'
// import { enviarEmailDeReset } from '~/server/lib/email' // (Função hipotética de envio de e-mail)

const schema = z.object({
    email: z.string().email(),
})

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, schema.safeParse)

    if (!body.success)
        throw body.error

    const { email } = body.data

    const admin = await prisma.admin.findUnique({ where: { email } })

    // IMPORTANTE: Se o admin não for encontrado, não retornamos um erro.
    // Isso evita que alguém use este endpoint para descobrir quais e-mails estão cadastrados.
    if (admin) {
        // 1. Gera o token de reset com validade de 15 minutos
        const token = gerarResetToken(admin)

        // 2. (Lógica de Envio de E-mail)
        // Aqui você chamaria uma função para enviar um e-mail para o admin.email
        // O e-mail conteria um link como: `https://seusite.com/admin/redefinir-senha?token=${token}`
        // await enviarEmailDeReset(admin.email, token)
        console.log(`Token de reset para ${admin.email}: ${token}`) // Para fins de teste
    }

    // Retorna uma mensagem genérica de sucesso em todos os casos
    return { message: 'Se um e-mail correspondente for encontrado, um link de recuperação foi enviado.' }
})