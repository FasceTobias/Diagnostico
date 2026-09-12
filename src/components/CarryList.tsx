import { useState } from 'react'
import type { PackItem } from '../lib/types'
import { Sheet } from './Sheet'
import { CheckRow } from './ui'

/* HOY LLEVATE — es una lectura, no una tarea.

   La checklist existe, pero apagada: se enciende sólo si querés ir
   marcando mientras cargás la mochila. Si nunca la tocás, la función
   sirve igual. */

export function CarryList({
  open,
  onClose,
  items,
  onCheck,
}: {
  open: boolean
  onClose: () => void
  items: PackItem[]
  onCheck: (id: string) => void
}) {
  const [marking, setMarking] = useState(false)

  const meals = items.filter((i) => i.kind === 'meal')
  const gear = items.filter((i) => i.kind === 'gear')

  return (
    <Sheet open={open} onClose={onClose} title="Hoy llevate">
      {meals.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line-strong px-4 py-4 text-[14px] leading-relaxed text-ink-faint">
          Hoy no hay comida para llevar: el día está armado para comer en casa.
        </p>
      )}

      {marking ? (
        <div className="-mx-1">
          {items.map((item) => (
            <CheckRow
              key={item.id}
              label={item.label}
              hint={item.hint}
              done={item.done}
              onToggle={() => onCheck(item.id)}
            />
          ))}
        </div>
      ) : (
        <>
          {meals.length > 0 && (
            <ul className="space-y-1">
              {meals.map((item) => (
                <li key={item.id} className="py-1.5">
                  <p className="text-[17px] leading-snug text-ink">{item.label}</p>
                  {item.hint && (
                    <p className="text-[13px] text-ink-faint">{item.hint}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {gear.length > 0 && (
            <ul className="mt-5 space-y-1 border-t border-line pt-4">
              {gear.map((item) => (
                <li key={item.id} className="py-1 text-[16px] text-ink-soft">
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <button
        onClick={() => setMarking((m) => !m)}
        className="mt-7 w-full py-3 text-[14px] font-medium text-ink-faint active:text-ink"
      >
        {marking ? 'Sólo mirar la lista' : 'Ir marcando mientras cargo'}
      </button>
    </Sheet>
  )
}
