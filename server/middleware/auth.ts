import { verificarToken } from '../lib/auth'

interface JwtPayload {
    id: number;
    email: string;
}

export default defineEventHandler(async (event) => {
    const rotasApiPublicas = [
        '/api/auth/login',
    ]

    if (!event.path.startsWith('/api/')) {
        return;
    }

    if (rotasApiPublicas.includes(event.path)) {
        return
    }

    const token = getCookie(event, 'token');

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Não autorizado: Token não fornecido.',
        });
    }

    const admin = verificarToken<JwtPayload>(token);

    if (!admin) {
        throw createError({
            statusCode: 401,
            message: 'Não autorizado: Token inválido.',
        });
    }

    event.context.auth = { id: admin.id, email: admin.email };
})