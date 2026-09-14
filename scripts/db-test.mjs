/* Corre las migraciones y las pruebas de RLS contra un Postgres de verdad.

   Sirve para no publicar SQL que nunca se ejecutó. Levanta una base
   limpia, le pone encima el esqueleto de lo que aporta Supabase
   (supabase/tests/00_stub.sql), aplica las migraciones en orden y después
   intenta, desde una cuenta, hacerle cosas a la de al lado. Cada línea que
   dice OK es un intento que la base rechazó.

   Necesita un Postgres accesible. Por defecto usa el socket local en el
   puerto 5433; se puede apuntar a otro con PGHOST, PGPORT, PGUSER.

       node scripts/db-test.mjs
*/

import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DB = process.env.PGDATABASE_TEST ?? 'vianda_test'

const conn = [
  '-h', process.env.PGHOST ?? '/tmp',
  '-p', process.env.PGPORT ?? '5433',
  '-U', process.env.PGUSER ?? 'postgres',
]

/* -t -A: sin encabezados ni marcos, que acá sólo estorban. Los avisos de
   las pruebas salen por stderr, así que se juntan los dos flujos. */
const psql = (args, db = DB) => {
  const r = spawnSync('psql', [...conn, '-d', db, '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', ...args], {
    encoding: 'utf8',
  })
  const salida = `${r.stdout ?? ''}${r.stderr ?? ''}`
  if (r.status !== 0) {
    console.error(salida.trim() || r.error?.message || 'psql falló')
    process.exit(1)
  }
  return salida
}

// Base limpia en cada corrida: una prueba que depende de lo que quedó de
// la anterior no prueba nada.
psql(['-c', `drop database if exists ${DB}`], 'postgres')
psql(['-c', `create database ${DB}`], 'postgres')

const migraciones = readdirSync(resolve(ROOT, 'supabase/migrations')).sort()
const pruebas = readdirSync(resolve(ROOT, 'supabase/tests')).sort()

for (const f of ['supabase/tests/00_stub.sql', ...migraciones.map((m) => `supabase/migrations/${m}`)]) {
  psql(['-f', resolve(ROOT, f)])
  console.log('aplicada', f)
}

console.log('')

let pasaron = 0
for (const f of pruebas.filter((p) => p !== '00_stub.sql')) {
  const salida = psql(['-f', resolve(ROOT, 'supabase/tests', f)])
  for (const linea of salida.split('\n')) {
    // psql prefija los avisos con el archivo y la línea; eso no aporta.
    const limpia = linea.replace(/^psql:[^:]+:\d+: NOTICE:\s*/, '').trimEnd()
    if (!limpia || limpia === 'BEGIN' || limpia === 'ROLLBACK') continue
    if (limpia.startsWith('OK')) pasaron++
    console.log(limpia)
  }
}

console.log(`\n${pasaron} pruebas, todas pasaron.`)
