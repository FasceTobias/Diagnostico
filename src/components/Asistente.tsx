import { useEffect, useRef, useState } from 'react'
import type { Category, DayContext, Meal } from '../lib/types'
import type { Respuesta } from '../lib/asistente'
import { EJEMPLOS, preguntar } from '../lib/asistente'
import { ingredientText } from '../lib/foods'
import { Card, Chip, FilaChips, Icono, Pill, Vacio } from './base'
import { FilaComida } from './comida'

/* ------------------------------------------------------------------
   LA AYUDA

   Dos piezas y ninguna más: una línea en Inicio que no molesta, y una
   hoja que sube cuando la tocás.

   Lo que esto NO es: un chat. No hay burbujas, no hay historial, no hay
   nadie escribiendo puntos suspensivos. Escribís una frase y abajo
   aparecen comidas de verdad, con su número, tocables. La conversación
   más larga que puede pasar acá son dos toques: preguntar y afinar.

   Y siempre dice qué entendió antes de mostrar nada. Si se equivocó, se
   corrige con un chip en vez de reescribir la frase entera.
   ------------------------------------------------------------------ */

/* ---------------- la línea en Inicio ---------------- */

/** Un campo que no es un campo: es un botón con cara de campo. Abre la
    hoja con el teclado ya levantado, que es lo que la gente espera. */
export function BarraAsistente({ onAbrir }: { onAbrir: () => void }) {
  return (
    <button
      type="button"
      onClick={onAbrir}
      className="mb-3 flex w-full items-center gap-2.5 rounded-pill bg-surface px-4 py-3 text-left shadow-sm transition-transform duration-150 active:scale-[0.99]"
    >
      <Icono name="chispa" size={17} className="shrink-0 text-lavanda" />
      <span className="flex-1 truncate text-[15px] font-semibold text-ink-faint">
        Decime qué necesitás o qué tenés
      </span>
    </button>
  )
}

/* ---------------- la hoja ---------------- */

export function PanelAsistente({
  meals,
  momento,
  textoInicial = '',
  onComida,
  onCambiarContexto,
}: {
  meals: Meal[]
  /** El momento del día en el que está, para ordenar sin que lo pidan. */
  momento: Category
  textoInicial?: string
  onComida: (meal: Meal) => void
  onCambiarContexto: (ctx: DayContext) => void
}) {
  const [texto, setTexto] = useState(textoInicial)
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
  const campo = useRef<HTMLInputElement>(null)
  const arriba = useRef<HTMLDivElement>(null)

  useEffect(() => {
    campo.current?.focus()
  }, [])

  const preguntarPor = (frase: string) => {
    setTexto(frase)
    setRespuesta(preguntar(frase, meals, momento))
    /* Una respuesta nueva empieza arriba. Sin esto quedás mirando la
       mitad de la lista anterior y parece que no pasó nada. */
    requestAnimationFrame(() => arriba.current?.scrollIntoView({ block: 'start' }))
  }

  /* Afinar es agregarle una condición a lo que ya dijo, no empezar de
     cero: «algo salado» + «en 10 minutos» sigue siendo salado. */
  const afinar = (extra: string) => preguntarPor(`${texto} ${extra}`.trim())

  return (
    <div className="space-y-4">
      <div ref={arriba} className="scroll-mt-2" />
      <form
        onSubmit={(ev) => {
          ev.preventDefault()
          if (texto.trim()) preguntarPor(texto.trim())
        }}
        className="flex items-center gap-2 rounded-pill bg-surface px-4 py-2 shadow-sm"
      >
        <Icono name="chispa" size={17} className="shrink-0 text-lavanda" />
        <input
          ref={campo}
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          placeholder="Tengo hambre y estoy en el trabajo"
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
        />
        {texto && (
          <button
            type="submit"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-lavanda text-lavanda-ink"
            aria-label="Buscar"
          >
            <Icono name="flecha" size={17} strokeWidth={2.2} />
          </button>
        )}
      </form>

      {/* Sin pregunta todavía: los ejemplos son los que de verdad se
          escriben, y se tocan en vez de tipearse. */}
      {!respuesta && (
        <div>
          <p className="mb-2 px-1 text-[13.5px] text-ink-faint">Por ejemplo</p>
          <div className="flex flex-wrap gap-2">
            {EJEMPLOS.map((e) => (
              <Chip key={e} onClick={() => preguntarPor(e)}>
                {e}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {respuesta && <Resultado r={respuesta} onComida={onComida} onCambiarContexto={onCambiarContexto} onAfinar={afinar} />}
    </div>
  )
}

/* ---------------- la respuesta ---------------- */

function Resultado({
  r,
  onComida,
  onCambiarContexto,
  onAfinar,
}: {
  r: Respuesta
  onComida: (meal: Meal) => void
  onCambiarContexto: (ctx: DayContext) => void
  onAfinar: (extra: string) => void
}) {
  if (r.sinEntender) {
    return (
      <Card>
        <Vacio
          icono="chispa"
          titulo="No entendí eso"
          detalle="Probá con un momento del día, un lugar, cuánto tiempo tenés o qué ingredientes hay en tu casa."
        />
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Qué entendió. Va primero y en una línea: es lo que permite
          corregir en un toque en vez de pelearse con la caja. */}
      <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] bg-lavanda-tenue px-4 py-3">
        <Icono name="chispa" size={16} className="mt-0.5 shrink-0 text-lavanda" />
        <p className="text-[14px] font-semibold leading-snug text-lavanda">{r.resumen}</p>
      </div>

      {/* Cuando el pedido es de todo el día, el arreglo de fondo es el
          contexto y no un plato suelto. */}
      {r.cambiarA && (
        <Card padding="p-4">
          <p className="text-[14.5px] leading-snug text-ink-soft">
            Si es por todo el día, te rearmo lo que queda con ese criterio.
          </p>
          <button
            type="button"
            onClick={() => onCambiarContexto(r.cambiarA!)}
            className="mt-3 inline-flex min-h-[42px] items-center gap-2 rounded-pill bg-lavanda px-4 text-[14.5px] font-extrabold text-lavanda-ink active:scale-[0.97]"
          >
            <Icono name="cambiar" size={17} strokeWidth={2} />
            Pasar el día a{' '}
            {r.cambiarA === 'calle' ? '«en la calle»' : r.cambiarA === 'casa' ? '«en casa»' : '«mixto»'}
          </button>
        </Card>
      )}

      {r.opciones.length ? (
        <ul className="space-y-2">
          {r.opciones.map(({ meal, faltan }) => (
            <li key={meal.id}>
              <FilaComida
                meal={meal}
                porOrigen
                onClick={() => onComida(meal)}
                pie={
                  faltan.length ? (
                    <span className="flex flex-wrap items-center gap-1.5">
                      <Pill tono="mantequilla">
                        te falta{' '}
                        {faltan
                          .map((f) => {
                            const ing = meal.ingredients.find((i) => i.item === f)!
                            return ingredientText(ing.item, ing.qty, ing.unit)
                          })
                          .join(' y ')}
                      </Pill>
                    </span>
                  ) : undefined
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Vacio
            icono="plato"
            titulo="No encontré nada con eso"
            detalle="Puede que el pedido sea muy específico, o que todavía falte esa comida en la biblioteca. Probá aflojando una condición."
          />
        </Card>
      )}

      {/* Afinar sin volver a escribir. */}
      {r.ajustes.length > 0 && (
        <div className="pt-1">
          <p className="mb-2 px-1 text-[13.5px] text-ink-faint">¿No era esto?</p>
          <FilaChips label="Ajustar la búsqueda">
            {r.ajustes.map((a) => (
              <Chip key={a.label} onClick={() => onAfinar(a.texto)}>
                {a.label}
              </Chip>
            ))}
          </FilaChips>
        </div>
      )}
    </div>
  )
}
