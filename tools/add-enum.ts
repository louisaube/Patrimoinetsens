import { config } from 'dotenv'
config({ path: '.env.local' })
import postgres from 'postgres'

async function main() {
  const sql = postgres(process.env.DATABASE_URL!)
  await sql.unsafe("ALTER TYPE category_enum ADD VALUE IF NOT EXISTS 'personnalite'")
  console.log('Enum personnalite added')
  await sql.end()
}

main().catch(e => { console.error(e); process.exit(1) })
