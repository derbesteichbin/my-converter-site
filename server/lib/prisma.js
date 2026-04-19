const { PrismaClient } = require('@prisma/client')

const dbUrl = process.env.DATABASE_URL || '';
const separator = dbUrl.includes('?') ? '&' : '?';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl + separator + 'pgbouncer=true&connection_limit=1',
    },
  },
})

module.exports = prisma
