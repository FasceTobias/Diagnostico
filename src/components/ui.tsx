import type { ReactNode } from 'react'
import type { DayContext, Meal, MealStatus, Satiety } from '../lib/types'
import { CONTEXT_LABEL, STATUS_LABEL } from '../lib/types'
import { CATEGORY_TINT, carbApprox } from '../lib/format'

/* ------------------------------------------------------------------
   Primitivas.

   Dos reglas que ordenan todo: el contenido va en serif, los datos en
   versalitas o en números tabulares. Y ningún estado se comunica sólo
   con color: siempre hay forma, texto o posición.
   ------------------------------------------------------------------ */

type CarbInfo = Pick<Meal, 'carbs' | 'confidence' | 'carbsVerified'>

/** El carbohidrato como cifra, no como chip.
    La tilde dice «sin confirmar» sin gastar una etiqueta entera. */
export function CarbValue({
  meal,
  size = 'sm',
  unit = true,
}: {
  meal: CarbInfo
  size?: 'sm' | 'md' | 'lg'
  /** En listas largas la unidad va una sola vez, arriba de la columna. */
  unit?: boolean
}) {
  const approx = carbApprox(meal)
  const cls =
    size === 'lg'
      ? 'text-[34px] leading-none font-medium'
      : size === 'md'
        ? 'text-[19px] leading-none font-medium'
        : 'text-[14px] font-medium'

  return (
    <span className="inline-flex items-baseline gap-1 text-ink v-tnum" title={
      meal.carbsVerified ? undefined : 'Carbohidratos sin verificar'
    }>
      <span className={cls}>
        {approx ? '~' : ''}
        {meal.carbs}
      </span>
      {unit && (
        <span
          className={size === 'lg' ? 'v-label text-ink-faint' : 'v-label-sm text-ink-faint'}
        >
          g CHO
        </span>
      )}
    </span>
  )
}

/** La línea de datos de una comida: momento, saciedad y poco más.
    Una sola línea en versalitas en vez de cinco insignias sueltas. */
export function MetaLine({
  parts,
  className = '',
}: {
  parts: (string | false | undefined | null)[]
  className?: string
}) {
  const clean = parts.filter(Boolean) as string[]
  if (!clean.length) return null
  return (
    <p className={`v-label-sm text-ink-faint ${className}`}>{clean.join(' · ')}</p>
  )
}

/** Sólo donde hace falta explicar: biblioteca y detalle. */
export function DemoBadge() {
  return (
    <span className="v-label-sm shrink-0 text-ink-faint opacity-70">demo</span>
  )
}

const SATIETY_BARS: Record<Satiety, number> = { liviana: 1, normal: 2, potente: 3 }

/** Saciedad con forma, para el detalle. En las listas va como palabra. */
export function SatietyMark({ level, showLabel = true }: { level: Satiety; showLabel?: boolean }) {
  const filled = SATIETY_BARS[level]
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-soft">
      <span aria-hidden className="inline-flex items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${i < filled ? 'bg-clay' : 'bg-line-strong'}`}
            style={{ height: 4 + i * 3 }}
          />
        ))}
      </span>
      {showLabel && <span className="v-label-sm">{level}</span>}
    </span>
  )
}

/** Estado. No existe el estado «mal»: omitir o cambiar son decisiones. */
export function StatusPill({ status }: { status: MealStatus }) {
  if (status === 'pending') return null
  const s = status as Exclude<MealStatus, 'pending'>
  const tone: Record<Exclude<MealStatus, 'pending'>, string> = {
    prepared: 'text-sage',
    eaten: 'text-ink-faint',
    skipped: 'text-ink-faint',
    replaced: 'text-dusk',
  }
  const glyph: Record<Exclude<MealStatus, 'pending'>, string> = {
    prepared: '✓',
    eaten: '●',
    skipped: '–',
    replaced: '↺',
  }
  return (
    <span className={`v-label-sm inline-flex shrink-0 items-center gap-1 ${tone[s]}`}>
      <span aria-hidden>{glyph[s]}</span>
      {STATUS_LABEL[s]}
    </span>
  )
}

/* Un ícono de línea por momento del día. Sin caja, sin iniciales: una
   inicial dentro de un círculo se lee como un avatar de persona, y esto
   es comida. Cuando haya fotos reales, la foto ocupa este lugar. */

const CATEGORY_PATH: Record<Meal['category'], string> = {
  // sol: la mañana
  desayuno:
    'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6M12 3.2v1.8M12 19v1.8M3.2 12H5M19 12h1.8M5.8 5.8l1.3 1.3M16.9 16.9l1.3 1.3M18.2 5.8l-1.3 1.3M7.1 16.9l-1.3 1.3',
  // manzana
  snack: 'M12 8c-1.1-1.5-3-1.9-4.3-.8C6.2 8.4 6 10.6 6.9 12.8c.8 2 2.1 4.2 3.3 4.2.6 0 .9-.3 1.8-.3s1.2.3 1.8.3c1.2 0 2.5-2.2 3.3-4.2.9-2.2.7-4.4-.8-5.6C14.9 6.1 13.1 6.5 12 8ZM12 8V5.2',
  // tenedor y cuchillo
  almuerzo:
    'M5.2 3.5v4.4M7.4 3.5v4.4M9.6 3.5v4.4M5.2 7.9a2.2 2.2 0 0 0 4.4 0M7.4 10.1V20.5M16.9 3.5c1.6 1.9 2.2 4.5 1.5 6.7-.3.9-1 1.5-1.5 1.5V20.5',
  // taza con vapor
  merienda:
    'M4.5 10.5h11v4a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4zM15.5 11.5H17a2.5 2.5 0 0 1 0 5h-1.5M7.5 4v2.5M11.5 3.5V6',
  // luna
  cena: 'M18 14.8A7.2 7.2 0 0 1 9.2 6a7.2 7.2 0 1 0 8.8 8.8Z',
}

export function MealMark({ meal, size = 22 }: { meal: Meal; size?: number }) {
  if (meal.photoUrl) {
    return (
      <img
        src={meal.photoUrl}
        alt=""
        className="shrink-0 rounded-[10px] object-cover"
        style={{ width: size * 1.7, height: size * 1.7 }}
      />
    )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="shrink-0"
      style={{ width: size, height: size, color: CATEGORY_TINT[meal.category].fg }}
      fill="none"
      aria-hidden
    >
      <path
        d={CATEGORY_PATH[meal.category]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Dónde transcurre el día. Tres palabras separadas por reglas, no cápsulas. */
export function ContextSwitch({
  value,
  onChange,
}: {
  value: DayContext
  onChange: (c: DayContext) => void
}) {
  const options: DayContext[] = ['casa', 'mixto', 'calle']
  return (
    <div
      role="group"
      aria-label="Dónde transcurre el día"
      className="flex gap-1 rounded-xl bg-surface-2 p-1"
    >
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={active}
            className={`v-label min-h-[40px] flex-1 rounded-lg font-semibold transition-colors duration-150 ${
              active ? 'bg-clay text-white' : 'text-ink-soft active:bg-surface'
            }`}
          >
            {CONTEXT_LABEL[o]}
          </button>
        )
      })}
    </div>
  )
}

/** Fila de checklist: una regla y una marca. Sin caja. */
export function CheckRow({
  label,
  hint,
  done,
  onToggle,
}: {
  label: string
  hint?: string
  done: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={done}
      className="flex w-full items-start gap-3.5 rounded-xl border-b border-line px-1 py-3.5 text-left transition-colors active:bg-surface-2"
    >
      <span
        className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-all duration-200 ${
          done ? 'v-checked border-clay bg-clay text-white' : 'border-line-strong'
        }`}
      >
        {done && (
          <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden>
            <path
              d="M3 8.5 6.2 11.6 13 4.8"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[16px] leading-snug transition-colors ${
            done ? 'text-ink-faint line-through decoration-1' : 'text-ink'
          }`}
        >
          {label}
        </span>
        {hint && <span className="v-label-sm mt-0.5 block text-ink-faint">{hint}</span>}
      </span>
    </button>
  )
}

/** Encabezado de sección: versalitas con una regla que llega al borde. */
export function SectionLabel({
  children,
  aside,
  className = '',
}: {
  children: ReactNode
  /** Encabezado de la columna derecha, cuando la lista tiene cifras. */
  aside?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${className}`}>
      <p className="v-label font-semibold text-ink-soft">{children}</p>
      {aside && <p className="v-label-sm text-ink-faint">{aside}</p>}
    </div>
  )
}
