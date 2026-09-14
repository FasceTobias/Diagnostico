/* Un GoTrue de juguete, para probar las pantallas de cuenta sin proyecto.

   No valida nada en serio ni guarda nada en disco: implementa los seis
   endpoints que usa supabase-js y contesta con la forma que espera. Sirve
   para comprobar lo que de otra manera no se puede comprobar sin
   credenciales: que el registro, el login, el error de contraseña
   equivocada, el cierre de sesión y la recuperación llegan a la pantalla
   como corresponde.

   No reemplaza probar contra el proyecto real. Reemplaza no probar nada.

       node scripts/fake-auth.mjs 54321
*/

import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

const PORT = Number(process.argv[2] ?? 54321)

/** Las cuentas viven en memoria y se van con el proceso. */
const cuentas = new Map() // email -> { id, password, metadata }
const recuperaciones = []

const sesion = (cuenta) => ({
  access_token: `falso.${cuenta.id}`,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: `refresco.${cuenta.id}`,
  user: usuario(cuenta),
})

const usuario = (cuenta) => ({
  id: cuenta.id,
  aud: 'authenticated',
  role: 'authenticated',
  email: cuenta.email,
  email_confirmed_at: new Date().toISOString(),
  user_metadata: cuenta.metadata,
  app_metadata: { provider: 'email' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

const server = createServer((req, res) => {
  const enviar = (code, cuerpo) => {
    const texto = cuerpo === undefined ? '' : JSON.stringify(cuerpo)
    res.writeHead(code, {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
    })
    res.end(texto)
  }

  if (req.method === 'OPTIONS') return enviar(200, {})

  let crudo = ''
  req.on('data', (c) => (crudo += c))
  req.on('end', () => {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    const ruta = url.pathname
    let body = {}
    try {
      body = crudo ? JSON.parse(crudo) : {}
    } catch {
      /* cuerpo vacío o roto: se trata como vacío */
    }

    const mal = (msg, code = 400, error_code = 'invalid_request') =>
      enviar(code, { code, error_code, msg, message: msg })

    // ---- registro ----
    if (ruta === '/auth/v1/signup') {
      const email = String(body.email ?? '').toLowerCase()
      if (cuentas.has(email)) return mal('User already registered', 422, 'user_already_exists')
      if (String(body.password ?? '').length < 8)
        return mal('Password should be at least 8 characters', 422, 'weak_password')
      const cuenta = {
        id: randomUUID(),
        email,
        password: body.password,
        metadata: body.data ?? {},
      }
      cuentas.set(email, cuenta)
      return enviar(200, sesion(cuenta))
    }

    // ---- login ----
    if (ruta === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password') {
      const cuenta = cuentas.get(String(body.email ?? '').toLowerCase())
      if (!cuenta || cuenta.password !== body.password)
        return mal('Invalid login credentials', 400, 'invalid_credentials')
      return enviar(200, sesion(cuenta))
    }

    // ---- refresco ----
    if (ruta === '/auth/v1/token' && url.searchParams.get('grant_type') === 'refresh_token') {
      const id = String(body.refresh_token ?? '').split('.')[1]
      const cuenta = [...cuentas.values()].find((c) => c.id === id)
      if (!cuenta) return mal('Invalid Refresh Token', 400, 'invalid_grant')
      return enviar(200, sesion(cuenta))
    }

    if (ruta === '/auth/v1/logout') return enviar(204)

    // ---- recuperación ----
    if (ruta === '/auth/v1/recover') {
      // Igual que el de verdad: no cuenta si el mail existe o no.
      recuperaciones.push(body.email)
      return enviar(200, {})
    }

    // ---- usuario ----
    if (ruta === '/auth/v1/user') {
      const id = (req.headers.authorization ?? '').split('.')[1]
      const cuenta = [...cuentas.values()].find((c) => c.id === id)
      if (!cuenta) return mal('invalid claim: missing sub claim', 401, 'bad_jwt')
      if (req.method === 'PUT') {
        if (body.password) {
          if (String(body.password).length < 8)
            return mal('Password should be at least 8 characters', 422, 'weak_password')
          cuenta.password = body.password
        }
        if (body.data) cuenta.metadata = { ...cuenta.metadata, ...body.data }
      }
      return enviar(200, usuario(cuenta))
    }

    enviar(404, { code: 404, msg: `sin ruta para ${ruta}` })
  })
})

server.listen(PORT, () => console.log(`auth de juguete en http://localhost:${PORT}`))
