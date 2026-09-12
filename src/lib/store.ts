import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DayPlan, MealStatus, PackItem, PrepTask, Slot } from './types'
import { DEMO_MEALS } from './demo'
import { addDays, isoDate } from './format'
import { buildWeek, packListFor, prepTasksFor } from './domain'

/* Repositorio local. Misma forma que va a tener el de Supabase, para que
   cambiar de uno a otro no toque ninguna pantalla. */

const KEY = 'vianda.state.v1'

interface Persisted {
  week: DayPlan[]
  weekStart: string
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

export const useVianda = () => {
  const meals = DEMO_MEALS

  const [state, setState] = useState<Persisted>(() => {
    const today = new Date()
    const ws = startOfWeek(today)
    const stored = load()
    if (stored && stored.weekStart === isoDate(ws)) return stored
    return {
      week: buildWeek(ws, DEMO_MEALS),
      weekStart: isoDate(ws),
      checks: {},
      focus: false,
    }
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

  const mealById = useCallback(
    (id: string) => meals.find((m) => m.id === id),
    [meals],
  )

  const setStatus = useCallback((date: string, slot: Slot, status: MealStatus) => {
    setState((s) => ({
      ...s,
      week: s.week.map((day) =>
        day.date !== date
          ? day
          : {
              ...day,
              meals: day.meals.map((m) =>
                m.slot === slot ? { ...m, status } : m,
              ),
            },
      ),
    }))
  }, [])

  const replaceMeal = useCallback((date: string, slot: Slot, mealId: string) => {
    setState((s) => ({
      ...s,
      week: s.week.map((day) =>
        day.date !== date
          ? day
          : {
              ...day,
              meals: day.meals.map((m) =>
                m.slot === slot
                  ? { ...m, mealId, replacedFrom: m.mealId, status: 'pending' }
                  : m,
              ),
            },
      ),
    }))
  }, [])

  const toggleCheck = useCallback((id: string) => {
    setState((s) => ({ ...s, checks: { ...s.checks, [id]: !s.checks[id] } }))
  }, [])

  const setFocus = useCallback((focus: boolean) => {
    setState((s) => ({ ...s, focus }))
  }, [])

  const regenerate = useCallback(() => {
    setState((s) => ({
      ...s,
      week: buildWeek(new Date(s.weekStart + 'T00:00:00'), meals),
      checks: {},
    }))
  }, [meals])

  /* Checklists derivadas del menú. El estado marcado se guarda por id. */
  const withChecks = <T extends { id: string; done: boolean }>(items: T[], ns: string) =>
    items.map((i) => ({ ...i, done: !!state.checks[`${ns}:${i.id}`] }))

  const packing: PackItem[] = useMemo(
    () => (today ? withChecks(packListFor(today, meals), `pack:${today.date}`) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today, meals, state.checks],
  )

  const prep: PrepTask[] = useMemo(
    () => (tomorrow ? withChecks(prepTasksFor(tomorrow, meals), `prep:${tomorrow.date}`) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tomorrow, meals, state.checks],
  )

  const checkPack = useCallback(
    (id: string) => toggleCheck(`pack:${todayIso}:${id}`),
    [toggleCheck, todayIso],
  )
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
    packing,
    prep,
    focus: state.focus,
    setFocus,
    setStatus,
    replaceMeal,
    checkPack,
    checkPrep,
    regenerate,
  }
}

export type Vianda = ReturnType<typeof useVianda>
