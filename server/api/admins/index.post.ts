import prisma from '~/server/utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { nome, email, senha } = body

    if (!nome || !email || !senha)
        throw createError({ statusCode: 400, message: 'Dados incompletos.' })

    // Explicação da Regex:
    // (?=.*[a-z]) -> Pelo menos uma minúscula
    // (?=.*[A-Z]) -> Pelo menos uma maiúscula
    // (?=.*\d)    -> Pelo menos um número
    // (?=.*[\W_]) -> Pelo menos um caractere especial (!@#$%^&*)
    // .{8,}       -> Pelo menos 8 caracteres
    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

    if (!senhaForteRegex.test(senha)) {
        throw createError({
            statusCode: 400,
            message: 'A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais'
        })
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10)

        const novo = await prisma.admin.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                papel: 'PADRAO'
            }
        })
        return novo
    } catch (error: any) {
        if (error.code === 'P2002') {
            const campo = error.meta?.target?.[0]
            throw createError({
                statusCode: 409,
                message: `O ${campo === 'nome' ? 'usuário' : 'e-mail'} já está cadastrado.`
            })
        }
        throw error
    }
})