import { useMemo, useState } from 'react'
import type { Vianda } from '../lib/store'
import type { MealStatus, Slot } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { findNext } from '../lib/domain'
import { greeting, longDate, minutesOf, nowMinutes, relativeTime } from '../lib/format'
import { CarbChip, CheckRow, MealTile, SatietyMark, StatusPill } from '../components/ui'
import { MealRow } from '../components/MealRow'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'
import { Sheet } from '../components/Sheet'

/* ------------------------------------------------------------------
   HOY — la pantalla que importa.

   Jerarquía: 1) próxima comida  2) lo que hay que hacer ahora  3) el día.
   Una acción primaria visible. Todo lo demás vive en sheets.
   ------------------------------------------------------------------ */

export function Hoy({ app, onFocus }: { app: Vianda; onFocus: () => void }) {
  const [target, setTarget] = useState<MealSheetTarget | null>(null)
  const [sheet, setSheet] = useState<'pack' | 'prep' | null>(null)

  const now = nowMinutes()
  const next = useMemo(
    () => (app.today ? findNext(app.today, app.meals, now) : undefined),
    [app.today, app.meals, now],
  )

  const evening = new Date().getHours() >= 18
  const packDone = app.packing.filter((p) => p.done).length
  const prepDone = app.prep.filter((p) => p.done).length

  const setStatus = (slot: Slot, status: MealStatus) =>
    app.today && app.setStatus(app.today.date, slot, status)

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      {/* 1. Encabezado — quién soy y qué día es. Nada accionable. */}
      <header className="v-safe-top flex items-start justify-between gap-3 pt-6 pb-7">
        <div>
          <h1 className="text-[30px] leading-none v-display text-ink">{greeting()}</h1>
          <p className="mt-2 text-[15px] text-ink-soft">Hoy, {longDate(new Date())}</p>
        </div>
        <button
          onClick={onFocus}
          aria-label="Modo foco"
          className="relative grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-sm active:scale-95"
        >
          <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2.6" fill="currentColor" />
          </svg>
        </button>
      </header>

      {/* 2. Próxima comida — lo más grande de la pantalla, sin discusión. */}
      {next ? (
        <section className="v-rise rounded-hero bg-surface p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="v-eyebrow text-clay">Próximo</p>
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

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <CarbChip meal={next.meal} size="lg" />
            <SatietyMark level={next.meal.satiety} />
            <StatusPill status={next.planned.status} />
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
          <p className="mt-1.5 text-[15px] text-ink-soft">
            No queda nada pendiente para hoy.
          </p>
        </section>
      )}

      {/* 3. Lo que hay que hacer ahora. Cambia según la hora: de mañana la
             mochila, de noche la preparación. La otra queda en segundo plano. */}
      <div className="mt-3 space-y-2">
        <ActionBand
          title={evening ? 'Preparar para mañana' : 'Mochila de hoy'}
          count={evening ? `${prepDone} de ${app.prep.length}` : `${packDone} de ${app.packing.length}`}
          done={evening ? prepDone === app.prep.length : packDone === app.packing.length}
          onClick={() => setSheet(evening ? 'prep' : 'pack')}
          primary
        />
        <ActionBand
          title={evening ? 'Mochila de hoy' : 'Preparar para mañana'}
          count={evening ? `${packDone} de ${app.packing.length}` : `${prepDone} de ${app.prep.length}`}
          done={evening ? packDone === app.packing.length : prepDone === app.prep.length}
          onClick={() => setSheet(evening ? 'pack' : 'prep')}
        />
      </div>

      {/* 4. El resto del día. Segundo nivel: compacto y escaneable. */}
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
                planned.status === 'skipped' ||
                minutesOf(planned.time) < now - 60
              }
              onOpen={() => setTarget({ planned, meal })}
              onSwipeReplace={() => setTarget({ planned, meal, replace: true })}
            />
          )
        })}
      </ul>

      <p className="mt-6 px-1 text-[12px] leading-relaxed text-ink-faint">
        Deslizá una comida hacia la izquierda para cambiarla.
      </p>

      <MealSheet
        target={target}
        meals={app.meals}
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
        primary
          ? 'bg-surface px-4 py-4 shadow-md'
          : 'border border-line bg-transparent px-4 py-3'
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
  return (
    <div>
      <p className="text-[14px] text-ink-soft">Sale del menú de mañana.</p>
      <ul className="mt-3 space-y-1.5">
        {app.tomorrow.meals.map((planned) => {
          const meal = app.mealById(planned.mealId)
          if (!meal) return null
          return (
            <li key={planned.slot} className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-2.5 shadow-sm">
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
