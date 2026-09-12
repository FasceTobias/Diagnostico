import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { Meal, PlannedMeal } from '../lib/types'
import { SLOT_LABEL, SLOT_SHORT } from '../lib/types'
import { findNext } from '../lib/domain'
import { carbLabel, longDate, nowMinutes, relativeTime, shortDate } from '../lib/format'

/* ------------------------------------------------------------------
   TRES DIRECCIONES VISUALES PARA HOY

   Mismos datos, mismas funciones. Cambia el lenguaje: tipografía, grilla,
   densidad, cómo se trata el héroe, cuánta metadata se ve, cómo se mueve
   y dónde vive el asistente.

   Están acá para decidirlo en el teléfono, no en una captura.
   ------------------------------------------------------------------ */

type Dir = 'A' | 'B' | 'C'

const META: Record<Dir, { name: string; type: string; idea: string }> = {
  A: {
    name: 'Editorial',
    type: 'Fraunces + Inter',
    idea: 'Sin cajas. Reglas finas, mucho aire y un riel de horas. El día es una línea, no una pila de tarjetas.',
  },
  B: {
    name: 'Instrumento',
    type: 'Space Grotesk',
    idea: 'Denso y tabular. El contraste lo da la inversión de color, no el tamaño. Todo el día entra sin scrollear.',
  },
  C: {
    name: 'Póster',
    type: 'Bricolage Grotesque',
    idea: 'Tipografía enorme y fondo que cambia con la hora. La metadata aparece sólo si la tocás.',
  },
}

type Row = { planned: PlannedMeal; meal: Meal }

export function Direcciones({ app, onBack }: { app: Vianda; onBack: () => void }) {
  const [dir, setDir] = useState<Dir>('A')

  /* Las tipografías de B y C sólo se bajan si entrás acá. */
  useEffect(() => {
    import('../fonts-alt.css')
  }, [])

  const now = nowMinutes()
  const next = useMemo(
    () => (app.today ? findNext(app.today, app.meals, now) : undefined),
    [app.today, app.meals, now],
  )

  const rows: Row[] = (app.today?.meals ?? [])
    .filter((p) => p.status !== 'skipped')
    .map((planned) => ({ planned, meal: app.mealById(planned.mealId) }))
    .filter((r): r is Row => !!r.meal)

  if (!next) return null

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-dvh bg-bg-deep">
        <header className="mx-auto max-w-md v-safe-top px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] v-serif text-ink">Direcciones visuales</h1>
            <button
              onClick={onBack}
              className="rounded-pill border border-line px-4 py-2 text-[14px] font-medium text-ink-soft"
            >
              Volver
            </button>
          </div>

          <div className="mt-4 flex gap-1 rounded-pill border border-line bg-surface p-1">
            {(['A', 'B', 'C'] as Dir[]).map((k) => (
              <button
                key={k}
                onClick={() => setDir(k)}
                className={`flex-1 rounded-pill py-2 text-[14px] font-semibold transition-colors ${
                  k === dir ? 'bg-ink text-bg' : 'text-ink-soft'
                }`}
              >
                {META[k].name}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[12px] tracking-[0.14em] text-ink-faint uppercase">
            {META[dir].type}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{META[dir].idea}</p>
        </header>

        <div className="mx-auto max-w-md px-5 pb-16">
          <div className="overflow-hidden rounded-[30px] shadow-lg ring-1 ring-line">
            <AnimatePresence mode="wait">
              <m.div
                key={dir}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {dir === 'A' && <Editorial next={next} rows={rows} now={now} />}
                {dir === 'B' && <Instrumento next={next} rows={rows} now={now} />}
                {dir === 'C' && <Poster next={next} rows={rows} now={now} />}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}

type Next = NonNullable<ReturnType<typeof findNext>>
interface DirProps {
  next: Next
  rows: Row[]
  now: number
}

/* ================================================================
   A — EDITORIAL
   Serif variable para el contenido, grotesca para los datos.
   Cero cajas: el ritmo lo dan las reglas y el espacio.
   ================================================================ */

function Editorial({ next, rows, now }: DirProps) {
  const [ask, setAsk] = useState(false)

  return (
    <div
      className="relative bg-[#f7f4ee] px-6 pt-9 pb-24 text-[#1c1814]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Folio: la fecha como cabecera de página, no como título */}
      <div className="flex items-baseline justify-between border-b border-[#1c181420] pb-2.5">
        <p className="text-[11px] tracking-[0.18em] text-[#8d8478] uppercase">
          {longDate(new Date())}
        </p>
        <p className="text-[11px] tracking-[0.18em] text-[#8d8478] uppercase">mixto</p>
      </div>

      {/* Héroe editorial */}
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="pt-8"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] tracking-[0.18em] text-[#b0542a] uppercase">
            {next.isNow ? 'Ahora' : 'Próximo'}
          </span>
          <span className="h-px flex-1 bg-[#1c181420]" />
          <span className="text-[12px] text-[#8d8478] tabular-nums">
            {relativeTime(next.minutes, now)}
          </span>
        </div>

        <p
          className="mt-7 text-[44px] leading-[1.02] tracking-[-0.025em]"
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
        >
          {next.meal.name}
        </p>

        <div className="mt-6 flex items-baseline gap-5 text-[12px] tracking-[0.1em] text-[#8d8478] uppercase">
          <span className="text-[#1c1814]">
            {SLOT_LABEL[next.planned.slot]} {next.planned.time}
          </span>
          <span className="tabular-nums">{carbLabel(next.meal)}</span>
          <span>{next.meal.satiety}</span>
        </div>
      </m.div>

      {/* El día como un riel de horas. Una línea, no seis tarjetas. */}
      <div className="mt-12">
        <p className="text-[11px] tracking-[0.18em] text-[#8d8478] uppercase">El día</p>
        <div className="relative mt-4 pl-[62px]">
          <span className="absolute top-2 bottom-2 left-[46px] w-px bg-[#1c181418]" />
          {rows.map(({ planned, meal }, idx) => {
            const active = planned.slot === next.planned.slot
            const past = !active && idx < rows.findIndex((r) => r.planned.slot === next.planned.slot)
            return (
              <m.div
                key={planned.slot}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: past ? 0.38 : 1, y: 0 }}
                transition={{ delay: 0.04 * idx, type: 'spring', stiffness: 240, damping: 28 }}
                className="relative py-3.5"
              >
                <span className="absolute top-[19px] -left-[62px] text-[12px] text-[#8d8478] tabular-nums">
                  {planned.time}
                </span>
                <span
                  className={`absolute top-[20px] -left-[19px] block rounded-full ${
                    active
                      ? 'size-[9px] bg-[#b0542a] ring-4 ring-[#f7f4ee]'
                      : 'size-[5px] bg-[#1c181438] ring-4 ring-[#f7f4ee]'
                  }`}
                />
                <div className="flex items-baseline justify-between gap-4">
                  <p
                    className="min-w-0 flex-1 truncate text-[17px] tracking-[-0.01em]"
                    style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: active ? 600 : 400 }}
                  >
                    {meal.name}
                  </p>
                  <span className="shrink-0 text-[12px] text-[#8d8478] tabular-nums">
                    {meal.carbs}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] tracking-[0.1em] text-[#a79e91] uppercase">
                  {SLOT_SHORT[planned.slot]}
                  {planned.optional ? ' · opcional' : ''}
                </p>
              </m.div>
            )
          })}
        </div>
      </div>

      {/* Asistente: un punto. Se abre si lo tocás. */}
      <div className="absolute right-5 bottom-6 left-5 flex justify-end">
        <AnimatePresence mode="wait">
          {ask ? (
            <m.div
              key="open"
              initial={{ width: 44, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 44, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-2 overflow-hidden rounded-pill border border-[#1c181425] bg-white px-4 py-3"
            >
              <span className="truncate text-[14px] text-[#8d8478]">
                Escribilo como lo pensás…
              </span>
              <button onClick={() => setAsk(false)} className="ml-auto text-[13px] text-[#8d8478]">
                ✕
              </button>
            </m.div>
          ) : (
            <m.button
              key="closed"
              onClick={() => setAsk(true)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileTap={{ scale: 0.92 }}
              className="grid size-11 place-items-center rounded-full border border-[#1c181420] bg-white shadow-[0_6px_20px_-8px_rgba(28,24,20,.4)]"
            >
              <svg viewBox="0 0 20 20" className="size-[17px] text-[#b0542a]" aria-hidden>
                <path d="M10 3 11.5 7 15.5 8.5 11.5 10 10 14 8.5 10 4.5 8.5 8.5 7Z" fill="currentColor" />
              </svg>
            </m.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ================================================================
   B — INSTRUMENTO
   Denso, tabular, sin scroll. El contraste lo da invertir el color.
   ================================================================ */

function Instrumento({ next, rows, now }: DirProps) {
  const [open, setOpen] = useState<string | null>(next.planned.slot)

  return (
    <div
      className="bg-[#f2f0eb] pb-5 text-[#16150f]"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <div className="flex items-center justify-between border-b border-[#16150f18] px-4 py-3">
        <p className="text-[12px] font-medium tracking-[0.02em]">
          {shortDate(new Date())}
          <span className="ml-2 text-[#8a857a]">mixto</span>
        </p>
        <div className="flex gap-3 text-[#8a857a]">
          <svg viewBox="0 0 20 20" className="size-[17px]" fill="none" aria-hidden>
            <path d="M10 3 11.5 7 15.5 8.5 11.5 10 10 14 8.5 10 4.5 8.5 8.5 7Z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 20 20" className="size-[17px]" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="10" cy="10" r="2.4" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Banda AHORA: inversión de color en vez de tarjeta grande */}
      <div className="bg-[#16150f] px-4 py-4 text-[#f2f0eb]">
        <div className="flex items-baseline justify-between text-[11px] tracking-[0.14em] uppercase">
          <span className="text-[#e08256]">{next.isNow ? 'Ahora' : 'Próximo'}</span>
          <span className="text-white/45 tabular-nums">{relativeTime(next.minutes, now)}</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] text-white/50 tabular-nums">
              {SLOT_SHORT[next.planned.slot]} · {next.planned.time}
            </p>
            <p className="mt-1 text-[24px] leading-[1.12] font-semibold tracking-[-0.025em]">
              {next.meal.name}
            </p>
          </div>
          <p className="shrink-0 text-[30px] leading-none font-semibold tabular-nums">
            {next.meal.carbs}
            <span className="ml-1 text-[11px] font-normal text-white/45">g CHO</span>
          </p>
        </div>
      </div>

      {/* Tabla del día. Todo visible, jerarquía por peso y opacidad. */}
      <table className="w-full border-collapse text-left">
        <tbody>
          {rows.map(({ planned, meal }) => {
            const active = planned.slot === next.planned.slot
            const expanded = open === planned.slot
            return (
              <tr
                key={planned.slot}
                onClick={() => setOpen(expanded ? null : planned.slot)}
                className="border-b border-[#16150f12] align-top"
              >
                <td className="w-[52px] py-3 pl-4 text-[12px] text-[#8a857a] tabular-nums">
                  {planned.time}
                </td>
                <td className="py-3">
                  <p
                    className={`text-[15px] leading-tight ${active ? 'font-semibold' : 'font-normal'}`}
                  >
                    {meal.name}
                  </p>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <m.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                        className="overflow-hidden text-[10px] tracking-[0.12em] text-[#a09a8d] uppercase"
                      >
                        <span className="block pt-1.5">
                          {SLOT_SHORT[planned.slot]} · {meal.satiety}
                          {planned.optional ? ' · opcional' : ''} · sin verificar
                        </span>
                      </m.p>
                    )}
                  </AnimatePresence>
                </td>
                <td className="w-[58px] py-3 pr-4 text-right text-[13px] text-[#57534a] tabular-nums">
                  {meal.carbs}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2 px-4">
        <div className="flex-1 border border-[#16150f22] py-2.5 text-center text-[12px] font-medium tracking-[0.08em] uppercase">
          Llevate
        </div>
        <div className="flex-1 border border-[#16150f22] py-2.5 text-center text-[12px] font-medium tracking-[0.08em] uppercase">
          Resolver
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   C — PÓSTER
   Tipografía grande, fondo que cambia con la hora, metadata escondida.
   ================================================================ */

const TINT = (minutes: number) => {
  if (minutes < 11 * 60) return { bg: '#efe4d2', ink: '#2a1d10', accent: '#a8541f' }
  if (minutes < 17 * 60) return { bg: '#e7e7de', ink: '#1f2018', accent: '#5d6b3a' }
  if (minutes < 20 * 60) return { bg: '#ecdfe0', ink: '#2b1c1e', accent: '#9b4a52' }
  return { bg: '#1b1a21', ink: '#f0eee9', accent: '#c98b5e' }
}

function Poster({ next, rows, now }: DirProps) {
  const [meta, setMeta] = useState(false)
  const t = TINT(now)

  return (
    <div
      className="pb-8"
      style={{ background: t.bg, color: t.ink, fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      <div className="flex min-h-[440px] flex-col justify-between px-6 pt-7 pb-8">
        <div className="flex items-baseline justify-between text-[12px] font-medium tracking-[0.06em] uppercase opacity-50">
          <span>{shortDate(new Date())}</span>
          <span>{relativeTime(next.minutes, now)}</span>
        </div>

        <m.button
          onClick={() => setMeta((v) => !v)}
          whileTap={{ scale: 0.99 }}
          className="mt-10 block w-full text-left"
        >
          <p className="text-[13px] font-semibold tracking-[0.14em] uppercase" style={{ color: t.accent }}>
            {SLOT_LABEL[next.planned.slot]}
          </p>
          <p className="mt-1 text-[58px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
            {next.planned.time}
          </p>
          <p className="mt-6 text-[34px] leading-[1.03] font-medium tracking-[-0.035em]">
            {next.meal.name}
          </p>

          <AnimatePresence initial={false}>
            {meta && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                className="overflow-hidden"
              >
                <p className="pt-6 text-[14px] tracking-[0.08em] uppercase opacity-55">
                  {carbLabel(next.meal)} · {next.meal.satiety} · sin verificar
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </m.button>

        <p className="mt-8 text-[12px] tracking-[0.08em] uppercase opacity-35">
          {meta ? 'Tocá para esconder' : 'Tocá para ver los datos'}
        </p>
      </div>

      {/* El resto del día: sólo hora y nombre */}
      <div className="border-t px-6 pt-5" style={{ borderColor: `${t.ink}1f` }}>
        {rows.map(({ planned, meal }, idx) => {
          const active = planned.slot === next.planned.slot
          return (
            <m.div
              key={planned.slot}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: active ? 1 : 0.42, y: 0 }}
              transition={{ delay: 0.03 * idx, type: 'spring', stiffness: 240, damping: 28 }}
              className="flex items-baseline gap-4 py-2.5"
            >
              <span className="w-[46px] shrink-0 text-[13px] font-medium tabular-nums opacity-60">
                {planned.time}
              </span>
              <span className="min-w-0 flex-1 truncate text-[19px] font-medium tracking-[-0.02em]">
                {meal.name}
              </span>
            </m.div>
          )
        })}
      </div>

      {/* Asistente: un orbe */}
      <div className="flex justify-center pt-8">
        <m.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="size-14 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${t.accent}, ${t.accent}00 72%)`,
            boxShadow: `0 0 40px -8px ${t.accent}66`,
          }}
        />
      </div>
    </div>
  )
}
