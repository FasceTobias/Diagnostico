import type { ReactNode } from 'react'
import type { Meal, MealStatus, Satiety } from '../lib/types'
import { STATUS_LABEL } from '../lib/types'
import { CATEGORY_TINT, carbLabel, mealInitial } from '../lib/format'

/* ------------------------------------------------------------------
   Primitivas. Ninguna depende sólo del color para comunicar estado:
   siempre hay forma, texto o posición además del tono.
   ------------------------------------------------------------------ */

/** Carbohidratos con su confianza. El punto dice cuánto confiar en el número. */
export function CarbChip({
  meal,
  size = 'sm',
}: {
  meal: Pick<Meal, 'carbs' | 'confidence'>
  size?: 'sm' | 'lg'
}) {
  const dot =
    meal.confidence === 'alta'
      ? 'bg-current'
      : meal.confidence === 'media'
        ? 'bg-linear-to-r from-current from-50% to-transparent to-50%'
        : 'bg-transparent'

  return (
    <span
      className={
        size === 'lg'
          ? 'inline-flex items-baseline gap-1.5 text-ink v-tnum'
          : 'inline-flex items-baseline gap-1 text-ink-soft v-tnum'
      }
    >
      <span
        aria-hidden
        className={`self-center rounded-full border border-current ${dot} ${
          size === 'lg' ? 'size-2' : 'size-1.5'
        }`}
      />
      <span className={size === 'lg' ? 'text-3xl v-display' : 'text-[13px] font-medium'}>
        {carbLabel(meal)}
      </span>
      <span className={size === 'lg' ? 'text-base text-ink-soft' : 'text-[13px]'}>g CH</span>
    </span>
  )
}

const SATIETY_BARS: Record<Satiety, number> = { liviana: 1, normal: 2, potente: 3 }

/** Saciedad: tres barras + palabra. Se lee sin color y de un vistazo. */
export function SatietyMark({ level, showLabel = true }: { level: Satiety; showLabel?: boolean }) {
  const filled = SATIETY_BARS[level]
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-soft">
      <span aria-hidden className="inline-flex items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${
              i < filled ? 'bg-clay' : 'bg-line-strong'
            }`}
            style={{ height: 4 + i * 3 }}
          />
        ))}
      </span>
      {showLabel && <span className="text-[13px] font-medium capitalize">{level}</span>}
    </span>
  )
}

/** Estado. Nunca hay estado "mal": omitido y cambiado son neutros. */
export function StatusPill({ status }: { status: MealStatus }) {
  if (status === 'pending') return null
  const style: Record<Exclude<MealStatus, 'pending'>, string> = {
    prepared: 'text-sage bg-sage-soft',
    eaten: 'text-ink-soft bg-line',
    skipped: 'text-ink-faint bg-line',
    replaced: 'text-dusk bg-dusk-soft',
  }
  const glyph: Record<Exclude<MealStatus, 'pending'>, string> = {
    prepared: '✓',
    eaten: '●',
    skipped: '–',
    replaced: '↺',
  }
  const s = status as Exclude<MealStatus, 'pending'>
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[12px] font-semibold ${style[s]}`}
    >
      <span aria-hidden>{glyph[s]}</span>
      {STATUS_LABEL[s]}
    </span>
  )
}

/** Marca de la comida: tono por momento del día + inicial. Sin fotos, con identidad. */
export function MealTile({ meal, size = 44 }: { meal: Meal; size?: number }) {
  const tint = CATEGORY_TINT[meal.category]
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-[14px] v-display"
      style={{
        width: size,
        height: size,
        background: tint.bg,
        color: tint.fg,
        fontSize: size * 0.42,
      }}
    >
      {mealInitial(meal.name)}
    </span>
  )
}

/** Fila de checklist. La animación confirma el toque; dura 240ms y se termina. */
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
      className="flex w-full items-center gap-3.5 rounded-2xl px-3 py-3 text-left transition-colors active:bg-surface-2"
    >
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-all duration-200 ${
          done ? 'v-checked border-clay bg-clay text-white' : 'border-line-strong'
        }`}
      >
        {done && (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
            <path
              d="M3 8.5 6.2 11.6 13 4.8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[15px] transition-colors ${
            done ? 'text-ink-faint line-through decoration-1' : 'text-ink'
          }`}
        >
          {label}
        </span>
        {hint && <span className="block text-[12px] text-ink-faint">{hint}</span>}
      </span>
    </button>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="v-eyebrow text-ink-faint">{children}</p>
}

/** Botón de acción. Grande, cómodo, sin decoración. */
export function Action({
  children,
  onClick,
  variant = 'quiet',
  full,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'quiet'
  full?: boolean
}) {
  const base =
    'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill px-5 text-[15px] font-semibold transition-[transform,background-color] duration-150 active:scale-[0.97]'
  const look =
    variant === 'primary'
      ? 'bg-clay text-white shadow-sm'
      : 'bg-surface text-ink border border-line'
  return (
    <button onClick={onClick} className={`${base} ${look} ${full ? 'w-full' : ''}`}>
      {children}
    </button>
  )
}
