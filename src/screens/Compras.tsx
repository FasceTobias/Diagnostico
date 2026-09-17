import { useEffect, useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import { buildShoppingList } from '../lib/domain'
import {
  estimateShopping,
  loadFoodPrices,
  money,
  type PriceReference,
} from '../lib/precios'

/* COMPRAS — un ticket, no una lista de texto.

   La cantidad vive en su propia columna, en números tabulares y con peso
   propio: parada en el súper lo que buscás es "1,5 kg", no la oración
   entera. El sector encabeza con una regla gruesa y su propio conteo.

   Marcar acá sí tiene sentido —es el único lugar donde tachar es el
   punto— pero la lista se lee igual sin tocar nada. */

export function Compras({ app }: { app: Vianda }) {
  const { week, mealById } = app
  const [prices, setPrices] = useState<Map<string, PriceReference>>(new Map())

  const groups = useMemo(() => buildShoppingList(week, app.meals), [week, app.meals])
  const estimate = useMemo(() => estimateShopping(groups, prices), [groups, prices])

  useEffect(() => {
    let alive = true
    void loadFoodPrices().then((next) => {
      if (alive) setPrices(next)
    })
    return () => {
      alive = false
    }
  }, [])

  /* Preparaciones compartidas: si varias comidas llevan pollo, se dice una vez. */
  const prep = useMemo(() => {
    const byIngredient = new Map<string, Set<string>>()
    for (const day of week) {
      for (const planned of day.meals) {
        if (planned.status === 'skipped') continue
        const meal = mealById(planned.mealId)
        if (!meal || meal.buyOutside || meal.activeMinutes < 15) continue
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
  const done = groups.reduce(
    (n, g) => n + g.lines.filter((l) => app.isBought(l.id)).length,
    0,
  )

  const observed = estimate.latestObservedOn
    ? new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(
        new Date(`${estimate.latestObservedOn}T12:00:00`),
      )
    : null

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto max-w-md px-4 pb-40">
        <header className="v-safe-top pt-5 pb-5">
          <h1 className="v-serif-lg text-[28px] text-ink">Compras</h1>
          <p className="v-label-sm mt-1.5 text-ink-faint">
            {total} cosas para la semana · {done} en el changuito
          </p>
        </header>

        {estimate.pricedLines > 0 && (
          <section className="mb-7 rounded-2xl border border-line bg-surface px-4 py-4">
            <p className="v-label-sm text-ink-faint">Gasto estimado de esta compra</p>
            <p className="v-serif mt-1 text-[25px] text-ink v-tnum">
              {money(estimate.min)}–{money(estimate.max)}
            </p>
            <p className="mt-1 text-[14px] text-ink-soft">
              Referencia central: {money(estimate.median)}
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-faint">
              AMBA · {estimate.pricedLines} de {estimate.totalLines} productos con precio
              {observed ? ` · referencia ${observed}` : ''}. Es un rango orientativo, no el
              precio de caja de un comercio puntual.
            </p>
          </section>
        )}

        {groups.map((group, gi) => {
          const gDone = group.lines.filter((l) => app.isBought(l.id)).length
          return (
            <section key={group.aisle} className="mb-7">
              <div className="flex items-baseline justify-between border-b border-line px-1 pt-1 pb-1.5">
                <h2 className="v-serif text-[18px] text-ink first-letter:uppercase">
                  {group.aisle}
                </h2>
                <span className="v-label-sm text-ink-faint v-tnum">
                  {gDone}/{group.lines.length}
                </span>
              </div>

              {group.lines.map((line, li) => {
                const bought = app.isBought(line.id)
                const priced = estimate.lines.find((x) => x.line.id === line.id)
                return (
                  <m.button
                    key={line.id}
                    onClick={() => app.toggleBought(line.id)}
                    aria-pressed={bought}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.012 * (gi * 6 + li) }}
                    className="flex w-full items-center gap-3 rounded-xl border-b border-line px-1 py-2.5 text-left transition-colors active:bg-surface-2"
                  >
                    <span
                      className={`flex w-[82px] shrink-0 items-baseline gap-1 transition-colors ${
                        bought ? 'text-ink-faint' : 'text-ink'
                      }`}
                    >
                      <span className="v-head text-[17px] v-tnum">{line.value}</span>
                      {line.unit && (
                        <span className="v-label-sm text-ink-faint">{line.unit}</span>
                      )}
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-[16px] transition-colors ${
                        bought ? 'text-ink-faint line-through decoration-1' : 'text-ink-soft'
                      }`}
                    >
                      {line.label}
                      {priced && !bought && (
                        <span className="mt-0.5 block text-[12px] text-ink-faint v-tnum">
                          aprox. {money(priced.min)}–{money(priced.max)}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className={`grid size-[20px] shrink-0 place-items-center rounded-[6px] border transition-colors ${
                        bought ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong'
                      }`}
                    >
                      {bought && (
                        <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden>
                          <path d="M3 8.5 6.2 11.6 13 4.8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </m.button>
                )
              })}
            </section>
          )
        })}

        {total === 0 && (
          <p className="border-y border-line py-10 text-center text-[16px] text-ink-faint">
            No hay nada que comprar todavía.
          </p>
        )}

        <p className="px-1 text-[13px] leading-relaxed text-ink-faint">
          Cantidades aproximadas, redondeadas a cómo se compra. Lo que se come
          afuera no entra, y lo que siempre tenés en casa —sal, aceite, caldo—
          tampoco. Los precios son referencias regionales y pueden cambiar por
          comercio, marca, promoción y fecha.
        </p>

        <section className="mt-12">
          <div className="border-b border-line px-1 pb-1.5">
            <h2 className="v-serif text-[18px] text-ink">Para preparar esta semana</h2>
          </div>
          <p className="v-label-sm mt-2 mb-2 px-1 text-ink-faint">
            Cocinar una vez y que rinda varios días
          </p>

          {prep.map(({ ingredient, names }) => (
            <div key={ingredient} className="border-b border-line px-1 py-3">
              <p className="v-head text-[16px] text-ink first-letter:uppercase">
                {ingredient}
                {names.length > 1 && (
                  <span className="v-label-sm ml-2.5 text-ink-soft">{names.length} comidas</span>
                )}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-faint">
                {names.join(' · ')}
              </p>
            </div>
          ))}
        </section>
      </div>
    </LazyMotion>
  )
}
