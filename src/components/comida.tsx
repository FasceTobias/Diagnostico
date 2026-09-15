import type { ReactNode } from 'react'
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
  pie,
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
  /** Una línea extra abajo de la fila: lo que falta para hacerla, por
      ejemplo. Va adentro de la misma tarjeta y no en otra. */
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
    {pie && <div className="mt-2 pl-[54px]">{pie}</div>}
    </>
  )

  return onClick ? (
    <CardButton padding="p-3.5" onClick={onClick} label={meal.name}>
      {cuerpo}
    </CardButton>
  ) : (
    <Card padding="p-3.5">{cuerpo}</Card>
  )
}

/* ---------------- la tira del día ----------------

   Lo primero que se lee, y en un segundo: por dónde vas. Sin esto hay
   que entrar a otra pantalla para saber si te queda la cena, que es
   justo lo que nadie va a hacer con el celular en una mano. */

/* En la tira no entra «Media mañana» sin partirse en dos líneas, y una
   tira despareja deja de leerse de un vistazo, que es su único trabajo. */
const TIRA_LABEL: Record<Slot, string> = {
  breakfast: 'Desayuno',
  snack_am: 'Mañana',
  lunch: 'Almuerzo',
  snack_pm: 'Tarde',
  merienda: 'Merienda',
  dinner: 'Cena',
}

export function TiraDelDia({
  plan,
  ahoraSlot,
}: {
  plan: PlannedMeal[]
  ahoraSlot?: Slot
}) {
  const hechas = plan.filter((p) => p.status === 'eaten').length
  const faltan = plan.filter((p) => p.status !== 'eaten' && p.status !== 'skipped').length

  return (
    <Card padding="p-4">
      <p className="v-head text-[16px] text-ink">
        {faltan === 0
          ? 'Ya comiste todo lo del día'
          : faltan === 1
            ? 'Te queda 1 comida hoy'
            : `Te quedan ${faltan} comidas hoy`}
        {hechas > 0 && (
          <span className="font-semibold text-ink-faint">
            {' '}· {hechas} {hechas === 1 ? 'hecha' : 'hechas'}
          </span>
        )}
      </p>

      <ol className="mt-3 flex items-start justify-between gap-1">
        {plan.map((p) => {
          const hecha = p.status === 'eaten'
          const saltada = p.status === 'skipped'
          const ahora = p.slot === ahoraSlot
          return (
            <li key={p.slot} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span
                className={`grid size-5 place-items-center rounded-full ${
                  hecha
                    ? 'bg-menta-tenue text-menta-ink'
                    : ahora
                      ? 'bg-lavanda text-lavanda-ink'
                      : 'border-[1.5px] border-line-strong'
                }`}
              >
                {hecha && <Icono name="check" size={12} strokeWidth={3} />}
                {ahora && <span className="size-1.5 rounded-full bg-lavanda-ink" />}
              </span>
              <span
                className={`w-full text-center text-[10px] leading-tight ${
                  ahora
                    ? 'font-extrabold text-lavanda'
                    : hecha
                      ? 'font-semibold text-menta-ink'
                      : saltada
                        ? 'font-semibold text-ink-faint line-through'
                        : 'font-semibold text-ink-faint'
                }`}
              >
                {TIRA_LABEL[p.slot]}
              </span>
              {/* La línea existe siempre, con o sin texto: si apareciera
                  sólo en la activa, esa columna quedaría más alta que las
                  otras cinco. */}
              <span className="h-[13px] text-[10px] font-extrabold leading-[13px] text-lavanda">
                {ahora ? 'ahora' : ''}
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

/* ---------------- lo que sigue ----------------

   Una fila más explícita que la de una lista cualquiera: la hora y el
   momento arriba, el nombre abajo, el número al final. Los cinco datos
   que hacen falta para saber si eso te sirve, sin abrir nada. */

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
    <CardButton padding="p-3.5" onClick={onClick} label={`${SLOT_LABEL[slot]}: ${meal.name}`}>
      <div className="flex items-center gap-3">
        <Tile name={ICONO_MOMENTO[cat]} tono={TONO_MOMENTO[cat]} size={42} icon={22} />
        <div className="min-w-0 flex-1">
          <p className="v-label-sm text-ink-faint">
            <span className="v-tnum">{hora}</span> · {SLOT_LABEL[slot].toUpperCase()}
          </p>
          <p className="v-head mt-0.5 text-[15.5px] leading-tight text-ink">{meal.name}</p>
          <p className="mt-1 text-[13.5px] text-ink-faint">
            {carbs(meal)} CH
            {(meal.totalMinutes ?? meal.prepMinutes) > 0 &&
              ` · ${meal.totalMinutes ?? meal.prepMinutes} min`}
          </p>
        </div>
        <Icono name="flecha" size={19} className="shrink-0 text-ink-faint" />
      </div>
    </CardButton>
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
    <Card padding="p-5">
      <div className="flex items-center gap-2">
        <Pill tono={TONO_MOMENTO[SLOT_CATEGORY[slot]]}>{SLOT_LABEL[slot]}</Pill>
        <span className="v-tnum text-[15px] font-extrabold text-ink">{hora}</span>
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

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={onAlternativa}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-pill bg-lavanda-tenue px-3 text-[15px] font-extrabold text-lavanda transition-transform duration-150 active:scale-[0.98]"
        >
          <Icono name="cambiar" size={18} strokeWidth={2} />
          Cambiar esta comida
        </button>
        <button
          type="button"
          onClick={onAbrir}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-pill bg-lavanda px-3 text-[15px] font-extrabold text-lavanda-ink shadow-sm transition-transform duration-150 active:scale-[0.98]"
        >
          {meal.origen === 'casera' ? 'Ver preparación' : 'Ver detalle'}
          <Icono name="flecha" size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Sin esto, «qué comidas ya hice» no se puede contestar: la app
          no tiene forma de saberlo. Va abajo y en voz baja, porque es
          la acción que menos apura. */}
      <button
        type="button"
        onClick={onComida}
        className="mt-2 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-pill text-[14.5px] font-bold text-ink-faint active:bg-surface-2"
      >
        <Icono name="check" size={17} strokeWidth={2.2} />
        Ya comí esto
      </button>
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
