import type {
  DayContext,
  DayPlan,
  Meal,
  PackItem,
  PlannedMeal,
  PrepTask,
  ResolveFilter,
  Satiety,
  Slot,
} from './types'
import { OPTIONAL_SLOTS, SLOT_CATEGORY, SLOT_ORDER } from './types'
import { addDays, isoDate, minutesOf, nowMinutes } from './format'

/* Horarios por defecto de la rutina. Son editables: salen del perfil,
   no están clavados en la UI. */
export const DEFAULT_TIMES: Record<Slot, string> = {
  breakfast: '08:30',
  snack_am: '10:30',
  lunch: '12:30',
  snack_pm: '16:00',
  merienda: '18:30',
  dinner: '21:30',
}

/* ------------------------------------------------------------------
   NECESIDADES DEL DÍA

   El contexto manda: dónde transcurre el día decide qué tiene que poder
   llevarse y cuánto tiene que llenar cada comida. No se deduce del día
   de la semana — un sábado también podés estar todo el día afuera.
   ------------------------------------------------------------------ */

const SATIETY_RANK: Record<Satiety, number> = { liviana: 0, normal: 1, potente: 2 }

export interface SlotNeed {
  category: Meal['category']
  /** Tiene que poder viajar en la mochila */
  requirePortable: boolean
  /** Piso de saciedad. Es un requisito, no una preferencia. */
  minSatiety: Satiety | null
}

const PORTABLE_BY_CONTEXT: Record<DayContext, Slot[]> = {
  casa: [],
  mixto: ['breakfast', 'snack_am', 'lunch', 'snack_pm'],
  calle: ['breakfast', 'snack_am', 'lunch', 'snack_pm', 'merienda'],
}

const SATIETY_BY_CONTEXT: Record<DayContext, Partial<Record<Slot, Satiety>>> = {
  // En casa podés cocinar en el momento: sólo se pide que no sean livianas
  // las tres comidas grandes.
  casa: { breakfast: 'normal', lunch: 'normal', merienda: 'normal' },
  // Medio día afuera: el desayuno tiene que aguantar hasta el mediodía.
  mixto: { breakfast: 'potente', lunch: 'normal', merienda: 'normal' },
  // Todo el día afuera: nada liviano en las comidas grandes, y los snacks
  // tienen que servir de verdad para aguantar.
  calle: {
    breakfast: 'potente',
    snack_am: 'normal',
    lunch: 'potente',
    snack_pm: 'normal',
    merienda: 'potente',
  },
}

export const needsFor = (slot: Slot, context: DayContext): SlotNeed => ({
  category: SLOT_CATEGORY[slot],
  requirePortable: PORTABLE_BY_CONTEXT[context].includes(slot),
  minSatiety: SATIETY_BY_CONTEXT[context][slot] ?? null,
})

/* ------------------------------------------------------------------
   ROTACIÓN

   No es random, y tampoco es una suma de puntos donde la variedad puede
   ganarle al hambre. Primero se filtra por lo que el día NECESITA; recién
   dentro de lo que sirve se optimiza preferencia y variedad.

   Orden: contexto → saciedad → momento → transporte → preparación → variedad.
   La repetición penaliza. Nunca invalida una opción mejor.
   ------------------------------------------------------------------ */

/** Aplica un requisito. Si dejara el pozo vacío, no se aplica:
    es mejor una comida imperfecta que ninguna. */
const narrow = (pool: Meal[], keep: (m: Meal) => boolean): Meal[] => {
  const next = pool.filter(keep)
  return next.length ? next : pool
}

export interface RotationContext {
  /** ids usados por día, del más reciente al más viejo */
  recentByDay: string[][]
  /** ingredientes principales ya usados hoy */
  usedToday: Meal[]
  /** minutos disponibles para cocinar, si el día aprieta */
  maxPrepMinutes?: number
}

/** Candidatos que efectivamente sirven para este slot, en orden de prioridad. */
export const candidatesFor = (
  slot: Slot,
  context: DayContext,
  meals: Meal[],
  maxPrepMinutes?: number,
): Meal[] => {
  const need = needsFor(slot, context)

  // 1. Momento del día. Este sí es infranqueable: una cena no es un desayuno.
  //    Lo comprable afuera queda fuera del plan: el martes no puede decirte
  //    "comprá empanadas". Aparece sólo desde «Resolver ahora».
  const sameMoment = meals.filter(
    (m) => m.category === need.category && !m.buyOutside,
  )
  if (!sameMoment.length) return []

  // 2. Saciedad necesaria. Antes que nada: que llene lo que tiene que llenar.
  let pool = need.minSatiety
    ? narrow(sameMoment, (m) => SATIETY_RANK[m.satiety] >= SATIETY_RANK[need.minSatiety!])
    : sameMoment

  // 3. Transportabilidad, cuando el contexto la exige.
  if (need.requirePortable) pool = narrow(pool, (m) => m.portable)

  // 4. Disponibilidad: que entre en el tiempo que hay.
  if (maxPrepMinutes) pool = narrow(pool, (m) => m.prepMinutes <= maxPrepMinutes)

  return pool
}

/** Puntaje de preferencia DENTRO del pozo de candidatos válidos.
    Acá sí pesa la variedad, porque cualquiera de estas opciones ya sirve. */
const preferenceScore = (meal: Meal, ctx: RotationContext): number => {
  let score = (meal.rating ?? 3) * 4
  if (meal.favorite) score += 12
  if (!meal.tested) score -= 6

  // Penalización por repetición: acotada, para que sea un desempate y no
  // un veto. Ayer pesa más que anteayer.
  ctx.recentByDay.forEach((ids, daysAgo) => {
    if (!ids.includes(meal.id)) return
    score -= Math.max(4, 20 - daysAgo * 5)
  })

  // Variedad dentro del mismo día: dos veces huevo cansa.
  const repeats = ctx.usedToday.filter((m) => m.mainIngredient === meal.mainIngredient).length
  score -= repeats * 10

  return score
}

export const pickForSlot = (
  slot: Slot,
  context: DayContext,
  meals: Meal[],
  ctx: RotationContext,
): Meal | undefined => {
  const pool = candidatesFor(slot, context, meals, ctx.maxPrepMinutes)
  if (!pool.length) return undefined

  return [...pool].sort(
    (a, b) =>
      preferenceScore(b, ctx) - preferenceScore(a, ctx) || a.id.localeCompare(b.id),
  )[0]
}

export const buildDayPlan = (
  date: Date,
  meals: Meal[],
  context: DayContext,
  history: string[][] = [],
  times: Record<Slot, string> = DEFAULT_TIMES,
): DayPlan => {
  const usedToday: Meal[] = []
  const planned: PlannedMeal[] = []

  for (const slot of SLOT_ORDER) {
    const meal = pickForSlot(slot, context, meals, { recentByDay: history, usedToday })
    if (!meal) continue
    usedToday.push(meal)
    planned.push({
      slot,
      mealId: meal.id,
      time: times[slot],
      status: 'pending',
      optional: OPTIONAL_SLOTS.includes(slot),
    })
  }

  return { date: isoDate(date), context, meals: planned }
}

export const buildWeek = (
  start: Date,
  meals: Meal[],
  context: DayContext = 'mixto',
  times: Record<Slot, string> = DEFAULT_TIMES,
): DayPlan[] => {
  const days: DayPlan[] = []
  const history: string[][] = []
  for (let i = 0; i < 7; i++) {
    const day = buildDayPlan(addDays(start, i), meals, context, history, times)
    history.unshift(day.meals.map((m) => m.mealId))
    days.push(day)
  }
  return days
}

/** Rearma sólo lo que todavía no pasó. Lo preparado o comido no se toca:
    cambiar el contexto a mitad del día no puede borrar lo que ya hiciste. */
export const reflowDay = (
  day: DayPlan,
  meals: Meal[],
  context: DayContext,
  history: string[][] = [],
): DayPlan => {
  const usedToday = day.meals
    .filter((p) => p.status === 'eaten' || p.status === 'prepared')
    .map((p) => meals.find((m) => m.id === p.mealId))
    .filter((m): m is Meal => !!m)

  const next = day.meals.map((planned) => {
    if (planned.status !== 'pending') return planned
    const meal = pickForSlot(planned.slot, context, meals, {
      recentByDay: history,
      usedToday,
    })
    if (!meal) return planned
    usedToday.push(meal)
    return { ...planned, mealId: meal.id }
  })

  return { ...day, context, meals: next }
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
  opts: {
    slot?: Slot
    context?: DayContext
    /** "no preparé nada": sólo lo que se resuelve ya */
    maxMinutes?: number
    limit?: number
  } = {},
): ReplacementReason[] => {
  const limit = opts.limit ?? 3

  // Los candidatos salen del mismo filtro que usa la rotación: lo que se
  // ofrece como reemplazo tiene que servir para el día de verdad.
  const pool =
    opts.slot && opts.context
      ? candidatesFor(opts.slot, opts.context, all, opts.maxMinutes)
      : all.filter((m) => m.category === current.category && !m.buyOutside)

  return pool
    .filter((m) => m.id !== current.id)
    .filter((m) => (opts.maxMinutes ? m.prepMinutes <= opts.maxMinutes : true))
    .map((meal) => {
      let score = 0
      const why: string[] = []

      if (meal.satiety === current.satiety) {
        score += 26
        why.push(`igual de ${meal.satiety === 'potente' ? 'contundente' : meal.satiety}`)
      } else if (SATIETY_RANK[meal.satiety] > SATIETY_RANK[current.satiety]) {
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

/** "Hoy no preparé nada": lo que se resuelve ya.

    Afloja de a poco en vez de devolver una lista vacía. Si no hay nada
    rápido en ese momento del día, ofrece algo de otro momento que aguante:
    en la vida real dos snacks potentes reemplazan un almuerzo, y es mejor
    eso que una pantalla vacía a las 12:30. */
export interface RescueOption {
  meal: Meal
  why: string
}

const bySpeed = (a: RescueOption, b: RescueOption) =>
  a.meal.prepMinutes - b.meal.prepMinutes || (b.meal.rating ?? 0) - (a.meal.rating ?? 0)

export const rescueOptions = (slot: Slot, meals: Meal[], limit = 4): RescueOption[] => {
  const category = SLOT_CATEGORY[slot]

  const sameMoment = (max: number) =>
    meals
      .filter((m) => m.category === category && !m.buyOutside && m.prepMinutes <= max)
      .map((meal) => ({ meal, why: `${meal.prepMinutes} min` }))

  // 1. Cero preparación. 2. Casi cero.
  for (const max of [8, 15]) {
    const tier = sameMoment(max)
    if (tier.length) return tier.sort(bySpeed).slice(0, limit)
  }

  // 3. Red de seguridad: otro momento del día, pero que llene y salga ya.
  return meals
    .filter(
      (m) =>
        m.category !== category &&
        !m.buyOutside &&
        m.prepMinutes <= 8 &&
        m.satiety !== 'liviana',
    )
    .map((meal) => ({ meal, why: `es ${meal.category}, pero sale en ${meal.prepMinutes} min` }))
    .sort(bySpeed)
    .slice(0, limit)
}

/* ------------------------------------------------------------------
   PREPARAR PARA MAÑANA
   Las tareas salen del menú. Si tres comidas llevan pollo, se dice una vez.
   ------------------------------------------------------------------ */

const activeMeals = (day: DayPlan, meals: Meal[]) =>
  day.meals
    .filter((p) => p.status !== 'skipped')
    .map((p) => ({ planned: p, meal: meals.find((m) => m.id === p.mealId) }))
    .filter((x): x is { planned: PlannedMeal; meal: Meal } => !!x.meal)

export const prepTasksFor = (day: DayPlan, meals: Meal[]): PrepTask[] => {
  const byLabel = new Map<string, string[]>()

  for (const { meal } of activeMeals(day, meals)) {
    if (!meal.makeNightBefore) continue
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
  const fromMeals: PackItem[] = activeMeals(day, meals)
    .filter(({ meal }) => meal.portable)
    .map(({ planned, meal }) => ({
      id: `pack-${planned.slot}`,
      label: meal.name,
      kind: 'meal' as const,
      hint: meal.needsCold ? 'Va con frío' : undefined,
      mealId: meal.id,
      done: false,
    }))

  const gear: PackItem[] = [
    { id: 'pack-botella', label: 'Botella de agua', kind: 'gear', done: false },
    { id: 'pack-termo', label: 'Vaso térmico con café', kind: 'gear', done: false },
    { id: 'pack-cubiertos', label: 'Cubiertos', kind: 'gear', done: false },
    { id: 'pack-servilletas', label: 'Servilletas', kind: 'gear', done: false },
  ]

  if (fromMeals.some((m) => m.hint)) {
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

/* ------------------------------------------------------------------
   RESOLVER AHORA

   El plan del día no coincide con la realidad: saliste sin almuerzo, o el
   día se estiró. Esto no planifica nada — busca qué comer ya, con lo que
   haya, acá y ahora.

   Devuelve dos grupos separados porque la decisión es distinta: lo que
   tenés en tu biblioteca y lo que tendrías que salir a comprar.
   ------------------------------------------------------------------ */

export interface ResolveResult {
  propias: Meal[]
  comprables: Meal[]
}

const matchesFilters = (meal: Meal, filters: ResolveFilter[]): boolean => {
  for (const f of filters) {
    switch (f) {
      case 'mucha-hambre':
        if (meal.satiety !== 'potente') return false
        break
      case 'normal':
        if (meal.satiety === 'liviana') return false
        break
      case 'rapido':
        if (meal.prepMinutes > 10) return false
        break
      case 'barato':
        if ((meal.priceLevel ?? 1) > 1) return false
        break
      case 'caminando':
        // Lo propio transportable ya se come caminando; lo comprable tiene
        // que decirlo explícitamente.
        if (meal.buyOutside ? !meal.handheld : !meal.portable) return false
        break
      case 'sentarme':
        // No filtra nada: sentarse abre opciones, no las cierra.
        break
    }
  }
  return true
}

/** Relaja el último filtro antes que devolver una lista vacía:
    a las 12:30 en la calle, una lista vacía no le sirve a nadie. */
const searchRelaxing = (pool: Meal[], filters: ResolveFilter[]): Meal[] => {
  for (let i = filters.length; i >= 0; i--) {
    const applied = filters.slice(0, i)
    const found = pool.filter((m) => matchesFilters(m, applied))
    if (found.length) return found
  }
  return pool
}

const rank = (a: Meal, b: Meal) =>
  Number(b.favorite) - Number(a.favorite) ||
  (b.rating ?? 0) - (a.rating ?? 0) ||
  a.prepMinutes - b.prepMinutes

export const resolveNow = (
  slot: Slot,
  meals: Meal[],
  filters: ResolveFilter[],
  limit = 4,
): ResolveResult => {
  const category = SLOT_CATEGORY[slot]
  const ofMoment = meals.filter((m) => m.category === category)

  return {
    propias: searchRelaxing(
      ofMoment.filter((m) => !m.buyOutside),
      filters,
    )
      .sort(rank)
      .slice(0, limit),
    comprables: searchRelaxing(
      ofMoment.filter((m) => m.buyOutside),
      filters,
    )
      .sort(rank)
      .slice(0, limit),
  }
}
