import { useMemo } from 'react'
import type { Vianda } from '../lib/store'
import { buildShoppingList } from '../lib/domain'
import { CheckRow } from '../components/ui'

/* COMPRAS — una compra práctica, no un inventario.

   Las cantidades salen de sumar el menú de la semana y redondear a cómo se
   compra de verdad: "12 huevos", no "23 huevos"; "1,5 kg de pollo", no
   "1350 g". No busca precisión: busca que sirva parado en el súper.

   Acá marcar sí tiene sentido —es el único lugar donde tachar es el punto—
   pero tampoco hace falta: la lista se lee igual. */

export function Compras({ app }: { app: Vianda }) {
  const { week, mealById } = app

  const groups = useMemo(
    () => buildShoppingList(week, app.meals),
    [week, app.meals],
  )

  /* Preparaciones compartidas: si varias comidas llevan pollo, se dice una vez. */
  const prep = useMemo(() => {
    const byIngredient = new Map<string, Set<string>>()
    for (const day of week) {
      for (const planned of day.meals) {
        if (planned.status === 'skipped') continue
        const meal = mealById(planned.mealId)
        if (!meal || meal.buyOutside || meal.prepMinutes < 15) continue
        const set = byIngredient.get(meal.mainIngredient) ?? new Set<string>()
        set.add(meal.name)
        byIngredient.set(meal.mainIngredient, set)
      }
    }
    return [...byIngredient.entries()]
      .map(([ingredient, names]) => ({ ingredient, names: [...names] }))
      .sort((a, b) => b.names.length - a.names.length)
  }, [week, mealById])

  const total = groups.reduce((n, g) => n + g.lines.length, 0)

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="text-[30px] leading-none v-display text-ink">Compras</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          {total} cosas para la semana, salidas del menú.
        </p>
      </header>

      {groups.map(({ aisle, lines }) => (
        <section key={aisle} className="mb-6">
          <h2 className="v-eyebrow mb-1 px-1 text-ink-faint">{aisle}</h2>
          <div className="-mx-1">
            {lines.map((line) => (
              <CheckRow
                key={line.id}
                label={line.text}
                done={app.isBought(line.id)}
                onToggle={() => app.toggleBought(line.id)}
              />
            ))}
          </div>
        </section>
      ))}

      {total === 0 && (
        <p className="rounded-card border border-dashed border-line-strong px-5 py-8 text-center text-[15px] text-ink-faint">
          No hay nada que comprar todavía.
        </p>
      )}

      <p className="px-1 text-[12px] leading-relaxed text-ink-faint">
        Cantidades aproximadas, redondeadas a cómo se compra. Lo que se come
        afuera no entra, y lo que siempre tenés en casa —sal, aceite, caldo—
        tampoco.
      </p>

      <h2 className="v-eyebrow mt-10 mb-1 px-1 text-ink-faint">Para preparar esta semana</h2>
      <p className="mb-3 px-1 text-[13px] leading-relaxed text-ink-faint">
        Cocinar una vez y que rinda varios días.
      </p>

      <ul className="space-y-2">
        {prep.map(({ ingredient, names }) => (
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
