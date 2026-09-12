import { useRef, useState } from 'react'
import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { CarbChip, DemoBadge, MealTile, SatietyMark, StatusPill } from './ui'

/* Fila del día. El swipe a la izquierda es un atajo para cambiar la comida,
   nunca el único camino: la fila abre el detalle, y ahí hay un botón visible.

   Los snacks son opcionales: se distinguen por forma (borde en vez de
   tarjeta sólida) y por texto, no por color. Si los sacás del día, la fila
   se colapsa a una línea con "sumar", para que volver atrás sea gratis. */

export function MealRow({
  planned,
  meal,
  dim,
  onOpen,
  onSwipeReplace,
  onRestore,
}: {
  planned: PlannedMeal
  meal: Meal
  dim?: boolean
  onOpen: () => void
  onSwipeReplace: () => void
  onRestore?: () => void
}) {
  const [dx, setDx] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const locked = useRef<'x' | 'y' | null>(null)

  const end = () => {
    if (dx < -72) onSwipeReplace()
    setDx(0)
    start.current = null
    locked.current = null
  }

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
    <li className="relative overflow-hidden rounded-card">
      <div className="absolute inset-y-0 right-0 flex items-center pr-5 text-[13px] font-semibold text-clay">
        Cambiar
      </div>

      <button
        onClick={onOpen}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerMove={(e) => {
          if (!start.current) return
          const mx = e.clientX - start.current.x
          const my = e.clientY - start.current.y
          if (!locked.current) locked.current = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'
          if (locked.current === 'x') setDx(Math.min(0, Math.max(-108, mx)))
        }}
        onPointerUp={end}
        onPointerCancel={end}
        style={{
          transform: `translateX(${dx}px)`,
          transition: dx ? 'none' : 'transform .22s var(--ease-out-soft)',
        }}
        className={`relative flex w-full items-center gap-3.5 px-3.5 py-3.5 text-left ${
          optionalPending
            ? 'border border-dashed border-line-strong bg-bg'
            : 'bg-surface shadow-sm'
        } ${dim ? 'opacity-55' : ''}`}
      >
        <span className="w-[46px] shrink-0 text-[13px] font-semibold text-ink-faint v-tnum">
          {planned.time}
        </span>
        <MealTile meal={meal} size={42} />
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
