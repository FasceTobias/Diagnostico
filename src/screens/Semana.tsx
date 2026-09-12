import { useState } from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import { CONTEXT_NOTE } from '../lib/types'
import { isoDate, longDate, parseIso, shortDate } from '../lib/format'
import { ContextSwitch, SectionLabel } from '../components/ui'
import { Rail, type RailItem } from '../components/Rail'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'

/* SEMANA — un pliego de siete páginas.

   Arriba, los días como numerales grandes; el elegido se marca con una
   regla, no con una cápsula. Abajo, el día abierto con el mismo riel que
   HOY: la forma de leer un día es siempre la misma. */

export function Semana({ app }: { app: Vianda }) {
  const todayIso = isoDate(new Date())
  const [selected, setSelected] = useState(todayIso)
  const [target, setTarget] = useState<MealSheetTarget | null>(null)

  const day = app.week.find((d) => d.date === selected) ?? app.week[0]

  const items: RailItem[] = (day?.meals ?? [])
    .map((planned) => ({ planned, meal: app.mealById(planned.mealId) }))
    .filter((r): r is RailItem => !!r.meal)

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto max-w-md px-6 pb-32">
        <header className="v-safe-top pt-8 pb-6">
          <h1 className="v-serif-lg text-[38px] text-ink">Semana</h1>
        </header>

        {/* Tira de días: numerales en serif, sin cápsulas */}
        <div className="v-no-scrollbar -mx-6 flex gap-1 overflow-x-auto border-y border-line px-6">
          {app.week.map((d) => {
            const date = parseIso(d.date)
            const active = d.date === selected
            const isToday = d.date === todayIso
            return (
              <button
                key={d.date}
                onClick={() => setSelected(d.date)}
                className="relative min-w-[46px] shrink-0 py-3.5 text-center"
              >
                <span
                  className={`v-label-sm block ${active ? 'text-clay' : 'text-ink-faint'}`}
                >
                  {shortDate(date).split(' ')[0]}
                </span>
                <span
                  className={`v-serif mt-0.5 block text-[22px] v-tnum transition-colors ${
                    active ? 'text-ink' : 'text-ink-faint'
                  }`}
                >
                  {date.getDate()}
                </span>
                {isToday && !active && (
                  <span aria-hidden className="mx-auto mt-1 block size-1 rounded-full bg-clay" />
                )}
                {active && (
                  <m.span
                    aria-hidden
                    initial={{ scaleX: 0.3, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    className="absolute inset-x-1 bottom-0 h-[2px] bg-clay"
                  />
                )}
              </button>
            )
          })}
        </div>

        {day && (
          <m.section
            key={day.date}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
            className="pt-7"
          >
            <h2 className="v-serif-lg text-[27px] text-ink first-letter:uppercase">
              {longDate(parseIso(day.date))}
            </h2>

            <div className="mt-5">
              <ContextSwitch value={day.context} onChange={(c) => app.setContext(day.date, c)} />
              <p className="v-label-sm mt-2.5 text-ink-faint">{CONTEXT_NOTE[day.context]}</p>
            </div>

            <SectionLabel className="mt-9 mb-3" aside="g CHO">El día</SectionLabel>
            <Rail
              items={items}
              onOpen={(item) => setTarget({ planned: item.planned, meal: item.meal })}
              onRestore={(item) => app.setStatus(day.date, item.planned.slot, 'pending')}
              showStatus={false}
            />
          </m.section>
        )}

        <button
          onClick={app.regenerate}
          className="mt-10 w-full border-y border-line py-4 text-[16px] text-ink-soft active:bg-surface-2"
        >
          Volver a armar la semana
        </button>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
          Primero se elige entre las comidas que el día necesita —saciedad,
          transporte, tiempo—; la variedad desempata dentro de esas. Nunca al revés.
        </p>

        <MealSheet
          target={target}
          meals={app.meals}
          context={day?.context ?? 'mixto'}
          insulin={app.insulin}
          onClose={() => setTarget(null)}
          onStatus={(status) => target && day && app.setStatus(day.date, target.planned.slot, status)}
          onReplace={(mealId) =>
            target && day && app.replaceMeal(day.date, target.planned.slot, mealId)
          }
        />
      </div>
    </LazyMotion>
  )
}
