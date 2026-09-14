import { useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { MealStatus, Slot } from '../lib/types'
import { SLOT_LABEL } from '../lib/types'
import { findNext } from '../lib/domain'
import { longDate, nowMinutes, relativeTime } from '../lib/format'
import { CarbValue, CheckRow, SectionLabel, StatusPill } from '../components/ui'
import { Rail, type RailItem } from '../components/Rail'
import { MealSheet, type MealSheetTarget } from '../components/MealSheet'
import { CarryList } from '../components/CarryList'
import { SettingsSheet } from '../components/Settings'
import { CuentaSheet } from '../components/Cuenta'
import { useSession } from '../lib/auth'
import { Sheet } from '../components/Sheet'
import type { ResolveStart } from '../components/ResolveSheet'

/* ------------------------------------------------------------------
   HOY

   Arriba, la comida que toca: una sola superficie elevada con el nombre
   grande y dos acciones visibles —ver y cambiar—. Es la zona de trabajo
   de la pantalla, no una portada.

   Abajo, el día como línea de tiempo: filas de 56px, tocables, con la
   flecha que dice que se abren.

   Nada de esto exige marcar: la pantalla avanza sola con el reloj.
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
  const [sheet, setSheet] = useState<'carry' | 'prep' | 'config' | 'cuenta' | null>(null)
  const cuenta = useSession()

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
      <div className="mx-auto max-w-md px-4 pb-40">
        <header className="v-safe-top flex items-center justify-between gap-3 py-3">
          <p className="v-label truncate text-ink-soft">
            <span className="font-semibold text-ink">Hoy</span> · {longDate(new Date())}
          </p>
          <div className="flex shrink-0 gap-0.5">
            <IconButton label="Configuración" onClick={() => setSheet('config')}>
              <path
                d="M3 6h5.5M11.5 6H17M3 14h2.5M8.5 14H17"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="10" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="7" cy="14" r="2" stroke="currentColor" strokeWidth="1.6" />
            </IconButton>
            <IconButton label="Modo foco" onClick={onFocus}>
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="10" cy="10" r="2.6" fill="currentColor" />
            </IconButton>
          </div>
        </header>

        {/* La zona de trabajo: una superficie, dos acciones */}
        <AnimatePresence mode="wait">
          {next ? (
            <m.section
              key={next.meal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="rounded-hero bg-surface p-4 shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="v-caps inline-flex items-center gap-2 text-accent">
                  {/* El punto con halo: el único glow de la app. Marca
                      qué estás mirando sin necesidad de más color. */}
                  <span
                    aria-hidden
                    className={`size-[6px] rounded-full bg-accent ${next.isNow ? 'v-glow' : ''}`}
                  />
                  {next.isNow ? 'Ahora' : 'Próximo'}
                </span>
                <span className="v-label-sm text-ink-faint v-tnum">
                  {SLOT_LABEL[next.planned.slot]} {next.planned.time}
                </span>
              </div>

              <p className="v-head mt-2.5 text-[26px] leading-[1.15] text-ink">
                {next.meal.name}
              </p>
              {next.meal.drink && (
                <p className="v-label mt-1 text-ink-soft">con {next.meal.drink}</p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <CarbValue meal={next.meal} size="md" />
                <span className="v-label-sm text-ink-faint">
                  · {next.meal.satiety}
                  {next.planned.optional ? ' · opcional' : ''} ·{' '}
                  {relativeTime(next.minutes, now)}
                </span>
                <StatusPill status={next.planned.status} />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setTarget({ planned: next.planned, meal: next.meal })}
                  className="v-label min-h-[44px] flex-1 rounded-xl bg-accent font-semibold text-accent-ink transition-transform duration-150 active:scale-[0.97]"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() =>
                    setTarget({ planned: next.planned, meal: next.meal, replace: true })
                  }
                  className="v-label min-h-[44px] flex-1 rounded-xl border border-line-strong font-semibold text-ink transition-transform duration-150 active:scale-[0.97]"
                >
                  Cambiar
                </button>
              </div>
            </m.section>
          ) : (
            <m.section
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-hero bg-surface p-5 shadow-md"
            >
              <p className="v-head text-[22px] text-ink">El día está resuelto</p>
              <p className="mt-1.5 text-[15px] text-ink-soft">No queda nada pendiente.</p>
            </m.section>
          )}
        </AnimatePresence>

        {/* La acción del momento, según la hora */}
        {morning && carryMeals > 0 && (
          <ActionRow
            title="Hoy llevate"
            detail={`${carryMeals} ${carryMeals === 1 ? 'comida' : 'comidas'} + botella, termo y cubiertos`}
            onClick={() => setSheet('carry')}
          />
        )}
        {evening && (
          <ActionRow
            title="Preparar para mañana"
            detail={`${app.prep.length} cosas, del menú de mañana`}
            onClick={() => setSheet('prep')}
          />
        )}

        {/* El día */}
        <SectionLabel className="mt-7 mb-1 px-1" aside="g CHO">
          El día
        </SectionLabel>
        <Rail
          items={items}
          activeSlot={next?.planned.slot}
          onOpen={(item) => setTarget({ planned: item.planned, meal: item.meal })}
          onRestore={(item) => setStatus(item.planned.slot, 'pending')}
        />

        {/* Salidas */}
        <div className="mt-6 space-y-2">
          <ActionRow
            title="Resolver ahora"
            detail="Cuando el plan no coincide con el día"
            onClick={() => onResolve({})}
            tone="quiet"
          />
          {!(morning && carryMeals > 0) && carryMeals > 0 && (
            <ActionRow
              title="Hoy llevate"
              detail={`${carryMeals} comidas + lo de siempre`}
              onClick={() => setSheet('carry')}
              tone="quiet"
            />
          )}
          {!evening && (
            <ActionRow
              title="Preparar para mañana"
              detail={`${app.prep.length} cosas`}
              onClick={() => setSheet('prep')}
              tone="quiet"
            />
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
          prefs={app.prefs}
          onPrefs={app.setPrefs}
          cuenta={cuenta}
          onCuenta={() => setSheet('cuenta')}
        />

        {/* Si volvés del mail de recuperación, esto se abre solo: es lo
            único que corresponde hacer en ese momento. */}
        <CuentaSheet
          open={sheet === 'cuenta' || cuenta.recuperando}
          onClose={() => setSheet(null)}
          cuenta={cuenta}
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
      className="grid size-11 place-items-center rounded-xl text-ink-soft transition-colors active:bg-surface-2"
    >
      <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" aria-hidden>
        {children}
      </svg>
    </button>
  )
}

/** Fila de acción: superficie completa, dos líneas y flecha. */
function ActionRow({
  title,
  detail,
  onClick,
  tone = 'solid',
}: {
  title: string
  detail: string
  onClick: () => void
  tone?: 'solid' | 'quiet'
}) {
  return (
    <button
      onClick={onClick}
      className={`mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors active:bg-surface-2 ${
        tone === 'solid' ? 'bg-surface shadow-md' : 'border border-line'
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="v-head block text-[16px] text-ink">{title}</span>
        <span className="v-label-sm mt-0.5 block truncate text-ink-faint">{detail}</span>
      </span>
      <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-ink-faint" aria-hidden>
        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}
