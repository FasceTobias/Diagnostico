import { useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Meal, Step } from '../lib/types'
import { FREQUENCY_LABEL } from '../lib/types'
import { CARB_SOURCE_TEXT, CATEGORY_TINT, CONFIDENCE_TEXT } from '../lib/format'
import { ingredientText } from '../lib/foods'
import { CarbValue, SatietyMark, SectionLabel } from './ui'

/* Detalle: el único lugar donde la densidad de datos está permitida.
   Aun así, la jerarquía manda: nombre, carbohidratos, y recién después
   todo lo demás en filas de ficha. */

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
    <span className="v-label-sm text-ink-faint">{label}</span>
    <span className="text-right text-[15px] text-ink">{value}</span>
  </div>
)

export function MealDetail({ meal }: { meal: Meal }) {
  /* Los datos derivados no repiten lo que ya dice una etiqueta. */
  const badges = (
    [
      meal.buyOutside || meal.tags.includes('para llevar') || meal.tags.includes('en casa')
        ? null
        : meal.portable
          ? 'se puede llevar'
          : 'para comer en casa',
      meal.needsCold ? 'va con frío' : null,
      meal.needsReheat ? 'se calienta' : null,
      meal.makeNightBefore ? 'se deja listo la noche anterior' : null,
      meal.freezable ? 'se puede congelar' : null,
    ].filter(Boolean) as string[]
  ).filter((b) => !meal.tags.includes(b as never))

  return (
    <div>
      <p
        className="v-label font-semibold first-letter:uppercase"
        style={{ color: CATEGORY_TINT[meal.category].fg }}
      >
        {meal.category}
      </p>
      <h3 className="v-head mt-1.5 text-[25px] leading-[1.15] text-ink">{meal.name}</h3>
      {meal.drink && <p className="v-label mt-1 text-ink-soft">con {meal.drink}</p>}
      <p className="v-label-sm mt-1.5 text-ink-faint">{meal.portion}</p>
      {meal.description && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{meal.description}</p>
      )}

      <div className="mt-5 flex items-end justify-between gap-4 rounded-xl bg-surface px-4 py-4">
        <div>
          <CarbValue meal={meal} size="lg" />
          <p className="v-label-sm mt-2 text-ink-faint">
            {meal.carbsVerified
              ? `${CARB_SOURCE_TEXT[meal.carbSource]} · ${CONFIDENCE_TEXT[meal.confidence]}`
              : 'Sin verificar'}
          </p>
        </div>
        <SatietyMark level={meal.satiety} />
      </div>

      {!meal.carbsVerified && (
        <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
          <span className="text-ink">Carbohidratos sin verificar.</span>{' '}
          {meal.isDemo
            ? 'Es un valor de demostración, no medido contra nada. No lo uses para decidir.'
            : 'Está calculado sobre una porción estándar, no medido contra una etiqueta. Sirve para orientarte; si vas a ajustar fino, mirá el envase.'}
        </p>
      )}

      <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
        Los carbohidratos son información para que decidas vos. Vianda no calcula
        ni sugiere insulina.
      </p>

      {/* Etiquetas: qué es y para qué sirve. Ninguna dice si está bien o mal. */}
      <p className="v-label-sm mt-5 leading-[1.9] text-ink-faint">
        {[FREQUENCY_LABEL[meal.frequency].toLowerCase(), ...meal.tags, ...badges].join(' · ')}
      </p>

      {meal.venues && meal.venues.length > 0 && (
        <>
          <SectionLabel className="mt-8 mb-2">Dónde conseguirla</SectionLabel>
          <p className="text-[16px] text-ink first-letter:uppercase">
            {meal.venues.join(' · ')}
          </p>
        </>
      )}

      {meal.packaged && (
        <>
          <SectionLabel className="mt-8 mb-1">Producto envasado</SectionLabel>
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
          {meal.packaged.sugarPerServing !== undefined && (
            <Fact label="Azúcares por porción" value={`${meal.packaged.sugarPerServing} g`} />
          )}
          {meal.packaged.addedSugarPerServing !== undefined && (
            <Fact
              label="Azúcares añadidos"
              value={`${meal.packaged.addedSugarPerServing} g`}
            />
          )}
          {meal.packaged.caloriesPerServing !== undefined && (
            <Fact label="Calorías por porción" value={`${meal.packaged.caloriesPerServing}`} />
          )}
          {meal.packaged.source && <Fact label="Fuente" value={meal.packaged.source} />}
          {!meal.carbsVerified && (
            <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
              Tiene etiqueta, así que este número puede dejar de ser una estimación
              en cuanto carguemos la marca y la porción reales.
            </p>
          )}
        </>
      )}

      {/* Las otras porciones de lo mismo. El número de arriba es el de
          una porción concreta, no el del plato en abstracto: media pizza
          y tres porciones son la misma comida con otro número. */}
      {meal.portions && meal.portions.length > 1 && (
        <>
          <SectionLabel className="mt-8 mb-1">Según cuánto comas</SectionLabel>
          {meal.portions.map((p) => {
            const actual = p.label === meal.portion
            return (
              <div
                key={p.label}
                className="flex items-baseline justify-between gap-4 border-b border-line py-2.5"
              >
                <span className={`text-[16px] ${actual ? 'font-semibold text-ink' : 'text-ink-soft'}`}>
                  {p.label}
                  {p.grams ? <span className="v-label-sm text-ink-faint"> · {p.grams} g</span> : null}
                </span>
                <span className={`text-[16px] v-tnum ${actual ? 'text-ink' : 'text-ink-soft'}`}>
                  ~{p.carbs} <span className="v-label-sm text-ink-faint">g CHO</span>
                </span>
              </div>
            )
          })}
        </>
      )}

      {meal.ingredients.length > 0 && (
        <>
          <SectionLabel className="mt-8 mb-1">Ingredientes</SectionLabel>
          {meal.ingredients.map((ing) => (
            <p
              key={`${ing.item}-${ing.unit}`}
              className="border-b border-line py-2.5 text-[16px] text-ink first-letter:uppercase"
            >
              {ingredientText(ing.item, ing.qty, ing.unit)}
            </p>
          ))}
        </>
      )}

      {meal.steps && meal.steps.length > 0 && (
        <Recipe steps={meal.steps} minutes={meal.prepMinutes} />
      )}

      {!meal.buyOutside && (
        <>
          <SectionLabel className="mt-8 mb-1">Datos</SectionLabel>
          <Fact label="Preparación" value={`${meal.prepMinutes} min`} />
          <Fact
            label="Dificultad"
            value={['Fácil', 'Media', 'Requiere tiempo'][meal.difficulty - 1]}
          />
          {meal.rating && <Fact label="Puntuación" value={`${meal.rating} de 5`} />}
          <Fact label="Probada" value={meal.tested ? 'Sí' : 'Todavía no'} />
        </>
      )}

      {meal.notes && (
        <>
          <SectionLabel className="mt-8 mb-2">Notas</SectionLabel>
          <p className="text-[16px] leading-relaxed text-ink-soft">{meal.notes}</p>
        </>
      )}

      {meal.isDemo && (
        <p className="mt-8 text-[13px] leading-relaxed text-ink-faint">
          {meal.buyOutside
            ? 'Opción de demostración: es el tipo de cosa que vas a encontrar, no un lugar ni un plato concreto. Los de verdad los cargamos juntos.'
            : 'Comida de demostración: existe sólo para que la interfaz tenga algo que mostrar. La biblioteca real la vamos a construir comida por comida.'}
        </p>
      )}
    </div>
  )
}

/* Cómo se hace. Por defecto, la versión corta: lo que necesitás si ya
   sabés cocinar eso. «Ver con detalle» abre la receta entera —cantidades,
   temperaturas, cómo te das cuenta de que está— sin cambiar de pantalla.
   Nunca al revés: el detalle no se abre solo. */
const DETAIL_KEY = 'vianda.receta.detalle'

/* Si lo abriste una vez, queda abierto. El que necesita la explicación la
   necesita siempre, y no tiene por qué pedirla comida por comida. */
const readPref = () => {
  try {
    return localStorage.getItem(DETAIL_KEY) === '1'
  } catch {
    return false
  }
}

function Recipe({ steps, minutes }: { steps: Step[]; minutes: number }) {
  const [full, setFull] = useState(readPref)
  const hasDetail = steps.some((s) => s.detail)

  const toggle = () =>
    setFull((v) => {
      try {
        localStorage.setItem(DETAIL_KEY, v ? '0' : '1')
      } catch {
        /* modo privado: la preferencia no se guarda, la app funciona igual */
      }
      return !v
    })

  return (
    <LazyMotion features={domAnimation}>
      <SectionLabel className="mt-8 mb-1" aside={`${minutes} min`}>
        Cómo se hace
      </SectionLabel>

      {steps.map((step, idx) => (
        <div key={step.text} className="border-b border-line py-3">
          <div className="flex items-baseline gap-3">
            <span className="v-label-sm w-4 shrink-0 text-accent v-tnum">{idx + 1}</span>
            <p className="min-w-0 flex-1 text-[16px] leading-snug text-ink">{step.text}</p>
            {step.minutes && (
              <span className="v-label-sm shrink-0 text-ink-faint v-tnum">
                {step.minutes} min
              </span>
            )}
          </div>
          <AnimatePresence initial={false}>
            {full && step.detail && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden"
              >
                <p className="pt-2 pl-7 text-[14px] leading-relaxed text-ink-soft">
                  {step.detail}
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {hasDetail && (
        <button
          type="button"
          onClick={toggle}
          className="v-label mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-left font-semibold text-ink transition-colors active:bg-surface-2"
        >
          {full ? 'Ver en corto' : 'Ver con detalle'}
          <span
            className={`text-[13px] text-ink-faint transition-transform duration-200 ${full ? '-rotate-180' : ''}`}
            aria-hidden
          >
            ▾
          </span>
        </button>
      )}

      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-faint">
        {full
          ? 'La receta entera. Los tiempos se solapan: el horno calienta mientras cortás.'
          : 'Los tiempos se solapan: el horno calienta mientras cortás.'}
      </p>
    </LazyMotion>
  )
}
