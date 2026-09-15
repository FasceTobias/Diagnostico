import type { ReactNode } from 'react'
import type { Category, Meal, MealStatus, PlannedMeal, Slot } from '../lib/types'
import { ORIGEN_CORTO, SLOT_CATEGORY, SLOT_LABEL } from '../lib/types'
import { Card, CardButton, Icono, Pill, Tile } from './base'
import { ICONO_MOMENTO, TILE_ORIGEN, TONO_MOMENTO, carbs, meta } from './tokens'

/* ------------------------------------------------------------------
   COMIDA

   Las piezas que muestran una comida. Todas dicen lo mismo, en el mismo
   orden y con los mismos pesos:

     momento y hora   rótulo chico, gris, versalitas
     nombre           lo único que pesa
     el resto         gris, 13, en una línea

   Leer una comida se aprende una vez. Por eso hay dos filas y no seis
   maneras distintas de dibujar lo mismo.
   ------------------------------------------------------------------ */

/* ---------------- la tira del día ----------------

   Lo primero que se lee, y tiene que contestar tres cosas en un
   segundo: qué hice, dónde estoy, qué falta. Nada más.

   No lleva tarjeta a propósito: es una línea de estado, no un módulo.
   Con caja parecía un stepper de onboarding. */

const TIRA: Record<Slot, string> = {
  breakfast: 'Desayuno',
  snack_am: 'Mañana',
  lunch: 'Almuerzo',
  snack_pm: 'Tarde',
  merienda: 'Merienda',
  dinner: 'Cena',
}

export function TiraDelDia({ plan, ahoraSlot }: { plan: PlannedMeal[]; ahoraSlot?: Slot }) {
  const hechas = plan.filter((p) => p.status === 'eaten').length
  const faltan = plan.filter((p) => p.status !== 'eaten' && p.status !== 'skipped').length

  return (
    <section aria-label="Cómo viene el día">
      <div className="flex items-baseline justify-between gap-3">
        <p className="t-label text-ink-soft">
          {faltan === 0
            ? 'Ya comiste todo'
            : `Te ${faltan === 1 ? 'queda' : 'quedan'} ${faltan} ${faltan === 1 ? 'comida' : 'comidas'}`}
        </p>
        <p className="t-label text-ink-faint">
          <span className="t-num">{hechas}</span> de <span className="t-num">{plan.length}</span>
        </p>
      </div>

      <ol className="relative mt-3 flex items-start justify-between">
        {/* El hilo que las une. Va detrás y casi no se ve: sirve para
            leerlas como una secuencia, no para decorar. */}
        <span className="absolute inset-x-3 top-[5px] h-px bg-line" aria-hidden />

        {plan.map((p) => {
          const hecha = p.status === 'eaten'
          const ahora = p.slot === ahoraSlot
          return (
            <li key={p.slot} className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
              <span
                className={`grid size-[11px] place-items-center rounded-full ${
                  hecha
                    ? 'bg-lavanda'
                    : ahora
                      ? 'bg-lavanda ring-4 ring-lavanda-tenue'
                      : 'border border-line-strong bg-bg'
                }`}
              >
                {hecha && <Icono name="check" size={7} strokeWidth={4} className="text-lavanda-ink" />}
              </span>
              <span
                className={`w-full text-center text-[10.5px] leading-tight ${
                  ahora
                    ? 'font-semibold text-lavanda'
                    : hecha
                      ? 'font-medium text-ink-soft'
                      : 'font-medium text-ink-faint'
                }`}
              >
                {TIRA[p.slot]}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ---------------- la tarjeta que manda ---------------- */

/** Qué te toca comer. Una sola opción, el nombre grande, tres datos y
    dos salidas. Sin descripción: la frase de color va en la ficha, acá
    lo único que importa es el nombre. */
export function ProximaComida({
  meal,
  slot,
  hora,
  onAlternativa,
  onAbrir,
  onComida,
}: {
  meal: Meal
  slot: Slot
  hora: string
  onAlternativa: () => void
  onAbrir: () => void
  onComida: () => void
}) {
  return (
    <Card aire="hero">
      <p className="t-caps text-ink-faint">
        {SLOT_LABEL[slot]} <span className="text-line-strong">·</span>{' '}
        <span className="t-num text-ink-soft">{hora}</span>
      </p>

      <h3 className="t-display mt-2 text-ink">{meal.name}</h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Pill tono={TONO_MOMENTO[SLOT_CATEGORY[slot]]}>{carbs(meal)} CH</Pill>
        {(meal.totalMinutes ?? meal.prepMinutes) > 0 && (
          <Pill>{meal.totalMinutes ?? meal.prepMinutes} min</Pill>
        )}
        {meal.portable && <Pill>para llevar</Pill>}
        {ORIGEN_CORTO[meal.origen] && <Pill>{ORIGEN_CORTO[meal.origen]}</Pill>}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAlternativa}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill border border-line px-2 text-[13.5px] font-semibold text-ink-soft transition-transform duration-150 active:scale-[0.98]"
        >
          <Icono name="cambiar" size={16} strokeWidth={1.8} />
          Cambiar esta comida
        </button>
        <button
          type="button"
          onClick={onAbrir}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill bg-lavanda px-2 text-[13.5px] font-semibold text-lavanda-ink transition-transform duration-150 active:scale-[0.98]"
        >
          {meal.origen === 'casera' ? 'Ver preparación' : 'Ver detalle'}
          <Icono name="flecha" size={16} strokeWidth={1.9} />
        </button>
      </div>

      {/* Marcarla es lo que hace posible saber qué comiste. Es una
          acción secundaria de verdad —gris, sin caja— pero con su línea
          propia y su ícono, no un texto suelto. */}
      <button
        type="button"
        onClick={onComida}
        className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-pill text-[13.5px] font-medium text-ink-faint active:bg-surface-2"
      >
        <Icono name="check" size={15} strokeWidth={2} />
        Ya comí esto
      </button>
    </Card>
  )
}

/* ---------------- lo que sigue ---------------- */

export function FilaProxima({
  meal,
  slot,
  hora,
  onClick,
}: {
  meal: Meal
  slot: Slot
  hora: string
  onClick: () => void
}) {
  const cat = SLOT_CATEGORY[slot]
  return (
    <CardButton aire="lista" onClick={onClick} label={`${SLOT_LABEL[slot]}: ${meal.name}`}>
      <div className="flex items-center gap-3">
        <Tile name={ICONO_MOMENTO[cat]} tono={TONO_MOMENTO[cat]} />
        <div className="min-w-0 flex-1">
          <p className="t-caps text-ink-faint">
            <span className="t-num">{hora}</span> <span className="text-line-strong">·</span>{' '}
            {SLOT_LABEL[slot]}
          </p>
          <p className="mt-1 text-[15.5px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {meal.name}
          </p>
          <p className="t-meta mt-1 text-ink-faint">{meta(meal)}</p>
        </div>
        <Icono name="flecha" size={17} className="shrink-0 text-ink-faint" />
      </div>
    </CardButton>
  )
}

/* ---------------- una comida en una lista ---------------- */

/** La fila de cualquier resultado: alternativas, búsquedas, snacks.
    Misma anatomía que la de arriba, sin la hora. */
export function FilaComida({
  meal,
  momento,
  estado,
  porOrigen = false,
  pie,
  onClick,
}: {
  meal: Meal
  momento?: Category
  estado?: MealStatus
  /** En una lista de resultados la baldosa dice de dónde sale, que es
      lo que distingue una fila de otra cuando todas son del mismo
      momento del día. */
  porOrigen?: boolean
  pie?: ReactNode
  onClick?: () => void
}) {
  const cat = momento ?? meal.category
  const hecha = estado === 'eaten' || estado === 'prepared'
  const baldosa = porOrigen
    ? TILE_ORIGEN[meal.origen]
    : { icono: ICONO_MOMENTO[cat], tono: TONO_MOMENTO[cat] }

  const cuerpo = (
    <>
      <div className="flex items-center gap-3">
        <Tile name={baldosa.icono} tono={baldosa.tono} />
        <div className="min-w-0 flex-1">
          <p className="text-[15.5px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {meal.name}
          </p>
          <p className="t-meta mt-1 text-ink-faint">{meta(meal)}</p>
        </div>
        {hecha ? (
          <Icono name="check" size={17} className="shrink-0 text-lavanda" strokeWidth={2.2} />
        ) : onClick ? (
          <Icono name="flecha" size={17} className="shrink-0 text-ink-faint" />
        ) : null}
      </div>
      {pie && <div className="mt-2 pl-[50px]">{pie}</div>}
    </>
  )

  return onClick ? (
    <CardButton aire="lista" onClick={onClick} label={meal.name}>
      {cuerpo}
    </CardButton>
  ) : (
    <Card aire="lista">{cuerpo}</Card>
  )
}
