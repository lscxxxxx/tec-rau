import bcrypt from 'bcrypt'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)
    const body = await readBody(event)

    const admin = await prisma.admin.findUnique({ where: { id } })
    if (!admin) throw createError({ statusCode: 404, message: 'Admin não encontrado.' })

    let senhaHash = undefined

    if (body.senha) {
        const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        
        if (!senhaForteRegex.test(body.senha)) {
            throw createError({
                statusCode: 400,
                message: 'A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.'
            })
        }
        senhaHash = await bcrypt.hash(body.senha, 10)
    }

    try {
        const atualizado = await prisma.admin.update({
            where: { id },
            data: {
                nome: body.nome ?? admin.nome,
                email: body.email ?? admin.email,
                ...(senhaHash && { senha: senhaHash })
            }
        })

        return atualizado

    } catch (error: any) {
        if (error.code === 'P2002') {
            const campo = error.meta?.target?.[0]
            throw createError({
                statusCode: 409,
                message: `O ${campo === 'nome' ? 'usuário' : 'e-mail'} já está em uso por outro administrador.`
            })
        }
        throw error
    }
})