import { useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { MealStatus, Slot } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { findNext } from '../lib/domain'
import { greeting, longDate, nowMinutes, relativeTime } from '../lib/format'
import { CarbValue, CheckRow, MetaLine, SectionLabel, StatusPill } from '../components/ui'
import { Rail, type RailItem } from '../components/Rail'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'
import { CarryList } from '../components/CarryList'
import { SettingsSheet } from '../components/Settings'
import { Sheet } from '../components/Sheet'
import type { ResolveStart } from '../components/ResolveSheet'

/* ------------------------------------------------------------------
   HOY

   Una portada y un riel. Arriba, la comida que toca ahora tratada como
   titular: nombre grande en serif, datos en una sola línea de versalitas.
   Abajo, el día entero como una línea de tiempo — así el "ahora", el
   "después" y "el día" dejan de ser tres bloques que repiten lo mismo.

   La pantalla avanza sola con el reloj: marcar sigue siendo opcional.
   ------------------------------------------------------------------ */

export function Hoy({
  app,
  onFocus,
  onResolve,
}: {
  app: Vianda
  onFocus: () => void
  onResolve: (start: ResolveStart) => void
}) {
  const [target, setTarget] = useState<MealSheetTarget | null>(null)
  const [sheet, setSheet] = useState<'carry' | 'prep' | 'config' | null>(null)

  const now = nowMinutes()
  const hour = new Date().getHours()

  const next = useMemo(
    () => (app.today ? findNext(app.today, app.meals, now) : undefined),
    [app.today, app.meals, now],
  )

  const items: RailItem[] = (app.today?.meals ?? [])
    .map((planned) => ({ planned, meal: app.mealById(planned.mealId) }))
    .filter((r): r is RailItem => !!r.meal)

  const carryMeals = app.packing.filter((p) => p.kind === 'meal').length
  const morning = hour < 13
  const evening = hour >= 18

  const setStatus = (slot: Slot, status: MealStatus) =>
    app.today && app.setStatus(app.today.date, slot, status)

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto max-w-md px-6 pb-32">
        {/* Folio: la fecha como cabecera de página, no como título */}
        <header className="v-safe-top flex items-center justify-between gap-3 border-b border-line pt-5 pb-2.5">
          <p className="v-label-sm truncate text-ink-faint">
            {greeting()} · {longDate(new Date())}
          </p>
          <div className="flex shrink-0 gap-1">
            <IconButton label="Configuración" onClick={() => setSheet('config')}>
              <path
                d="M3 6h5.5M11.5 6H17M3 14h2.5M8.5 14H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
            </IconButton>
            <IconButton label="Modo foco" onClick={onFocus}>
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2.6" fill="currentColor" />
            </IconButton>
          </div>
        </header>

        {/* Titular */}
        <AnimatePresence mode="wait">
          {next ? (
            <m.section
              key={next.meal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 230, damping: 26 }}
              className="pt-8"
            >
              <div className="flex items-center gap-3">
                <span className="v-label shrink-0 text-clay">
                  {next.isNow ? 'Ahora' : 'Próximo'}
                </span>
                <span aria-hidden className="h-px flex-1 bg-line" />
                <span className="v-label-sm shrink-0 text-ink-faint v-tnum">
                  {relativeTime(next.minutes, now)}
                </span>
              </div>

              <button
                onClick={() => setTarget({ planned: next.planned, meal: next.meal })}
                className="mt-6 block w-full text-left active:opacity-70"
              >
                <p className="v-serif-lg text-[42px] text-ink">{next.meal.name}</p>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <p className="v-label text-ink">
                    {SLOT_LABEL[next.planned.slot]} {next.planned.time}
                  </p>
                  <CarbValue meal={next.meal} size="md" />
                  <MetaLine
                    parts={[next.meal.satiety, next.planned.optional && 'opcional']}
                  />
                  <StatusPill status={next.planned.status} />
                </div>
              </button>
            </m.section>
          ) : (
            <m.section
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-10"
            >
              <p className="v-serif-lg text-[34px] text-ink">El día está resuelto</p>
              <p className="mt-2 text-[16px] text-ink-soft">No queda nada pendiente.</p>
            </m.section>
          )}
        </AnimatePresence>

        {/* La acción del momento. Una sola, según la hora. */}
        {morning && carryMeals > 0 && (
          <MainAction
            title="Hoy llevate"
            detail={`${carryMeals} ${carryMeals === 1 ? 'comida' : 'comidas'} + botella, termo y cubiertos`}
            onClick={() => setSheet('carry')}
          />
        )}
        {evening && (
          <MainAction
            title="Preparar para mañana"
            detail={`${app.prep.length} cosas, del menú de mañana`}
            onClick={() => setSheet('prep')}
          />
        )}

        {/* El día como línea de tiempo */}
        <SectionLabel className="mt-11 mb-3" aside="g CHO">El día</SectionLabel>
        <Rail
          items={items}
          activeSlot={next?.planned.slot}
          onOpen={(item) => setTarget({ planned: item.planned, meal: item.meal })}
          onRestore={(item) => setStatus(item.planned.slot, 'pending')}
        />

        {/* Lo secundario, en texto, al final */}
        <div className="mt-10 border-t border-line">
          <QuietRow label="Resolver ahora" onClick={() => onResolve({})} />
          {!(morning && carryMeals > 0) && carryMeals > 0 && (
            <QuietRow label="Hoy llevate" onClick={() => setSheet('carry')} />
          )}
          {!evening && (
            <QuietRow label="Preparar para mañana" onClick={() => setSheet('prep')} />
          )}
        </div>

        <MealSheet
          target={target}
          meals={app.meals}
          context={app.today?.context ?? 'mixto'}
          insulin={app.insulin}
          onClose={() => setTarget(null)}
          onStatus={(status) => target && setStatus(target.planned.slot, status)}
          onReplace={(mealId) =>
            target && app.today && app.replaceMeal(app.today.date, target.planned.slot, mealId)
          }
        />

        <CarryList
          open={sheet === 'carry'}
          onClose={() => setSheet(null)}
          items={app.packing}
          onCheck={app.checkPack}
        />

        <Sheet open={sheet === 'prep'} onClose={() => setSheet(null)} title="Preparar para mañana">
          <p className="text-[15px] text-ink-soft">Sale del menú de mañana.</p>
          <div className="mt-4 border-t border-line">
            {app.prep.map((task) => (
              <CheckRow
                key={task.id}
                label={task.label}
                hint={task.sourceMealIds.length > 1 ? 'Para varias comidas' : undefined}
                done={task.done}
                onToggle={() => app.checkPrep(task.id)}
              />
            ))}
          </div>
        </Sheet>

        <SettingsSheet
          open={sheet === 'config'}
          onClose={() => setSheet(null)}
          times={app.times}
          onTime={app.setTime}
          insulin={app.insulin}
          onInsulin={app.setInsulin}
          context={app.today?.context ?? 'mixto'}
          onContext={(c) => app.today && app.setContext(app.today.date, c)}
        />
      </div>
    </LazyMotion>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full text-ink-faint active:bg-surface-2"
    >
      <svg viewBox="0 0 20 20" className="size-[17px]" fill="none" aria-hidden>
        {children}
      </svg>
    </button>
  )
}

function MainAction({
  title,
  detail,
  onClick,
}: {
  title: string
  detail: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mt-9 flex w-full items-center gap-4 border-y border-ink/85 py-4 text-left transition-colors active:bg-surface-2"
    >
      <span className="min-w-0 flex-1">
        <span className="v-serif block text-[20px] text-ink">{title}</span>
        <span className="v-label-sm mt-1 block truncate text-ink-faint">{detail}</span>
      </span>
      <Chevron />
    </button>
  )
}

function QuietRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 border-b border-line py-4 text-left active:opacity-60"
    >
      <span className="text-[16px] text-ink-soft">{label}</span>
      <Chevron />
    </button>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-ink-faint" aria-hidden>
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
