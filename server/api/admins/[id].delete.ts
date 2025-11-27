import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)

    await prisma.admin.delete({
        where: { id }
    })

    return { message: 'Administrador removido com sucesso.' }
})