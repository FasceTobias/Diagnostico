import type { DayPlan, InsulinSettings, Preferences, Slot } from '../types'
import { DEFAULT_INSULIN, DEFAULT_PREFERENCES } from '../types'
import { DEMO_MEALS } from '../demo'
import { addDays, isoDate } from '../format'
import { DEFAULT_TIMES, buildWeek } from '../domain'
import type { Snapshot, ViandaRepo } from './types'

/* El repositorio del dispositivo. Es el que corre hoy, y el que va a
   seguir corriendo sin sesión iniciada: la app tiene que poder abrirse y
   servir para algo antes de que exista una cuenta.

   Guarda una sola clave con todo adentro. Para localStorage eso está
   bien —es un archivo de texto, no una base— así que los métodos
   granulares de la interfaz escriben todos el mismo blob. Lo que importa
   es que las pantallas ya hablen en granular: cuando aparezca el
   repositorio de Supabase, sólo cambia quién contesta. */

const KEY = 'vianda.state.v4'

interface Stored {
  week: DayPlan[]
  weekStart: string
  times: Record<Slot, string>
  insulin: InsulinSettings
  prefs: Preferences
  checks: Record<string, boolean>
  focus: boolean
}

const startOfWeek = (d: Date) => {
  const x = new Date(d)
  const dow = (x.getDay() + 6) % 7 // lunes = 0
  return addDays(x, -dow)
}

const read = (): Stored | null => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Stored) : null
  } catch {
    return null
  }
}

const write = (s: Stored) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* modo privado, cuota llena: la app funciona igual, sin recordar */
  }
}

const fresh = (): Stored => {
  const ws = startOfWeek(new Date())
  return {
    // 'mixto' por defecto: ni asumir que estás en casa ni que estás afuera.
    week: buildWeek(ws, DEMO_MEALS, 'mixto', DEFAULT_TIMES, DEFAULT_PREFERENCES),
    weekStart: isoDate(ws),
    times: DEFAULT_TIMES,
    insulin: DEFAULT_INSULIN,
    prefs: DEFAULT_PREFERENCES,
    checks: {},
    focus: false,
  }
}

/** Lo guardado, con la semana regenerada si ya pasó. La configuración
    personal sobrevive siempre: los horarios no se reinician un lunes.

    Si tuvo que regenerar, lo deja escrito antes de devolverlo. Así la
    semana se arma una sola vez: `cached()` y `bootstrap()` leen lo mismo
    y la pantalla no cambia de plan entre el primer cuadro y el segundo. */
const current = (): Stored => {
  const stored = read()
  const ws = isoDate(startOfWeek(new Date()))
  if (stored?.weekStart === ws) return { ...fresh(), ...stored }

  const next = stored
    ? { ...fresh(), times: stored.times, insulin: stored.insulin, prefs: stored.prefs }
    : fresh()
  write(next)
  return next
}

const toSnapshot = (s: Stored): Snapshot => ({
  meals: DEMO_MEALS,
  week: s.week,
  weekStart: s.weekStart,
  times: s.times,
  insulin: s.insulin,
  prefs: s.prefs,
  checks: s.checks,
  ui: { focus: s.focus },
})

/* Escribir no regenera nada: la semana se arma en `current()` y nada más.
   Si no, tachar un tomate podría rearmarte el plan del día. */
const patch = (fn: (s: Stored) => Stored) => {
  write(fn(read() ?? fresh()))
  return Promise.resolve()
}

export const localRepo: ViandaRepo = {
  kind: 'local',

  cached: () => toSnapshot(current()),
  bootstrap: () => Promise.resolve(toSnapshot(current())),

  saveWeek: (week, weekStart) => patch((s) => ({ ...s, week, weekStart })),

  saveDay: (day) =>
    patch((s) => ({
      ...s,
      week: s.week.map((d) => (d.date === day.date ? day : d)),
    })),

  saveTimes: (times) => patch((s) => ({ ...s, times })),
  savePrefs: (prefs) => patch((s) => ({ ...s, prefs })),
  saveInsulin: (insulin) => patch((s) => ({ ...s, insulin })),
  setCheck: (id, done) => patch((s) => ({ ...s, checks: { ...s.checks, [id]: done } })),
  saveUi: (ui) => patch((s) => ({ ...s, focus: ui.focus })),
}
