const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

// Usage: set DATABASE_URL env var (same as SUPABASE_DB_URL) and run `node scripts/run_migrations.js`
async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    console.error('DATABASE_URL not set. Export your DB connection string as DATABASE_URL or SUPABASE_DB_URL.')
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })
  await client.connect()

  const migrationsDir = path.join(__dirname, '..', 'migrations')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  for (const f of files) {
    const full = path.join(migrationsDir, f)
    const sql = fs.readFileSync(full, 'utf8')
    console.log('Applying', f)
    try {
      await client.query(sql)
      console.log('Applied', f)
    } catch (e) {
      console.error('Failed to apply', f, e)
      process.exit(1)
    }
  }

  await client.end()
  console.log('All migrations applied')
}

main().catch(e => { console.error(e); process.exit(1) })
