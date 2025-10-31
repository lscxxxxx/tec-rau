import prisma from '../../lib/prisma'

export default defineEventHandler(async () => {
  return await prisma.trabalho.findMany({
    include: {
        curso: true,
        tipoDocumental: true,
        palavrasChave: {
        select: {
          palavraChave: { select: { nome: true } },
        },
      },
      pessoas: {
        select: {
          papel: true,
          pessoa: true,
        },
      },
    }
  })
})