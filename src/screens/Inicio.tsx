import { useMemo, useState } from 'react'
import type { Category, DayContext, Meal, Venue } from '../lib/types'
import { SLOT_CATEGORY, SLOT_LABEL, VENUES } from '../lib/types'
import type { Vianda } from '../lib/store'
import { findNext } from '../lib/domain'
import type { FiltroSnack, Pregunta } from '../lib/busquedas'
import { FILTRO_SNACK, PREGUNTA, alternativas, porLugar, responder, snacks } from '../lib/busquedas'
import { Card, CardButton, Chip, FilaChips, Icono, Sheet, Tile, TituloSeccion, Vacio } from '../components/base'
import type { IconName, Tono } from '../components/tokens'
import { FilaComida, FilaProxima, ProximaComida, TiraDelDia } from '../components/comida'
import { DetalleComida } from '../components/Detalle'
import { BarraAsistente, PanelAsistente } from '../components/Asistente'

/* ------------------------------------------------------------------
   INICIO

   Una sola pregunta manda esta pantalla: ¿qué como ahora?

   Todo lo demás es cómo cambiar esa respuesta cuando la respuesta no
   sirve —porque estás en la calle, porque no cocinaste, porque tenés
   ganas de algo dulce— y un vistazo a cómo viene el día.

   Los carbohidratos aparecen como un dato de cada comida, al lado del
   tiempo de preparación. No hay ningún número de salud arriba de todo:
   esta es una app de comida.
   ------------------------------------------------------------------ */

const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

const FECHA = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const fechaLarga = (d: Date) => mayus(FECHA.format(d))

/* ---------------- dónde estás ----------------

   Cambia lo que la app recomienda. En casa podés cocinar; en el trabajo
   tiene que haber viajado en la mochila; en la calle se compra. */

type Situacion = 'casa' | 'trabajo' | 'calle' | 'afuera'

const SITUACIONES: { id: Situacion; label: string; icono: IconName }[] = [
  { id: 'casa', label: 'En casa', icono: 'casa' },
  { id: 'trabajo', label: 'En el trabajo', icono: 'trabajo' },
  { id: 'calle', label: 'En la calle', icono: 'calle' },
  { id: 'afuera', label: 'Comiendo afuera', icono: 'afuera' },
]

/* Tres de las cuatro son el contexto del día y rearman lo que queda por
   comer. La cuarta no: «comiendo afuera» no cambia tu plan, abre la
   lista de lo que se pide en cada lugar. */
const CONTEXTO: Record<Exclude<Situacion, 'afuera'>, DayContext> = {
  casa: 'casa',
  trabajo: 'mixto',
  calle: 'calle',
}

/* ---------------- qué necesitás ---------------- */

const NECESIDADES: { id: Pregunta; label: string; icono: IconName; tono: Tono }[] = [
  { id: 'hambre', label: 'Tengo hambre ahora', icono: 'hambre', tono: 'coral' },
  { id: 'dulce', label: 'Quiero algo dulce', icono: 'dulce', tono: 'rosa' },
  { id: 'salado', label: 'Quiero algo salado', icono: 'salado', tono: 'mantequilla' },
  { id: 'snack', label: 'Necesito un snack', icono: 'manzana', tono: 'menta' },
  { id: 'rapido', label: 'Tengo poco tiempo', icono: 'rapido', tono: 'azul' },
  { id: 'sin-cocinar', label: 'No preparé nada', icono: 'heladera', tono: 'lavanda' },
]

const FILTROS_SNACK: FiltroSnack[] = ['llevar', 'dulces', 'salados', 'rapidos', 'sin-cocinar', 'trabajo']

/* ---------------- la hoja ---------------- */

type Hoja =
  | { tipo: 'lista'; titulo: string; bajada?: string; meals: Meal[]; elegir?: (m: Meal) => void }
  | { tipo: 'detalle'; meal: Meal }
  | { tipo: 'ayuda' }
  | null

export function Inicio({ app, onIr }: { app: Vianda; onIr: (tab: 'hoy' | 'comidas') => void }) {
  const [hoja, setHoja] = useState<Hoja>(null)
  const [situacion, setSituacion] = useState<Situacion>(() =>
    app.today?.context === 'calle' ? 'calle' : app.today?.context === 'casa' ? 'casa' : 'trabajo',
  )

  const hoy = new Date()
  const nombre = app.perfil.nombre.trim()
  const dia = app.today

  const proxima = useMemo(
    () => (dia ? findNext(dia, app.meals) : undefined),
    [dia, app.meals],
  )
  const catAhora: Category = proxima ? SLOT_CATEGORY[proxima.planned.slot] : 'snack'

  /* Las que vienen después de la que toca ahora. Tres alcanzan: más que
     eso ya es la pantalla del día entero, y para eso está el botón. */
  const siguen = useMemo(() => {
    if (!dia) return []
    const desde = proxima ? dia.meals.findIndex((m) => m.slot === proxima.planned.slot) + 1 : 0
    return dia.meals
      .slice(desde)
      .filter((m) => m.status !== 'eaten' && m.status !== 'skipped')
      .slice(0, 3)
  }, [dia, proxima])

  const verLista = (titulo: string, bajada: string | undefined, meals: Meal[], elegir?: (m: Meal) => void) =>
    setHoja({ tipo: 'lista', titulo, bajada, meals, elegir })

  const elegirSituacion = (s: Situacion) => {
    setSituacion(s)
    if (s === 'afuera') {
      verLista(
        'Comiendo afuera',
        'Elegí el lugar y mirá qué se pide ahí adentro.',
        porLugar(app.meals, 'restaurante', catAhora),
      )
      return
    }
    if (dia) app.setContext(dia.date, CONTEXTO[s])
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-32">
      <header className="v-safe-top pt-6 pb-4">
        <h1 className="v-head text-[22px] text-ink">{nombre ? `Hola, ${nombre}` : 'Hola'}</h1>
        <p className="mt-0.5 text-[15px] text-ink-faint">{fechaLarga(hoy)}</p>
      </header>

      {/* ================= TU DÍA =================
          Todo lo de acá arriba contesta las tres preguntas que se hace
          alguien que abre la app cinco segundos: qué como ahora, qué me
          queda, qué ya hice. Nada de esto depende de la ayuda. */}

      {dia && <TiraDelDia plan={dia.meals} ahoraSlot={proxima?.planned.slot} />}

      <section className="mt-6">
        <TituloSeccion>{proxima?.isNow ? 'Te toca ahora' : 'Tu próxima comida'}</TituloSeccion>
        {proxima ? (
          <ProximaComida
            meal={proxima.meal}
            slot={proxima.planned.slot}
            hora={proxima.planned.time}
            onAbrir={() => setHoja({ tipo: 'detalle', meal: proxima.meal })}
            onComida={() => app.setStatus(dia.date, proxima.planned.slot, 'eaten')}
            onAlternativa={() =>
              verLista(
                'Cambiar esta comida',
                `Otras opciones para ${SLOT_LABEL[proxima.planned.slot].toLowerCase()} de las ${proxima.planned.time}. Tocá una y queda puesta.`,
                alternativas(app.meals, SLOT_CATEGORY[proxima.planned.slot], proxima.meal.id),
                (m) => {
                  app.replaceMeal(dia.date, proxima.planned.slot, m.id)
                  setHoja(null)
                },
              )
            }
          />
        ) : (
          <Card>
            <Vacio
              icono="plato"
              titulo="Ya comiste todo lo del día"
              detalle="Mañana el plan se arma solo. Si te dio hambre igual, resolvelo más abajo."
            />
          </Card>
        )}
      </section>

      {/* LO QUE SIGUE HOY — obligatorio y a la vista, no detrás de un
          «ver el día». Es la pregunta que la pantalla no contestaba. */}
      {dia && (
        <section className="mt-6">
          <TituloSeccion>Lo que sigue hoy</TituloSeccion>
          {siguen.length ? (
            <>
              <ul className="space-y-2">
                {siguen.map((p) => {
                  const meal = app.mealById(p.mealId)
                  if (!meal) return null
                  return (
                    <li key={p.slot}>
                      <FilaProxima
                        meal={meal}
                        slot={p.slot}
                        hora={p.time}
                        onClick={() => setHoja({ tipo: 'detalle', meal })}
                      />
                    </li>
                  )
                })}
              </ul>
              <button
                type="button"
                onClick={() => onIr('hoy')}
                className="mt-3 w-full rounded-pill border border-line bg-surface px-4 py-3 text-[14.5px] font-bold text-lavanda active:bg-surface-2"
              >
                Ver todas las comidas de hoy
              </button>
            </>
          ) : (
            <Card padding="p-4">
              <p className="text-[15px] text-ink-soft">
                {proxima
                  ? 'Es la última comida del día.'
                  : 'No queda ninguna comida pendiente para hoy.'}
              </p>
            </Card>
          )}
        </section>
      )}

      {/* ================= HASTA ACÁ, EL PLAN =================
          Abajo de esta línea empieza otra cosa: cambiar lo que hay. La
          separación es a propósito y tiene que verse. */}
      <div className="v-rule mt-9 mb-7" />

      {/* CAMBIAR EL DÍA ENTERO */}
      <section>
        <TituloSeccion>¿Vas a comer en otro lugar?</TituloSeccion>
        <p className="mb-3 -mt-1 text-[14px] text-ink-faint">
          Cambia lo que te propone para el resto del día.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SITUACIONES.map((s) => {
            const activo = situacion === s.id
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={activo}
                onClick={() => elegirSituacion(s.id)}
                className={`flex items-center gap-2.5 rounded-[var(--radius-hero)] p-3 text-left shadow-sm transition-transform duration-150 active:scale-[0.985] ${
                  activo ? 'bg-lavanda text-lavanda-ink' : 'bg-surface text-ink'
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-[var(--radius-tile)] ${
                    activo ? 'bg-white/20 text-lavanda-ink' : 'bg-lavanda-tenue text-lavanda'
                  }`}
                >
                  <Icono name={s.icono} size={19} strokeWidth={1.9} />
                </span>
                <span className="v-head text-[14.5px] leading-tight">{s.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* RESOLVER UNA EXCEPCIÓN */}
      <section className="mt-7">
        <TituloSeccion chispa>¿Querés cambiar o resolver algo?</TituloSeccion>

        {/* La misma pregunta de la sección, pero escrita. Va arriba de
            los atajos porque es la que cubre lo que los atajos no:
            «tengo yogur y avena», «estoy en una panadería». */}
        <BarraAsistente onAbrir={() => setHoja({ tipo: 'ayuda' })} />

        <div className="grid grid-cols-2 gap-3">
          {NECESIDADES.map((n) => (
            <CardButton
              key={n.id}
              padding="p-3.5"
              onClick={() =>
                verLista(
                  PREGUNTA[n.id].titulo,
                  PREGUNTA[n.id].bajada,
                  responder(n.id, app.meals, catAhora),
                )
              }
              label={n.label}
            >
              <Tile name={n.icono} tono={n.tono} size={38} icon={20} />
              <p className="v-head mt-2.5 text-[15px] leading-tight text-ink">{n.label}</p>
            </CardButton>
          ))}
        </div>
      </section>

      {/* ACCESOS SECUNDARIOS */}
      <section className="mt-7">
        <TituloSeccion>Comer afuera</TituloSeccion>
        <p className="mb-3 -mt-1 text-[14px] text-ink-faint">
          Qué pedir en cada lugar, con el número de cada cosa.
        </p>
        <FilaChips label="Lugares para comer afuera">
          {VENUES.map((v: Venue) => (
            <Chip
              key={v}
              icono="lugar"
              onClick={() =>
                verLista(
                  mayus(v),
                  'Lo que se pide acá, ordenado por lo que más se come.',
                  porLugar(app.meals, v, catAhora),
                )
              }
            >
              {mayus(v)}
            </Chip>
          ))}
        </FilaChips>
      </section>


      <section className="mt-7">
        <TituloSeccion
          accion={{
            label: 'Ver todos',
            onClick: () =>
              verLista('Snacks', 'Todo lo que entra entre comidas.', snacks(app.meals, 'llevar', 30)),
          }}
        >
          Snacks
        </TituloSeccion>
        <FilaChips label="Tipos de snack">
          {FILTROS_SNACK.map((f) => (
            <Chip
              key={f}
              onClick={() =>
                verLista(
                  `Snacks · ${FILTRO_SNACK[f].toLowerCase()}`,
                  undefined,
                  snacks(app.meals, f),
                )
              }
            >
              {FILTRO_SNACK[f]}
            </Chip>
          ))}
        </FilaChips>
      </section>

      {/* ---------------- la hoja de respuestas ---------------- */}
      <Sheet
        abierta={hoja !== null}
        onCerrar={() => setHoja(null)}
        titulo={
          hoja?.tipo === 'detalle'
            ? hoja.meal.name
            : hoja?.tipo === 'ayuda'
              ? 'Decime qué necesitás'
              : (hoja?.titulo ?? '')
        }
        bajada={
          hoja?.tipo === 'lista'
            ? hoja.bajada
            : hoja?.tipo === 'ayuda'
              ? 'Escribilo como lo dirías. Te contesto con comidas de la biblioteca.'
              : undefined
        }
      >
        {hoja?.tipo === 'ayuda' && (
          <PanelAsistente
            meals={app.meals}
            momento={catAhora}
            onComida={(m) => setHoja({ tipo: 'detalle', meal: m })}
            onCambiarContexto={(ctx) => {
              if (dia) app.setContext(dia.date, ctx)
              setSituacion(ctx === 'calle' ? 'calle' : ctx === 'casa' ? 'casa' : 'trabajo')
              setHoja(null)
            }}
          />
        )}
        {hoja?.tipo === 'detalle' && <DetalleComida meal={hoja.meal} />}
        {hoja?.tipo === 'lista' &&
          (hoja.meals.length ? (
            <ul className="space-y-2">
              {hoja.meals.map((m) => (
                <li key={m.id}>
                  <FilaComida
                    meal={m}
                    porOrigen
                    onClick={() =>
                      hoja.elegir ? hoja.elegir(m) : setHoja({ tipo: 'detalle', meal: m })
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <Card>
              <Vacio
                icono="plato"
                titulo="Todavía no hay nada acá"
                detalle="La biblioteca se sigue llenando. Probá con otra opción."
              />
            </Card>
          ))}
      </Sheet>
    </div>
  )
}
