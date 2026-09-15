import type { Meal } from '../lib/types'
import { ORIGEN_LABEL } from '../lib/types'
import { ingredientText } from '../lib/foods'
import { Card, Pill, TituloSeccion } from './base'
import { TONO_MOMENTO, carbs } from './tokens'

/* ------------------------------------------------------------------
   UNA COMIDA, ENTERA

   Qué es, qué lleva y cómo se hace. Nada más: el detalle de una comida
   no es una ficha nutricional, es lo que necesitás para decidir si la
   comés hoy y para poder hacerla.
   ------------------------------------------------------------------ */

export function DetalleComida({ meal }: { meal: Meal }) {
  return (
    <div className="space-y-4 pt-1">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tono={TONO_MOMENTO[meal.category]}>{meal.category}</Pill>
          {meal.frequency === 'ocasional' && <Pill tono="mantequilla">de vez en cuando</Pill>}
          {meal.portable && <Pill tono="neutro">para llevar</Pill>}
        </div>

        {meal.description && (
          <p className="mt-3 text-[15px] leading-snug text-ink-soft">{meal.description}</p>
        )}

        <dl className="mt-4 divide-y divide-line">
          <Fila rotulo="Porción" valor={meal.portion} />
          <Fila
            rotulo="Carbohidratos"
            valor={carbs(meal)}
            nota={
              !meal.carbsVerified
                ? 'Estimado sobre esa porción. Todavía no se midió contra una etiqueta.'
                : undefined
            }
          />
          {meal.prepMinutes > 0 && (
            <Fila
              rotulo="Tiempo"
              valor={
                meal.totalMinutes && meal.totalMinutes > meal.prepMinutes
                  ? `${meal.prepMinutes} min de trabajo · ${meal.totalMinutes} min en total`
                  : `${meal.prepMinutes} min`
              }
            />
          )}
          <Fila rotulo="De dónde sale" valor={ORIGEN_LABEL[meal.origen]} />
        </dl>
      </Card>

      {meal.ingredients.length > 0 && (
        <section>
          <TituloSeccion>Qué lleva</TituloSeccion>
          <Card padding="p-4">
            <ul className="space-y-1.5">
              {meal.ingredients.map((i) => (
                <li key={i.item} className="text-[15px] text-ink-soft">
                  {ingredientText(i.item, i.qty, i.unit)}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {meal.steps && meal.steps.length > 0 && (
        <section>
          <TituloSeccion>Cómo se hace</TituloSeccion>
          <ol className="space-y-2">
            {meal.steps.map((paso, i) => (
              <li key={paso.text}>
                <Card padding="p-4">
                  <div className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lavanda-tenue text-[13px] font-extrabold text-lavanda">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-ink">{paso.text}</p>
                      {paso.detail && (
                        <p className="mt-1 text-[14px] leading-snug text-ink-faint">{paso.detail}</p>
                      )}
                    </div>
                    {paso.minutes && (
                      <span className="v-tnum ml-auto shrink-0 text-[13px] font-bold text-ink-faint">
                        {paso.minutes} min
                      </span>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

function Fila({ rotulo, valor, nota }: { rotulo: string; valor: string; nota?: string }) {
  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <dt className="v-label-sm text-ink-faint">{rotulo}</dt>
        <dd className="text-right text-[15px] font-bold text-ink">{valor}</dd>
      </div>
      {nota && <p className="mt-1 text-[13px] text-ink-faint">{nota}</p>}
    </div>
  )
}
