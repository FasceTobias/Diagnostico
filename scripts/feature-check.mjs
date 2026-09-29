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
  const { buildShoppingList, packListFor, buildWeek, reflowDay } = await vite.ssrLoadModule('/src/lib/domain.ts')
  const { comidasDelDia, comidaActual } = await vite.ssrLoadModule('/src/lib/dia.ts')
  const { SLOT_ORDER, SLOT_CATEGORY } = await vite.ssrLoadModule('/src/lib/types.ts')
  const { normalizarPerfil } = await vite.ssrLoadModule('/src/lib/perfil.ts')
  const { candidatesFor } = await vite.ssrLoadModule('/src/lib/domain.ts')
  const { FOODS } = await vite.ssrLoadModule('/src/lib/foods.ts')
  const { alternativas } = await vite.ssrLoadModule('/src/lib/busquedas.ts')
  const snap = localRepo.cached()
  assert.equal(snap.meals.length, 423)
  assert(snap.meals.every((m) => Number.isFinite(m.carbs) && (m.portions ?? []).every((p) => Number.isFinite(p.carbs))), 'ninguna porción puede mostrar NaN')
  assert(snap.meals.filter((m) => m.origen === 'casera' && m.prepType !== 'ready' && !m.esBebida).length > 300)
  const kiosk = snap.meals.filter((m) => m.id.endsWith('-kiosco') && m.packaged?.verified)
  assert.equal(kiosk.length, 13)
  assert(kiosk.every((m) => m.buyOutside && m.venues?.includes('kiosco') && m.carbsVerified && m.packaged?.carbsPerServing === m.carbs))
  const { byVenue } = await vite.ssrLoadModule('/src/lib/domain.ts')
  const lowCarb = byVenue('snack_pm', snap.meals, ['pocos-carbo']).flatMap((g) => g.meals)
  assert(lowCarb.some((m) => m.id === 'natural-break-nutritivo-kiosco'))
  assert(lowCarb.every((m) => m.carbs <= 10 && !m.esBebida))
  assert(!lowCarb.some((m) => m.id === 'menthoplus-zero-kiosco'))
  assert.equal(byVenue('snack_pm', snap.meals, ['pocos-carbo','mucha-hambre']).flatMap((g) => g.meals).every((m) => m.carbs <= 10), true)
  assert.equal(SLOT_ORDER.length, 6)
  for (const slot of SLOT_ORDER) assert(snap.meals.some((m) => m.momentos.includes(SLOT_CATEGORY[slot])))
  const day = snap.week[0]
  const contexts = Object.fromEntries(snap.week.map((d, i) => [d.date, i % 2 ? 'calle' : 'casa']))
  const rotated = buildWeek(new Date(`${snap.weekStart}T12:00:00`), snap.meals, 'mixto', snap.times, snap.prefs, contexts)
  assert(rotated.every((d) => d.context === contexts[d.date]))
  assert(rotated.flatMap((d) => d.meals).filter((p) => snap.meals.find((m) => m.id === p.mealId)?.totalMinutes > 30).length <= 1)
  for (const d of rotated.filter((d) => d.context === 'calle')) {
    for (const p of d.meals) {
      const m = snap.meals.find((x) => x.id === p.mealId)
      assert(m?.portable || m?.buyOutside, `${p.slot} del ${d.date} no sirve afuera`)
    }
  }
  const reflowed = reflowDay(day, snap.meals, 'calle')
  assert(reflowed.meals.every((p) => { const m = snap.meals.find((x) => x.id === p.mealId); return m?.portable || m?.buyOutside }))
  await localRepo.saveDay(reflowed)
  assert.equal(localRepo.cached().week[0].context, 'calle')
  const kioskSnack = kiosk.find((m) => m.momentos.includes('snack mañana')) ?? kiosk[0]
  const withBought = { ...reflowed, meals: reflowed.meals.map((p) => p.slot === 'snack_am' ? { ...p, mealId: kioskSnack.id } : p) }
  assert(packListFor(withBought, snap.meals).some((x) => x.kind === 'buy' && x.label.includes(kioskSnack.name)))
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
  assert(alternativas(snap.meals, 'almuerzo', 'pollo-arroz-integral').some((m) => m.id === recipe.id), 'las alternativas deben incluir todo el catálogo')
  assert(recipe.ingredients.every((i) => FOODS[i.item]), 'todos los ingredientes nuevos deben llegar a Compras')
  const planned = { ...day, meals: day.meals.map((m) => m.slot === 'lunch' ? { ...m, mealId: recipe.id } : m) }
  await localRepo.saveDay(planned)
  assert.equal(localRepo.cached().week[0].meals.find((m) => m.slot === 'lunch').mealId, recipe.id)
  assert(packListFor({ ...planned, context: 'mixto' }, snap.meals).some((x) => x.kind === 'meal' && x.label.includes(recipe.name)))
  const shopping = buildShoppingList([planned], snap.meals).flatMap((g) => g.lines)
  assert(shopping.some((x) => x.item === 'zapallito'))
  assert(shopping.filter((x) => x.item === 'tomate').length <= 1)
  const bothUnits = [
    { ...recipe, id: 'gramos', ingredients: [{ item: 'tomate', qty: 230, unit: 'g' }] },
    { ...recipe, id: 'unidades', ingredients: [{ item: 'tomate', qty: 2, unit: 'u' }] },
  ]
  const withBoth = [{ ...planned, meals: [
    { ...planned.meals[0], mealId: 'gramos' },
    { ...planned.meals[1], mealId: 'unidades' },
  ] }]
  const tomatoes = buildShoppingList(withBoth, bothUnits).flatMap((g) => g.lines).filter((x) => x.item === 'tomate')
  assert.equal(tomatoes.length, 1)
  assert.equal(tomatoes[0].value, '4')
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
  console.log('6 momentos, 423 opciones, 13 productos de kiosco con etiqueta, onboarding A–F, receta→plan→Hoy/lonchera/Compras y persistencia: OK')
} finally {
  await vite.close()
}
