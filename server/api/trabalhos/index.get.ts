import prisma from '../../lib/prisma'

export default defineEventHandler(async () => {
  return await prisma.trabalho.findMany({
    include: {
        curso: true,
        tipoDocumental: true,
        palavrasChave: true
    }
  })
})