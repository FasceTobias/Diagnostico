import { useState } from 'react'
import type { Category, DayContext, Meal, Venue } from '../lib/types'
import { CONTEXT_LABEL, CONTEXT_NOTE, SLOT_CATEGORY, SLOT_LABEL, VENUES } from '../lib/types'
import type { Vianda } from '../lib/store'
import { comidaActual, comidasDelDia } from '../lib/dia'
import { packListFor } from '../lib/domain'
import type { Tab } from '../components/Nav'
import type { FiltroSnack, Pregunta } from '../lib/busquedas'
import { FILTRO_SNACK, PREGUNTA, alternativas, porLugar, responder, snacks } from '../lib/busquedas'
import { Card, Chip, FilaChips, Icono, Rotulo, TituloSeccion, Vacio } from '../components/base'
import type { IconName } from '../components/tokens'
import { FilaProxima, ProximaComida, TiraDelDia } from '../components/comida'
import { Hojas, type Hoja } from '../components/Hojas'
import { ContextSwitch } from '../components/ui'
import { BarraAsistente } from '../components/Asistente'
import { isoDate, parseIso } from '../lib/format'

/* ------------------------------------------------------------------
   INICIO

   Dos mitades, y la línea que las separa es el orden de la pantalla.

   Arriba, TU DÍA: cómo viene, qué comés ahora, qué sigue. Se lee sin
   tocar nada y no depende de la ayuda.

   Abajo, CAMBIARLO: dónde vas a comer, los atajos y la caja de texto.
   Es lo que hacés cuando el plan no sirve.

   El ritmo vertical es siempre el mismo —32 entre secciones, 16 del
   título a su contenido, 12 entre tarjetas hermanas— porque el problema
   que tenía esta pantalla no era de contenido: era que cada bloque
   respiraba distinto y se sentía armada de a pedazos.
   ------------------------------------------------------------------ */

const mayus = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

const FECHA = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const fechaLarga = (d: Date) => mayus(FECHA.format(d)).replace(',', '')

/* ---------------- dónde vas a comer ---------------- */

type Situacion = 'casa' | 'trabajo' | 'calle' | 'afuera'

const SITUACIONES: { id: Situacion; label: string; icono: IconName }[] = [
  { id: 'casa', label: 'En casa', icono: 'casa' },
  { id: 'trabajo', label: 'En el trabajo', icono: 'trabajo' },
  { id: 'calle', label: 'En la calle', icono: 'calle' },
  { id: 'afuera', label: 'Comiendo afuera', icono: 'afuera' },
]

/* Tres de las cuatro son el contexto del día y rearman lo que queda por
   comer. La cuarta abre la lista de lo que se pide en cada lugar. */
const CONTEXTO: Record<Exclude<Situacion, 'afuera'>, DayContext> = {
  casa: 'casa',
  trabajo: 'mixto',
  calle: 'calle',
}

/* ---------------- los atajos ----------------

   Etiquetas de dos palabras. El nombre largo de cada pregunta vive en
   el título de la hoja que abre, que es donde hay lugar para leerlo.

   Todas las baldosas en lavanda: seis pasteles distintos uno al lado
   del otro no era un sistema de color, era un arcoíris. */

const ATAJOS: { id: Pregunta; label: string; icono: IconName }[] = [
  { id: 'hambre', label: 'Tengo hambre', icono: 'hambre' },
  { id: 'dulce', label: 'Algo dulce', icono: 'dulce' },
  { id: 'salado', label: 'Algo salado', icono: 'salado' },
  { id: 'snack', label: 'Un snack', icono: 'manzana' },
  { id: 'rapido', label: 'Poco tiempo', icono: 'rapido' },
  { id: 'sin-cocinar', label: 'No preparé nada', icono: 'heladera' },
]

const FILTROS_SNACK: FiltroSnack[] = ['llevar', 'dulces', 'salados', 'rapidos', 'sin-cocinar', 'trabajo']

/** Una tarjeta chica de una sola línea: el ícono a la izquierda y la
    palabra al lado. Es la misma en las dos grillas de abajo, y por eso
    las dos terminan a la misma altura. */
function Celda({
  label,
  icono,
  activo = false,
  onClick,
}: {
  label: string
  icono: IconName
  activo?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`flex h-14 items-center gap-2.5 rounded-[var(--radius-card)] px-3 text-left shadow-sm transition-transform duration-150 active:scale-[0.99] ${
        activo ? 'bg-lavanda text-lavanda-ink' : 'bg-surface text-ink'
      }`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-[10px] ${
          activo ? 'bg-white/20' : 'bg-lavanda-tenue text-lavanda'
        }`}
      >
        <Icono name={icono} size={17} strokeWidth={1.7} />
      </span>
      <span className="min-w-0 text-[13.5px] font-semibold leading-tight tracking-[-0.01em]">
        {label}
      </span>
    </button>
  )
}

export function Inicio({ app, onIr, onDiaSemana }: { app: Vianda; onIr: (tab: Tab) => void; onDiaSemana: (date: string) => void }) {
  const [hoja, setHoja] = useState<Hoja>(null)
  const [situacion, setSituacion] = useState<Situacion>(() =>
    app.today?.context === 'calle' ? 'calle' : app.today?.context === 'casa' ? 'casa' : 'trabajo',
  )

  const hoy = new Date()
  const nombre = app.perfil.nombre.trim()
  const dia = app.today

  /* El estado de cada comida sale del reloj, no de lo que hayas
     marcado. Es la misma función que usa Hoy: una sola verdad sobre en
     qué momento del día estás. */
  const comidas = dia ? comidasDelDia(dia, app.meals) : []
  const actual = comidaActual(comidas)
  const catAhora: Category = actual ? SLOT_CATEGORY[actual.planned.slot] : 'snack'

  /* Las dos o tres que vienen después de la que toca ahora. */
  const siguen = comidas
    .filter((c) => c.estado === 'proxima' || c.estado === 'mas-tarde')
    .slice(0, 3)
  const proxima = siguen[0]

  const verLista = (
    titulo: string,
    bajada: string | undefined,
    meals: Meal[],
    elegir?: (m: Meal) => void,
  ) => setHoja({ tipo: 'lista', titulo, bajada, meals, elegir })

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
    <div className="mx-auto max-w-md px-5 pb-28">
      <header className="v-safe-top pt-6 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="t-title text-ink">{nombre ? `Hola, ${nombre}` : 'Hola'}</h1>
          <button onClick={() => onIr('guia')} className="min-h-[44px] shrink-0 rounded-xl border border-line px-3 text-[15px] font-semibold text-ink">¿Cómo se usa?</button>
        </div>
        <p className="t-meta mt-1 text-ink-faint">{fechaLarga(hoy)}</p>
      </header>

      <section aria-label="Calendario de la semana" className="rounded-[22px] bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[19px] font-bold text-ink">Tu semana</h2>
          <button onClick={() => onIr('semana')} className="min-h-[44px] rounded-xl bg-accent px-3 text-[14px] font-semibold text-white">Ver calendario ›</button>
        </div>
        <p className="mt-1 text-[14px] text-ink-soft">Elegí un día para ver o cambiar sus comidas.</p>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {app.week.map((d) => {
            const fecha = parseIso(d.date)
            const esHoy = d.date === isoDate(hoy)
            return <button key={d.date} onClick={() => onDiaSemana(d.date)} aria-label={`${fechaLarga(fecha)} · ${d.context === 'calle' ? 'afuera' : d.context === 'casa' ? 'en casa' : 'mixto'}`} className={`min-h-[62px] rounded-xl text-center transition-transform active:scale-95 ${esHoy ? 'bg-accent-soft text-accent' : 'bg-bg text-ink'}`}>
              <span className="block text-[12px] font-semibold">{new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(fecha).replace('.', '')}</span>
              <span className="block text-[20px] font-bold">{fecha.getDate()}</span>
            </button>
          })}
        </div>
      </section>

      {/* ══════════════ TU DÍA ══════════════ */}

      {dia && <TiraDelDia dia={comidas} />}

      <section className="mt-8">
        <TituloSeccion>{actual?.estado === 'ahora' ? 'Te toca ahora' : 'Tu próxima comida'}</TituloSeccion>
        {actual?.meal ? (
          <ProximaComida
            meal={actual.meal}
            slot={actual.planned.slot}
            hora={actual.planned.time}
            onAbrir={() =>
              setHoja({ tipo: 'detalle', meal: actual.meal!, slot: actual.planned.slot })
            }
            onRegistrar={() =>
              setHoja({ tipo: 'registrar', slot: actual.planned.slot, meal: actual.meal! })
            }
            onAlternativa={() =>
              verLista(
                'Cambiar esta comida',
                `Otras opciones para ${SLOT_LABEL[actual.planned.slot].toLowerCase()}. Tocá una y queda puesta.`,
                alternativas(app.meals, SLOT_CATEGORY[actual.planned.slot], actual.meal!.id),
                (m) => {
                  app.replaceMeal(dia.date, actual.planned.slot, m.id)
                  setHoja(null)
                },
              )
            }
          />
        ) : (
          <Card>
            <Vacio
              icono="luna"
              titulo="Terminó el día"
              detalle="Ya pasaron todas las comidas. Mañana el plan se arma solo."
            />
          </Card>
        )}
      </section>

      {actual?.estado === 'ahora' && proxima?.meal && (
        <section className="mt-8">
          <TituloSeccion>Próxima comida</TituloSeccion>
          <FilaProxima meal={proxima.meal} slot={proxima.planned.slot} hora={proxima.planned.time}
            onClick={() => setHoja({ tipo: 'registrar', slot: proxima.planned.slot, meal: proxima.meal! })} />
        </section>
      )}

      {dia && (
        <section className="mt-8">
          <TituloSeccion>Lo que sigue hoy</TituloSeccion>
          {siguen.length ? (
            <>
              <ul className="space-y-3">
                {siguen.filter((c) => c !== (actual?.estado === 'ahora' ? proxima : undefined)).map((c) =>
                  c.meal ? (
                    <li key={c.planned.slot}>
                      <FilaProxima
                        meal={c.meal}
                        slot={c.planned.slot}
                        hora={c.planned.time}
                        onClick={() =>
                          setHoja({ tipo: 'registrar', meal: c.meal!, slot: c.planned.slot })
                        }
                      />
                    </li>
                  ) : null,
                )}
              </ul>
              <button
                type="button"
                onClick={() => onIr('hoy')}
                className="mt-3 h-11 w-full rounded-pill border border-line text-[13.5px] font-semibold text-lavanda active:bg-surface-2"
              >
                Ver todas las comidas de hoy
              </button>
            </>
          ) : (
            <Card>
              <p className="t-body text-ink-soft">
                {actual ? 'Es la última comida del día.' : 'Ya pasaron todas las comidas de hoy.'}
              </p>
            </Card>
          )}
        </section>
      )}

      {app.tomorrow && <section className="mt-8">
        <TituloSeccion>Cómo va a ser mañana</TituloSeccion>
        <Card>
          <p className="text-[15px] font-semibold text-ink">{CONTEXT_LABEL[app.tomorrow.context]}</p>
          <p className="mt-1 text-[13px] text-ink-soft">{CONTEXT_NOTE[app.tomorrow.context]}</p>
          <div className="mt-4"><ContextSwitch value={app.tomorrow.context} onChange={(c) => app.setContext(app.tomorrow!.date, c)} /></div>
          {app.tomorrow.context !== 'casa' && <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
            {packListFor(app.tomorrow, app.meals).filter((i) => i.kind === 'meal').length} comidas para llevar · {packListFor(app.tomorrow, app.meals).filter((i) => i.kind === 'buy').length} para comprar afuera.
          </p>}
          <button onClick={() => onIr('semana')} className="mt-4 min-h-[44px] w-full rounded-xl border border-line font-semibold text-ink">Ver y marcar los días de la semana</button>
        </Card>
      </section>}

      {dia && (
        <section className="mt-8">
          <TituloSeccion>Qué me llevo</TituloSeccion>
          <Card>
            {app.packing.some((item) => item.kind === 'meal' || item.kind === 'buy') ? (
              <div className="space-y-3">
                {app.packing.map((item) => (
                  <button key={item.id} type="button" aria-pressed={item.done}
                    onClick={() => app.checkPack(item.id)} className="flex w-full gap-3 text-left text-[14px] text-ink">
                    <span aria-hidden>{item.done ? '☑' : '□'}</span>
                    <span className={item.done ? 'line-through text-ink-faint' : ''}>
                      {item.label}{item.hint && <small className="block text-ink-faint">{item.hint}</small>}
                    </span>
                  </button>
                ))}
              </div>
            ) : <p className="t-body text-ink-soft">Hoy no hay comidas del plan para guardar en la lonchera.</p>}
          </Card>
        </section>
      )}

      {/* ══════════════ CAMBIARLO ══════════════ */}

      <div className="v-rule mt-8 mb-8" />

      <section>
        <TituloSeccion>¿Vas a comer en otro lugar?</TituloSeccion>
        <div className="grid grid-cols-2 gap-3">
          {SITUACIONES.map((s) => (
            <Celda
              key={s.id}
              label={s.label}
              icono={s.icono}
              activo={situacion === s.id}
              onClick={() => elegirSituacion(s.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <TituloSeccion>¿Querés cambiar o resolver algo?</TituloSeccion>

        <BarraAsistente onAbrir={() => setHoja({ tipo: 'ayuda' })} />

        <div className="mt-3 grid grid-cols-2 gap-3">
          {ATAJOS.map((a) => (
            <Celda
              key={a.id}
              label={a.label}
              icono={a.icono}
              onClick={() =>
                verLista(PREGUNTA[a.id].titulo, PREGUNTA[a.id].bajada, responder(a.id, app.meals, catAhora))
              }
            />
          ))}
        </div>
      </section>

      {/* ══════════════ ACCESOS SECUNDARIOS ══════════════
          Rótulo chico y chips: son atajos a la biblioteca, no secciones
          con el mismo peso que el plan del día. */}

      <section className="mt-8 space-y-6">
        <div>
          <Rotulo>Comer afuera</Rotulo>
          <FilaChips label="Lugares para comer afuera">
            {VENUES.map((v: Venue) => (
              <Chip
                key={v}
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
        </div>

        <div>
          <Rotulo
            accion={{
              label: 'Ver todos',
              onClick: () =>
                verLista('Snacks', 'Todo lo que entra entre comidas.', snacks(app.meals, 'llevar', 30)),
            }}
          >
            Snacks
          </Rotulo>
          <FilaChips label="Tipos de snack">
            {FILTROS_SNACK.map((f) => (
              <Chip
                key={f}
                onClick={() =>
                  verLista(`Snacks · ${FILTRO_SNACK[f].toLowerCase()}`, undefined, snacks(app.meals, f))
                }
              >
                {FILTRO_SNACK[f]}
              </Chip>
            ))}
          </FilaChips>
        </div>
      </section>

      <Hojas hoja={hoja} setHoja={setHoja} app={app} momento={catAhora} />
    </div>
  )
}
