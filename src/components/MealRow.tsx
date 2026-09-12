import { useRef, useState } from 'react'
import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { CarbChip, MealTile, SatietyMark, StatusPill } from './ui'

/* Fila del día. El swipe a la izquierda es un atajo para cambiar la comida,
   nunca el único camino: la fila abre el detalle, y ahí hay un botón visible. */

export function MealRow({
  planned,
  meal,
  dim,
  onOpen,
  onSwipeReplace,
}: {
  planned: PlannedMeal
  meal: Meal
  dim?: boolean
  onOpen: () => void
  onSwipeReplace: () => void
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
        style={{ transform: `translateX(${dx}px)`, transition: dx ? 'none' : 'transform .22s var(--ease-out-soft)' }}
        className={`relative flex w-full items-center gap-3.5 bg-surface px-3.5 py-3.5 text-left shadow-sm ${
          dim ? 'opacity-55' : ''
        }`}
      >
        <span className="w-[46px] shrink-0 text-[13px] font-semibold text-ink-faint v-tnum">
          {planned.time}
        </span>
        <MealTile meal={meal} size={42} />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] v-eyebrow text-ink-faint">
            {SLOT_LABEL[planned.slot]}
          </span>
          <span className="mt-0.5 block truncate text-[16px] font-medium text-ink">
            {meal.name}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <CarbChip meal={meal} />
            <SatietyMark level={meal.satiety} />
            <StatusPill status={planned.status} />
          </span>
        </span>
      </button>
    </li>
  )
}
