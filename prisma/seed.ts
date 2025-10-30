import { PrismaClient, PapelAdmin } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando o processo de seed...')

  const email = 'admin@email.com'
  const nome = 'admin'
  const senha = '123456'

  const senhaHash = await bcrypt.hash(senha, 10)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      nome,
      senha: senhaHash,
      papel: PapelAdmin.SUPER,
    },
  })
  console.log('-> Usuário admin criado/verificado:', { id: admin.id, email: admin.email })

  await prisma.tipoDocumental.deleteMany()
  await prisma.tipoDocumental.createMany({
    data: [
      { nome: 'Projeto Integrador' },
      { nome: 'Artigo Científico' },
      { nome: 'Seminário' },
    ],
  })
  console.log('-> Tabela "TipoDocumental" populada com sucesso.')

  await prisma.curso.deleteMany()
  await prisma.curso.createMany({
    data: [
      { nome: 'Desenvolvimento de Sistemas' },
      { nome: 'Eletrotécnica' },
      { nome: 'Mecânica' },
    ],
  })
  console.log('-> Tabela "Curso" populada com sucesso.')
}

main()
  .then(() => {
    console.log('Seed concluído com sucesso!')
  })
  .catch((e) => {
    console.error('Ocorreu um erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })