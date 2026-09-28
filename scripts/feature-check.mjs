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
  const snap = localRepo.cached()
  assert.equal(snap.meals.length, 199)
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
  console.log('Inicio/Hoy, lonchera, registro persistente, 199 comidas/seis momentos y compras: OK')
} finally {
  await vite.close()
}
