import path from 'path'
import { defineConfig } from 'prisma/config'

require('dotenv').config({ path: '.env.local' })

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
})
