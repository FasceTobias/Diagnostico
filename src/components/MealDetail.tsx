import type { Meal } from '../lib/types'
import { CARB_SOURCE_TEXT, CONFIDENCE_TEXT } from '../lib/format'
import { CarbChip, DemoBadge, MealTile, SatietyMark } from './ui'

/* Detalle: acá sí se muestra todo. Es el segundo nivel de la divulgación
   progresiva, y el único lugar donde la densidad de datos está permitida. */

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 py-2.5">
    <span className="text-[14px] text-ink-soft">{label}</span>
    <span className="text-right text-[15px] font-medium text-ink">{value}</span>
  </div>
)

export function MealDetail({ meal }: { meal: Meal }) {
  const badges = [
    meal.portable ? 'Se puede llevar' : 'Para comer en casa',
    meal.needsCold ? 'Va con frío' : null,
    meal.needsReheat ? 'Se calienta' : null,
    meal.makeNightBefore ? 'Se prepara la noche anterior' : null,
    meal.freezable ? 'Se puede congelar' : null,
  ].filter(Boolean) as string[]

  return (
    <div>
      <div className="flex items-start gap-4">
        <MealTile meal={meal} size={56} />
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

      <div className="mt-5 flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-soft"
          >
            {b}
          </span>
        ))}
      </div>

      <h4 className="v-eyebrow mt-7 text-ink-faint">Ingredientes</h4>
      <ul className="mt-2 divide-y divide-line">
        {meal.ingredients.map((i) => (
          <li key={i} className="py-2.5 text-[15px] text-ink">
            {i}
          </li>
        ))}
      </ul>

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

      {meal.notes && (
        <>
          <h4 className="v-eyebrow mt-7 text-ink-faint">Notas</h4>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{meal.notes}</p>
        </>
      )}

      {meal.isDemo && (
        <p className="mt-7 rounded-2xl border border-dashed border-line-strong px-4 py-3 text-[13px] leading-relaxed text-ink-faint">
          Comida de demostración: existe sólo para que la interfaz tenga algo que
          mostrar. La biblioteca real la vamos a construir comida por comida.
        </p>
      )}
    </div>
  )
}
