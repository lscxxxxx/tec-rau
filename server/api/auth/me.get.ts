import { findAdminById } from '~/server/lib/usuarios'

export default defineEventHandler(async (event) => {
    const { id } = event.context.auth
    const admin = await findAdminById(id)

    if (!admin) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Admin não encontrado.',
        })
    }

    const { senha, ...adminSemSenha } = admin
    return adminSemSenha
})