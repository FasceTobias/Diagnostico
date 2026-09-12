import { useMemo, useState } from 'react'
import type { Vianda } from '../lib/store'
import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_LABEL, SLOT_SHORT } from '../lib/types'
import { findNext } from '../lib/domain'
import { carbLabel, greeting, longDate, nowMinutes, relativeTime } from '../lib/format'

/* ------------------------------------------------------------------
   Los tres conceptos visuales de HOY, con los mismos datos.
   Están acá para poder compararlos en el teléfono, no en una captura.
   El elegido (B con piel de A) es el que corre en el resto de la app.
   ------------------------------------------------------------------ */

type Concept = 'A' | 'B' | 'C'

const META: Record<Concept, { name: string; line: string }> = {
  A: { name: 'Ambient Health', line: 'Aire, calma y tipografía. Premium y tranquilo.' },
  B: { name: 'One UI Personal', line: 'Ergonomía primero. Todo llega con el pulgar.' },
  C: { name: 'Invisible Glass', line: 'Oscuro, en capas. La UI aparece cuando la tocás.' },
}

export function Conceptos({ app, onBack }: { app: Vianda; onBack: () => void }) {
  const [c, setC] = useState<Concept>('B')
  const now = nowMinutes()
  const next = useMemo(
    () => (app.today ? findNext(app.today, app.meals, now) : undefined),
    [app.today, app.meals, now],
  )

  const rows = (app.today?.meals ?? [])
    .filter((planned) => planned.status !== 'skipped')
    .map((planned) => ({ planned, meal: app.mealById(planned.mealId) }))
    .filter((r): r is { planned: PlannedMeal; meal: Meal } => !!r.meal)

  if (!next) return null

  return (
    <div className="min-h-dvh bg-bg-deep">
      <header className="mx-auto max-w-md px-4 v-safe-top pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] v-display text-ink">Conceptos</h1>
          <button
            onClick={onBack}
            className="rounded-pill border border-line px-4 py-2 text-[14px] font-medium text-ink-soft"
          >
            Volver
          </button>
        </div>

        <div className="mt-4 flex gap-1.5 rounded-pill border border-line bg-surface p-1">
          {(['A', 'B', 'C'] as Concept[]).map((k) => (
            <button
              key={k}
              onClick={() => setC(k)}
              className={`flex-1 rounded-pill py-2 text-[14px] font-semibold transition-colors ${
                k === c ? 'bg-ink text-bg' : 'text-ink-soft'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[15px] font-semibold text-ink">{META[c].name}</p>
        <p className="text-[13px] leading-relaxed text-ink-soft">{META[c].line}</p>
        {c === 'B' && (
          <p className="mt-1 text-[13px] font-medium text-clay">
            Recomendado · es el que corre en la app
          </p>
        )}
      </header>

      <div className="mx-auto max-w-md px-4 pb-16">
        <div className="overflow-hidden rounded-[32px] shadow-lg ring-1 ring-line">
          {c === 'A' && <ConceptA next={next} rows={rows} />}
          {c === 'B' && <ConceptB next={next} rows={rows} now={now} />}
          {c === 'C' && <ConceptC next={next} rows={rows} now={now} />}
        </div>
        <p className="mt-4 px-1 text-[12px] leading-relaxed text-ink-faint">
          Vista estática, sólo para comparar la forma. Los tres muestran exactamente
          la misma información.
        </p>
      </div>
    </div>
  )
}

type Rows = { planned: PlannedMeal; meal: Meal }[]
type Next = NonNullable<ReturnType<typeof findNext>>

/* ---------------- A · AMBIENT HEALTH ----------------
   Separación por espacio, no por líneas. Un anillo fino marca el día.
   Riesgo conocido: la acción principal queda alta y hay que scrollear. */

function ConceptA({ next, rows }: { next: Next; rows: Rows }) {
  const eaten = rows.filter((r) => r.planned.status === 'eaten').length
  const pct = rows.length ? eaten / rows.length : 0

  return (
    <div className="bg-[#faf8f4] px-7 py-10 text-[#1c1814]">
      <p className="text-[13px] tracking-[0.14em] text-[#9a9187] uppercase">
        {longDate(new Date())}
      </p>

      <div className="mt-9 flex items-center gap-6">
        <svg viewBox="0 0 80 80" className="size-[84px] shrink-0 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e6e0d6" strokeWidth="5" />
          <circle
            cx="40" cy="40" r="34" fill="none" stroke="#b85c33" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${pct * 213} 213`}
          />
        </svg>
        <div>
          <p className="text-[40px] leading-none font-light tracking-[-0.03em]">
            {eaten}
            <span className="text-[22px] text-[#9a9187]"> de {rows.length}</span>
          </p>
          <p className="mt-1 text-[14px] text-[#6a6157]">comidas del día</p>
        </div>
      </div>

      <div className="mt-14">
        <p className="text-[13px] tracking-[0.14em] text-[#b85c33] uppercase">Próximo</p>
        <p className="mt-5 text-[34px] leading-[1.1] font-light tracking-[-0.03em]">
          {next.meal.name}
        </p>
        <p className="mt-5 text-[17px] font-light text-[#6a6157]">
          {SLOT_LABEL[next.planned.slot]} · {next.planned.time} ·{' '}
          {carbLabel(next.meal)} g CH
        </p>
      </div>

      <div className="mt-14 space-y-8">
        {rows.map(({ planned, meal }) => (
          <div key={planned.slot}>
            <p className="text-[12px] tracking-[0.12em] text-[#9a9187] uppercase">
              {SLOT_SHORT[planned.slot]} · {planned.time}
            </p>
            <p className="mt-1.5 text-[19px] font-light tracking-[-0.02em]">{meal.name}</p>
            <p className="mt-1 text-[14px] text-[#9a9187]">
              {carbLabel(meal)} g CH · {meal.satiety}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- B · ONE UI PERSONAL ----------------
   Encabezado alto que empuja lo accionable a la zona del pulgar.
   Tarjetas grandes, jerarquía por tamaño, acciones cómodas. */

function ConceptB({ next, rows, now }: { next: Next; rows: Rows; now: number }) {
  return (
    <div className="bg-[#f5f2ec] text-[#1c1814]">
      <div className="px-6 pt-12 pb-8">
        <p className="text-[32px] leading-none font-semibold tracking-[-0.033em]">
          {greeting()}
        </p>
        <p className="mt-2 text-[15px] text-[#6a6157]">Hoy, {longDate(new Date())}</p>
      </div>

      <div className="px-4">
        <div className="rounded-[30px] bg-white p-5 shadow-[0_12px_34px_-12px_rgba(28,24,20,.28)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.11em] text-[#b85c33] uppercase">
              Próximo
            </p>
            <p className="text-[13px] text-[#9a9187]">{relativeTime(next.minutes, now)}</p>
          </div>
          <p className="mt-4 text-[19px] font-semibold tracking-[-0.03em]">
            {SLOT_LABEL[next.planned.slot]}{' '}
            <span className="font-normal text-[#9a9187]">{next.planned.time}</span>
          </p>
          <p className="mt-1.5 text-[27px] leading-[1.15] font-semibold tracking-[-0.033em]">
            {next.meal.name}
          </p>
          <p className="mt-4 text-[15px] text-[#6a6157]">
            {carbLabel(next.meal)} g CH · {next.meal.satiety}
          </p>
          <div className="mt-6 flex gap-2.5">
            <div className="min-h-[52px] flex-1 rounded-full bg-[#b85c33] text-center text-[16px] leading-[52px] font-semibold text-white">
              Ya está preparado
            </div>
            <div className="min-h-[52px] rounded-full border border-[#1c181417] px-6 text-[16px] leading-[50px] font-semibold">
              Ver
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[22px] bg-white px-4 py-4 shadow-sm">
          <span className="size-6 rounded-full border-2 border-[#1c181428]" />
          <span className="flex-1 text-[17px] font-semibold">Mochila de hoy</span>
          <span className="text-[13px] text-[#9a9187]">0 de 7</span>
        </div>
      </div>

      <p className="mt-8 px-5 text-[11px] font-semibold tracking-[0.11em] text-[#9a9187] uppercase">
        El día
      </p>
      <div className="space-y-2 px-4 pt-2 pb-8">
        {rows.map(({ planned, meal }) => (
          <div
            key={planned.slot}
            className="flex items-center gap-3.5 rounded-[22px] bg-white px-3.5 py-3.5 shadow-sm"
          >
            <span className="w-[46px] text-[13px] font-semibold text-[#9a9187]">
              {planned.time}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold tracking-[0.11em] text-[#9a9187] uppercase">
                {SLOT_SHORT[planned.slot]}
              </span>
              <span className="mt-0.5 block truncate text-[16px] font-medium">{meal.name}</span>
              <span className="text-[13px] text-[#6a6157]">
                {carbLabel(meal)} g CH · {meal.satiety}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- C · INVISIBLE GLASS ----------------
   Negro profundo, capas, luz detrás de lo activo, bordes de 1px.
   Riesgo conocido: sin controles visibles falla el test de los 5 segundos. */

function ConceptC({ next, rows, now }: { next: Next; rows: Rows; now: number }) {
  return (
    <div className="relative overflow-hidden bg-[#08080a] px-6 py-12 text-[#f2efe9]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full opacity-60 blur-[70px]"
        style={{ background: 'radial-gradient(circle, rgba(224,130,86,.42), transparent 70%)' }}
      />

      <p className="relative text-[12px] tracking-[0.16em] text-white/35 uppercase">
        {longDate(new Date())}
      </p>

      <div className="relative mt-10 rounded-[26px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.16em] text-[#e08256] uppercase">Ahora</p>
          <p className="text-[12px] text-white/35">{relativeTime(next.minutes, now)}</p>
        </div>
        <p className="mt-5 text-[29px] leading-[1.15] font-medium tracking-[-0.03em]">
          {next.meal.name}
        </p>
        <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
          <p className="text-[15px] text-white/50">
            {SLOT_LABEL[next.planned.slot]} · {next.planned.time}
          </p>
          <p className="text-[24px] font-medium tracking-[-0.02em]">
            {carbLabel(next.meal)}
            <span className="ml-1 text-[13px] text-white/40">g CH</span>
          </p>
        </div>
      </div>

      <div className="relative mt-10 divide-y divide-white/[0.07]">
        {rows.map(({ planned, meal }) => (
          <div key={planned.slot} className="flex items-baseline gap-4 py-4">
            <span className="w-[46px] shrink-0 text-[13px] text-white/30">{planned.time}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[16px] text-white/85">{meal.name}</span>
              <span className="text-[12px] text-white/30">
                {SLOT_SHORT[planned.slot]} · {meal.satiety}
              </span>
            </span>
            <span className="text-[14px] text-white/45">{carbLabel(meal)} g</span>
          </div>
        ))}
      </div>

      <p className="relative mt-8 text-[12px] text-white/25">
        Mantené una comida para ver los carbohidratos · deslizá para cambiarla
      </p>
    </div>
  )
}
