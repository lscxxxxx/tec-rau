import prisma from '~/server/utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { usuario, email, senha } = body

  if (!usuario || !email || !senha) {
    throw createError({ statusCode: 400, statusMessage: 'Campos obrigatórios' })
  }

  const hashedPassword = await bcrypt.hash(senha, 10)

  try {
    const user = await prisma.admin.create({
      data: {
        usuario,
        email,
        senha: hashedPassword
      }
    })

    return {
      message: 'Usuário criado com sucesso!',
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar usuário'
    })
  }
})