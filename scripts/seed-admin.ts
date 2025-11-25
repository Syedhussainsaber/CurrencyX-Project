import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@payinglobal.com'
    const password = 'Admin@123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            fullName: 'Super Admin',
            role: 'admin',
            address: 'Hyderabad, India',
            isActive: true,
            emailVerified: true
        },
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
