export type Tab = 'hoy' | 'semana' | 'comidas' | 'compras'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'hoy', label: 'Hoy', icon: 'M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1Z' },
  { id: 'semana', label: 'Semana', icon: 'M4 6h16v14H4Zm0 4h16M9 3v4m6-4v4' },
  { id: 'comidas', label: 'Comidas', icon: 'M6 3v8a2 2 0 0 0 4 0V3M8 11v10M16 3c-1.5 2-2 3.5-2 6s.7 3 2 3v9' },
  { id: 'compras', label: 'Compras', icon: 'M4 7h16l-1.4 11.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8ZM9 7a3 3 0 0 1 6 0' },
]

/* Cuatro destinos. Preparación y mochila no son secciones: son acciones de HOY. */

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-veil backdrop-blur-xl v-safe-bottom">
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <li key={t.id} className="flex-1">
              <button
                onClick={() => onTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[58px] w-full flex-col items-center justify-center gap-1 pt-1.5 pb-1 transition-colors ${
                  active ? 'text-clay' : 'text-ink-faint'
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-[21px]" fill="none" aria-hidden>
                  <path
                    d={t.icon}
                    stroke="currentColor"
                    strokeWidth={active ? 1.9 : 1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={`text-[11px] ${active ? 'font-semibold' : 'font-medium'}`}>
                  {t.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
