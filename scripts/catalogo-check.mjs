/* Las reglas que el catálogo no puede romper.

   No es un linter de estilo: cada una de estas corresponde a un error
   que ya pasó y que sólo se ve cuando la app está andando —una lista de
   compras que manda a comprar harina para hacer pochoclo, una ficha que
   muestra el tiempo activo como si fuera el total, un ingrediente que no
   existe—. Correrlo antes de tocar el JSON sale más barato que
   descubrirlo en el teléfono.

       node scripts/catalogo-check.mjs
*/

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogo = JSON.parse(readFileSync(resolve(ROOT, 'data/catalogo/v1.json'), 'utf8'))

/* FOODS es TypeScript, así que se leen las claves del archivo en vez de
   importarlo: alcanza para saber si un ingrediente existe. */
const foods = readFileSync(resolve(ROOT, 'src/lib/foods.ts'), 'utf8')
const cuerpo = foods.slice(foods.indexOf('export const FOODS'), foods.indexOf('export const foodOf'))
const INGREDIENTES = new Set(
  [...cuerpo.matchAll(/^ {2}'?([^':\n]+?)'?:\s*\{/gm)].map((m) => m[1]),
)
const BASICOS = new Set(
  [...cuerpo.matchAll(/^ {2}'?([^':\n]+?)'?:\s*\{[^}]*pantryBasic: true/gm)].map((m) => m[1]),
)

const recetas = readFileSync(resolve(ROOT, 'src/lib/recetas.ts'), 'utf8')
const CON_RECETA = new Set([...recetas.matchAll(/^ {2}'([a-z0-9-]+)':/gm)].map((m) => m[1]))

const fallas = []
const mal = (slug, texto) => fallas.push(`${slug}: ${texto}`)

const slugs = new Set()
for (const e of catalogo) {
  if (slugs.has(e.slug)) mal(e.slug, 'slug repetido')
  slugs.add(e.slug)

  if (!/^[a-z0-9-]+$/.test(e.slug)) mal(e.slug, 'el slug tiene algo que no es ASCII, número o guión')
  if (!['cook', 'assemble', 'ready'].includes(e.prepType)) mal(e.slug, `prepType inválido: ${e.prepType}`)
  if (typeof e.totalMinutes !== 'number') mal(e.slug, 'sin totalMinutes')
  if (e.totalMinutes < e.activeMinutes) mal(e.slug, 'el total es menor que el tiempo activo')

  // Lo que se compra hecho no se cocina, y no genera ingredientes.
  const afuera = !['casera', 'envasada'].includes(e.origen)
  if (afuera && e.prepType === 'cook') mal(e.slug, 'se compra hecha pero está marcada como que se cocina')
  if (afuera && e.items.length) mal(e.slug, 'se compra hecha pero arrastra ingredientes')

  // Una receta escrita implica que hay algo que preparar.
  if (CON_RECETA.has(e.slug) && e.prepType === 'ready')
    mal(e.slug, 'tiene receta escrita pero está marcada como lista para comer')

  // El ingrediente parecido es el peor error del catálogo: la compra
  // "funciona" y te hace comprar cualquier cosa.
  for (const i of e.items) {
    if (!INGREDIENTES.has(i.item)) mal(e.slug, `usa un ingrediente que no existe: ${i.item}`)
    if (!(i.qty > 0)) mal(e.slug, `${i.item} sin cantidad`)
  }
  const items = e.items.map((i) => i.item)
  const repetido = items.find((x, n) => items.indexOf(x) !== n)
  if (repetido) mal(e.slug, `${repetido} está dos veces`)

  // Los básicos existen dentro de la receta, no en la compra semanal:
  // sólo tienen sentido en algo que se prepara en casa.
  if (afuera && e.items.some((i) => BASICOS.has(i.item)))
    mal(e.slug, 'una comida comprada no puede llevar básicos de alacena')

  const porDefecto = e.portions.filter((p) => p.default)
  if (porDefecto.length !== 1) mal(e.slug, `tiene ${porDefecto.length} porciones por defecto`)

  if (e.esBebida && e.category !== 'snack' && !e.momentos.includes('snack')) {
    // Una bebida puede acompañar, pero no ocupa un lugar del día.
  }
}

if (fallas.length) {
  console.error(`${fallas.length} problema(s) en el catálogo:\n`)
  for (const f of fallas) console.error('  ·', f)
  process.exit(1)
}

const cuenta = { cook: 0, assemble: 0, ready: 0 }
for (const e of catalogo) cuenta[e.prepType]++
console.log(
  `${catalogo.length} entradas, sin problemas.`,
  `cook ${cuenta.cook} · assemble ${cuenta.assemble} · ready ${cuenta.ready}.`,
  `${CON_RECETA.size} con preparación escrita.`,
)
