import { useState } from 'react'
import type { Vianda } from '../lib/store'
import { CONTEXT_NOTE, SLOT_LABEL } from '../lib/types'
import { isoDate, longDate, parseIso, shortDate } from '../lib/format'
import { CarbChip, ContextSwitch, DemoBadge, MealMark, SatietyMark } from '../components/ui'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'

export function Semana({ app }: { app: Vianda }) {
  const todayIso = isoDate(new Date())
  const [selected, setSelected] = useState(todayIso)
  const [target, setTarget] = useState<MealSheetTarget | null>(null)

  const day = app.week.find((d) => d.date === selected) ?? app.week[0]

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="text-[30px] leading-none v-display text-ink">Semana</h1>
        <p className="mt-2 text-[15px] text-ink-soft">Tocá un día para verlo o cambiarlo.</p>
      </header>

      <div className="v-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {app.week.map((d) => {
          const date = parseIso(d.date)
          const active = d.date === selected
          const isToday = d.date === todayIso
          return (
            <button
              key={d.date}
              onClick={() => setSelected(d.date)}
              className={`flex min-w-[62px] shrink-0 flex-col items-center gap-1 rounded-card px-3 py-3 transition-colors ${
                active ? 'bg-clay text-white shadow-md' : 'bg-surface text-ink-soft shadow-sm'
              }`}
            >
              <span className="text-[11px] v-eyebrow opacity-80">{shortDate(date).split(' ')[0]}</span>
              <span className="text-[19px] v-display v-tnum">{date.getDate()}</span>
              <span
                aria-hidden
                className={`size-1 rounded-full ${isToday ? (active ? 'bg-white' : 'bg-clay') : 'bg-transparent'}`}
              />
            </button>
          )
        })}
      </div>

      {day && (
        <section className="mt-7">
          <h2 className="px-1 text-[17px] v-display text-ink first-letter:uppercase">
            {longDate(parseIso(day.date))}
          </h2>

          <div className="mt-3">
            <ContextSwitch
              value={day.context}
              onChange={(c) => app.setContext(day.date, c)}
            />
            <p className="mt-2 px-1 text-[12px] text-ink-faint">{CONTEXT_NOTE[day.context]}</p>
          </div>

          <ul className="mt-3 space-y-2">
            {day.meals.map((planned) => {
              const meal = app.mealById(planned.mealId)
              if (!meal) return null
              return (
                <li key={planned.slot}>
                  <button
                    onClick={() => setTarget({ planned, meal })}
                    className="flex w-full items-center gap-3.5 rounded-card bg-surface px-3.5 py-3.5 text-left shadow-sm active:scale-[0.985]"
                  >
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
                      <span className="mt-1.5 flex items-center gap-3">
                        <CarbChip meal={meal} />
                        <SatietyMark level={meal.satiety} showLabel={false} />
                        {meal.isDemo && <DemoBadge />}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <button
        onClick={app.regenerate}
        className="mt-8 min-h-[48px] w-full rounded-pill border border-line bg-surface text-[15px] font-semibold text-ink-soft active:scale-[0.98]"
      >
        Volver a armar la semana
      </button>
      <p className="mt-3 px-1 text-[12px] leading-relaxed text-ink-faint">
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
  )
}
