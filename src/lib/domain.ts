import type { DayPlan, Meal, PackItem, PlannedMeal, PrepTask, Slot } from './types'
import { SLOT_CATEGORY, SLOT_ORDER } from './types'
import { addDays, isoDate, minutesOf, nowMinutes } from './format'

/* Horarios de la rutina real. Salen del perfil, no están hardcodeados en la UI. */
export const DEFAULT_TIMES: Record<Slot, string> = {
  breakfast: '08:30',
  snack_am: '10:30',
  lunch: '12:30',
  snack_pm: '18:30',
  dinner: '21:30',
}

/* ------------------------------------------------------------------
   ROTACIÓN
   No es random. Puntúa candidatos y elige el mejor con desempate estable.
   ------------------------------------------------------------------ */

export interface RotationContext {
  /** ids usados por día, del más reciente al más viejo */
  recentByDay: string[][]
  /** El día requiere comida transportable en ese slot */
  needsPortable: (slot: Slot) => boolean
  /** Saciedad mínima pedida para ese slot */
  wantsPotent: (slot: Slot) => boolean
}

const scoreMeal = (meal: Meal, slot: Slot, ctx: RotationContext): number => {
  let score = 0

  // 1. Restricciones duras primero: si no se puede llevar, no sirve.
  if (ctx.needsPortable(slot) && !meal.portable) return -Infinity
  if (meal.category !== SLOT_CATEGORY[slot]) return -Infinity

  // 2. Favoritas pesan, pero no tanto como para comer siempre lo mismo.
  if (meal.favorite) score += 14
  score += (meal.rating ?? 3) * 3

  // 3. Penalizar lo reciente. Ayer pesa mucho más que hace cinco días.
  ctx.recentByDay.forEach((ids, daysAgo) => {
    if (ids.includes(meal.id)) score -= daysAgo === 0 ? 60 : 34 - daysAgo * 5
  })

  // 4. Saciedad pedida.
  if (ctx.wantsPotent(slot)) {
    if (meal.satiety === 'potente') score += 18
    if (meal.satiety === 'liviana') score -= 16
  }

  // 5. Lo que se prepara la noche anterior vale más para los slots de afuera.
  if (ctx.needsPortable(slot) && meal.makeNightBefore) score += 6

  // 6. Nunca probado: se propone, pero después de lo conocido.
  if (!meal.tested) score -= 8

  return score
}

/** Elige comida para un slot evitando repetir ingrediente principal del día. */
const pickForSlot = (
  slot: Slot,
  meals: Meal[],
  ctx: RotationContext,
  usedToday: Meal[],
): Meal | undefined => {
  const mainToday = usedToday.map((m) => m.mainIngredient)
  const ranked = meals
    .map((meal) => {
      let s = scoreMeal(meal, slot, ctx)
      // Variedad dentro del mismo día: dos huevos seguidos cansan.
      const repeats = mainToday.filter((i) => i === meal.mainIngredient).length
      s -= repeats * 22
      return { meal, s }
    })
    .filter((c) => c.s > -Infinity)
    .sort((a, b) => b.s - a.s || a.meal.id.localeCompare(b.meal.id))

  return ranked[0]?.meal
}

export const buildDayPlan = (
  date: Date,
  meals: Meal[],
  history: string[][] = [],
  opts: { portableDay?: boolean; longDay?: boolean } = {},
): DayPlan => {
  const ctx: RotationContext = {
    recentByDay: history,
    needsPortable: (slot) =>
      (opts.portableDay ?? true) && slot !== 'dinner' && slot !== 'snack_pm',
    wantsPotent: (slot) =>
      (opts.longDay ?? true) && (slot === 'breakfast' || slot === 'lunch'),
  }

  const usedToday: Meal[] = []
  const planned: PlannedMeal[] = []

  for (const slot of SLOT_ORDER) {
    const meal = pickForSlot(slot, meals, ctx, usedToday)
    if (!meal) continue
    usedToday.push(meal)
    planned.push({
      slot,
      mealId: meal.id,
      time: DEFAULT_TIMES[slot],
      status: 'pending',
    })
  }

  return { date: isoDate(date), meals: planned }
}

export const buildWeek = (start: Date, meals: Meal[]): DayPlan[] => {
  const days: DayPlan[] = []
  const history: string[][] = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i)
    const weekend = date.getDay() === 0 || date.getDay() === 6
    const day = buildDayPlan(date, meals, history, {
      portableDay: !weekend,
      longDay: !weekend,
    })
    history.unshift(day.meals.map((m) => m.mealId))
    days.push(day)
  }
  return days
}

/* ------------------------------------------------------------------
   REEMPLAZOS COMPATIBLES
   Tres opciones buenas, no trescientas recetas.
   ------------------------------------------------------------------ */

export interface ReplacementReason {
  meal: Meal
  /** Por qué lo propone. Se muestra: el usuario tiene que entender la sugerencia. */
  why: string
}

export const compatibleReplacements = (
  current: Meal,
  all: Meal[],
  opts: { needsPortable?: boolean; maxMinutes?: number; limit?: number } = {},
): ReplacementReason[] => {
  const limit = opts.limit ?? 3
  const needsPortable = opts.needsPortable ?? current.portable

  return all
    .filter((m) => m.id !== current.id && m.category === current.category)
    .filter((m) => (needsPortable ? m.portable : true))
    .filter((m) => (opts.maxMinutes ? m.prepMinutes <= opts.maxMinutes : true))
    .map((meal) => {
      let score = 0
      const why: string[] = []

      if (meal.satiety === current.satiety) {
        score += 26
        why.push(`igual de ${meal.satiety === 'potente' ? 'contundente' : meal.satiety}`)
      } else if (meal.satiety === 'potente') {
        score += 10
        why.push('llena más')
      } else {
        score -= 6
        why.push('más liviana')
      }

      const carbGap = Math.abs(meal.carbs - current.carbs)
      if (carbGap <= 8) {
        score += 22
        why.push('carbos parecidos')
      } else if (carbGap <= 18) {
        score += 8
      } else {
        score -= carbGap / 4
        why.push(meal.carbs > current.carbs ? 'más carbos' : 'menos carbos')
      }

      if (meal.prepMinutes < current.prepMinutes) {
        score += 8
        why.push('más rápida')
      }
      if (meal.favorite) {
        score += 12
        why.push('favorita')
      }
      score += (meal.rating ?? 3) * 2

      return { meal, why: why.slice(0, 2).join(' · '), score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ meal, why }) => ({ meal, why }))
}

/* ------------------------------------------------------------------
   PREPARAR PARA MAÑANA
   Las tareas salen del menú. Si tres comidas llevan pollo, se dice una vez.
   ------------------------------------------------------------------ */

export const prepTasksFor = (day: DayPlan, meals: Meal[]): PrepTask[] => {
  const byLabel = new Map<string, string[]>()

  for (const planned of day.meals) {
    const meal = meals.find((m) => m.id === planned.mealId)
    if (!meal || !meal.makeNightBefore) continue
    for (const step of meal.prepSteps ?? []) {
      byLabel.set(step, [...(byLabel.get(step) ?? []), meal.id])
    }
  }

  const tasks: PrepTask[] = [...byLabel.entries()].map(([label, ids]) => ({
    id: `prep-${label}`,
    label: ids.length > 1 ? `${label} (${ids.length} comidas)` : label,
    sourceMealIds: ids,
    done: false,
  }))

  // Tareas fijas de la rutina, siempre al final.
  tasks.push(
    { id: 'prep-termo', label: 'Dejar el vaso térmico listo', sourceMealIds: [], done: false },
    { id: 'prep-botella', label: 'Llenar la botella de agua', sourceMealIds: [], done: false },
  )

  return tasks
}

/* ------------------------------------------------------------------
   MOCHILA
   Las comidas transportables del día + lo fijo.
   ------------------------------------------------------------------ */

export const packListFor = (day: DayPlan, meals: Meal[]): PackItem[] => {
  const fromMeals: PackItem[] = day.meals
    .map((planned): PackItem | null => {
      const meal = meals.find((m) => m.id === planned.mealId)
      if (!meal || !meal.portable) return null
      return {
        id: `pack-${planned.slot}`,
        label: meal.name,
        kind: 'meal' as const,
        hint: meal.needsCold ? 'Va con frío' : undefined,
        mealId: meal.id,
        done: false,
      }
    })
    .filter((x): x is PackItem => x !== null)

  const gear: PackItem[] = [
    { id: 'pack-botella', label: 'Botella de agua', kind: 'gear', done: false },
    { id: 'pack-termo', label: 'Vaso térmico con café', kind: 'gear', done: false },
    { id: 'pack-cubiertos', label: 'Cubiertos', kind: 'gear', done: false },
    { id: 'pack-servilletas', label: 'Servilletas', kind: 'gear', done: false },
  ]

  const needsCold = fromMeals.some((m) => m.hint)
  if (needsCold) {
    gear.unshift({
      id: 'pack-refrigerante',
      label: 'Refrigerante de la mochila térmica',
      kind: 'gear',
      hint: 'Hay comida que va con frío',
      done: false,
    })
  }

  return [...fromMeals, ...gear]
}

/* ------------------------------------------------------------------
   PRÓXIMA COMIDA
   ------------------------------------------------------------------ */

export interface NextMeal {
  planned: PlannedMeal
  meal: Meal
  minutes: number
  /** Está pasando ahora (±45 min) */
  isNow: boolean
}

export const findNext = (
  day: DayPlan,
  meals: Meal[],
  at = nowMinutes(),
): NextMeal | undefined => {
  const open = day.meals
    .filter((p) => p.status === 'pending' || p.status === 'prepared')
    .map((planned) => ({ planned, minutes: minutesOf(planned.time) }))
    .sort((a, b) => a.minutes - b.minutes)

  const upcoming = open.find((x) => x.minutes >= at - 45) ?? open[0]
  if (!upcoming) return undefined

  const meal = meals.find((m) => m.id === upcoming.planned.mealId)
  if (!meal) return undefined

  return {
    planned: upcoming.planned,
    meal,
    minutes: upcoming.minutes,
    isNow: Math.abs(upcoming.minutes - at) <= 45,
  }
}

/** Carbohidratos del día. Dato, no objetivo: no hay meta que cumplir. */
export const dayCarbs = (day: DayPlan, meals: Meal[]) =>
  day.meals.reduce((sum, p) => {
    if (p.status === 'skipped') return sum
    const meal = meals.find((m) => m.id === p.mealId)
    return sum + (meal?.carbs ?? 0)
  }, 0)
