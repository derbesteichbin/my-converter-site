const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

// Strip sslmode from URL and handle SSL via pg Pool config
const url = process.env.DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, '')
const pool = new pg.Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

module.exports = prisma
