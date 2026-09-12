import { useState } from 'react'
import type { DayContext, Meal, ResolveFilter, ResolveReason, Slot } from '../lib/types'
import {
  CONTEXT_LABEL,
  CONTEXT_NOTE,
  RESOLVE_FILTER,
  RESOLVE_REASON,
  SLOT_LABEL,
  SLOT_ORDER,
} from '../lib/types'
import type { Vianda } from '../lib/store'
import { compatibleReplacements, findNext, resolveNow } from '../lib/domain'
import { Sheet } from './Sheet'
import { BuyBadge, CarbChip, DemoBadge, MealMark, SatietyMark } from './ui'

/* ------------------------------------------------------------------
   RESOLVER AHORA

   La salida de emergencia cuando el plan del día no coincide con la
   realidad. Unifica cosas que ya existían sueltas —cambiar el contexto,
   "no preparé nada", reemplazar una comida— y agrega la que faltaba:
   estoy en la calle y no traje nada.

   Máximo tres toques hasta ver opciones. Los filtros están arriba de los
   resultados, no antes: se ajustan mirando lo que salió.
   ------------------------------------------------------------------ */

export interface ResolveStart {
  reason?: ResolveReason
  slot?: Slot
}

type Step = 'reason' | 'slot' | 'context' | 'results'

const REASONS: ResolveReason[] = [
  'sin-comida',
  'hambre',
  'cambio-dia',
  'sin-preparar',
  'reemplazar',
]

const REASON_HINT: Record<ResolveReason, string> = {
  'sin-comida': 'Estás afuera sin nada encima',
  hambre: 'Comer algo ahora, fuera del plan',
  'cambio-dia': 'Volvés más tarde, o ya no salís',
  'sin-preparar': 'Quedó sin hacer la noche anterior',
  reemplazar: 'Cambiar una comida del día',
}

const FILTERS: ResolveFilter[] = [
  'mucha-hambre',
  'normal',
  'rapido',
  'barato',
  'caminando',
  'sentarme',
]

/* Cerrado no existe: así cada apertura arranca limpia, sin efectos que
   reseteen estado. Abierto desde el asistente, entra directo al paso que
   corresponde. */
export function ResolveSheet({
  open,
  onClose,
  app,
  start,
}: {
  open: boolean
  onClose: () => void
  app: Vianda
  start?: ResolveStart
}) {
  if (!open) return null
  return <ResolveFlow onClose={onClose} app={app} start={start} />
}

const firstStep = (start?: ResolveStart): Step => {
  if (!start?.reason) return 'reason'
  if (start.reason === 'cambio-dia') return 'context'
  return start.slot ? 'results' : 'slot'
}

function ResolveFlow({
  onClose,
  app,
  start,
}: {
  onClose: () => void
  app: Vianda
  start?: ResolveStart
}) {
  const [step, setStep] = useState<Step>(() => firstStep(start))
  const [reason, setReason] = useState<ResolveReason | null>(start?.reason ?? null)
  const [slot, setSlot] = useState<Slot | null>(start?.slot ?? null)
  const [filters, setFilters] = useState<ResolveFilter[]>([])

  const context = app.today?.context ?? 'mixto'
  const next = app.today ? findNext(app.today, app.meals) : undefined

  const close = () => onClose()

  const pickReason = (r: ResolveReason) => {
    setReason(r)
    if (r === 'cambio-dia') return setStep('context')
    // La comida que viene es la apuesta más probable, pero se puede cambiar.
    setSlot(next?.planned.slot ?? null)
    setStep('slot')
  }

  const pickSlot = (s: Slot) => {
    setSlot(s)
    setStep('results')
  }

  const apply = (mealId: string) => {
    if (app.today && slot) app.replaceMeal(app.today.date, slot, mealId)
    close()
  }

  const applyContext = (c: DayContext) => {
    if (app.today) app.setContext(app.today.date, c)
    close()
  }

  const toggleFilter = (f: ResolveFilter) =>
    setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))

  const back = () => {
    if (step === 'results') return setStep('slot')
    setStep('reason')
  }

  const title =
    step === 'reason'
      ? 'Resolver ahora'
      : step === 'context'
        ? 'Cómo sigue el día'
        : step === 'slot'
          ? '¿Qué necesitás resolver?'
          : `Resolver ${slot ? SLOT_LABEL[slot].toLowerCase() : ''}`

  return (
    <Sheet open onClose={close} title={title}>
      {step !== 'reason' && (
        <button
          onClick={back}
          className="-mt-1 mb-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-soft active:text-ink"
        >
          <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
            <path d="M8 2 4 6l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Atrás
        </button>
      )}

      {/* 1 — ¿Qué pasó? */}
      {step === 'reason' && (
        <>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            El plan es una guía, no una obligación. ¿Qué pasó?
          </p>
          <ul className="mt-4 space-y-2">
            {REASONS.map((r) => (
              <li key={r}>
                <button
                  onClick={() => pickReason(r)}
                  className="flex w-full items-center gap-3 rounded-card bg-surface px-4 py-4 text-left shadow-sm transition-transform duration-150 active:scale-[0.985]"
                >
                  <span className="flex-1">
                    <span className="block text-[16px] font-semibold text-ink">
                      {RESOLVE_REASON[r]}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-faint">
                      {REASON_HINT[r]}
                    </span>
                  </span>
                  <svg viewBox="0 0 12 12" className="size-3 text-ink-faint" aria-hidden>
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 2a — Cambió el día: es el contexto, no comida por comida */}
      {step === 'context' && (
        <>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            Se rearma sólo lo que todavía no pasó.
          </p>
          <ul className="mt-4 space-y-2">
            {(['casa', 'mixto', 'calle'] as DayContext[]).map((c) => (
              <li key={c}>
                <button
                  onClick={() => applyContext(c)}
                  className={`w-full rounded-card px-4 py-4 text-left shadow-sm transition-transform duration-150 active:scale-[0.985] ${
                    c === context ? 'bg-clay text-white' : 'bg-surface'
                  }`}
                >
                  <span
                    className={`block text-[16px] font-semibold ${c === context ? 'text-white' : 'text-ink'}`}
                  >
                    {CONTEXT_LABEL[c]}
                    {c === context && <span className="ml-2 text-[13px] font-normal">actual</span>}
                  </span>
                  <span
                    className={`mt-0.5 block text-[13px] ${c === context ? 'text-white/75' : 'text-ink-faint'}`}
                  >
                    {CONTEXT_NOTE[c]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 2b — ¿Qué comida? */}
      {step === 'slot' && (
        <ul className="space-y-2">
          {SLOT_ORDER.map((s) => {
            const suggested = s === next?.planned.slot
            return (
              <li key={s}>
                <button
                  onClick={() => pickSlot(s)}
                  className="flex w-full items-center gap-3 rounded-card bg-surface px-4 py-3.5 text-left shadow-sm active:scale-[0.985]"
                >
                  <span className="flex-1 text-[16px] font-medium text-ink">{SLOT_LABEL[s]}</span>
                  {suggested && <span className="v-eyebrow text-clay">Ahora</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* 3 — Filtros arriba, resultados abajo */}
      {step === 'results' && slot && (
        <Results
          slot={slot}
          reason={reason}
          filters={filters}
          onToggleFilter={toggleFilter}
          meals={app.meals}
          context={context}
          currentMealId={app.today?.meals.find((p) => p.slot === slot)?.mealId}
          onPick={apply}
        />
      )}
    </Sheet>
  )
}

function Results({
  slot,
  reason,
  filters,
  onToggleFilter,
  meals,
  context,
  currentMealId,
  onPick,
}: {
  slot: Slot
  reason: ResolveReason | null
  filters: ResolveFilter[]
  onToggleFilter: (f: ResolveFilter) => void
  meals: Meal[]
  context: DayContext
  currentMealId?: string
  onPick: (id: string) => void
}) {
  /* Reemplazar una comida del plan es otra cosa: ahí el criterio es
     "que encaje en el día", no "qué hago ahora". Se reusa lo que ya había. */
  if (reason === 'reemplazar') {
    const current = meals.find((m) => m.id === currentMealId)
    const options = current
      ? compatibleReplacements(current, meals, { slot, context })
      : []
    return (
      <>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          {current ? (
            <>
              En lugar de <span className="text-ink">{current.name}</span>.
            </>
          ) : (
            'Elegí una opción.'
          )}
        </p>
        <h4 className="v-eyebrow mt-6 text-ink-faint">Reemplazos compatibles</h4>
        <OptionList options={options.map((o) => ({ meal: o.meal, why: o.why }))} onPick={onPick} />
      </>
    )
  }

  const { propias, comprables } = resolveNow(slot, meals, filters)
  // Si saliste sin comida, lo que tenés en casa no te sirve ahora.
  const buyFirst = reason === 'sin-comida'

  const propiasBlock = propias.length > 0 && (
    <section key="propias" className="mt-6">
      <h4 className="v-eyebrow text-ink-faint">De tu biblioteca</h4>
      <OptionList options={propias.map((meal) => ({ meal, why: `${meal.prepMinutes} min` }))} onPick={onPick} />
    </section>
  )

  const comprablesBlock = comprables.length > 0 && (
    <section key="comprables" className="mt-6">
      <h4 className="v-eyebrow text-ink-faint">Para comprar afuera</h4>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-faint">
        Tipos de opción, no lugares concretos. Los carbohidratos son un orden de
        magnitud: dependen del tamaño y de quién la hizo.
      </p>
      <OptionList options={comprables.map((meal) => ({ meal }))} onPick={onPick} />
    </section>
  )

  return (
    <>
      <div className="v-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => {
          const on = filters.includes(f)
          return (
            <button
              key={f}
              onClick={() => onToggleFilter(f)}
              aria-pressed={on}
              className={`shrink-0 rounded-pill px-4 py-2 text-[14px] font-medium transition-colors ${
                on ? 'bg-ink text-bg' : 'border border-line bg-surface text-ink-soft'
              }`}
            >
              {RESOLVE_FILTER[f]}
            </button>
          )
        })}
      </div>

      {buyFirst ? [comprablesBlock, propiasBlock] : [propiasBlock, comprablesBlock]}

      {propias.length === 0 && comprables.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-line-strong px-4 py-4 text-[14px] leading-relaxed text-ink-faint">
          No hay nada cargado para este momento del día. Cuando armemos tu
          biblioteca real, acá va a haber opciones.
        </p>
      )}
    </>
  )
}

function OptionList({
  options,
  onPick,
}: {
  options: { meal: Meal; why?: string }[]
  onPick: (id: string) => void
}) {
  return (
    <ul className="mt-2 space-y-2">
      {options.map(({ meal, why }) => (
        <li key={meal.id}>
          <button
            onClick={() => onPick(meal.id)}
            className="flex w-full items-center gap-3.5 rounded-card bg-surface px-3.5 py-3.5 text-left shadow-sm transition-transform duration-150 active:scale-[0.985]"
          >
            <MealMark meal={meal} size={24} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[16px] font-medium text-ink">{meal.name}</span>
              <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <CarbChip meal={meal} />
                <SatietyMark level={meal.satiety} showLabel={false} />
                {meal.buyOutside ? (
                  <BuyBadge venues={meal.venues} />
                ) : (
                  why && <span className="text-[13px] text-ink-faint">{why}</span>
                )}
                {meal.isDemo && <DemoBadge />}
              </span>
              {meal.buyOutside && meal.venues && meal.venues.length > 1 && (
                <span className="mt-1 block truncate text-[12px] text-ink-faint">
                  {meal.venues.join(' · ')}
                </span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
