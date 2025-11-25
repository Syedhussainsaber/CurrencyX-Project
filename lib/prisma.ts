import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const createPrismaStub = () => {
  const reject = async () => {
    throw new Error('Database unavailable')
  }
  return {
    user: {
      findMany: reject,
      findUnique: reject,
      create: reject,
      update: reject,
      delete: reject
    },
    blog: {
      findMany: reject,
      findUnique: reject,
      create: reject,
      update: reject,
      delete: reject
    },
    siteSettings: {
      findFirst: reject,
      create: reject,
      update: reject
    },
    rateCache: {
      upsert: reject
    },
    contactSubmission: {
      create: reject,
      findMany: reject,
      update: reject
    }
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? (
  process.env.DATABASE_URL ? prismaClientSingleton() : (createPrismaStub() as unknown as PrismaClient)
)

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
