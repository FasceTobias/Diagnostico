import { useMemo } from 'react'
import type { Vianda } from '../lib/store'
import { SLOT_LABEL } from '../lib/types'
import { findNext } from '../lib/domain'
import { minutesOf, nowMinutes, relativeTime } from '../lib/format'
import { carbLabel } from '../lib/format'

/* MODO FOCO — una sola cosa en pantalla: lo que viene ahora.
   Sin navegación, sin listas, sin asistente. Se sale con un toque. */

export function Focus({ app, onExit }: { app: Vianda; onExit: () => void }) {
  const now = nowMinutes()
  const next = useMemo(
    () => (app.today ? findNext(app.today, app.meals, now) : undefined),
    [app.today, app.meals, now],
  )

  const after = app.today?.meals
    .filter((p) => minutesOf(p.time) > (next?.minutes ?? 0) && p.status !== 'skipped')
    .sort((a, b) => minutesOf(a.time) - minutesOf(b.time))[0]
  const afterMeal = after ? app.mealById(after.mealId) : undefined

  return (
    <div className="flex min-h-dvh flex-col bg-bg px-7 v-safe-top v-safe-bottom">
      <div className="relative z-10 flex shrink-0 items-center justify-between pt-6">
        <p className="v-eyebrow text-ink-faint">Modo foco</p>
        <button
          onClick={onExit}
          className="-mr-2 rounded-pill px-3 py-2 text-[15px] font-medium text-ink-soft active:bg-surface-2"
        >
          Salir
        </button>
      </div>

      {next ? (
        <div className="v-rise flex flex-1 flex-col justify-center py-12">
          <p className="v-eyebrow text-clay">Ahora</p>
          <h1 className="mt-3 text-[34px] leading-none v-display text-ink">
            {SLOT_LABEL[next.planned.slot]}
          </h1>
          <p className="mt-2 text-[22px] text-ink-soft v-tnum">
            {next.planned.time}
            <span className="ml-2.5 text-[16px] text-ink-faint">
              {relativeTime(next.minutes, now)}
            </span>
          </p>

          <p className="mt-9 text-[30px] leading-[1.15] v-display text-ink">
            {next.meal.name}
          </p>

          <p className="mt-5 text-[20px] text-ink-soft v-tnum">
            {carbLabel(next.meal)}
            <span className="ml-3 text-[16px] text-ink-faint capitalize">
              {next.meal.satiety}
            </span>
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center py-12">
          <h1 className="text-[30px] v-display text-ink">Nada pendiente</h1>
          <p className="mt-2 text-[17px] text-ink-soft">El día ya está resuelto.</p>
        </div>
      )}

      <div className="shrink-0 border-t border-line py-6">
        {afterMeal && after ? (
          <p className="text-[15px] text-ink-faint">
            Después · {SLOT_LABEL[after.slot]} {after.time} ·{' '}
            <span className="text-ink-soft">{afterMeal.name}</span>
          </p>
        ) : (
          <p className="text-[15px] text-ink-faint">No queda nada después.</p>
        )}
      </div>
    </div>
  )
}
