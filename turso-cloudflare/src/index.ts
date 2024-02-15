import { eq } from 'drizzle-orm/expressions'

import type { IRequest as IttyRequest, RequestLike, Route } from 'itty-router'
import { Client, createClient } from '@libsql/client'
import { users } from './schema'
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql'

import {
  error, // creates error responses
  json, // creates JSON responses
  Router, // the ~440 byte router itself
  withParams // middleware: puts params directly on the Request
} from 'itty-router'

interface Env {
  NEON_DATABASE_URL: string
}

interface Env {
  NEON_DATABASE_URL: string
}

interface Request extends IttyRequest {
  client: Client
  db: LibSQLDatabase
}

interface Methods {
  get: Route
  post: Route
}

async function injectDB(request: Request, env: Env) {
  const turso = createClient({
    url: env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN
  })
  request.client = turso
  request.db = drizzle(turso)
}

const router = Router<Request, any[]>({ base: '/' })
  .get('/health', async (req: Request, env: Env, ctx: ExecutionContext) => {
    return json({ status: 'ok' })
  })
  .get(
    '/users',
    injectDB,
    async (req: Request, env: Env, ctx: ExecutionContext) => {
      const start = performance.now()
      const result = await req.db.select().from(users)
      const end = performance.now()
      const timing = end - start // 0

      return json({
        timingMs: timing,
        result
      })
    }
  )
  .get('/users/:id', injectDB, async (req: Request, env: Env) => {
    const result = await req.db
      .select()
      .from(users)
      .where(eq(users.id, req.params!['id']))
      .execute()
    return json(result)
  })
  .post('/users', injectDB, async (req: Request, env: Env) => {
    const { name, email } = await req.json!()
    const res = await req.db
      .insert(users)
      .values({ name, email })
      .returning()
      .execute()
    return json({ res })
  })
  .all('*', () => error(404))

export default {
  fetch: (request: RequestLike, ...args: any) =>
    router
      .handle(request, ...args)
      .then(json) // send as JSON
      .catch(error) // catch errors
}
