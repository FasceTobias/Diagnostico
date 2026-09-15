import type { Meal } from '../lib/types'
import { ORIGEN_LABEL, SLOT_CATEGORY, SLOT_LABEL, SLOT_ORDER } from '../lib/types'
import { ingredientText, sustitutosDe } from '../lib/foods'
import { Card, Icono, Pill, Rotulo } from './base'
import { TONO_MOMENTO, carbs } from './tokens'

/* ------------------------------------------------------------------
   LA FICHA DE UNA COMIDA

   Qué es, qué lleva, cómo se hace y con qué se reemplaza lo que falta.
   En ese orden, que es el orden en el que se pregunta.

   Dos cosas que esta ficha no hace:

     · No inventa. Si una comida no tiene la preparación escrita, lo
       dice. Si no sabemos con qué reemplazar un ingrediente, no aparece
       la sección. Un paso inventado en una receta se descubre recién
       cuando ya arruinaste la cena.
     · No presenta una estimación como un dato. El carbohidrato dice
       «estimado» mientras lo sea, y explica por qué.
   ------------------------------------------------------------------ */

export function DetalleComida({
  meal,
  esFavorita = false,
  enCompras = false,
  onFavorita,
  onCompras,
  onCambiar,
}: {
  meal: Meal
  esFavorita?: boolean
  enCompras?: boolean
  onFavorita?: () => void
  onCompras?: () => void
  /** Sólo cuando la ficha se abrió desde un lugar del día. */
  onCambiar?: () => void
}) {
  /* Los momentos en los que sirve, en el orden del día y no en el que
     quedaron escritos en el catálogo. */
  const momentos = [
    ...new Set(
      SLOT_ORDER.filter((s) =>
        (meal.momentos ?? [meal.category]).includes(SLOT_CATEGORY[s]),
      ).map((s) => SLOT_LABEL[s]),
    ),
  ]

  const sustituciones = meal.ingredients
    .map((i) => ({ item: i.item, con: sustitutosDe(i.item) }))
    .filter((x) => x.con.length > 0)

  return (
    <div className="space-y-8 pb-2">
      {/* ---- datos rápidos ---- */}
      <Card>
        <div className="flex flex-wrap gap-1.5">
          <Pill tono={TONO_MOMENTO[meal.category]}>{carbs(meal)} CH</Pill>
          {(meal.totalMinutes ?? meal.prepMinutes) > 0 && (
            <Pill>{meal.totalMinutes ?? meal.prepMinutes} min</Pill>
          )}
          <Pill>{meal.portion}</Pill>
        </div>

        {meal.description && <p className="t-body mt-3 text-ink-soft">{meal.description}</p>}

        <dl className="mt-4 divide-y divide-line">
          <Fila rotulo="Momento" valor={momentos.join(' · ')} />
          <Fila rotulo="De dónde sale" valor={ORIGEN_LABEL[meal.origen]} />
          {meal.prepMinutes > 0 && (
            <Fila
              rotulo="Tiempo"
              valor={
                meal.totalMinutes && meal.totalMinutes > meal.prepMinutes
                  ? `${meal.prepMinutes} min de trabajo · ${meal.totalMinutes} en total`
                  : `${meal.prepMinutes} min`
              }
            />
          )}
          <Fila
            rotulo="Carbohidratos"
            valor={`${carbs(meal)} · ${meal.carbsVerified ? 'verificado' : 'estimado'}`}
            nota={
              meal.carbsVerified
                ? 'Medido contra la etiqueta del producto.'
                : 'La porción está documentada y el número calculado sobre ella, pero todavía no se midió contra una etiqueta.'
            }
          />
        </dl>

        {meal.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {meal.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        )}
      </Card>

      {/* ---- ingredientes ---- */}
      {meal.ingredients.length > 0 ? (
        <section>
          <Rotulo>Qué lleva</Rotulo>
          <Card>
            <ul className="divide-y divide-line">
              {meal.ingredients.map((i) => (
                <li key={i.item} className="t-body py-2 text-ink-soft first:pt-0 last:pb-0">
                  {ingredientText(i.item, i.qty, i.unit)}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : !meal.buyOutside ? (
        <section>
          <Rotulo>Qué lleva</Rotulo>
          <Card>
            <p className="t-meta text-ink-faint">
              Todavía no están cargados los ingredientes de esta comida.
            </p>
          </Card>
        </section>
      ) : null}

      {/* ---- preparación ---- */}
      {meal.steps && meal.steps.length > 0 ? (
        <section>
          <Rotulo>Cómo se hace</Rotulo>
          <Card>
            <ol className="divide-y divide-line">
              {meal.steps.map((paso, i) => (
                <li key={paso.text} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lavanda-tenue text-[11px] font-semibold text-lavanda">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-medium leading-snug text-ink">{paso.text}</p>
                    {paso.detail && <p className="t-meta mt-1 text-ink-faint">{paso.detail}</p>}
                  </div>
                  {paso.minutes && (
                    <span className="t-num shrink-0 text-[12px] text-ink-faint">
                      {paso.minutes} min
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        </section>
      ) : meal.origen === 'casera' && meal.prepMinutes > 3 ? (
        <section>
          <Rotulo>Cómo se hace</Rotulo>
          <Card>
            <p className="t-meta text-ink-faint">
              Esta comida todavía no tiene la preparación escrita. Preferimos que falte antes que
              inventarla.
            </p>
          </Card>
        </section>
      ) : null}

      {/* ---- si te falta algo ---- */}
      {sustituciones.length > 0 && (
        <section>
          <Rotulo>Si no tenés algo</Rotulo>
          <Card>
            <ul className="divide-y divide-line">
              {sustituciones.map((s) => (
                <li key={s.item} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="t-label text-ink-faint">Sin {s.item}</p>
                  <p className="t-body mt-0.5 text-ink-soft">{s.con.join(' · ')}</p>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* ---- acciones ---- */}
      <section className="space-y-2">
        {onCambiar && (
          <button
            type="button"
            onClick={onCambiar}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-lavanda text-[13.5px] font-semibold text-lavanda-ink active:scale-[0.98]"
          >
            <Icono name="cambiar" size={16} strokeWidth={1.9} />
            Cambiar esta comida
          </button>
        )}
        <div className="flex gap-2">
          {onCompras && meal.ingredients.length > 0 && (
            <Accion
              activo={enCompras}
              icono="compras"
              onClick={onCompras}
              label={enCompras ? 'En la compra' : 'Agregar a compras'}
            />
          )}
          {onFavorita && (
            <Accion
              activo={esFavorita}
              icono="chispa"
              onClick={onFavorita}
              label={esFavorita ? 'Es favorita' : 'Guardar favorita'}
            />
          )}
        </div>
      </section>
    </div>
  )
}

function Accion({
  label,
  icono,
  activo,
  onClick,
}: {
  label: string
  icono: 'compras' | 'chispa'
  activo: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex h-11 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-pill px-2 text-[13.5px] font-semibold transition-colors duration-150 active:scale-[0.98] ${
        activo ? 'bg-lavanda-tenue text-lavanda' : 'border border-line text-ink-soft'
      }`}
    >
      <Icono name={icono} size={16} strokeWidth={1.8} />
      {label}
    </button>
  )
}

function Fila({ rotulo, valor, nota }: { rotulo: string; valor: string; nota?: string }) {
  return (
    <div className="py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-4">
        <dt className="t-label text-ink-faint">{rotulo}</dt>
        <dd className="text-right text-[14.5px] font-semibold text-ink">{valor}</dd>
      </div>
      {nota && <p className="t-meta mt-1 text-ink-faint">{nota}</p>}
    </div>
  )
}
