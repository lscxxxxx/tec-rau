import { readBody, setCookie } from 'h3'
import { findAdminByEmail } from '../../lib/usuarios'
import { gerarToken } from '../../lib/auth'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const { email, senha } = await readBody(event)

    if (!email || !senha) {
        throw createError({
            statusCode: 400,
            message: 'Email e senha são obrigatórios.'
        })
    }

    const admin = await findAdminByEmail(email)

    if (!admin || !(await bcrypt.compare(senha, admin.senha))) {
        throw createError({
            statusCode: 401,
            message: 'Email ou senha inválidos.'
        })
    }

    const token = gerarToken(admin)

    setCookie(event, 'token', token, {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hora
        path: '/',
        sameSite: 'strict',
    })

    return {
        id: admin.id,
        email: admin.email,
        usuario: admin.usuario,
    }
})