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
      <div className="mx-auto max-w-md px-6 pb-32">
        <header className="v-safe-top pt-8 pb-6">
          <h1 className="v-serif-lg text-[38px] text-ink">Comidas</h1>
          <p className="v-label-sm mt-3 text-ink-faint">
            {count} de {app.meals.length} · todas de demostración
          </p>
        </header>

        {/* Filtros como palabras, no como botones */}
        <div className="v-no-scrollbar -mx-6 flex gap-5 overflow-x-auto border-y border-line px-6 py-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`v-label shrink-0 transition-colors ${
                c === cat
                  ? 'text-ink underline decoration-clay decoration-2 underline-offset-[7px]'
                  : 'text-ink-faint'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-5 py-3">
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
              className="mt-8"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <h2 className="v-serif text-[21px] text-ink first-letter:uppercase">
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
                  className="flex w-full items-baseline gap-4 border-b border-line py-3.5 text-left active:bg-surface-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="v-serif truncate text-[17px] text-ink">{meal.name}</span>
                      {meal.favorite && (
                        <span aria-label="Favorita" className="shrink-0 text-[12px] text-clay">
                          ★
                        </span>
                      )}
                    </span>
                    <MetaLine
                      className="mt-1"
                      parts={[
                        meal.satiety,
                        meal.buyOutside ? meal.venues?.[0] : `${meal.prepMinutes} min`,
                        meal.frequency === 'ocasional' && 'de vez en cuando',
                      ]}
                    />
                  </span>
                  <CarbValue meal={meal} unit={false} />
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

        <p className="mt-10 text-[13px] leading-relaxed text-ink-faint">
          Todas son de demostración: los carbohidratos no están verificados y las
          comidas no las elegiste vos. La biblioteca real la construimos comida
          por comida.
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
      className={`text-[14px] transition-colors ${
        active
          ? 'text-ink underline decoration-clay decoration-2 underline-offset-[6px]'
          : 'text-ink-faint'
      }`}
    >
      {children}
    </button>
  )
}
