import bcrypt from 'bcrypt'
import prisma from '../server/lib/prisma'

async function main() {
    const email = 'admin@email.com'
    const usuario = 'admin'
    const senha = '123456'

    const senhaHash = await bcrypt.hash(senha, 10)

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: {
            email,
            usuario,
            senha: senhaHash
        }
    })

    console.log('Usuário admin criado:', admin)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })