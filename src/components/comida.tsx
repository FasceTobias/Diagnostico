import type { Category, Meal, MealStatus, PlannedMeal, Slot } from '../lib/types'
import { SLOT_CATEGORY } from '../lib/types'
import { ORIGEN_CORTO, ORIGEN_LABEL, SLOT_LABEL } from '../lib/types'
import { Card, CardButton, Icono, Pill, Tile } from './base'
import { ICONO_MOMENTO, TILE_ORIGEN, TONO_MOMENTO, carbs } from './tokens'

/* ------------------------------------------------------------------
   COMIDA

   Las piezas que muestran una comida. Todas dicen lo mismo y en el
   mismo orden —qué es, cuántos carbohidratos, cuánto tarda, de dónde
   sale— para que leer una comida se aprenda una vez.

   Sobre los carbohidratos: son un dato de la comida, como el tiempo de
   preparación. Van en la misma línea que el resto y con la tilde
   adelante cuando son estimados, que hoy son todos. La app no es un
   contador: es una app de comida que además te dice ese número.
   ------------------------------------------------------------------ */

/** La línea de datos de una comida: los carbohidratos, el tiempo y de
    dónde sale. Corta, siempre igual, siempre en ese orden. */
export function MetaComida({ meal, className = '' }: { meal: Meal; className?: string }) {
  /* En una fila el tiempo es uno solo, el de reloj. La diferencia entre
     activo y total es un dato de la ficha, no de una lista que se lee
     de reojo. */
  const minutos = meal.totalMinutes ?? meal.prepMinutes
  const partes = [
    `${carbs(meal)} CH`,
    minutos > 0 ? `${minutos} min` : null,
    ORIGEN_CORTO[meal.origen] || null,
  ].filter(Boolean)

  return <p className={`text-[13.5px] text-ink-faint ${className}`}>{partes.join(' · ')}</p>
}

/* ---------------- la fila de una comida ---------------- */

/** Una comida dentro de una lista. Es la pieza que más se repite en la
    app: en «Hoy», en las alternativas, en los resultados de cualquier
    búsqueda. Por eso es una sola. */
export function FilaComida({
  meal,
  momento,
  hora,
  estado,
  porOrigen = false,
  onClick,
}: {
  meal: Meal
  /** Para qué momento se está mostrando. Si falta, usa el suyo. */
  momento?: Category
  hora?: string
  estado?: MealStatus
  /** En una lista de resultados la baldosa muestra de dónde sale, que
      es lo que distingue una fila de otra cuando todas son del mismo
      momento. */
  porOrigen?: boolean
  onClick?: () => void
}) {
  const cat = momento ?? meal.category
  const hecha = estado === 'eaten' || estado === 'prepared'
  const baldosa = porOrigen
    ? TILE_ORIGEN[meal.origen]
    : { icono: ICONO_MOMENTO[cat], tono: TONO_MOMENTO[cat] }

  const cuerpo = (
    <div className="flex items-center gap-3">
      <Tile name={baldosa.icono} tono={baldosa.tono} size={42} icon={22} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          {hora && (
            <span className="v-tnum shrink-0 text-[13px] font-bold text-ink-faint">{hora}</span>
          )}
          <p className="v-head text-[15.5px] leading-tight text-ink">{meal.name}</p>
        </div>
        <MetaComida meal={meal} className="mt-1" />
      </div>
      {hecha ? (
        <Icono name="check" size={20} className="shrink-0 text-menta-ink" strokeWidth={2.4} />
      ) : onClick ? (
        <Icono name="flecha" size={19} className="shrink-0 text-ink-faint" />
      ) : null}
    </div>
  )

  return onClick ? (
    <CardButton padding="p-3.5" onClick={onClick} label={meal.name}>
      {cuerpo}
    </CardButton>
  ) : (
    <Card padding="p-3.5">{cuerpo}</Card>
  )
}

/* ---------------- la próxima comida ---------------- */

/** La tarjeta de arriba de todo, y la razón por la que alguien abre la
    app: qué te toca comer ahora. Una sola opción, con nombre y número,
    y un botón para ver otra. Elegir entre veinte no es ayudar. */
export function ProximaComida({
  meal,
  slot,
  hora,
  ahora,
  onAlternativa,
  onAbrir,
}: {
  meal: Meal
  slot: Slot
  hora: string
  /** Es el momento de comerla, no una que viene más tarde. */
  ahora: boolean
  onAlternativa: () => void
  onAbrir: () => void
}) {
  return (
    <Card padding="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="v-label text-ink-faint">{ahora ? 'Te toca ahora' : 'Próxima comida'}</p>
        <div className="flex items-center gap-2">
          <Pill tono={TONO_MOMENTO[meal.category]}>{SLOT_LABEL[slot]}</Pill>
          <span className="v-tnum text-[15px] font-extrabold text-ink">{hora}</span>
        </div>
      </div>

      <h2 className="v-head mt-3 text-[26px] leading-[1.15] text-ink">{meal.name}</h2>
      {meal.description && (
        <p className="mt-1.5 text-[14.5px] leading-snug text-ink-soft">{meal.description}</p>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <Pill tono="neutro">{carbs(meal)} de carbohidratos</Pill>
        {(meal.totalMinutes ?? meal.prepMinutes) > 0 && (
          <Pill tono="neutro">{meal.totalMinutes ?? meal.prepMinutes} min</Pill>
        )}
        {meal.portable && <Pill tono="neutro">para llevar</Pill>}
        {meal.origen !== 'casera' && <Pill tono="neutro">{ORIGEN_LABEL[meal.origen].toLowerCase()}</Pill>}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAlternativa}
          className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill bg-lavanda-tenue px-3 text-[15px] font-extrabold text-lavanda transition-transform duration-150 active:scale-[0.97]"
        >
          <Icono name="cambiar" size={18} strokeWidth={2} />
          Otra opción
        </button>
        <button
          type="button"
          onClick={onAbrir}
          className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill bg-lavanda px-3 text-[15px] font-extrabold text-lavanda-ink shadow-sm transition-transform duration-150 active:scale-[0.97]"
        >
          Ver comida
          <Icono name="flecha" size={18} strokeWidth={2} />
        </button>
      </div>
    </Card>
  )
}

/* ---------------- el día ---------------- */

/** El plan del día, como lista. No es un resumen de números: son las
    comidas, con su hora y su estado. */
export function ResumenDelDia({
  plan,
  mealById,
  ahoraSlot,
  onComida,
}: {
  plan: PlannedMeal[]
  mealById: (id: string) => Meal | undefined
  ahoraSlot?: Slot
  onComida: (slot: Slot) => void
}) {
  return (
    <ul className="space-y-2">
      {plan.map((p) => {
        const meal = mealById(p.mealId)
        if (!meal) return null
        return (
          <li key={p.slot} className="relative">
            <FilaComida
              meal={meal}
              momento={SLOT_CATEGORY[p.slot]}
              hora={p.time}
              estado={p.status}
              onClick={() => onComida(p.slot)}
            />
            {p.slot === ahoraSlot && (
              <span className="pointer-events-none absolute -left-1 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-lavanda" />
            )}
          </li>
        )
      })}
    </ul>
  )
}
