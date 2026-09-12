import type { Meal } from '../lib/types'
import { FREQUENCY_LABEL } from '../lib/types'
import { CARB_SOURCE_TEXT, CONFIDENCE_TEXT } from '../lib/format'
import { ingredientText } from '../lib/foods'
import { CarbChip, DemoBadge, MealMark, SatietyMark } from './ui'

/* Detalle: acá sí se muestra todo. Es el segundo nivel de la divulgación
   progresiva, y el único lugar donde la densidad de datos está permitida. */

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 py-2.5">
    <span className="text-[14px] text-ink-soft">{label}</span>
    <span className="text-right text-[15px] font-medium text-ink">{value}</span>
  </div>
)

export function MealDetail({ meal }: { meal: Meal }) {
  /* Los datos derivados no repiten lo que ya dice una etiqueta. */
  const badges = (
    [
      meal.buyOutside || meal.tags.includes('para llevar') || meal.tags.includes('en casa')
        ? null
        : meal.portable
          ? 'Se puede llevar'
          : 'Para comer en casa',
      meal.needsCold ? 'Va con frío' : null,
      meal.needsReheat ? 'Se calienta' : null,
      meal.makeNightBefore ? 'Se deja listo la noche anterior' : null,
      meal.freezable ? 'Se puede congelar' : null,
    ].filter(Boolean) as string[]
  ).filter((b) => !meal.tags.includes(b.toLowerCase() as never))

  return (
    <div>
      <div className="flex items-start gap-4">
        <MealMark meal={meal} size={30} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[19px] leading-tight v-display text-ink">{meal.name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink-faint first-letter:uppercase">
            <span className="first-letter:uppercase">
              {meal.category} · {meal.portion}
            </span>
            {meal.isDemo && <DemoBadge />}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between rounded-card bg-surface px-4 py-4 shadow-sm">
        <div>
          <CarbChip meal={meal} size="lg" />
          <p className="mt-1 text-[12px] text-ink-faint">
            {meal.carbsVerified
              ? `${CARB_SOURCE_TEXT[meal.carbSource]} · ${CONFIDENCE_TEXT[meal.confidence]}`
              : 'Sin verificar'}
          </p>
        </div>
        <SatietyMark level={meal.satiety} />
      </div>

      {!meal.carbsVerified && (
        <p className="mt-3 rounded-2xl border border-dashed border-line-strong px-4 py-3 text-[13px] leading-relaxed text-ink-faint">
          <span className="font-semibold text-ink-soft">Carbohidratos sin verificar.</span>{' '}
          Es un valor de demostración, no medido contra una etiqueta ni una receta
          calculada. No lo uses para decidir nada.
        </p>
      )}

      <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
        Los carbohidratos son información para que decidas vos. Vianda no calcula
        ni sugiere insulina.
      </p>

      {/* Etiquetas: qué es y para qué sirve. Ninguna dice si está bien o mal. */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-soft">
          {FREQUENCY_LABEL[meal.frequency]}
        </span>
        {meal.tags.map((t) => (
          <span
            key={t}
            className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-soft first-letter:uppercase"
          >
            {t}
          </span>
        ))}
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-soft"
          >
            {b}
          </span>
        ))}
      </div>

      {meal.packaged && (
        <>
          <h4 className="v-eyebrow mt-7 text-ink-faint">Producto envasado</h4>
          <div className="mt-1 divide-y divide-line">
            {meal.packaged.brand && <Fact label="Marca" value={meal.packaged.brand} />}
            {meal.packaged.product && <Fact label="Producto" value={meal.packaged.product} />}
            {meal.packaged.servingSize && (
              <Fact label="Porción" value={meal.packaged.servingSize} />
            )}
            {meal.packaged.servingsPerPack && (
              <Fact label="Porciones por envase" value={String(meal.packaged.servingsPerPack)} />
            )}
            {meal.packaged.carbsPerServing !== undefined && (
              <Fact
                label="Carbohidratos por porción"
                value={`${meal.packaged.carbsPerServing} g CHO`}
              />
            )}
          </div>
          {!meal.carbsVerified && (
            <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
              Tiene etiqueta, así que este número puede dejar de ser una estimación
              en cuanto carguemos la marca y la porción reales.
            </p>
          )}
        </>
      )}

      {meal.venues && meal.venues.length > 0 && (
        <>
          <h4 className="v-eyebrow mt-7 text-ink-faint">Dónde conseguirla</h4>
          <p className="mt-2 text-[15px] text-ink first-letter:uppercase">
            {meal.venues.join(' · ')}
          </p>
        </>
      )}

      {meal.ingredients.length > 0 && (
        <>
          <h4 className="v-eyebrow mt-7 text-ink-faint">Ingredientes</h4>
          <ul className="mt-2 divide-y divide-line">
            {meal.ingredients.map((ing) => (
              <li
                key={`${ing.item}-${ing.unit}`}
                className="py-2.5 text-[15px] text-ink first-letter:uppercase"
              >
                {ingredientText(ing.item, ing.qty, ing.unit)}
              </li>
            ))}
          </ul>
        </>
      )}

      {!meal.buyOutside && (
        <>
          <h4 className="v-eyebrow mt-7 text-ink-faint">Datos</h4>
          <div className="mt-1 divide-y divide-line">
            <Fact label="Preparación" value={`${meal.prepMinutes} min`} />
            <Fact
              label="Dificultad"
              value={['Fácil', 'Media', 'Requiere tiempo'][meal.difficulty - 1]}
            />
            {meal.rating && <Fact label="Puntuación" value={`${meal.rating} de 5`} />}
            <Fact label="Probada" value={meal.tested ? 'Sí' : 'Todavía no'} />
          </div>
        </>
      )}

      {meal.notes && (
        <>
          <h4 className="v-eyebrow mt-7 text-ink-faint">Notas</h4>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{meal.notes}</p>
        </>
      )}

      {meal.isDemo && (
        <p className="mt-7 rounded-2xl border border-dashed border-line-strong px-4 py-3 text-[13px] leading-relaxed text-ink-faint">
          {meal.buyOutside
            ? 'Opción de demostración: es el tipo de cosa que vas a encontrar, no un lugar ni un plato concreto. Los de verdad los cargamos juntos.'
            : 'Comida de demostración: existe sólo para que la interfaz tenga algo que mostrar. La biblioteca real la vamos a construir comida por comida.'}
        </p>
      )}
    </div>
  )
}
