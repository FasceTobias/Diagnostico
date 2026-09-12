import { useMemo } from 'react'
import type { Vianda } from '../lib/store'

/* COMPRAS — honestidad de alcance.

   La lista automática necesita cantidades reales por ingrediente, y eso
   todavía no está cargado: una lista mal agregada es peor que no tenerla.
   Lo que sí se puede armar hoy con los datos del plan es la preparación
   semanal agrupada, y eso es lo que está. */

export function Compras({ app }: { app: Vianda }) {
  const { week, mealById } = app
  /* Preparaciones compartidas: si tres comidas llevan pollo, se dice una vez. */
  const grouped = useMemo(() => {
    const byIngredient = new Map<string, Set<string>>()
    for (const day of week) {
      for (const planned of day.meals) {
        const meal = mealById(planned.mealId)
        if (!meal || meal.prepMinutes < 10) continue
        const set = byIngredient.get(meal.mainIngredient) ?? new Set<string>()
        set.add(meal.name)
        byIngredient.set(meal.mainIngredient, set)
      }
    }
    return [...byIngredient.entries()]
      .map(([ingredient, names]) => ({ ingredient, names: [...names] }))
      .sort((a, b) => b.names.length - a.names.length)
  }, [week, mealById])

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="text-[30px] leading-none v-display text-ink">Compras</h1>
        <p className="mt-2 text-[15px] text-ink-soft">Lo de la semana, en un solo lugar.</p>
      </header>

      <section className="rounded-card border border-dashed border-line-strong px-5 py-6">
        <h2 className="text-[17px] v-display text-ink">La lista automática viene después</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          Para armarla bien hacen falta las cantidades reales de cada ingrediente.
          Con los datos de ejemplo daría una lista pobre, y una lista de compras
          que no se puede usar es peor que no tenerla.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          Cuando carguemos las comidas de verdad, esta pantalla agrupa por
          verdulería, carnicería, lácteos, almacén, congelados y panadería.
        </p>
      </section>

      <h2 className="v-eyebrow mt-9 mb-1 px-1 text-ink-faint">Para preparar esta semana</h2>
      <p className="mb-3 px-1 text-[13px] leading-relaxed text-ink-faint">
        Agrupado por preparación compartida, para cocinar una vez y que rinda varios días.
      </p>

      <ul className="space-y-2">
        {grouped.map(({ ingredient, names }) => (
          <li key={ingredient} className="rounded-card bg-surface px-4 py-3.5 shadow-sm">
            <p className="text-[16px] font-medium text-ink first-letter:uppercase">
              {ingredient}
              {names.length > 1 && (
                <span className="ml-2 text-[13px] font-normal text-clay">
                  {names.length} comidas
                </span>
              )}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-faint">
              {names.join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
