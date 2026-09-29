import assert from 'node:assert/strict'
import { deleteLocalData, exportLocalData, LOCAL_DATA_KEY } from '../src/lib/privacy.ts'

const data = new Map([
  [LOCAL_DATA_KEY, JSON.stringify({ perfil: { nombre: 'Prueba', diabetes: 'tipo-1' }, week: [{ date: '2026-09-28' }] })],
  ['vianda.remote.pending.v1', '[{"kind":"perfil"}]'],
  ['vianda.receta.detalle', '1'],
  ['otro.proyecto', 'no tocar'],
])
globalThis.localStorage = {
  get length() { return data.size },
  key: (i) => [...data.keys()][i] ?? null,
  getItem: (key) => data.get(key) ?? null,
  removeItem: (key) => data.delete(key),
}
let downloaded
let clicked = false
let exportedBlob
globalThis.document = {
  body: { append: () => {} },
  createElement: () => ({ click() { clicked = true; downloaded = this }, remove() {} }),
}
URL.createObjectURL = (blob) => { exportedBlob = blob; return 'blob:test' }
URL.revokeObjectURL = () => {}
globalThis.window = { setTimeout: () => 0 }

exportLocalData()
assert(clicked)
assert.equal(downloaded.download, 'vianda-mis-datos-' + new Date().toISOString().slice(0, 10) + '.json')
// El blob creado contiene el registro real, no datos de ejemplo del catálogo.
const exported = JSON.parse(await exportedBlob.text())
assert.equal(exported.data.perfil.diabetes, 'tipo-1')
assert.equal(exported.data.week[0].date, '2026-09-28')
deleteLocalData()
assert.equal(localStorage.getItem(LOCAL_DATA_KEY), null)
assert.equal(localStorage.getItem('vianda.remote.pending.v1'), null)
assert.equal(localStorage.getItem('vianda.receta.detalle'), null)
assert.equal(localStorage.getItem('otro.proyecto'), 'no tocar')
console.log('Exportación y borrado local: OK')
