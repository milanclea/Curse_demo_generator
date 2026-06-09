import { createHmac, randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Benutzername und Passwort erforderlich.' })
  }

  const config = useRuntimeConfig()

  if (username !== config.authUsername || password !== config.authPassword) {
    throw createError({ statusCode: 401, message: 'Ungültige Anmeldedaten.' })
  }

  // Build a simple signed token: base64(payload).signature
  const payload = JSON.stringify({ username, jti: randomUUID(), iat: Date.now() })
  const sig = createHmac('sha256', config.authSecret).update(payload).digest('hex')
  const token = `${Buffer.from(payload).toString('base64url')}.${sig}`

  return { token }
})
