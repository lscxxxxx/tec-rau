import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Evita duplicações
  await prisma.tipoTrabalho.deleteMany()
  await prisma.curso.deleteMany()

  // Populando tipos de trabalho
  await prisma.tipoTrabalho.createMany({
    data: [
      { descricao: 'Monografia' },
      { descricao: 'Artigo' },
      { descricao: 'Projeto de Pesquisa' },
      { descricao: 'Relatório Técnico' }
    ]
  })

  // Populando cursos
  await prisma.curso.createMany({
    data: [
      { curso: 'Desenvolvimento de Sistemas' },
      { curso: 'Eletrotécnica' },
      { curso: 'Mecânica' }
    ]
  })

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })