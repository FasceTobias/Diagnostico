import { useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { Category, Meal } from '../lib/types'
import { CarbValue, MetaLine } from '../components/ui'
import { Sheet } from '../components/Sheet'
import { MealDetail } from '../components/MealDetail'

/* COMIDAS — un índice, no un catálogo.

   Las opciones se agrupan por momento del día con encabezados en serif y
   cada una ocupa un renglón: nombre a la izquierda, carbohidratos a la
   derecha, datos abajo en versalitas. Sin tarjetas y sin cápsulas: los
   filtros son palabras que se subrayan. */

const CATEGORIES: (Category | 'todas')[] = [
  'todas',
  'desayuno',
  'snack',
  'almuerzo',
  'merienda',
  'cena',
]

const ORDER: Category[] = ['desayuno', 'snack', 'almuerzo', 'merienda', 'cena']

export function Comidas({ app }: { app: Vianda }) {
  const [cat, setCat] = useState<Category | 'todas'>('todas')
  const [portable, setPortable] = useState(false)
  const [outside, setOutside] = useState<'todas' | 'casa' | 'afuera'>('todas')
  const [open, setOpen] = useState<Meal | null>(null)

  const groups = useMemo(() => {
    const list = app.meals
      .filter((m) => (cat === 'todas' ? true : m.category === cat))
      .filter((m) => (portable ? m.portable : true))
      .filter((m) =>
        outside === 'todas' ? true : outside === 'afuera' ? m.buyOutside : !m.buyOutside,
      )
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name))

    return ORDER.map((c) => ({ category: c, meals: list.filter((m) => m.category === c) })).filter(
      (g) => g.meals.length > 0,
    )
  }, [app.meals, cat, portable, outside])

  const count = groups.reduce((n, g) => n + g.meals.length, 0)

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto max-w-md px-4 pb-40">
        <header className="v-safe-top pt-5 pb-4">
          <h1 className="v-serif-lg text-[28px] text-ink">Comidas</h1>
          <p className="v-label-sm mt-1.5 text-ink-faint">
            {count} de {app.meals.length}
          </p>
        </header>

        {/* Filtros como palabras, no como botones */}
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
          <FilterWord active={portable} onClick={() => setPortable((v) => !v)}>
            se lleva
          </FilterWord>
          <FilterWord
            active={outside === 'casa'}
            onClick={() => setOutside((v) => (v === 'casa' ? 'todas' : 'casa'))}
          >
            la cocinás
          </FilterWord>
          <FilterWord
            active={outside === 'afuera'}
            onClick={() => setOutside((v) => (v === 'afuera' ? 'todas' : 'afuera'))}
          >
            se compra
          </FilterWord>
        </div>

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
                <h2 className="v-serif text-[18px] text-ink first-letter:uppercase">
                  {group.category}
                </h2>
                <span className="v-label-sm text-ink-faint">
                  {group.meals.length} · g CHO
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
                      <span className="v-head min-w-0 flex-1 truncate text-[16px] text-ink">
                        {meal.name}
                      </span>
                      {meal.favorite && (
                        <span aria-label="Favorita" className="shrink-0 text-[12px] text-ink-soft">
                          ★
                        </span>
                      )}
                      <CarbValue meal={meal} unit={false} />
                    </span>
                    <MetaLine
                      className="mt-0.5"
                      parts={[
                        meal.satiety,
                        meal.drink,
                        meal.buyOutside ? meal.venues?.[0] : `${meal.prepMinutes} min`,
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
            No hay comidas con esos filtros.
          </p>
        )}

        <p className="mt-8 px-1 text-[13px] leading-relaxed text-ink-faint">
          Las del catálogo tienen la porción documentada y el carbohidrato calculado
          sobre esa porción; siguen con tilde porque ninguna se midió todavía contra
          una etiqueta. Las marcadas <span className="text-ink-soft">demo</span> son
          las que quedan por reemplazar.
        </p>

        <Sheet open={open !== null} onClose={() => setOpen(null)}>
          {open && <MealDetail meal={open} />}
        </Sheet>
      </div>
    </LazyMotion>
  )
}

function FilterWord({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`v-label-sm min-h-[34px] rounded-lg px-3 transition-colors ${
        active
          ? 'bg-accent-soft font-semibold text-accent'
          : 'border border-line text-ink-faint active:bg-surface-2'
      }`}
    >
      {children}
    </button>
  )
}
