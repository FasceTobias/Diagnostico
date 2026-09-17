import { useState } from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import { CONTEXT_NOTE } from '../lib/types'
import { isoDate, longDate, parseIso, shortDate } from '../lib/format'
import { ContextSwitch, SectionLabel } from '../components/ui'
import { Rail, type RailItem } from '../components/Rail'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'

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
      <div className="mx-auto max-w-md px-4 pb-40">
        <header className="v-safe-top pt-5 pb-4">
          <p className="v-label font-semibold text-accent">TU SEMANA, RESUELTA</p>
          <h1 className="v-serif-lg mt-1 text-[28px] text-ink">Qué vas a comer</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            Mirá el plan completo y cambiá sólo lo que no te cierre.
          </p>
        </header>

        <div className="v-no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-1">
          {app.week.map((d) => {
            const date = parseIso(d.date)
            const active = d.date === selected
            const isToday = d.date === todayIso
            return (
              <button
                key={d.date}
                onClick={() => setSelected(d.date)}
                className={`relative min-w-[47px] shrink-0 rounded-xl py-2.5 text-center transition-colors ${
                  active ? 'bg-accent-soft' : 'active:bg-surface-2'
                }`}
              >
                <span className={`v-label-sm block ${active ? 'text-accent' : 'text-ink-faint'}`}>
                  {shortDate(date).split(' ')[0]}
                </span>
                <span className={`v-head mt-0.5 block text-[20px] v-tnum ${active ? 'text-accent' : 'text-ink'}`}>
                  {date.getDate()}
                </span>
                {isToday && <span aria-hidden className={`mx-auto mt-1 block size-1 rounded-full ${active ? 'bg-accent' : 'bg-ink-faint'}`} />}
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
            className="pt-5"
          >
            <h2 className="v-head text-[20px] text-ink first-letter:uppercase">{longDate(parseIso(day.date))}</h2>

            <div className="mt-3.5">
              <ContextSwitch value={day.context} onChange={(c) => app.setContext(day.date, c)} />
              <p className="v-label-sm mt-2 px-1 text-ink-faint">{CONTEXT_NOTE[day.context]}</p>
            </div>

            <SectionLabel className="mt-7 mb-1 px-1" aside={app.perfil.contarCarbos ? 'g CHO' : undefined}>
              Comidas del día
            </SectionLabel>
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
          className="v-label mt-8 w-full rounded-xl border border-line py-3.5 font-semibold text-ink-soft active:bg-surface-2"
        >
          Armar otra semana
        </button>
        <p className="mt-3 px-1 text-[13px] leading-relaxed text-ink-faint">
          Vianda prioriza que la comida encaje con tu día —si estás en casa, afuera o necesitás llevarla— y después busca variedad.
        </p>

        <MealSheet
          target={target}
          meals={app.meals}
          context={day?.context ?? 'mixto'}
          insulin={app.insulin}
          onClose={() => setTarget(null)}
          onStatus={(status) => target && day && app.setStatus(day.date, target.planned.slot, status)}
          onReplace={(mealId) => target && day && app.replaceMeal(day.date, target.planned.slot, mealId)}
        />
      </div>
    </LazyMotion>
  )
}
