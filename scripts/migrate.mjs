// Applies db/schema.sql (idempotent). Run on every deploy before the app starts.
import postgres from 'postgres'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const schema = readFileSync(fileURLToPath(new URL('../db/schema.sql', import.meta.url)), 'utf8')
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} })

try {
  await sql.unsafe(schema)
  console.log('Schema is up to date')
} finally {
  await sql.end()
}
