import { useMemo, useState } from 'react'
import type { Vianda } from '../lib/store'
import type { MealStatus, Slot } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { findNext } from '../lib/domain'
import { greeting, longDate, minutesOf, nowMinutes, relativeTime } from '../lib/format'
import { CarbChip, CheckRow, DemoBadge, SatietyMark, StatusPill } from '../components/ui'
import { MealRow } from '../components/MealRow'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'
import { CarryList } from '../components/CarryList'
import { SettingsSheet } from '../components/Settings'
import { Sheet } from '../components/Sheet'
import type { ResolveStart } from '../components/ResolveSheet'

/* ------------------------------------------------------------------
   HOY

   Tres cosas, en este orden: qué toca ahora, qué viene después, y el
   resto del día. Nada más.

   La pantalla avanza sola con el reloj. Si no marcás nada en tres días,
   funciona exactamente igual: los estados existen, pero son una anotación
   opcional, no el motor.

   Lo secundario —qué llevar, qué preparar, resolver algo— aparece cuando
   la hora lo pide, y el resto queda abajo, apagado.
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

  /* Lo que viene después de lo que viene. Una línea, sin acciones. */
  const { today, mealById } = app
  const later = useMemo(() => {
    if (!today || !next) return undefined
    const after = today.meals
      .filter((p) => p.status !== 'skipped' && minutesOf(p.time) > next.minutes)
      .sort((a, b) => minutesOf(a.time) - minutesOf(b.time))[0]
    const meal = after ? mealById(after.mealId) : undefined
    return after && meal ? { planned: after, meal } : undefined
  }, [today, mealById, next])

  const carryMeals = app.packing.filter((p) => p.kind === 'meal').length
  const morning = hour < 13
  const evening = hour >= 18

  const setStatus = (slot: Slot, status: MealStatus) =>
    app.today && app.setStatus(app.today.date, slot, status)

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      <header className="v-safe-top flex items-start justify-between gap-3 pt-6 pb-7">
        <div>
          <h1 className="text-[30px] leading-none v-display text-ink">{greeting()}</h1>
          <p className="mt-2 text-[15px] text-ink-soft">Hoy, {longDate(new Date())}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setSheet('config')}
            aria-label="Configuración"
            className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-sm active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" aria-hidden>
              <path
                d="M3 6h5.5M11.5 6H17M3 14h2.5M8.5 14H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={onFocus}
            aria-label="Modo foco"
            className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-sm active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" aria-hidden>
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2.6" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* 1 — AHORA. Lo más grande de la pantalla, con una sola acción. */}
      {next ? (
        <section className="v-rise rounded-hero bg-surface p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="v-eyebrow text-clay">
              {next.isNow ? 'Ahora' : 'Próximo'}
              {next.planned.optional ? ' · opcional' : ''}
            </p>
            <p className="text-[13px] font-medium text-ink-faint v-tnum">
              {relativeTime(next.minutes, now)}
            </p>
          </div>

          <div className="mt-4 flex items-baseline gap-2.5">
            <h2 className="text-[19px] v-display text-ink">{SLOT_LABEL[next.planned.slot]}</h2>
            <span className="text-[19px] text-ink-faint v-tnum">{next.planned.time}</span>
          </div>

          <p className="mt-1.5 text-[27px] leading-[1.15] v-display text-ink">
            {next.meal.name}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <CarbChip meal={next.meal} size="lg" />
            <SatietyMark level={next.meal.satiety} />
            <StatusPill status={next.planned.status} />
            {next.meal.isDemo && <DemoBadge />}
          </div>

          <button
            onClick={() => setTarget({ planned: next.planned, meal: next.meal })}
            className="mt-6 min-h-[52px] w-full rounded-pill border border-line text-[16px] font-semibold text-ink transition-transform duration-150 active:scale-[0.98]"
          >
            Ver
          </button>
        </section>
      ) : (
        <section className="rounded-hero bg-surface p-6 text-center shadow-md">
          <p className="text-[19px] v-display text-ink">El día está resuelto</p>
          <p className="mt-1.5 text-[15px] text-ink-soft">No queda nada pendiente para hoy.</p>
        </section>
      )}

      {/* 2 — DESPUÉS. Una línea. */}
      {later && (
        <button
          onClick={() => setTarget({ planned: later.planned, meal: later.meal })}
          className="mt-3 flex w-full items-baseline gap-2 px-2 py-2 text-left"
        >
          <span className="v-eyebrow shrink-0 text-ink-faint">Después</span>
          <span className="min-w-0 flex-1 truncate text-[15px] text-ink-soft">
            {SLOT_LABEL[later.planned.slot]} {later.planned.time} · {later.meal.name}
          </span>
        </button>
      )}

      {/* 3 — La acción del momento. Una sola, según la hora. */}
      {morning && carryMeals > 0 && (
        <MainBand
          title="Hoy llevate"
          detail={`${carryMeals} ${carryMeals === 1 ? 'comida' : 'comidas'} + botella, termo y cubiertos`}
          onClick={() => setSheet('carry')}
        />
      )}
      {evening && (
        <MainBand
          title="Preparar para mañana"
          detail={`${app.prep.length} cosas, salen del menú de mañana`}
          onClick={() => setSheet('prep')}
        />
      )}

      {/* 4 — El resto del día. Un renglón por comida, para leer. */}
      <h3 className="v-eyebrow mt-9 mb-2.5 px-1 text-ink-faint">El día</h3>
      <ul className="space-y-2">
        {app.today?.meals.map((planned) => {
          const meal = app.mealById(planned.mealId)
          if (!meal) return null
          return (
            <MealRow
              key={planned.slot}
              planned={planned}
              meal={meal}
              dim={planned.status === 'eaten' || minutesOf(planned.time) < now - 60}
              onOpen={() => setTarget({ planned, meal })}
              onRestore={() => setStatus(planned.slot, 'pending')}
            />
          )
        })}
      </ul>

      {/* 5 — Lo secundario, apagado, al final. */}
      <div className="mt-8 divide-y divide-line border-t border-line">
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
        <p className="text-[14px] text-ink-soft">Sale del menú de mañana.</p>
        <div className="mt-3 -mx-1">
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
  )
}

function MainBand({
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
      className="mt-3 flex w-full items-center gap-3 rounded-card bg-surface px-4 py-4 text-left shadow-md transition-transform duration-150 active:scale-[0.985]"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-ink-faint">{detail}</span>
      </span>
      <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-ink-faint" aria-hidden>
        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function QuietRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 py-4 text-left active:opacity-60"
    >
      <span className="text-[15px] font-medium text-ink-soft">{label}</span>
      <svg viewBox="0 0 12 12" className="size-3 text-ink-faint" aria-hidden>
        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}
