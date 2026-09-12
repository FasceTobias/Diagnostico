import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  DayContext,
  DayPlan,
  InsulinSettings,
  MealStatus,
  PackItem,
  PrepTask,
  Slot,
} from './types'
import { DEFAULT_INSULIN } from './types'
import { DEMO_MEALS } from './demo'
import { addDays, isoDate } from './format'
import {
  DEFAULT_TIMES,
  buildWeek,
  packListFor,
  prepTasksFor,
  reflowDay,
} from './domain'

/* Repositorio local. Misma forma que va a tener el de Supabase, para que
   cambiar de uno a otro no toque ninguna pantalla. */

const KEY = 'vianda.state.v3'

interface Persisted {
  week: DayPlan[]
  weekStart: string
  times: Record<Slot, string>
  insulin: InsulinSettings
  checks: Record<string, boolean>
  focus: boolean
}

const startOfWeek = (d: Date) => {
  const x = new Date(d)
  const dow = (x.getDay() + 6) % 7 // lunes = 0
  return addDays(x, -dow)
}

const load = (): Persisted | null => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Persisted) : null
  } catch {
    return null
  }
}

const save = (state: Persisted) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* modo privado, cuota llena: la app funciona igual, sin recordar */
  }
}

const fresh = (): Persisted => {
  const ws = startOfWeek(new Date())
  return {
    // 'mixto' por defecto: ni asumir que estás en casa ni que estás afuera.
    week: buildWeek(ws, DEMO_MEALS, 'mixto', DEFAULT_TIMES),
    weekStart: isoDate(ws),
    times: DEFAULT_TIMES,
    insulin: DEFAULT_INSULIN,
    checks: {},
    focus: false,
  }
}

export const useVianda = () => {
  const meals = DEMO_MEALS

  const [state, setState] = useState<Persisted>(() => {
    const stored = load()
    const ws = isoDate(startOfWeek(new Date()))
    if (!stored) return fresh()
    // La semana se regenera, pero la configuración personal sobrevive.
    return stored.weekStart === ws
      ? { ...fresh(), ...stored }
      : { ...fresh(), times: stored.times, insulin: stored.insulin }
  })

  useEffect(() => save(state), [state])

  const todayIso = isoDate(new Date())
  const tomorrowIso = isoDate(addDays(new Date(), 1))

  const today = useMemo(
    () => state.week.find((d) => d.date === todayIso) ?? state.week[0],
    [state.week, todayIso],
  )
  const tomorrow = useMemo(
    () => state.week.find((d) => d.date === tomorrowIso) ?? state.week[1],
    [state.week, tomorrowIso],
  )

  const mealById = useCallback((id: string) => meals.find((m) => m.id === id), [meals])

  const patchDay = useCallback(
    (date: string, fn: (day: DayPlan) => DayPlan) => {
      setState((s) => ({
        ...s,
        week: s.week.map((day) => (day.date === date ? fn(day) : day)),
      }))
    },
    [],
  )

  const setStatus = useCallback(
    (date: string, slot: Slot, status: MealStatus) =>
      patchDay(date, (day) => ({
        ...day,
        meals: day.meals.map((m) => (m.slot === slot ? { ...m, status } : m)),
      })),
    [patchDay],
  )

  const replaceMeal = useCallback(
    (date: string, slot: Slot, mealId: string) =>
      patchDay(date, (day) => ({
        ...day,
        meals: day.meals.map((m) =>
          m.slot === slot
            ? { ...m, mealId, replacedFrom: m.mealId, status: 'pending' }
            : m,
        ),
      })),
    [patchDay],
  )

  /* Cambiar el contexto rearma sólo lo pendiente. Lo preparado o comido
     no se toca: la app se adapta al día, no borra lo que ya hiciste. */
  const setContext = useCallback(
    (date: string, context: DayContext) =>
      patchDay(date, (day) => reflowDay(day, meals, context)),
    [patchDay, meals],
  )

  const setTime = useCallback((slot: Slot, time: string) => {
    setState((s) => ({
      ...s,
      times: { ...s.times, [slot]: time },
      week: s.week.map((day) => ({
        ...day,
        meals: day.meals.map((m) => (m.slot === slot ? { ...m, time } : m)),
      })),
    }))
  }, [])

  const toggleCheck = useCallback((id: string) => {
    setState((s) => ({ ...s, checks: { ...s.checks, [id]: !s.checks[id] } }))
  }, [])

  const setInsulin = useCallback((insulin: InsulinSettings) => {
    setState((s) => ({ ...s, insulin }))
  }, [])

  const setFocus = useCallback((focus: boolean) => {
    setState((s) => ({ ...s, focus }))
  }, [])

  const regenerate = useCallback(() => {
    setState((s) => ({
      ...s,
      week: buildWeek(new Date(s.weekStart + 'T00:00:00'), meals, today?.context ?? 'mixto', s.times),
      checks: {},
    }))
  }, [meals, today?.context])

  /* Checklists derivadas del menú. El estado marcado se guarda por id. */
  const checks = state.checks
  const withChecks = useCallback(
    <T extends { id: string; done: boolean }>(items: T[], ns: string) =>
      items.map((i) => ({ ...i, done: !!checks[`${ns}:${i.id}`] })),
    [checks],
  )

  const packing: PackItem[] = useMemo(
    () => (today ? withChecks(packListFor(today, meals), `pack:${today.date}`) : []),
    [today, meals, withChecks],
  )

  const prep: PrepTask[] = useMemo(
    () => (tomorrow ? withChecks(prepTasksFor(tomorrow, meals), `prep:${tomorrow.date}`) : []),
    [tomorrow, meals, withChecks],
  )

  const checkPack = useCallback(
    (id: string) => toggleCheck(`pack:${todayIso}:${id}`),
    [toggleCheck, todayIso],
  )
  /* La lista de compras se marca por id de línea, no por comida. */
  const isBought = useCallback((id: string) => !!checks[`shop:${id}`], [checks])
  const toggleBought = useCallback((id: string) => toggleCheck(`shop:${id}`), [toggleCheck])

  const checkPrep = useCallback(
    (id: string) => toggleCheck(`prep:${tomorrowIso}:${id}`),
    [toggleCheck, tomorrowIso],
  )

  return {
    meals,
    mealById,
    week: state.week,
    today,
    tomorrow,
    times: state.times,
    insulin: state.insulin,
    setInsulin,
    packing,
    prep,
    focus: state.focus,
    setFocus,
    setStatus,
    setContext,
    setTime,
    replaceMeal,
    checkPack,
    checkPrep,
    isBought,
    toggleBought,
    regenerate,
  }
}

export type Vianda = ReturnType<typeof useVianda>
