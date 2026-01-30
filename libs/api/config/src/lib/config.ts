import { z } from 'zod'

const configSchema = z.object({
  databaseUrl: z.string(),
})

const config = configSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
})

export { config }
