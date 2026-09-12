import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { CarbChip, DemoBadge, MealMark, SatietyMark, StatusPill } from './ui'

/* Fila del día: un renglón para leer, no un control para operar.
   Se toca y se abre el detalle; no hay gestos ocultos que aprender.

   Los snacks son opcionales y se distinguen por forma (borde en vez de
   tarjeta) y por texto, no por color. Si los sacás del día, la fila se
   colapsa a una línea con "sumar", para que volver atrás sea gratis. */

export function MealRow({
  planned,
  meal,
  dim,
  onOpen,
  onRestore,
}: {
  planned: PlannedMeal
  meal: Meal
  dim?: boolean
  onOpen: () => void
  onRestore?: () => void
}) {
  if (planned.optional && planned.status === 'skipped') {
    return (
      <li className="flex items-center gap-3 px-3.5 py-2">
        <span className="w-[46px] shrink-0 text-[13px] text-ink-faint v-tnum">
          {planned.time}
        </span>
        <span className="flex-1 text-[14px] text-ink-faint">
          {SLOT_LABEL[planned.slot]} · hoy no
        </span>
        <button
          onClick={onRestore}
          className="-my-2 rounded-pill px-3 py-2 text-[14px] font-semibold text-clay active:bg-surface-2"
        >
          Sumar
        </button>
      </li>
    )
  }

  const optionalPending = planned.optional && planned.status === 'pending'

  return (
    <li>
      <button
        onClick={onOpen}
        className={`flex w-full items-center gap-3.5 rounded-card px-3.5 py-3.5 text-left transition-transform duration-150 active:scale-[0.985] ${
          optionalPending
            ? 'border border-dashed border-line-strong bg-bg'
            : 'bg-surface shadow-sm'
        } ${dim ? 'opacity-55' : ''}`}
      >
        <span className="w-[46px] shrink-0 text-[13px] font-semibold text-ink-faint v-tnum">
          {planned.time}
        </span>
        <MealMark meal={meal} size={24} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="v-eyebrow truncate text-ink-faint">
              {SLOT_LABEL[planned.slot]}
            </span>
            {planned.optional && (
              <span className="v-eyebrow shrink-0 text-clay">Opcional</span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[16px] font-medium text-ink">
            {meal.name}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <CarbChip meal={meal} />
            <SatietyMark level={meal.satiety} />
            {meal.isDemo && <DemoBadge />}
            <StatusPill status={planned.status} />
          </span>
        </span>
      </button>
    </li>
  )
}
