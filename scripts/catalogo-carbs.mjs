/* Compara los carbohidratos declarados de cada comida con los que dan
   sus ingredientes.

   No corrige nada: imprime en qué comidas los dos números no se
   parecen, para revisarlas a mano. Una diferencia grande puede ser el
   número mal estimado, los ingredientes mal cargados, o una receta que
   rinde más de lo que la porción dice.

       node scripts/catalogo-carbs.mjs            todas las que difieren
       node scripts/catalogo-carbs.mjs --todas    todas, difieran o no
       node scripts/catalogo-carbs.mjs merluza-pure polenta-salsa

   La cuenta es la misma que usa la app: este script empaqueta
   `src/lib/carbos.ts` y la importa, para que no existan dos versiones
   de la aritmética. */

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { rolldown } from 'rolldown'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const bundle = await rolldown({ input: resolve(ROOT, 'src/lib/carbos.ts'), platform: 'node' })
const { output } = await bundle.generate({ format: 'esm' })
const dir = mkdtempSync(join(tmpdir(), 'vianda-'))
const archivo = join(dir, 'carbos.mjs')
writeFileSync(archivo, output[0].code)
const { derivar, brecha } = await import(pathToFileURL(archivo).href)

const catalogo = JSON.parse(readFileSync(resolve(ROOT, 'data/catalogo/v1.json'), 'utf8'))

const args = process.argv.slice(2)
const todas = args.includes('--todas')
const pedidas = args.filter((a) => !a.startsWith('--'))

const filas = []
for (const e of catalogo) {
  if (pedidas.length && !pedidas.includes(e.slug)) continue
  if (!e.items.length) continue
  const p = e.portions.find((x) => x.default) ?? e.portions[0]
  const d = derivar(e.items, e.rinde ?? undefined, p.label)
  filas.push({ e, p, d, b: brecha(p.carbs, d) })
}

const sinCuenta = filas.filter((f) => !f.b)
const conBrecha = filas.filter((f) => f.b?.importante)
const parejas = filas.filter((f) => f.b && !f.b.importante)

const linea = (f) => {
  const { e, p, d, b } = f
  const rinde = e.rinde ? ` · rinde ${e.rinde}` : ''
  if (!b) return `${e.slug.padEnd(28)} sin cuenta: falta ${[...new Set(d.faltan)].join(', ')}`
  const signo = b.diferencia > 0 ? '+' : ''
  return (
    `${e.slug.padEnd(28)} declara ${String(b.declarado).padStart(3)} g · ` +
    `los ingredientes dan ${String(b.derivado).padStart(3)} g ` +
    `(${signo}${b.diferencia})  ${p.label}${rinde}`
  )
}

if (todas || pedidas.length) {
  for (const f of filas) console.log(linea(f))
} else {
  console.log(`\nDIFERENCIAS IMPORTANTES (${conBrecha.length})`)
  console.log('Ocho gramos o más, y al menos un quinto del número declarado.\n')
  for (const f of conBrecha.sort((a, b) => Math.abs(b.b.diferencia) - Math.abs(a.b.diferencia)))
    console.log('  ' + linea(f))
  if (sinCuenta.length) {
    console.log(`\nSIN CUENTA POSIBLE (${sinCuenta.length})`)
    for (const f of sinCuenta) console.log('  ' + linea(f))
  }
}

/* Con --marcar queda el resultado escrito al lado del catálogo, para
   poder revisarlo sin volver a correr nada. */
if (args.includes('--marcar')) {
  const salida = {
    _: 'Comidas donde los carbohidratos declarados y los que dan sus ingredientes no coinciden. Generado por scripts/catalogo-carbs.mjs. Nada de esto está corregido: es la lista para revisar a mano. El número derivado sale de tablas de composición, no de etiquetas, así que tampoco es la verdad: es con qué discutir el declarado.',
    generado: new Date().toISOString().slice(0, 10),
    regla: 'importante = ocho gramos o más de diferencia, y al menos un quinto del número declarado',
    comidas: conBrecha
      .sort((a, b) => Math.abs(b.b.diferencia) - Math.abs(a.b.diferencia))
      .map((f) => ({
        slug: f.e.slug,
        nombre: f.e.name,
        porcion: f.p.label,
        rinde: f.e.rinde ?? null,
        declarado: f.b.declarado,
        derivado: f.b.derivado,
        diferencia: f.b.diferencia,
      })),
  }
  writeFileSync(resolve(ROOT, 'data/catalogo/revision-carbos.json'), JSON.stringify(salida, null, 2) + '\n')
  console.log(`\nEscrito data/catalogo/revision-carbos.json con ${conBrecha.length} comidas.`)
}

console.log(
  `\n${filas.length} comidas con ingredientes · ${parejas.length} coinciden · ` +
    `${conBrecha.length} difieren · ${sinCuenta.length} sin cuenta posible`,
)
