import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm/expressions'
import type { NeonDatabase } from 'drizzle-orm/neon-serverless'
import { drizzle } from 'drizzle-orm/neon-http';
import type { IRequest as IttyRequest, RequestLike, Route } from 'itty-router'

import {
  error, // creates error responses
  json, // creates JSON responses
  Router, // the ~440 byte router itself
  withParams // middleware: puts params directly on the Request
} from 'itty-router'

import { users } from './schema'

interface Env {
  NEON_DATABASE_URL: string
}

interface Request extends IttyRequest {
  db: NeonDatabase
}

interface Methods {
  get: Route
  post: Route
}

async function injectDB(request: Request, env: Env) {
  request.db = drizzle(neon(env.NEON_DATABASE_URL))
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
