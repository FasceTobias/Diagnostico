import { useMemo, useState } from 'react'
import type { Category } from '../lib/types'
import { SLOT_CATEGORY, SLOT_LABEL } from '../lib/types'
import type { Vianda } from '../lib/store'
import type { ComidaDelDia } from '../lib/dia'
import { comidaActual, comidasDelDia } from '../lib/dia'
import { alternativas } from '../lib/busquedas'
import { Card, CardButton, Icono, Rotulo, Tile, TituloSeccion, Vacio } from '../components/base'
import { FilaProxima, ProximaComida, TiraDelDia } from '../components/comida'
import { Hojas, type Hoja } from '../components/Hojas'
import { ICONO_MOMENTO, TONO_MOMENTO } from '../components/tokens'

/* ------------------------------------------------------------------
   HOY

   El día entero, y una sola idea detrás: la app lo sigue con el reloj.
   Nadie tiene que marcar nada para que avance.

   Por eso acá no hay casillas. Hay tres bloques que se leen de arriba
   abajo como se lee un día: lo que toca ahora, lo que viene, y lo que
   ya pasó —en gris, sin cara de tarea sin hacer—.

   Registrar qué comiste sigue existiendo, abajo y en voz baja, para el
   día que comiste otra cosa y querés que quede anotado.
   ------------------------------------------------------------------ */

const FECHA = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const fechaLarga = (d: Date) => {
  const t = FECHA.format(d).replace(',', '')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export function Hoy({ app }: { app: Vianda }) {
  const [hoja, setHoja] = useState<Hoja>(null)
  const dia = app.today

  const comidas = useMemo(
    () => (dia ? comidasDelDia(dia, app.meals) : []),
    [dia, app.meals],
  )
  const actual = comidaActual(comidas)
  const momento: Category = actual ? SLOT_CATEGORY[actual.planned.slot] : 'snack'

  const siguientes = comidas.filter((c) => c.estado === 'proxima' || c.estado === 'mas-tarde')
  const pasadas = comidas.filter((c) => c.estado === 'pasada')

  if (!dia) {
    return (
      <div className="mx-auto max-w-md px-5 pb-28">
        <Cabecera />
        <Card>
          <Vacio icono="hoy" titulo="Todavía no hay plan para hoy" />
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-28">
      <Cabecera />

      <TiraDelDia dia={comidas} />

      {/* ---- lo que toca ahora ---- */}
      <section className="mt-8">
        <TituloSeccion>{actual?.estado === 'ahora' ? 'Ahora' : 'Tu próxima comida'}</TituloSeccion>
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
              setHoja({
                tipo: 'lista',
                titulo: 'Cambiar esta comida',
                bajada: `Otras opciones para ${SLOT_LABEL[actual.planned.slot].toLowerCase()}. Tocá una y queda puesta.`,
                meals: alternativas(
                  app.meals,
                  SLOT_CATEGORY[actual.planned.slot],
                  actual.meal!.id,
                ),
                elegir: (m) => {
                  app.replaceMeal(dia.date, actual.planned.slot, m.id)
                  setHoja(null)
                },
              })
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

      {/* ---- lo que viene ---- */}
      {siguientes.length > 0 && (
        <section className="mt-8">
          <TituloSeccion>Lo que sigue</TituloSeccion>
          <ul className="space-y-3">
            {siguientes.map((c) =>
              c.meal ? (
                <li key={c.planned.slot}>
                  <FilaProxima
                    meal={c.meal}
                    slot={c.planned.slot}
                    hora={c.planned.time}
                    onClick={() =>
                      setHoja({ tipo: 'detalle', meal: c.meal!, slot: c.planned.slot })
                    }
                  />
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}

      {/* ---- lo que ya pasó ----
          En gris y sin flecha de urgencia: son cosas que ya fueron, no
          tareas sin hacer. Se tocan igual, por si querés anotar qué
          comiste de verdad. */}
      {pasadas.length > 0 && (
        <section className="mt-8">
          <Rotulo>Antes de ahora</Rotulo>
          <ul className="space-y-2">
            {pasadas.map((c) => (c.meal ? <FilaPasada key={c.planned.slot} c={c} onClick={() => setHoja({ tipo: 'registrar', slot: c.planned.slot, meal: c.meal! })} /> : null))}
          </ul>
        </section>
      )}

      <Hojas hoja={hoja} setHoja={setHoja} app={app} momento={momento} />
    </div>
  )
}

function Cabecera() {
  return (
    <header className="v-safe-top pt-6 pb-5">
      <h1 className="t-title text-ink">Hoy</h1>
      <p className="t-meta mt-1 text-ink-faint">{fechaLarga(new Date())}</p>
    </header>
  )
}

/** Una comida que ya pasó. Misma anatomía que las otras filas, bajada
    de tono: la baldosa sin color y el texto en gris. */
function FilaPasada({ c, onClick }: { c: ComidaDelDia; onClick: () => void }) {
  const meal = c.meal!
  const cat = SLOT_CATEGORY[c.planned.slot]
  const registrada = c.planned.status === 'eaten'
  const salteada = c.planned.status === 'skipped'

  return (
    <li>
      <CardButton aire="lista" onClick={onClick} label={`${SLOT_LABEL[c.planned.slot]}: ${meal.name}`}>
        <div className="flex items-center gap-3 opacity-70">
          <Tile name={ICONO_MOMENTO[cat]} tono={registrada ? TONO_MOMENTO[cat] : 'neutro'} />
          <div className="min-w-0 flex-1">
            <p className="t-caps text-ink-faint">
              <span className="t-num">{c.planned.time}</span>{' '}
              <span className="text-line-strong">·</span> {SLOT_LABEL[c.planned.slot]}
            </p>
            <p
              className={`mt-1 text-[14.5px] font-medium leading-tight text-ink-soft ${
                salteada ? 'line-through' : ''
              }`}
            >
              {meal.name}
            </p>
          </div>
          <span className="t-label shrink-0 text-ink-faint">
            {salteada ? 'salteada' : registrada ? 'anotada' : 'pasada'}
          </span>
          {registrada && (
            <Icono name="check" size={15} className="shrink-0 text-lavanda" strokeWidth={2.2} />
          )}
        </div>
      </CardButton>
    </li>
  )
}
