import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  DayContext,
  DayPlan,
  InsulinSettings,
  MealStatus,
  Preferences,
  PackItem,
  PrepTask,
  Slot,
} from './types'
import { DEFAULT_INSULIN, DEFAULT_PREFERENCES } from './types'
import { addDays, isoDate } from './format'
import { DEFAULT_TIMES, buildWeek, packListFor, prepTasksFor, reflowDay } from './domain'
import { getRepo, type Snapshot } from './repo'

/* El estado de la app en memoria.

   Acá vive lo que las pantallas leen y las funciones que lo cambian. Lo
   que NO vive acá es dónde se guarda: eso es del repositorio (`./repo`).
   La diferencia importa porque es lo que permite que mañana los datos
   vengan de Supabase sin tocar una sola pantalla.

   Cada cambio hace dos cosas, en este orden: actualiza el estado en
   memoria y le avisa al repositorio. Nunca al revés. La interfaz no
   espera a que termine de guardar —hoy porque escribir en el navegador es
   instantáneo, mañana porque con red no se puede esperar—, así que tocar
   un interruptor se siente igual con señal que sin señal. */

const repo = getRepo()

/* Con qué arranca la app si el dispositivo no tiene nada guardado y el
   repositorio todavía no contestó. Dura un cuadro y no se ve: las
   pantallas ya saben qué hacer con un día vacío. */
const EMPTY: Snapshot = {
  meals: [],
  week: [],
  weekStart: isoDate(new Date()),
  times: DEFAULT_TIMES,
  insulin: DEFAULT_INSULIN,
  prefs: DEFAULT_PREFERENCES,
  checks: {},
  ui: { focus: false },
}

export const useVianda = () => {
  /* Lo que ya está en el dispositivo, sin esperar a nadie: la app abre con
     datos en el primer cuadro. */
  const [state, setState] = useState<Snapshot>(() => repo.cached() ?? EMPTY)

  /* El estado más reciente, sin esperar al próximo render. Dos toques
     seguidos —sacar un snack y cambiar el contexto— tienen que partir del
     estado que dejó el primero, no del que había cuando React dibujó. */
  const ref = useRef(state)

  const apply = useCallback(
    (next: Snapshot, write: () => Promise<void>) => {
      ref.current = next
      setState(next)
      /* Guardar puede fallar —modo privado, cuota llena, y en su momento
         la red—. Que falle no puede tirar abajo lo que el usuario acaba de
         hacer: la etapa 4 suma la cola de reintentos y el aviso. */
      void write().catch(() => {})
    },
    [],
  )

  /* Y la verdad, que puede tardar. Hoy es lo mismo; el día que el
     repositorio sea Supabase, acá llega lo que está guardado en la cuenta. */
  useEffect(() => {
    let vivo = true
    void repo.bootstrap().then((snap) => {
      if (vivo) apply(snap, () => Promise.resolve())
    })
    return () => {
      vivo = false
    }
  }, [apply])

  const meals = state.meals
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
      const s = ref.current
      const day = s.week.find((d) => d.date === date)
      if (!day) return
      const next = fn(day)
      apply(
        { ...s, week: s.week.map((d) => (d.date === date ? next : d)) },
        () => repo.saveDay(next),
      )
    },
    [apply],
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
      patchDay(date, (day) => reflowDay(day, ref.current.meals, context, [], ref.current.prefs)),
    [patchDay],
  )

  const setTime = useCallback(
    (slot: Slot, time: string) => {
      const s = ref.current
      const times = { ...s.times, [slot]: time }
      const week = s.week.map((day) => ({
        ...day,
        meals: day.meals.map((m) => (m.slot === slot ? { ...m, time } : m)),
      }))
      apply({ ...s, times, week }, async () => {
        await repo.saveTimes(times)
        await repo.saveWeek(week, s.weekStart)
      })
    },
    [apply],
  )

  const toggleCheck = useCallback(
    (id: string) => {
      const s = ref.current
      const done = !s.checks[id]
      apply({ ...s, checks: { ...s.checks, [id]: done } }, () => repo.setCheck(id, done))
    },
    [apply],
  )

  const setInsulin = useCallback(
    (insulin: InsulinSettings) => {
      apply({ ...ref.current, insulin }, () => repo.saveInsulin(insulin))
    },
    [apply],
  )

  /* Las preferencias rearman lo pendiente: si cambiás el criterio, el plan
     que todavía no pasó tiene que reflejarlo. */
  const setPrefs = useCallback(
    (prefs: Preferences) => {
      const s = ref.current
      const week = s.week.map((day) => reflowDay(day, s.meals, day.context, [], prefs))
      apply({ ...s, prefs, week }, async () => {
        await repo.savePrefs(prefs)
        await repo.saveWeek(week, s.weekStart)
      })
    },
    [apply],
  )

  const setFocus = useCallback(
    (focus: boolean) => {
      const ui = { ...ref.current.ui, focus }
      apply({ ...ref.current, ui }, () => repo.saveUi(ui))
    },
    [apply],
  )

  const regenerate = useCallback(() => {
    const s = ref.current
    const week = buildWeek(
      new Date(s.weekStart + 'T00:00:00'),
      s.meals,
      s.week.find((d) => d.date === isoDate(new Date()))?.context ?? 'mixto',
      s.times,
      s.prefs,
    )
    apply({ ...s, week, checks: {} }, () => repo.saveWeek(week, s.weekStart))
  }, [apply])

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
    prefs: state.prefs,
    setPrefs,
    packing,
    prep,
    focus: state.ui.focus,
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
