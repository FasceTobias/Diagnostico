import type { InsulinRatio, InsulinSettings, Slot } from './types'
import { minutesOf } from './format'

/* ------------------------------------------------------------------
   INSULINA — aritmética, no medicina.

   Este módulo hace UNA cosa: una división. No decide, no sugiere, no
   corrige por glucemia, no mira actividad ni horarios de inyección.

   Existe para que no tengas que hacer la cuenta de cabeza, y para que la
   relación que usás esté guardada en un solo lugar y sea editable.
   ------------------------------------------------------------------ */

/** Elige qué relación aplica. Hoy sólo hay una general, pero el orden de
    precedencia ya está: lo más específico gana. */
export const ratioFor = (
  settings: InsulinSettings,
  slot?: Slot,
  time?: string,
): InsulinRatio | undefined => {
  const inWindow = (r: InsulinRatio) => {
    if (!r.fromTime || !r.toTime || !time) return false
    const t = minutesOf(time)
    return t >= minutesOf(r.fromTime) && t < minutesOf(r.toTime)
  }

  return (
    settings.ratios.find((r) => slot && r.scope === slot) ??
    settings.ratios.find(inWindow) ??
    settings.ratios.find((r) => r.scope === 'general')
  )
}

export interface CarbMath {
  carbs: number
  gramsPerUnit: number
  /** El resultado crudo de la división. Sin redondear. */
  units: number
  /** Redondeado a media unidad, que es como se dosifica en la práctica. */
  rounded: number
}

/** La división, y nada más. */
export const carbMath = (carbs: number, gramsPerUnit: number): CarbMath | null => {
  if (!Number.isFinite(carbs) || carbs < 0) return null
  if (!Number.isFinite(gramsPerUnit) || gramsPerUnit <= 0) return null

  const units = carbs / gramsPerUnit
  return {
    carbs,
    gramsPerUnit,
    units,
    rounded: Math.round(units * 2) / 2,
  }
}

/** "3" · "2,5" — con coma, que es como se escribe acá. */
export const formatUnits = (n: number) =>
  (Number.isInteger(n) ? String(n) : n.toFixed(1)).replace('.', ',')
