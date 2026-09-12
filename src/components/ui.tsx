import type { ReactNode } from 'react'
import type { DayContext, Meal, MealStatus, Satiety } from '../lib/types'
import { CONTEXT_LABEL, STATUS_LABEL } from '../lib/types'
import { CARB_UNIT, CATEGORY_TINT, carbApprox } from '../lib/format'

/* ------------------------------------------------------------------
   Primitivas. Ninguna depende sólo del color para comunicar estado:
   siempre hay forma, texto o posición además del tono.
   ------------------------------------------------------------------ */

type CarbInfo = Pick<Meal, 'carbs' | 'confidence' | 'carbsVerified'>

/** Carbohidratos con su confianza.
    Si el dato no fue verificado, el número se muestra como lo que es:
    sin confirmar. La confianza cargada no se usa hasta que alguien lo revisó. */
export function CarbChip({ meal, size = 'sm' }: { meal: CarbInfo; size?: 'sm' | 'lg' }) {
  const dot = !meal.carbsVerified
    ? 'border-dashed bg-transparent'
    : meal.confidence === 'alta'
      ? 'bg-current'
      : meal.confidence === 'media'
        ? 'bg-linear-to-r from-current from-50% to-transparent to-50%'
        : 'bg-transparent'

  const approx = carbApprox(meal)

  return (
    <span
      className={
        size === 'lg'
          ? 'inline-flex items-baseline gap-1.5 text-ink v-tnum'
          : 'inline-flex items-baseline gap-1 text-ink-soft v-tnum'
      }
      title={meal.carbsVerified ? undefined : 'Carbohidratos sin verificar'}
    >
      <span
        aria-hidden
        className={`self-center rounded-full border border-current ${dot} ${
          size === 'lg' ? 'size-2' : 'size-1.5'
        }`}
      />
      <span className={size === 'lg' ? 'text-3xl v-display' : 'text-[13px] font-medium'}>
        {approx ? '~' : ''}
        {meal.carbs}
      </span>
      <span className={size === 'lg' ? 'text-base text-ink-soft' : 'text-[13px]'}>
        {CARB_UNIT}
      </span>
    </span>
  )
}

/** Marca de dato de demostración. Se ve en todas las pantallas, no sólo
    en el detalle: no quiero confundir un número inventado con uno real. */
export function DemoBadge({ full = false }: { full?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-pill border border-dashed border-line-strong px-1.5 py-px text-[10px] font-semibold tracking-wide text-ink-faint uppercase">
      {full ? 'Demo · sin verificar' : 'Demo'}
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
            className={`w-[3px] rounded-full ${i < filled ? 'bg-clay' : 'bg-line-strong'}`}
            style={{ height: 4 + i * 3 }}
          />
        ))}
      </span>
      {showLabel && <span className="text-[13px] font-medium capitalize">{level}</span>}
    </span>
  )
}

/** Estado. Nunca hay estado "mal": omitir o cambiar son decisiones, no faltas. */
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

/* Un ícono de línea por momento del día. Sin caja, sin iniciales: una
   inicial dentro de un círculo se lee como un avatar de persona, y esto
   es comida. Cuando haya fotos reales, la foto ocupa este lugar. */

const CATEGORY_PATH: Record<Meal['category'], string> = {
  // sol: la mañana
  desayuno:
    'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6M12 3.2v1.8M12 19v1.8M3.2 12H5M19 12h1.8M5.8 5.8l1.3 1.3M16.9 16.9l1.3 1.3M18.2 5.8l-1.3 1.3M7.1 16.9l-1.3 1.3',
  // manzana
  snack: 'M12 8c-1.1-1.5-3-1.9-4.3-.8C6.2 8.4 6 10.6 6.9 12.8c.8 2 2.1 4.2 3.3 4.2.6 0 .9-.3 1.8-.3s1.2.3 1.8.3c1.2 0 2.5-2.2 3.3-4.2.9-2.2.7-4.4-.8-5.6C14.9 6.1 13.1 6.5 12 8ZM12 8V5.2',
  // tenedor y cuchillo (un plato redondo con aro interior se lee como diana)
  almuerzo:
    'M5.2 3.5v4.4M7.4 3.5v4.4M9.6 3.5v4.4M5.2 7.9a2.2 2.2 0 0 0 4.4 0M7.4 10.1V20.5M16.9 3.5c1.6 1.9 2.2 4.5 1.5 6.7-.3.9-1 1.5-1.5 1.5V20.5',
  // taza con vapor: la merienda
  merienda:
    'M4.5 10.5h11v4a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4zM15.5 11.5H17a2.5 2.5 0 0 1 0 5h-1.5M7.5 4v2.5M11.5 3.5V6',
  // luna: la noche
  cena: 'M18 14.8A7.2 7.2 0 0 1 9.2 6a7.2 7.2 0 1 0 8.8 8.8Z',
}

export function MealMark({ meal, size = 24 }: { meal: Meal; size?: number }) {
  if (meal.photoUrl) {
    return (
      <img
        src={meal.photoUrl}
        alt=""
        className="shrink-0 rounded-[12px] object-cover"
        style={{ width: size * 1.6, height: size * 1.6 }}
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

/** Marca de una opción que hay que salir a comprar. Nunca se confunde con
    algo que ya tenés. */
export function BuyBadge({ venues }: { venues?: string[] }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-dusk-soft px-2 py-0.5 text-[12px] font-semibold text-dusk">
      <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden>
        <path
          d="M3 5h10l-.9 7.3a1.4 1.4 0 0 1-1.4 1.2H5.3a1.4 1.4 0 0 1-1.4-1.2ZM6 5a2 2 0 0 1 4 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {venues?.length ? venues[0] : 'comprar'}
    </span>
  )
}

/** Dónde transcurre el día. Es la palanca principal de adaptación:
    tres opciones, un toque, siempre visible. */
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
      className="flex gap-1 rounded-pill border border-line bg-surface p-1"
    >
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={active}
            className={`min-h-[38px] flex-1 rounded-pill px-3 text-[13px] font-semibold transition-colors duration-150 ${
              active ? 'bg-ink text-bg' : 'text-ink-soft'
            }`}
          >
            {CONTEXT_LABEL[o]}
          </button>
        )
      })}
    </div>
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
