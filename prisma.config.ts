import path from 'path'
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

require('dotenv').config({ path: '.env.local' })

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    async adapter() {
      const connectionString = process.env.DATABASE_URL!
      return new PrismaPg({ connectionString })
    },
  },
})