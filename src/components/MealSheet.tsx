import { useState } from 'react'
import type { DayContext, InsulinSettings, Meal, MealStatus, PlannedMeal } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { compatibleReplacements, rescueOptions } from '../lib/domain'
import { Sheet } from './Sheet'
import { MealDetail } from './MealDetail'
import { CarbCalculator } from './CarbCalculator'
import { CarbChip, DemoBadge, MealMark, SatietyMark } from './ui'

/* Un solo sheet resuelve: ver, marcar, cambiar y rescatar el día.
   Las acciones son grandes y ninguna es destructiva. */

type Mode = 'detail' | 'replace' | 'rescue'

export interface MealSheetTarget {
  planned: PlannedMeal
  meal: Meal
  /** Abrir directo en reemplazos (viene del swipe) */
  replace?: boolean
}

const ACTIONS: { status: MealStatus; label: string; glyph: string }[] = [
  { status: 'prepared', label: 'Preparado', glyph: '✓' },
  { status: 'eaten', label: 'Comido', glyph: '●' },
  { status: 'skipped', label: 'Hoy no', glyph: '–' },
]

function OptionList({
  options,
  onPick,
}: {
  options: { meal: Meal; why?: string }[]
  onPick: (id: string) => void
}) {
  return (
    <ul className="mt-2 space-y-2">
      {options.map(({ meal, why }) => (
        <li key={meal.id}>
          <button
            onClick={() => onPick(meal.id)}
            className="flex w-full items-center gap-3.5 rounded-card bg-surface px-3.5 py-3.5 text-left shadow-sm transition-transform duration-150 active:scale-[0.985]"
          >
            <MealMark meal={meal} size={24} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-[16px] font-medium text-ink">{meal.name}</span>
                {meal.isDemo && <DemoBadge />}
              </span>
              <span className="mt-1 flex items-center gap-2.5">
                <CarbChip meal={meal} />
                <SatietyMark level={meal.satiety} showLabel={false} />
                {why && <span className="truncate text-[13px] text-ink-faint">{why}</span>}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function MealSheet({
  target,
  meals,
  context,
  insulin,
  onClose,
  onStatus,
  onReplace,
}: {
  target: MealSheetTarget | null
  meals: Meal[]
  context: DayContext
  insulin: InsulinSettings
  onClose: () => void
  onStatus: (status: MealStatus) => void
  onReplace: (mealId: string) => void
}) {
  const [mode, setMode] = useState<Mode>('detail')
  const [calc, setCalc] = useState(false)

  const close = () => {
    onClose()
    setTimeout(() => setMode('detail'), 250)
  }

  if (!target) return null

  const { planned, meal } = target
  const effectiveMode: Mode = target.replace && mode === 'detail' ? 'replace' : mode
  const slotName = SLOT_LABEL[planned.slot].toLowerCase()

  // "No preparé nada" sólo tiene sentido si esta comida dependía de eso.
  const canRescue = meal.makeNightBefore && planned.status !== 'prepared'

  const pick = (id: string) => {
    onReplace(id)
    close()
  }

  if (effectiveMode === 'replace' || effectiveMode === 'rescue') {
    const rescue = effectiveMode === 'rescue'
    const options = rescue
      ? rescueOptions(planned.slot, meals)
      : compatibleReplacements(meal, meals, { slot: planned.slot, context })

    return (
      <Sheet
        open
        onClose={close}
        title={rescue ? `Resolver ${slotName}` : `Cambiar ${slotName}`}
      >
        <p className="text-[14px] leading-relaxed text-ink-soft">
          {rescue ? (
            <>
              Sin preparación previa. Esto se resuelve en minutos, con lo que
              haya.
            </>
          ) : (
            <>
              En lugar de <span className="text-ink">{meal.name}</span>. Estas son
              las que mejor encajan en el mismo momento del día.
            </>
          )}
        </p>

        <h4 className="v-eyebrow mt-6 text-ink-faint">
          {rescue ? 'Sin preparar nada' : 'Reemplazos compatibles'}
        </h4>

        <OptionList options={options} onPick={pick} />

        {options.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-line-strong px-4 py-4 text-[14px] leading-relaxed text-ink-faint">
            {rescue
              ? 'No hay nada cargado que se resuelva sin preparación. Hoy toca improvisar: cuando cargues comidas de emergencia, esto se llena solo.'
              : 'Todavía no hay otra opción cargada para este momento del día.'}
          </p>
        )}

        <button
          onClick={() => setMode('detail')}
          className="mt-6 w-full py-3 text-[15px] font-medium text-ink-soft"
        >
          Dejar la que estaba
        </button>
      </Sheet>
    )
  }

  return (
    <Sheet open onClose={close}>
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

        {insulin.enabled && (
          <button
            onClick={() => setCalc(true)}
            className="mt-2 min-h-[44px] w-full text-[15px] font-medium text-ink-soft active:text-ink"
          >
            Calcular referencia de insulina
          </button>
        )}

        {canRescue && (
          <button
            onClick={() => setMode('rescue')}
            className="mt-2 min-h-[44px] w-full text-[15px] font-medium text-ink-soft active:text-ink"
          >
            No lo preparé — resolvelo ya
          </button>
        )}
      </div>

      <CarbCalculator
        open={calc}
        onClose={() => setCalc(false)}
        insulin={insulin}
        meal={meal}
        slot={planned.slot}
        time={planned.time}
      />
    </Sheet>
  )
}
