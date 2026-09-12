import { LazyMotion, domAnimation, m } from 'motion/react'
import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_SHORT } from '../lib/types'
import { CarbValue, MetaLine, StatusPill } from './ui'

/* EL RIEL

   El día es una línea, no una pila de tarjetas. Una columna de horas, un
   hilo vertical y un nodo por comida: el activo es un punto lleno, los
   demás son puntos chicos, y lo que ya pasó se apaga solo.

   Es la misma estructura en HOY y en SEMANA: cambia el contenido, no la
   forma de leerlo. */

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
      <div className="relative pl-[60px]">
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[44px] w-px bg-line"
        />
        {items.map((item, idx) => {
          const { planned, meal } = item
          const active = planned.slot === activeSlot
          const past = activeIdx >= 0 && idx < activeIdx
          const skipped = planned.status === 'skipped'

          if (skipped) {
            return (
              <div key={planned.slot} className="relative flex items-center gap-3 py-2.5">
                <span className="absolute top-[13px] -left-[60px] text-[12px] text-ink-faint v-tnum">
                  {planned.time}
                </span>
                <span
                  aria-hidden
                  className="absolute top-[15px] -left-[19px] block size-[5px] rounded-full bg-line-strong ring-4 ring-bg"
                />
                <span className="v-label-sm flex-1 text-ink-faint">
                  {SLOT_SHORT[planned.slot]} · hoy no
                </span>
                {onRestore && (
                  <button
                    onClick={() => onRestore(item)}
                    className="v-label-sm -my-2 px-2 py-2 text-clay"
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: past ? 0.4 : 1, y: 0 }}
              transition={{ delay: 0.035 * idx, type: 'spring', stiffness: 240, damping: 28 }}
              whileTap={{ scale: 0.99 }}
              className="relative block w-full py-3.5 text-left"
            >
              <span className="absolute top-[19px] -left-[60px] text-[12px] text-ink-faint v-tnum">
                {planned.time}
              </span>
              <span
                aria-hidden
                className={`absolute -left-[19px] block rounded-full ring-4 ring-bg ${
                  active ? 'top-[19px] size-[9px] bg-clay' : 'top-[21px] size-[5px] bg-line-strong'
                }`}
              />
              <span className="flex items-baseline justify-between gap-4">
                <span
                  className={`v-serif min-w-0 flex-1 truncate text-[17px] text-ink ${
                    active ? 'font-semibold' : ''
                  }`}
                >
                  {meal.name}
                </span>
                <CarbValue meal={meal} unit={false} />
              </span>
              <span className="mt-1 flex items-center gap-2.5">
                <MetaLine
                  parts={[
                    SLOT_SHORT[planned.slot],
                    meal.satiety,
                    planned.optional && 'opcional',
                  ]}
                />
                {showStatus && <StatusPill status={planned.status} />}
              </span>
            </m.button>
          )
        })}
      </div>
    </LazyMotion>
  )
}
