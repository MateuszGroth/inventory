import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'
import { config } from '@org/api-config'

export * from './generated/prisma/client'
export * from './generated/prisma/models'

const adapter = new PrismaPg({ connectionString: config.databaseUrl })
const prisma = new PrismaClient({ adapter })

export { prisma }
