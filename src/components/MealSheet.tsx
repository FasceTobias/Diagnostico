import { useState } from 'react'
import type { Meal, MealStatus, PlannedMeal } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { compatibleReplacements } from '../lib/domain'
import { Sheet } from './Sheet'
import { MealDetail } from './MealDetail'
import { CarbChip, MealTile, SatietyMark } from './ui'

/* Un solo sheet resuelve: ver, marcar y cambiar.
   Las acciones son grandes y ninguna es destructiva. */

type Mode = 'detail' | 'replace'

export interface MealSheetTarget {
  planned: PlannedMeal
  meal: Meal
  /** Abrir directo en reemplazos (viene del swipe) */
  replace?: boolean
}

const ACTIONS: { status: MealStatus; label: string; glyph: string }[] = [
  { status: 'prepared', label: 'Preparado', glyph: '✓' },
  { status: 'eaten', label: 'Comido', glyph: '●' },
  { status: 'skipped', label: 'Omitido', glyph: '–' },
]

export function MealSheet({
  target,
  meals,
  onClose,
  onStatus,
  onReplace,
}: {
  target: MealSheetTarget | null
  meals: Meal[]
  onClose: () => void
  onStatus: (status: MealStatus) => void
  onReplace: (mealId: string) => void
}) {
  const [mode, setMode] = useState<Mode>('detail')
  const open = target !== null
  const effectiveMode: Mode = target?.replace && mode === 'detail' ? 'replace' : mode

  const close = () => {
    onClose()
    setTimeout(() => setMode('detail'), 250)
  }

  if (!target) return null

  const { planned, meal } = target
  const options = compatibleReplacements(meal, meals, { limit: 3 })

  return (
    <Sheet
      open={open}
      onClose={close}
      title={effectiveMode === 'replace' ? `Cambiar ${SLOT_LABEL[planned.slot].toLowerCase()}` : undefined}
    >
      {effectiveMode === 'replace' ? (
        <div>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            En lugar de <span className="text-ink">{meal.name}</span>. Estas son las
            que mejor encajan en el mismo momento del día.
          </p>

          <h4 className="v-eyebrow mt-6 text-ink-faint">Reemplazos compatibles</h4>
          <ul className="mt-2 space-y-2">
            {options.map(({ meal: option, why }) => (
              <li key={option.id}>
                <button
                  onClick={() => {
                    onReplace(option.id)
                    close()
                  }}
                  className="flex w-full items-center gap-3.5 rounded-card bg-surface px-3.5 py-3.5 text-left shadow-sm transition-transform duration-150 active:scale-[0.985]"
                >
                  <MealTile meal={option} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-medium text-ink">
                      {option.name}
                    </span>
                    <span className="mt-1 flex items-center gap-2.5">
                      <CarbChip meal={option} />
                      <SatietyMark level={option.satiety} showLabel={false} />
                      <span className="truncate text-[13px] text-ink-faint">{why}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {options.length === 0 && (
            <p className="mt-4 rounded-2xl border border-dashed border-line-strong px-4 py-4 text-[14px] text-ink-faint">
              Todavía no hay otra opción cargada para este momento del día.
            </p>
          )}

          <button
            onClick={() => setMode('detail')}
            className="mt-6 w-full py-3 text-[15px] font-medium text-ink-soft"
          >
            Dejar la que estaba
          </button>
        </div>
      ) : (
        <div>
          <MealDetail meal={meal} />

          <div className="sticky bottom-0 -mx-5 mt-8 bg-linear-to-t from-bg via-bg to-transparent px-5 pt-6 pb-1">
            <div className="flex gap-2">
              {ACTIONS.map((a) => {
                const active = planned.status === a.status
                return (
                  <button
                    key={a.status}
                    onClick={() => {
                      onStatus(active ? 'pending' : a.status)
                      if (!active) close()
                    }}
                    aria-pressed={active}
                    className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border text-[13px] font-semibold transition-colors duration-150 active:scale-[0.97] ${
                      active
                        ? 'border-clay bg-clay text-white'
                        : 'border-line bg-surface text-ink-soft'
                    }`}
                  >
                    <span aria-hidden className="text-[15px]">
                      {a.glyph}
                    </span>
                    {a.label}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setMode('replace')}
              className="mt-2 min-h-[48px] w-full rounded-2xl border border-line bg-surface text-[15px] font-semibold text-ink active:scale-[0.98]"
            >
              Cambiar por otra
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
