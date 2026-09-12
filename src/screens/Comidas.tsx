import { useMemo, useState } from 'react'
import type { Vianda } from '../lib/store'
import type { Category, Meal } from '../lib/types'
import { CarbChip, MealTile, SatietyMark } from '../components/ui'
import { Sheet } from '../components/Sheet'
import { MealDetail } from '../components/MealDetail'

/* Biblioteca personal. Dos filtros, no diez: categoría y "se puede llevar".
   Cualquier filtro más es una decisión extra que nadie pidió. */

const CATEGORIES: (Category | 'todas')[] = [
  'todas',
  'desayuno',
  'snack',
  'almuerzo',
  'merienda',
  'cena',
]

export function Comidas({ app }: { app: Vianda }) {
  const [cat, setCat] = useState<Category | 'todas'>('todas')
  const [portable, setPortable] = useState(false)
  const [open, setOpen] = useState<Meal | null>(null)

  const list = useMemo(
    () =>
      app.meals
        .filter((m) => (cat === 'todas' ? true : m.category === cat))
        .filter((m) => (portable ? m.portable : true))
        .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name)),
    [app.meals, cat, portable],
  )

  return (
    <div className="mx-auto max-w-md px-4 pb-40">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="text-[30px] leading-none v-display text-ink">Comidas</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Tu biblioteca. {app.meals.length} cargadas.
        </p>
      </header>

      <div className="v-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-pill px-4 py-2 text-[14px] font-medium capitalize transition-colors ${
              c === cat ? 'bg-ink text-bg' : 'border border-line bg-surface text-ink-soft'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        onClick={() => setPortable((p) => !p)}
        aria-pressed={portable}
        className={`mt-3 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[14px] font-medium transition-colors ${
          portable ? 'bg-clay-soft text-clay-ink' : 'border border-line bg-surface text-ink-soft'
        }`}
      >
        <span aria-hidden>{portable ? '✓' : '+'}</span>
        Solo las que se pueden llevar
      </button>

      <ul className="mt-5 space-y-2">
        {list.map((meal) => (
          <li key={meal.id}>
            <button
              onClick={() => setOpen(meal)}
              className="flex w-full items-center gap-3.5 rounded-card bg-surface px-3.5 py-3.5 text-left shadow-sm active:scale-[0.985]"
            >
              <MealTile meal={meal} size={44} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[16px] font-medium text-ink">{meal.name}</span>
                  {meal.favorite && (
                    <span aria-label="Favorita" className="shrink-0 text-[13px] text-clay">
                      ★
                    </span>
                  )}
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <CarbChip meal={meal} />
                  <SatietyMark level={meal.satiety} />
                  <span className="text-[13px] text-ink-faint">
                    {meal.portable ? 'se lleva' : 'en casa'} · {meal.prepMinutes} min
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="mt-8 rounded-card border border-dashed border-line-strong px-5 py-8 text-center text-[15px] text-ink-faint">
          No hay comidas con esos filtros.
        </p>
      )}

      <p className="mt-7 rounded-2xl border border-dashed border-line-strong px-4 py-4 text-[13px] leading-relaxed text-ink-faint">
        Estas 15 comidas son de ejemplo, para que la app funcione desde el primer día.
        Las reales las cargamos juntos: merienda y cena son las categorías más flacas.
      </p>

      <Sheet open={open !== null} onClose={() => setOpen(null)}>
        {open && <MealDetail meal={open} />}
      </Sheet>
    </div>
  )
}
