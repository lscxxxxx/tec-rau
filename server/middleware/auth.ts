import { verificarToken } from '../lib/auth'

export default defineEventHandler(async (event) => {
    const rotasPublicas = [
        '/api/auth/login',
    ]

    if (rotasPublicas.includes(event.path))
        return

    if (event.path.startsWith('/api/')) {
        const token = getCookie(event, 'token')

        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Não autorizado: Token não fornecido.',
            })
        }

        const admin = verificarToken(token)

        if (!admin) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Não autorizado: Token inválido.',
            })
        }

        event.context.auth = { id: admin.id, email: admin.email }
    }
})