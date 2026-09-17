import { useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { Category, Meal } from '../lib/types'
import { CarbValue, MetaLine } from '../components/ui'
import { Sheet } from '../components/Sheet'
import { MealDetail } from '../components/MealDetail'

const CATEGORIES: (Category | 'todas')[] = ['todas', 'desayuno', 'snack', 'almuerzo', 'merienda', 'cena']
const ORDER: Category[] = ['desayuno', 'snack', 'almuerzo', 'merienda', 'cena']

const normalizar = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function Comidas({ app }: { app: Vianda }) {
  const [cat, setCat] = useState<Category | 'todas'>('todas')
  const [portable, setPortable] = useState(false)
  const [outside, setOutside] = useState<'todas' | 'casa' | 'afuera'>('todas')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Meal | null>(null)

  const groups = useMemo(() => {
    const q = normalizar(query)
    const list = app.meals
      .filter((m) => (cat === 'todas' ? true : m.category === cat))
      .filter((m) => (portable ? m.portable : true))
      .filter((m) => outside === 'todas' ? true : outside === 'afuera' ? m.buyOutside : !m.buyOutside)
      .filter((m) => {
        if (!q) return true
        return normalizar([m.name, m.description ?? '', m.mainIngredient, ...m.ingredients.map((i) => i.item)].join(' ')).includes(q)
      })
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || Number(b.everyday) - Number(a.everyday) || a.name.localeCompare(b.name))

    return ORDER.map((c) => ({ category: c, meals: list.filter((m) => m.category === c) })).filter((g) => g.meals.length > 0)
  }, [app.meals, cat, portable, outside, query])

  const count = groups.reduce((n, g) => n + g.meals.length, 0)

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto max-w-md px-4 pb-40">
        <header className="v-safe-top pt-5 pb-4">
          <p className="v-label font-semibold text-accent">CUANDO NO SABÉS QUÉ COMER</p>
          <h1 className="v-serif-lg mt-1 text-[28px] text-ink">Encontrá algo que te cierre</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            Buscá por comida o ingrediente, o filtrá según lo que necesitás hoy.
          </p>
        </header>

        <label className="mb-4 block">
          <span className="sr-only">Buscar comidas</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. pollo, arroz, tostado…"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
          />
        </label>

        <div className="v-no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`v-label min-h-[36px] shrink-0 rounded-lg px-3.5 font-semibold capitalize transition-colors ${
                c === cat ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-ink-soft active:bg-surface'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 pb-3">
          <FilterWord active={portable} onClick={() => setPortable((v) => !v)}>para llevar</FilterWord>
          <FilterWord active={outside === 'casa'} onClick={() => setOutside((v) => (v === 'casa' ? 'todas' : 'casa'))}>la cocinás</FilterWord>
          <FilterWord active={outside === 'afuera'} onClick={() => setOutside((v) => (v === 'afuera' ? 'todas' : 'afuera'))}>se compra</FilterWord>
        </div>

        <p className="v-label-sm mt-1 text-ink-faint">{count} opciones</p>

        <AnimatePresence mode="popLayout">
          {groups.map((group) => (
            <m.section
              key={group.category}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="mt-6"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-line px-1 pb-1.5">
                <h2 className="v-serif text-[18px] text-ink first-letter:uppercase">{group.category}</h2>
                <span className="v-label-sm text-ink-faint">
                  {group.meals.length}{app.perfil.contarCarbos ? ' · g CHO' : ''}
                </span>
              </div>

              {group.meals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => setOpen(meal)}
                  className="flex w-full items-center gap-3 rounded-xl border-b border-line px-1 py-2.5 text-left transition-colors active:bg-surface-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="v-head min-w-0 flex-1 truncate text-[16px] text-ink">{meal.name}</span>
                      {meal.favorite && <span aria-label="Favorita" className="shrink-0 text-[12px] text-ink-soft">★</span>}
                      {app.perfil.contarCarbos && <CarbValue meal={meal} unit={false} />}
                    </span>
                    <MetaLine
                      className="mt-0.5"
                      parts={[
                        meal.portion,
                        meal.portable && 'se lleva',
                        meal.buyOutside ? meal.venues?.[0] : `${meal.activeMinutes} min`,
                        meal.frequency === 'ocasional' && 'de vez en cuando',
                      ]}
                    />
                  </span>
                  <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-ink-faint" aria-hidden>
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </m.section>
          ))}
        </AnimatePresence>

        {count === 0 && (
          <p className="mt-10 border-y border-line py-10 text-center text-[16px] text-ink-faint">
            No encontramos una comida con esos filtros. Probá sacar uno o buscar otra palabra.
          </p>
        )}

        <p className="mt-8 px-1 text-[13px] leading-relaxed text-ink-faint">
          Cuando un dato de hidratos todavía no está verificado, Vianda lo marca dentro de la ficha de la comida.
        </p>

        <Sheet open={open !== null} onClose={() => setOpen(null)}>
          {open && <MealDetail meal={open} />}
        </Sheet>
      </div>
    </LazyMotion>
  )
}

function FilterWord({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`v-label-sm min-h-[34px] rounded-lg px-3 transition-colors ${
        active ? 'bg-accent-soft font-semibold text-accent' : 'border border-line text-ink-faint active:bg-surface-2'
      }`}
    >
      {children}
    </button>
  )
}
