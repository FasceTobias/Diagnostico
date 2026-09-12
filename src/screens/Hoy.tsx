import { useMemo, useState } from 'react'
import type { Vianda } from '../lib/store'
import type { MealStatus, Slot } from '../lib/types'
import { CONTEXT_NOTE, SLOT_LABEL, SLOT_ORDER } from '../lib/types'
import { findNext } from '../lib/domain'
import { greeting, longDate, minutesOf, nowMinutes, relativeTime } from '../lib/format'
import {
  CarbChip,
  CheckRow,
  ContextSwitch,
  DemoBadge,
  MealTile,
  SatietyMark,
  StatusPill,
} from '../components/ui'
import { MealRow } from '../components/MealRow'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'
import { Sheet } from '../components/Sheet'

/* ------------------------------------------------------------------
   HOY — la pantalla que importa.

   Jerarquía: 1) próxima comida  2) qué hay que hacer ahora  3) el día.
   Una acción primaria visible. Todo lo demás vive en sheets.

   El día no se asume perfecto: el contexto se cambia de un toque, los
   snacks se sacan y se vuelven a sumar, y si no preparaste nada hay una
   salida rápida desde el detalle de cada comida.
   ------------------------------------------------------------------ */

export function Hoy({ app, onFocus }: { app: Vianda; onFocus: () => void }) {
  const [target, setTarget] = useState<MealSheetTarget | null>(null)
  const [sheet, setSheet] = useState<'pack' | 'prep' | 'times' | null>(null)

  const now = nowMinutes()
  const next = useMemo(
    () => (app.today ? findNext(app.today, app.meals, now) : undefined),
    [app.today, app.meals, now],
  )

  const evening = new Date().getHours() >= 18
  const packDone = app.packing.filter((p) => p.done).length
  const prepDone = app.prep.filter((p) => p.done).length
  const context = app.today?.context ?? 'mixto'

  const setStatus = (slot: Slot, status: MealStatus) =>
    app.today && app.setStatus(app.today.date, slot, status)

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      {/* 1. Encabezado — quién soy y qué día es. */}
      <header className="v-safe-top flex items-start justify-between gap-3 pt-6 pb-5">
        <div>
          <h1 className="text-[30px] leading-none v-display text-ink">{greeting()}</h1>
          <p className="mt-2 text-[15px] text-ink-soft">Hoy, {longDate(new Date())}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setSheet('times')}
            aria-label="Horarios del día"
            className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-sm active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" aria-hidden>
              <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v4.2l2.8 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

      {/* 2. Cómo viene el día. Es la palanca de adaptación: un toque y el
             menú pendiente se rearma solo. */}
      <section className="pb-6">
        <ContextSwitch
          value={context}
          onChange={(c) => app.today && app.setContext(app.today.date, c)}
        />
        <p className="mt-2 px-1 text-[12px] text-ink-faint">{CONTEXT_NOTE[context]}</p>
      </section>

      {/* 3. Próxima comida — lo más grande de la pantalla, sin discusión. */}
      {next ? (
        <section className="v-rise rounded-hero bg-surface p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="v-eyebrow text-clay">
              Próximo{next.planned.optional ? ' · opcional' : ''}
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

          <div className="mt-6 flex gap-2.5">
            <button
              onClick={() =>
                setStatus(
                  next.planned.slot,
                  next.planned.status === 'prepared' ? 'eaten' : 'prepared',
                )
              }
              className="min-h-[52px] flex-1 rounded-pill bg-clay text-[16px] font-semibold text-white shadow-sm transition-transform duration-150 active:scale-[0.97]"
            >
              {next.planned.status === 'prepared' ? 'Ya lo comí' : 'Ya está preparado'}
            </button>
            <button
              onClick={() => setTarget({ planned: next.planned, meal: next.meal })}
              className="min-h-[52px] rounded-pill border border-line px-5 text-[16px] font-semibold text-ink active:scale-[0.97]"
            >
              Ver
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-hero bg-surface p-6 text-center shadow-md">
          <p className="text-[19px] v-display text-ink">El día está resuelto</p>
          <p className="mt-1.5 text-[15px] text-ink-soft">No queda nada pendiente para hoy.</p>
        </section>
      )}

      {/* 4. Lo que hay que hacer ahora. Cambia según la hora. */}
      <div className="mt-3 space-y-2">
        <ActionBand
          title={evening ? 'Preparar para mañana' : 'Mochila de hoy'}
          count={
            evening
              ? `${prepDone} de ${app.prep.length}`
              : `${packDone} de ${app.packing.length}`
          }
          done={evening ? prepDone === app.prep.length : packDone === app.packing.length}
          onClick={() => setSheet(evening ? 'prep' : 'pack')}
          primary
        />
        <ActionBand
          title={evening ? 'Mochila de hoy' : 'Preparar para mañana'}
          count={
            evening
              ? `${packDone} de ${app.packing.length}`
              : `${prepDone} de ${app.prep.length}`
          }
          done={evening ? packDone === app.packing.length : prepDone === app.prep.length}
          onClick={() => setSheet(evening ? 'pack' : 'prep')}
        />
      </div>

      {/* 5. El resto del día. Segundo nivel: compacto y escaneable. */}
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
              dim={
                planned.status === 'eaten' ||
                minutesOf(planned.time) < now - 60
              }
              onOpen={() => setTarget({ planned, meal })}
              onSwipeReplace={() => setTarget({ planned, meal, replace: true })}
              onRestore={() => setStatus(planned.slot, 'pending')}
            />
          )
        })}
      </ul>

      <p className="mt-6 px-1 text-[12px] leading-relaxed text-ink-faint">
        Deslizá una comida hacia la izquierda para cambiarla. Los snacks son
        opcionales: si no los necesitás, sacalos y volvelos a sumar cuando quieras.
      </p>

      <MealSheet
        target={target}
        meals={app.meals}
        context={context}
        onClose={() => setTarget(null)}
        onStatus={(status) => target && setStatus(target.planned.slot, status)}
        onReplace={(mealId) =>
          target && app.today && app.replaceMeal(app.today.date, target.planned.slot, mealId)
        }
      />

      <Sheet open={sheet === 'pack'} onClose={() => setSheet(null)} title="Mochila de hoy">
        <p className="text-[14px] text-ink-soft">
          Lo que va en el bolso. Las comidas salen del menú del día.
        </p>
        <div className="mt-3 -mx-1">
          {app.packing.map((item) => (
            <CheckRow
              key={item.id}
              label={item.label}
              hint={item.hint ?? (item.kind === 'meal' ? 'Del menú de hoy' : undefined)}
              done={item.done}
              onToggle={() => app.checkPack(item.id)}
            />
          ))}
        </div>
        {app.packing.every((i) => i.kind === 'gear') && (
          <p className="mt-3 rounded-2xl border border-dashed border-line-strong px-4 py-3 text-[13px] text-ink-faint">
            Hoy no hay comida para llevar. Si eso cambia, pasá el día a
            «En la calle» o «Mixto».
          </p>
        )}
      </Sheet>

      <Sheet open={sheet === 'prep'} onClose={() => setSheet(null)} title="Preparar para mañana">
        <TomorrowSummary app={app} />
        <div className="mt-4 -mx-1">
          {app.prep.map((task) => (
            <CheckRow
              key={task.id}
              label={task.label}
              hint={task.sourceMealIds.length > 1 ? 'Tarea agrupada' : undefined}
              done={task.done}
              onToggle={() => app.checkPrep(task.id)}
            />
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'times'} onClose={() => setSheet(null)} title="Horarios">
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Son aproximados y se pueden mover cuando quieras. La app los usa para
          saber qué viene ahora, no para apurarte.
        </p>
        <div className="mt-4 divide-y divide-line">
          {SLOT_ORDER.map((slot) => (
            <label key={slot} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[15px] text-ink">{SLOT_LABEL[slot]}</span>
              <input
                type="time"
                value={app.times[slot]}
                onChange={(e) => app.setTime(slot, e.target.value)}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-[15px] text-ink v-tnum outline-none focus:border-clay"
              />
            </label>
          ))}
        </div>
      </Sheet>
    </div>
  )
}

function ActionBand({
  title,
  count,
  done,
  onClick,
  primary,
}: {
  title: string
  count: string
  done: boolean
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-card text-left transition-transform duration-150 active:scale-[0.985] ${
        primary ? 'bg-surface px-4 py-4 shadow-md' : 'border border-line bg-transparent px-4 py-3'
      }`}
    >
      <span
        aria-hidden
        className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
          done ? 'bg-sage text-white' : 'border-2 border-line-strong text-transparent'
        }`}
      >
        ✓
      </span>
      <span className="flex-1">
        <span
          className={`block ${primary ? 'text-[17px] font-semibold' : 'text-[15px] font-medium'} text-ink`}
        >
          {title}
        </span>
      </span>
      <span className="text-[13px] font-medium text-ink-faint v-tnum">{count}</span>
      <svg viewBox="0 0 12 12" className="size-3 text-ink-faint" aria-hidden>
        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function TomorrowSummary({ app }: { app: Vianda }) {
  if (!app.tomorrow) return null
  const meals = app.tomorrow.meals.filter((p) => p.status !== 'skipped')
  return (
    <div>
      <p className="text-[14px] text-ink-soft">Sale del menú de mañana.</p>
      <ul className="mt-3 space-y-1.5">
        {meals.map((planned) => {
          const meal = app.mealById(planned.mealId)
          if (!meal) return null
          return (
            <li
              key={planned.slot}
              className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2.5 shadow-sm"
            >
              <MealTile meal={meal} size={32} />
              <span className="min-w-0 flex-1 truncate text-[14px] text-ink">{meal.name}</span>
              <CarbChip meal={meal} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
