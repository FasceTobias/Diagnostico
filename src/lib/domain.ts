import type {
  Aisle,
  DayContext,
  Frequency,
  DayPlan,
  Meal,
  PackItem,
  PlannedMeal,
  PrepTask,
  Preferences,
  ResolveFilter,
  Satiety,
  Slot,
  Unit,
  Venue,
} from './types'
import { AISLES, OPTIONAL_SLOTS, SLOT_CATEGORY, SLOT_ORDER, VENUES } from './types'
import { addDays, isoDate, minutesOf, nowMinutes } from './format'
import { foodOf, shoppingParts } from './foods'

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
  /** Preferencias del usuario. Hoy sólo desempata; mañana va a pesar más. */
  prefs?: Preferences
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

/* Cada cuánto tiene sentido que algo aparezca en el plan. No es una nota
   de conducta: una pizza o un budín siguen entrando, sólo que no todos los
   días. Lo de «emergencia» casi no se planifica porque su lugar es
   «Resolver ahora», no el menú de la semana. */
const FREQUENCY_WEIGHT: Record<Frequency, number> = {
  habitual: 0,
  ocasional: -10,
  emergencia: -28,
}

/** Puntaje de preferencia DENTRO del pozo de candidatos válidos.
    Acá sí pesa la variedad, porque cualquiera de estas opciones ya sirve. */
const preferenceScore = (
  meal: Meal,
  ctx: RotationContext,
  prefs?: Preferences,
): number => {
  let score = (meal.rating ?? 3) * 4
  if (meal.favorite) score += 12
  if (!meal.tested) score -= 6
  score += FREQUENCY_WEIGHT[meal.frequency]

  /* La base de la app es comida de un martes cualquiera. Lo de gimnasio,
     lo de receta de internet y lo de dieta específica sigue disponible,
     pero no es el default: pierde prioridad, no desaparece. */
  score += meal.everyday ? 14 : -22

  /* Una entrada del catálogo real le gana a una de ejemplo. No por
     calidad de la comida: porque su número salió de una porción
     documentada y el de la otra es de relleno. */
  if (meal.isDemo) score -= 18

  /* Entre dos opciones parecidas, la de menos azúcar agregada desempata.
     Es un ajuste chico a propósito: no esconde nada ni bloquea nada. */
  if (prefs?.reduceAddedSugar && meal.addedSugar) score -= 8

  /* Gustos explícitos, para cuando exista la pantalla que los cargue. */
  if (prefs?.likes.includes(meal.id)) score += 20
  if (prefs?.dislikes.includes(meal.id)) score -= 60

  // Penalización por repetición. Es fuerte los primeros días —si no, las
  // dos o tres favoritas se turnan entre ellas y la semana queda cíclica—
  // pero sigue siendo un desempate: acá ya se descartó todo lo que no
  // sirve para el día, así que nunca puede elegir algo que deje con hambre.
  ctx.recentByDay.forEach((ids, daysAgo) => {
    if (!ids.includes(meal.id)) return
    score -= Math.max(4, 28 - daysAgo * 6)
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
  const all = candidatesFor(slot, context, meals, ctx.maxPrepMinutes)
  if (!all.length) return undefined

  // La misma comida dos veces en el mismo día no va. Los dos snacks son el
  // caso típico: si no se excluye, salen idénticos.
  const used = new Set(ctx.usedToday.map((m) => m.id))
  const fresh = all.filter((m) => !used.has(m.id))
  const pool = fresh.length ? fresh : all

  return [...pool].sort(
    (a, b) =>
      preferenceScore(b, ctx, ctx.prefs) - preferenceScore(a, ctx, ctx.prefs) ||
      a.id.localeCompare(b.id),
  )[0]
}

export const buildDayPlan = (
  date: Date,
  meals: Meal[],
  context: DayContext,
  history: string[][] = [],
  times: Record<Slot, string> = DEFAULT_TIMES,
  prefs?: Preferences,
): DayPlan => {
  const usedToday: Meal[] = []
  const planned: PlannedMeal[] = []

  for (const slot of SLOT_ORDER) {
    const meal = pickForSlot(slot, context, meals, { recentByDay: history, usedToday, prefs })
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
  prefs?: Preferences,
): DayPlan[] => {
  const days: DayPlan[] = []
  const history: string[][] = []
  for (let i = 0; i < 7; i++) {
    const day = buildDayPlan(addDays(start, i), meals, context, history, times, prefs)
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
  prefs?: Preferences,
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
      prefs,
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
      case 'rapido':
        if (meal.prepMinutes > 10) return false
        break
      case 'barato':
        if ((meal.priceLevel ?? 1) > 1) return false
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

/* ------------------------------------------------------------------
   LISTA DE COMPRAS

   Suma los ingredientes del menú de la semana y los convierte a cantidades
   de compra reales: "12 huevos", no "huevo". Lo que se compra afuera no
   entra, y lo que ya tenés en casa (sal, aceite) tampoco.
   ------------------------------------------------------------------ */

export interface ShoppingLine {
  id: string
  item: string
  /** "12" · "1,5" · "1" */
  value: string
  /** "" · "kg" · "paquete" */
  unit: string
  /** "huevos" · "pollo" · "pan" */
  label: string
  aisle: Aisle
  /** De qué comidas salió, para saber por qué está en la lista */
  fromMeals: string[]
}

export interface ShoppingGroup {
  aisle: Aisle
  lines: ShoppingLine[]
}

export const buildShoppingList = (week: DayPlan[], meals: Meal[]): ShoppingGroup[] => {
  const totals = new Map<
    string,
    { item: string; unit: Unit; qty: number; from: Set<string> }
  >()

  for (const day of week) {
    for (const planned of day.meals) {
      if (planned.status === 'skipped') continue
      const meal = meals.find((m) => m.id === planned.mealId)
      if (!meal || meal.buyOutside) continue

      for (const ing of meal.ingredients) {
        if (foodOf(ing.item).pantry) continue
        const key = `${ing.item}|${ing.unit}`
        const acc = totals.get(key) ?? {
          item: ing.item,
          unit: ing.unit,
          qty: 0,
          from: new Set<string>(),
        }
        acc.qty += ing.qty
        acc.from.add(meal.name)
        totals.set(key, acc)
      }
    }
  }

  const byAisle = new Map<Aisle, ShoppingLine[]>()
  for (const [key, acc] of totals) {
    const aisle = foodOf(acc.item).aisle
    const line: ShoppingLine = {
      id: key,
      item: acc.item,
      ...shoppingParts(acc.item, acc.qty, acc.unit),
      aisle,
      fromMeals: [...acc.from],
    }
    byAisle.set(aisle, [...(byAisle.get(aisle) ?? []), line])
  }

  return AISLES.filter((a) => byAisle.has(a)).map((aisle) => ({
    aisle,
    lines: (byAisle.get(aisle) ?? []).sort((a, b) => a.item.localeCompare(b.item)),
  }))
}

/* ------------------------------------------------------------------
   OPCIONES DE AFUERA, AGRUPADAS POR LUGAR

   «Estoy en la calle» es demasiado abstracto. Lo concreto es el lugar al
   que vas a entrar y qué pedís ahí adentro.
   ------------------------------------------------------------------ */

export interface VenueGroup {
  venue: Venue
  meals: Meal[]
}

export const byVenue = (
  slot: Slot,
  meals: Meal[],
  filters: ResolveFilter[] = [],
): VenueGroup[] => {
  const category = SLOT_CATEGORY[slot]
  const pool = searchRelaxing(
    meals.filter((m) => m.buyOutside && m.category === category),
    filters,
  )

  const groups = new Map<Venue, Meal[]>()
  for (const meal of pool) {
    const venue = meal.venues?.[0]
    if (!venue) continue
    groups.set(venue, [...(groups.get(venue) ?? []), meal])
  }

  return VENUES.filter((v) => groups.has(v)).map((venue) => ({
    venue,
    meals: (groups.get(venue) ?? []).sort((a, b) => a.carbs - b.carbs),
  }))
}

/* ------------------------------------------------------------------
   ALGO DULCE

   No responde «comé fruta». Busca lo que realmente se come cuando se
   quiere algo dulce, esté donde esté: café con budín, mate con
   galletitas, una barra, un alfajor.

   Ignora el momento del día a propósito: las ganas de algo dulce no
   respetan el horario del almuerzo.
   ------------------------------------------------------------------ */

const sweetRank = (prefs?: Preferences) => (a: Meal, b: Meal) => {
  const sugarPenalty = (m: Meal) => (prefs?.reduceAddedSugar && m.addedSugar ? 1 : 0)
  return (
    sugarPenalty(a) - sugarPenalty(b) ||
    Number(b.everyday) - Number(a.everyday) ||
    Number(b.favorite) - Number(a.favorite) ||
    (b.rating ?? 0) - (a.rating ?? 0)
  )
}

export const sweetOptions = (
  meals: Meal[],
  filters: ResolveFilter[] = [],
  prefs?: Preferences,
  limit = 5,
): { propias: Meal[]; venues: VenueGroup[] } => {
  /* Dulce quiere decir dulce. «Antojo» también lo usa una pizza, así que
     no alcanza como criterio. */
  const sweet = meals.filter((m) => m.tags.includes('dulce'))

  const propias = searchRelaxing(
    sweet.filter((m) => !m.buyOutside),
    filters,
  )
    .sort(sweetRank(prefs))
    .slice(0, limit)

  const groups = new Map<Venue, Meal[]>()
  for (const meal of searchRelaxing(sweet.filter((m) => m.buyOutside), filters)) {
    const venue = meal.venues?.[0]
    if (!venue) continue
    groups.set(venue, [...(groups.get(venue) ?? []), meal])
  }

  return {
    propias,
    venues: VENUES.filter((v) => groups.has(v)).map((venue) => ({
      venue,
      meals: (groups.get(venue) ?? []).sort(sweetRank(prefs)).slice(0, 3),
    })),
  }
}

/* ------------------------------------------------------------------
   EVENTO O TARDE LARGA

   Varias horas afuera sin una comida clara en el medio. Lo que funciona
   no es un plato: es una combinación — algo que llene y algo dulce, o
   algo salado y una bebida sin azúcar.

   Devuelve pares armados, no una lista de alimentos sueltos.
   ------------------------------------------------------------------ */

export interface Combo {
  id: string
  salado: Meal
  dulce: Meal
  /** Suma de los dos, para no tener que hacer la cuenta */
  carbs: number
}

export const eventCombos = (
  meals: Meal[],
  prefs?: Preferences,
  limit = 4,
): Combo[] => {
  /* En un evento estás afuera: lo que se compra ahí pesa más que lo que
     quedó en casa. Y las porciones tienen que ser de picar, no dos
     desayunos enteros pegados. */
  const handy = (m: Meal) => (m.buyOutside ? m.handheld !== false : m.portable)
  const outsideFirst = (a: Meal, b: Meal) => Number(b.buyOutside) - Number(a.buyOutside)
  const quality = (a: Meal, b: Meal) =>
    Number(b.everyday) - Number(a.everyday) ||
    Number(b.favorite) - Number(a.favorite) ||
    (b.rating ?? 0) - (a.rating ?? 0)

  const salados = meals
    .filter(
      (m) =>
        handy(m) &&
        m.satiety !== 'liviana' &&
        !m.tags.includes('dulce') &&
        m.carbs <= 45 &&
        m.prepMinutes <= 10,
    )
    .sort((a, b) => outsideFirst(a, b) || quality(a, b))

  const dulces = meals
    .filter((m) => handy(m) && m.tags.includes('dulce') && m.carbs <= 30)
    .sort((a, b) => sweetRank(prefs)(a, b) || outsideFirst(a, b))

  const combos: Combo[] = []
  const usedSweet = new Set<string>()
  const usedName = new Set<string>()

  for (const salado of salados) {
    if (usedName.has(salado.name)) continue
    // Que la suma siga siendo una merienda y no un almuerzo encubierto.
    const dulce = dulces.find(
      (d) =>
        !usedSweet.has(d.id) &&
        // Dos yogures no son una combinación.
        d.mainIngredient !== salado.mainIngredient &&
        salado.carbs + d.carbs <= 75,
    )
    if (!dulce) continue
    usedSweet.add(dulce.id)
    usedName.add(salado.name)
    combos.push({
      id: `${salado.id}+${dulce.id}`,
      salado,
      dulce,
      carbs: salado.carbs + dulce.carbs,
    })
    if (combos.length >= limit) break
  }

  return combos
}
