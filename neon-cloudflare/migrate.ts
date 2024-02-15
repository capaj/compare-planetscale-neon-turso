import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { drizzle } from 'drizzle-orm/postgres-js'

config({ path: '.dev.vars' })

const url = `${process.env.NEON_DATABASE_URL}?options=project%3D${process.env.PROJECT_NAME}`
const db = drizzle(postgres(url, { ssl: 'require', max: 1 }))
const main = async () => {
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('migrated')

  process.exit(0)
}
main()
