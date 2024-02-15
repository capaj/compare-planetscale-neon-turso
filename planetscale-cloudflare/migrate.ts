import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'
import { connect } from '@planetscale/database'

import { drizzle } from 'drizzle-orm/planetscale-serverless'

config({ path: '.dev.vars' })

const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
})
const db = drizzle(connection)
const main = async () => {
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('migrated')

  process.exit(0)
}
main()
