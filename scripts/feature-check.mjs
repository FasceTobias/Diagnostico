import assert from 'node:assert/strict'
import { createServer } from 'vite'

const data = new Map()
globalThis.localStorage = {
  getItem: (key) => data.get(key) ?? null,
  setItem: (key, value) => data.set(key, value),
  removeItem: (key) => data.delete(key),
}
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { localRepo } = await vite.ssrLoadModule('/src/lib/repo/local.ts')
  const { buildShoppingList, packListFor } = await vite.ssrLoadModule('/src/lib/domain.ts')
  const { comidasDelDia, comidaActual } = await vite.ssrLoadModule('/src/lib/dia.ts')
  const { SLOT_ORDER, SLOT_CATEGORY } = await vite.ssrLoadModule('/src/lib/types.ts')
  const { normalizarPerfil } = await vite.ssrLoadModule('/src/lib/perfil.ts')
  const { candidatesFor } = await vite.ssrLoadModule('/src/lib/domain.ts')
  const { FOODS } = await vite.ssrLoadModule('/src/lib/foods.ts')
  const snap = localRepo.cached()
  assert.equal(snap.meals.length, 410)
  assert(snap.meals.filter((m) => m.origen === 'casera' && m.prepType !== 'ready' && !m.esBebida).length > 300)
  assert.equal(SLOT_ORDER.length, 6)
  for (const slot of SLOT_ORDER) assert(snap.meals.some((m) => m.momentos.includes(SLOT_CATEGORY[slot])))
  const day = snap.week[0]
  assert.equal(day.meals.length, 6)
  assert(comidaActual(comidasDelDia(day, snap.meals, 8 * 60)))
  const outside = { ...day, context: 'mixto' }
  const carry = packListFor(outside, snap.meals)
  assert(carry.some((x) => x.kind === 'meal'))
  assert(carry.filter((x) => x.kind === 'meal').every((x) => /\d\d:\d\d/.test(x.hint)))
  assert.equal(packListFor({ ...outside, context: 'casa' }, snap.meals).filter((x) => x.kind === 'meal').length, 0)
  const slot = day.meals[0].slot
  const changed = { ...day, meals: day.meals.map((m) => m.slot === slot ? { ...m, status: 'eaten' } : m) }
  await localRepo.saveDay(changed)
  assert.equal(localRepo.cached().week[0].meals[0].status, 'eaten')
  await localRepo.saveDay({ ...changed, meals: changed.meals.map((m) => m.slot === slot ? { ...m, status: 'skipped' } : m) })
  assert.equal(localRepo.cached().week[0].meals[0].status, 'skipped')
  const groups = buildShoppingList(snap.week, snap.meals)
  assert(groups.length > 0 && groups.flatMap((g) => g.lines).length > 0)
  const id = groups[0].lines[0].id
  await localRepo.setCheck(`shop:${snap.weekStart}:${id}`, true)
  await localRepo.setCheck(`owned:${snap.weekStart}:${id}`, true)
  assert.equal(localRepo.cached().checks[`shop:${snap.weekStart}:${id}`], true)
  assert.equal(localRepo.cached().checks[`owned:${snap.weekStart}:${id}`], true)
  const recipe = snap.meals.find((m) => m.id === 'tarta-de-zapallitos-y-choclo')
  assert(recipe?.steps?.length && recipe.ingredients.length && recipe.nutrition && recipe.servings)
  assert(snap.meals.filter((m) => m.name.toLowerCase().includes('pollo')).length > 10)
  assert(snap.meals.filter((m) => m.ingredients.some((i) => i.item === 'papa')).length > 10)
  assert(candidatesFor('lunch', 'mixto', snap.meals).some((m) => m.id === recipe.id))
  assert(recipe.ingredients.every((i) => FOODS[i.item]), 'todos los ingredientes nuevos deben llegar a Compras')
  const planned = { ...day, meals: day.meals.map((m) => m.slot === 'lunch' ? { ...m, mealId: recipe.id } : m) }
  await localRepo.saveDay(planned)
  assert.equal(localRepo.cached().week[0].meals.find((m) => m.slot === 'lunch').mealId, recipe.id)
  assert(packListFor({ ...planned, context: 'mixto' }, snap.meals).some((x) => x.kind === 'meal' && x.label.includes(recipe.name)))
  const shopping = buildShoppingList([planned], snap.meals).flatMap((g) => g.lines)
  assert(shopping.some((x) => x.item === 'zapallito'))
  const scenarios = [
    [{ diabetes: 'tipo-1', usaInsulina: 'si', esquemaInsulina: 'ambas' }, ['tipo-1','si','ambas']],
    [{ diabetes: 'tipo-2', usaInsulina: 'no' }, ['tipo-2','no',null]],
    [{ diabetes: 'tipo-2', usaInsulina: 'si', esquemaInsulina: 'basal' }, ['tipo-2','si','basal']],
    [{ diabetes: 'no-seguro', usaInsulina: 'prefiero' }, ['no-seguro','prefiero',null]],
    [{ diabetes: 'prefiero-no-decir', usaInsulina: 'prefiero' }, ['prefiero-no-decir','prefiero',null]],
    [{ diabetes: 'tipo2_insulina', paso: 4, listo: false }, ['tipo-2','si',null]],
  ]
  for (const [input, expected] of scenarios) {
    const p = normalizarPerfil(input)
    assert.deepEqual([p.diabetes,p.usaInsulina,p.esquemaInsulina], expected)
    await localRepo.savePerfil(p)
    assert.deepEqual([localRepo.cached().perfil.diabetes,localRepo.cached().perfil.usaInsulina], expected.slice(0,2))
  }
  assert.equal(normalizarPerfil({ diabetes: 'tipo2_insulina', paso: 4, listo: false }).paso, 2)
  console.log('6 momentos, 410 opciones, onboarding A–F, receta→plan→Hoy/lonchera/Compras y persistencia: OK')
} finally {
  await vite.close()
}
