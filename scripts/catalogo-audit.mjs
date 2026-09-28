import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const old = read('data/catalogo/v1.json')
const added = read('data/catalogo/ampliacion.json')
const enriched = read('data/catalogo/legacy-enrichment.json')
const reference = read('data/nutrition/sara2.json')
const all = [...old, ...added]
const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const unique = new Set()
const names = new Set()
const units = new Set(['g','ml','u','cda','cdita','pizca','puñado','rebanada','pote','lata'])
const moments = new Set(['desayuno','snack','almuerzo','merienda','cena'])
const unitGrams = { huevo: 50, pan: 30, 'pan integral': 30, 'pan de miga': 25,
  'tortilla de trigo': 50, 'masa de tarta': 250, 'masa de pizza': 300,
  'tapas de empanada': 35, limón: 60 }
for (const x of all) {
  assert(x.slug && !unique.has(x.slug), `id duplicado: ${x.slug}`); unique.add(x.slug)
  assert(x.name && !names.has(normalize(x.name)), `nombre duplicado: ${x.name}`); names.add(normalize(x.name))
  assert(x.momentos?.length && x.momentos.every((m) => moments.has(m)), `${x.name}: momento inválido`)
  assert(['liviana','normal','potente'].includes(x.satiety), `${x.name}: saciedad inválida`)
  assert(x.portions?.length && x.portions.some((p) => p.default && p.carbs >= 0), `${x.name}: porción`)
  assert(x.items?.every((i) => i.item && i.qty > 0 && units.has(i.unit)), `${x.name}: ingrediente incompleto`)
  if (x.origen !== 'casera' || x.prepType === 'ready' || x.esBebida) continue // Bebidas y alimentos listos tampoco son recetas.
  assert(Number.isFinite(x.activeMinutes) && x.totalMinutes >= x.activeMinutes && x.totalMinutes > 0, `${x.name}: tiempo`)
  const complete = enriched[x.slug] ?? x
  assert(x.items.length && complete.steps?.length && complete.steps.every((p) => p.text?.trim()), `${x.name}: preparación`)
  assert(complete.servings > 0 && complete.nutrition && complete.equipment && complete.storage, `${x.name}: ficha incompleta`)
  const n = complete.nutrition
  assert(n.carbs >= 0 && n.carbs < 150 && n.kcal > 0 && n.kcal < 1200 && n.protein >= 0 && n.fat >= 0 && n.fiber >= 0, `${x.name}: macros inverosímiles`)
  assert(Math.abs(n.kcal - (n.carbs * 4 + n.protein * 4 + n.fat * 9 + n.fiber * 2)) < 175, `${x.name}: energía no coincide con macros`)
  assert(x.items.every((i) => reference[i.item]), `${x.name}: ingrediente sin referencia nutricional`)
  if (added.includes(x)) for (const field of ['carbs','protein','fat','fiber','kcal']) {
    const calculated = x.items.reduce((sum, i) => sum + reference[i.item][field] * i.qty *
      (i.unit === 'u' ? (unitGrams[i.item] ?? 100) / 100 : .01), 0) / x.servings
    assert(Math.abs(calculated - n[field]) < .11, `${x.name}: ${field} no corresponde a ingredientes y porciones`)
  }
}
const recipes = all.filter((x) => x.origen === 'casera' && x.prepType !== 'ready' && !x.esBebida)
assert(recipes.length > 300)
const nearlySame = []
for (let i = 0; i < recipes.length; i++) for (let j = i + 1; j < recipes.length; j++) {
  const a = recipes[i], b = recipes[j]
  const A = new Set(a.items.map((z) => z.item)), B = new Set(b.items.map((z) => z.item))
  const overlap = [...A].filter((v) => B.has(v)).length
  if (overlap >= 3 && overlap / new Set([...A,...B]).size >= .95 && a.category === b.category && a.name !== b.name) nearlySame.push([a.name,b.name])
}
// Distintas técnicas con los mismos ingredientes son preparaciones distintas.
const accepted = new Set(['Hamburguesas de pollo y calabaza|Albóndigas de pollo con puré de calabaza','Hamburguesas de atún y papa|Croquetas de papa y atún'])
assert(nearlySame.every((pair) => accepted.has(pair.join('|'))), `posibles duplicados: ${JSON.stringify(nearlySame)}`)
console.log(`${all.length} opciones; ${recipes.length} recetas caseras completas; ${added.length} nuevas; 0 duplicados sin revisar`)
