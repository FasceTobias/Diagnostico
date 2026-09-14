import type {
  DayPlan,
  InsulinSettings,
  Meal,
  Perfil,
  Preferences,
  Slot,
} from '../types'

/* ------------------------------------------------------------------
   LA COSTURA

   Todo lo que la app guarda pasa por acá. Hoy la única implementación
   escribe en el navegador; mañana hay otra que escribe en Supabase, y las
   pantallas no se enteran.

   Dos decisiones que valen la explicación:

   · Los métodos son granulares, uno por cosa que cambia. Guardar todo el
     estado de una en cada toque alcanza para localStorage y no alcanza
     para una red: sería mandar la semana entera cada vez que tachás un
     tomate de la lista de compras.

   · `cached()` devuelve sincrónico lo que ya está en el dispositivo, y
     `bootstrap()` es el que puede tardar. La app arranca con lo primero y
     se actualiza con lo segundo: así nunca hay una pantalla en blanco
     esperando a la red, ni siquiera con el teléfono en el subte.
   ------------------------------------------------------------------ */

/** Todo lo que la app necesita para arrancar. */
export interface Snapshot {
  /** La biblioteca: hoy los ejemplos, mañana el catálogo más lo tuyo. */
  meals: Meal[]
  week: DayPlan[]
  /** Lunes de la semana cargada, en ISO. */
  weekStart: string
  times: Record<Slot, string>
  insulin: InsulinSettings
  prefs: Preferences
  /** Quién sos, hasta donde quisiste contar. */
  perfil: Perfil
  /** Marcado de mochila, preparación y compras, por id de línea. */
  checks: Record<string, boolean>
  /** Estado de interfaz. No va a viajar al servidor. */
  ui: { focus: boolean }
}

export type RepoKind = 'local' | 'supabase'

export interface ViandaRepo {
  readonly kind: RepoKind

  /** Lo que ya está en el dispositivo. null si no hay nada guardado. */
  cached(): Snapshot | null
  /** La verdad, que puede tardar. */
  bootstrap(): Promise<Snapshot>

  saveWeek(week: DayPlan[], weekStart: string): Promise<void>
  saveDay(day: DayPlan): Promise<void>
  saveTimes(times: Record<Slot, string>): Promise<void>
  savePrefs(prefs: Preferences): Promise<void>
  savePerfil(perfil: Perfil): Promise<void>
  saveInsulin(insulin: InsulinSettings): Promise<void>
  setCheck(id: string, done: boolean): Promise<void>
  saveUi(ui: Snapshot['ui']): Promise<void>
}
