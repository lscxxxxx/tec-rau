import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)

    const admin = await prisma.admin.findUnique({
        where: { id }
    })

    if (!admin)
        throw createError({ statusCode: 404, message: 'Administrador não encontrado.' })

    return admin
})