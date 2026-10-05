import postgres from 'postgres'

// One connection pool per server process (reused across dev hot reloads).
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> }

export const sql =
  globalForDb.sql ??
  postgres(process.env.DATABASE_URL ?? '', {
    max: 10,
    idle_timeout: 30,
    transform: { undefined: null },
  })

if (process.env.NODE_ENV !== 'production') globalForDb.sql = sql
