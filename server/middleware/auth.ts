import { verificarToken } from '../lib/auth'

interface JwtPayload {
    id: number;
    email: string;
}

export default defineEventHandler(async (event) => {
    const rotasApiPublicas = [ '/api/auth/login', ]
    const rotasGetPublicas = [
        /^\/api\/trabalhos(\/\d+)?$/, 
        /^\/api\/cursos(\/\d+)?$/,
        /^\/api\/pessoas(\/\d+)?$/,
        /^\/api\/tiposdocumentais(\/\d+)?$/,
        /^\/api\/palavraschave(\/\d+)?$/,
        /^\/api\/stats$/,
        /^\/api\/facetas\/.+$/,
    ]

    if (!event.path.startsWith('/api/')) return
    if (rotasApiPublicas.includes(event.path)) return

    const urlSemQuery = event.path.replace(/\/$/, '')
    const caminhoLimpo = urlSemQuery.split('?')[0]
    if (event.method === 'GET') {
        const ehRotaPublica = rotasGetPublicas.some((regex) => regex.test(caminhoLimpo))
        if (ehRotaPublica) return
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