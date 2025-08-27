import prisma from './prisma'

export async function findAllAdmins() {
  return await prisma.admin.findMany()
}

export async function findAdminByEmail(email: string) {
  return await prisma.admin.findUnique({
    where: { email }
  })
}

export async function findAdminById(id: number) {
  return await prisma.admin.findUnique({
    where: { id }
  })
}