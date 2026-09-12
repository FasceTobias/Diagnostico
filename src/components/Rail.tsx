import { LazyMotion, domAnimation, m } from 'motion/react'
import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_SHORT } from '../lib/types'
import { CarbValue, StatusPill } from './ui'

/* EL DÍA, COMO LÍNEA DE TIEMPO

   Un hilo vertical con un nodo por comida. El nodo activo es un punto
   lleno; lo que ya pasó se apaga solo.

   Cada fila es una superficie táctil de verdad: 56px de alto, fondo que
   responde al toque y una flecha que dice que se abre. La línea de tiempo
   es la idea; la fila es un control. */

export interface RailItem {
  planned: PlannedMeal
  meal: Meal
}

export function Rail({
  items,
  activeSlot,
  onOpen,
  onRestore,
  showStatus = true,
}: {
  items: RailItem[]
  activeSlot?: string
  onOpen: (item: RailItem) => void
  onRestore?: (item: RailItem) => void
  showStatus?: boolean
}) {
  const activeIdx = items.findIndex((i) => i.planned.slot === activeSlot)

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative">
        <span
          aria-hidden
          className="absolute top-5 bottom-5 left-[65px] w-px bg-line"
        />
        {items.map((item, idx) => {
          const { planned, meal } = item
          const active = planned.slot === activeSlot
          const past = activeIdx >= 0 && idx < activeIdx

          if (planned.status === 'skipped') {
            return (
              <div key={planned.slot} className="flex items-center gap-3 py-2 pl-1">
                <span className="w-[44px] shrink-0 text-[12px] text-ink-faint v-tnum">
                  {planned.time}
                </span>
                <span aria-hidden className="flex w-[10px] shrink-0 justify-center">
                  <span className="size-[5px] rounded-full bg-line-strong ring-4 ring-bg" />
                </span>
                <span className="v-label-sm flex-1 pl-3 text-ink-faint">
                  {SLOT_SHORT[planned.slot]} · hoy no
                </span>
                {onRestore && (
                  <button
                    onClick={() => onRestore(item)}
                    className="v-label -my-2 rounded-lg px-3 py-2.5 font-semibold text-clay active:bg-surface-2"
                  >
                    Sumar
                  </button>
                )}
              </div>
            )
          }

          return (
            <m.button
              key={planned.slot}
              onClick={() => onOpen(item)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: past ? 0.45 : 1, y: 0 }}
              transition={{ delay: 0.03 * idx, type: 'spring', stiffness: 260, damping: 28 }}
              whileTap={{ scale: 0.995 }}
              className="flex w-full items-center gap-3 rounded-xl py-2.5 pr-1 pl-1 text-left transition-colors active:bg-surface-2"
            >
              <span className="w-[44px] shrink-0 text-[12px] text-ink-faint v-tnum">
                {planned.time}
              </span>
              <span aria-hidden className="flex w-[10px] shrink-0 justify-center">
                <span
                  className={`rounded-full ring-4 ring-bg ${
                    active ? 'size-[9px] bg-clay' : 'size-[5px] bg-line-strong'
                  }`}
                />
              </span>
              <span className="min-w-0 flex-1 pl-3">
                <span className="flex items-baseline gap-2">
                  <span
                    className={`v-head min-w-0 flex-1 truncate text-[16px] ${
                      active ? 'text-ink' : 'text-ink'
                    }`}
                  >
                    {meal.name}
                  </span>
                  <CarbValue meal={meal} unit={false} />
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <span className="v-label-sm truncate text-ink-faint">
                    {SLOT_SHORT[planned.slot]} · {meal.satiety}
                    {planned.optional ? ' · opcional' : ''}
                  </span>
                  {showStatus && <StatusPill status={planned.status} />}
                </span>
              </span>
              <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-ink-faint" aria-hidden>
                <path
                  d="M4 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </m.button>
          )
        })}
      </div>
    </LazyMotion>
  )
}
