import type { Confidence, Meal } from './types'

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const DAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre',
]

export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** "viernes 12 de setiembre" */
export const longDate = (d: Date) =>
  `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`

/** "vie 12" */
export const shortDate = (d: Date) => `${DAYS_SHORT[d.getDay()]} ${d.getDate()}`

export const dayInitial = (d: Date) => DAYS_SHORT[d.getDay()].toUpperCase()

/** Minutos desde medianoche, para comparar contra "08:30" sin parsear fechas. */
export const minutesOf = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export const nowMinutes = (d = new Date()) => d.getHours() * 60 + d.getMinutes()

/** Saludo por franja horaria. Cercano, nunca cursi. */
export const greeting = (d = new Date()) => {
  const h = d.getHours()
  if (h < 6) return 'Buenas noches'
  if (h < 13) return 'Buen día'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

/** "en 40 min" · "en 2 h 10" · "ahora" · "hace 1 h" */
export const relativeTime = (targetMinutes: number, from = nowMinutes()) => {
  const diff = targetMinutes - from
  const abs = Math.abs(diff)
  if (abs < 10) return 'ahora'
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const body = h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${m}`
  return diff > 0 ? `en ${body}` : `hace ${body}`
}

/* ---- Carbohidratos: el dato se muestra con su confianza, siempre ---- */

/** La tilde comunica "estimado" sin depender del color. */
export const carbLabel = (meal: Pick<Meal, 'carbs' | 'confidence'>) =>
  meal.confidence === 'estimada' ? `~${meal.carbs}` : `${meal.carbs}`

export const CONFIDENCE_TEXT: Record<Confidence, string> = {
  alta: 'Confianza alta',
  media: 'Confianza media',
  estimada: 'Estimado',
}

export const CARB_SOURCE_TEXT: Record<Meal['carbSource'], string> = {
  etiqueta: 'Etiqueta nutricional',
  receta: 'Calculado desde la receta',
  estimación: 'Estimación manual',
  pendiente: 'Pendiente de confirmar',
}

/** Marca visual por categoría: identidad propia sin depender de fotos.
    Un tono cálido por momento del día + la inicial de la comida. */
export const CATEGORY_TINT: Record<Meal['category'], { bg: string; fg: string }> = {
  desayuno: { bg: 'var(--v-t-desayuno-bg)', fg: 'var(--v-t-desayuno-fg)' },
  snack: { bg: 'var(--v-t-snack-bg)', fg: 'var(--v-t-snack-fg)' },
  almuerzo: { bg: 'var(--v-t-almuerzo-bg)', fg: 'var(--v-t-almuerzo-fg)' },
  merienda: { bg: 'var(--v-t-merienda-bg)', fg: 'var(--v-t-merienda-fg)' },
  cena: { bg: 'var(--v-t-cena-bg)', fg: 'var(--v-t-cena-fg)' },
}

/** Inicial de la comida, ignorando artículos. */
export const mealInitial = (name: string) => {
  const word = name.split(' ').find((w) => w.length > 2) ?? name
  return word.charAt(0).toUpperCase()
}
