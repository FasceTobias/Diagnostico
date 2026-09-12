export type Tab = 'hoy' | 'semana' | 'comidas' | 'compras'

const TABS: { id: Tab; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'semana', label: 'Semana' },
  { id: 'comidas', label: 'Comidas' },
  { id: 'compras', label: 'Compras' },
]

/* Cuatro destinos, en palabras. Sin íconos: a este tamaño un ícono de
   "comidas" y uno de "compras" se confunden, y la palabra no. */

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/94 backdrop-blur-md v-safe-bottom">
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <li key={t.id} className="flex-1">
              <button
                onClick={() => onTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className="relative flex min-h-[52px] w-full items-center justify-center"
              >
                <span
                  className={`v-label transition-colors duration-150 ${
                    active ? 'text-ink' : 'text-ink-faint'
                  }`}
                >
                  {t.label}
                </span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-0 right-5 left-5 h-[2px] bg-clay"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
