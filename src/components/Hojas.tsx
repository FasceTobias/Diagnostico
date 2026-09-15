import type { Meal, Slot } from '../lib/types'
import { SLOT_CATEGORY, SLOT_LABEL } from '../lib/types'
import type { Vianda } from '../lib/store'
import type { Category } from '../lib/types'
import { alternativas } from '../lib/busquedas'
import { Card, Icono, Sheet, Vacio } from './base'
import { FilaComida } from './comida'
import { DetalleComida } from './Detalle'
import { PanelAsistente } from './Asistente'

/* ------------------------------------------------------------------
   LAS HOJAS

   Todo lo que sube desde abajo, en un solo lugar. Inicio y Hoy abren
   las mismas cuatro cosas —una lista, una ficha, la ayuda, el registro—
   y no tiene sentido que cada pantalla las arme por su cuenta: si
   estuvieran duplicadas, en un mes serían distintas.
   ------------------------------------------------------------------ */

export type Hoja =
  | { tipo: 'lista'; titulo: string; bajada?: string; meals: Meal[]; elegir?: (m: Meal) => void }
  /** La ficha de una comida. Con `slot`, además se puede cambiar. */
  | { tipo: 'detalle'; meal: Meal; slot?: Slot }
  | { tipo: 'ayuda' }
  /** Registrar qué se comió de verdad. Opcional: el día avanza igual. */
  | { tipo: 'registrar'; slot: Slot; meal: Meal }
  | null

export function Hojas({
  hoja,
  setHoja,
  app,
  momento,
}: {
  hoja: Hoja
  setHoja: (h: Hoja) => void
  app: Vianda
  /** El momento del día, para que la ayuda ordene sin que se lo pidan. */
  momento: Category
}) {
  const dia = app.today

  const titulo =
    hoja?.tipo === 'detalle'
      ? hoja.meal.name
      : hoja?.tipo === 'ayuda'
        ? 'Decime qué necesitás'
        : hoja?.tipo === 'registrar'
          ? `Qué comiste de ${SLOT_LABEL[hoja.slot].toLowerCase()}`
          : (hoja?.titulo ?? '')

  const bajada =
    hoja?.tipo === 'lista'
      ? hoja.bajada
      : hoja?.tipo === 'ayuda'
        ? 'Escribilo como lo dirías. Te contesto con comidas de la biblioteca.'
        : hoja?.tipo === 'registrar'
          ? 'Sólo si querés que quede anotado. La app sigue sola igual.'
          : undefined

  /** Poner una comida en un lugar del día. Es lo mismo cambiarla antes
      de comerla que registrar que comiste otra cosa: en los dos casos
      esa comida pasa a ser la del día. La diferencia es si además queda
      marcada como comida. */
  const poner = (slot: Slot, meal: Meal, comida: boolean) => {
    if (!dia) return
    app.replaceMeal(dia.date, slot, meal.id)
    if (comida) app.setStatus(dia.date, slot, 'eaten')
    setHoja(null)
  }

  return (
    <Sheet abierta={hoja !== null} onCerrar={() => setHoja(null)} titulo={titulo} bajada={bajada}>
      {hoja?.tipo === 'ayuda' && (
        <PanelAsistente
          meals={app.meals}
          momento={momento}
          onComida={(m) => setHoja({ tipo: 'detalle', meal: m })}
          onCambiarContexto={(ctx) => {
            if (dia) app.setContext(dia.date, ctx)
            setHoja(null)
          }}
        />
      )}

      {hoja?.tipo === 'detalle' && (
        <DetalleComida
          meal={hoja.meal}
          esFavorita={app.prefs.likes.includes(hoja.meal.id)}
          enCompras={app.esExtra(hoja.meal.id)}
          onFavorita={() => app.toggleFavorita(hoja.meal.id)}
          onCompras={() => app.toggleExtra(hoja.meal.id)}
          onCambiar={
            hoja.slot
              ? () =>
                  setHoja({
                    tipo: 'lista',
                    titulo: 'Cambiar esta comida',
                    bajada: `Otras opciones para ${SLOT_LABEL[hoja.slot!].toLowerCase()}. Tocá una y queda puesta.`,
                    meals: alternativas(app.meals, SLOT_CATEGORY[hoja.slot!], hoja.meal.id),
                    elegir: (m) => poner(hoja.slot!, m, false),
                  })
              : undefined
          }
        />
      )}

      {hoja?.tipo === 'registrar' && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              if (dia) app.setStatus(dia.date, hoja.slot, 'eaten')
              setHoja(null)
            }}
            className="flex w-full items-center gap-3 rounded-[var(--radius-card)] bg-surface p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-lavanda-tenue text-lavanda">
              <Icono name="check" size={18} strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14.5px] font-semibold text-ink">
                Comí lo que estaba
              </span>
              <span className="t-meta block text-ink-faint">{hoja.meal.name}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setHoja({
                tipo: 'lista',
                titulo: 'Comí otra cosa',
                bajada: 'Elegila de la biblioteca y queda anotada en este lugar del día.',
                meals: alternativas(app.meals, SLOT_CATEGORY[hoja.slot], hoja.meal.id, 40),
                elegir: (m) => poner(hoja.slot, m, true),
              })
            }
            className="flex w-full items-center gap-3 rounded-[var(--radius-card)] bg-surface p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-lavanda-tenue text-lavanda">
              <Icono name="cambiar" size={18} strokeWidth={1.9} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14.5px] font-semibold text-ink">Comí otra cosa</span>
              <span className="t-meta block text-ink-faint">Buscala en la biblioteca</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (dia) app.setStatus(dia.date, hoja.slot, 'skipped')
              setHoja(null)
            }}
            className="flex h-11 w-full items-center justify-center rounded-pill text-[13.5px] font-medium text-ink-faint active:bg-surface-2"
          >
            Me la salteé
          </button>

          <p className="t-meta px-1 pt-1 text-ink-faint">
            Escribir una comida a mano, cambiar la cantidad o corregir los carbohidratos todavía no
            está: hoy sólo se puede elegir de la biblioteca.
          </p>
        </div>
      )}

      {hoja?.tipo === 'lista' &&
        (hoja.meals.length ? (
          <ul className="space-y-3">
            {hoja.meals.map((m) => (
              <li key={m.id}>
                <FilaComida
                  meal={m}
                  porOrigen
                  onClick={() => (hoja.elegir ? hoja.elegir(m) : setHoja({ tipo: 'detalle', meal: m }))}
                />
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <Vacio
              icono="plato"
              titulo="No encontré nada con eso"
              detalle="Puede que falte esa comida en la biblioteca. Probá con otra opción."
            />
          </Card>
        ))}
    </Sheet>
  )
}
