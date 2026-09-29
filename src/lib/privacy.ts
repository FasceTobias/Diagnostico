/** Datos creados por la persona en este dispositivo. No incluye el catálogo público. */
export const LOCAL_DATA_KEY = 'vianda.state.v4'
const LOCAL_KEYS = [LOCAL_DATA_KEY, 'vianda.remote.pending.v1', 'vianda.receta.detalle']

export function exportLocalData() {
  const raw = localStorage.getItem(LOCAL_DATA_KEY)
  if (!raw) throw new Error('Todavía no hay datos guardados en este dispositivo.')
  const content = JSON.stringify({ format: 'vianda-local-v1', exportedAt: new Date().toISOString(), data: JSON.parse(raw) }, null, 2)
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `vianda-mis-datos-${new Date().toISOString().slice(0, 10)}.json`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function deleteLocalData() {
  for (const key of LOCAL_KEYS) localStorage.removeItem(key)
  // Se eliminan únicamente las claves de Vianda. No se tocan datos de otros sitios.
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key?.startsWith('vianda.')) localStorage.removeItem(key)
  }
}
