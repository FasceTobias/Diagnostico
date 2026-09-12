export type Tab = 'hoy' | 'semana' | 'comidas' | 'compras'

/* Navegación de app: ícono, palabra y un estado activo que no deja dudas.
   56px de alto, cada destino con su propia superficie táctil. */

const TABS: { id: Tab; label: string; path: string }[] = [
  { id: 'hoy', label: 'Hoy', path: 'M4 10.4 12 4l8 6.4V19a1 1 0 0 1-1 1h-4.5v-5.2h-5V20H5a1 1 0 0 1-1-1Z' },
  { id: 'semana', label: 'Semana', path: 'M4.5 6.5h15v13h-15zM4.5 10.5h15M9 4v3.4M15 4v3.4' },
  { id: 'comidas', label: 'Comidas', path: 'M6.5 4v5.2a1.8 1.8 0 0 0 3.6 0V4M8.3 11v9M15.5 4c-1.3 1.6-1.8 3.4-1.8 5.4 0 1.6.6 2.4 1.8 2.4V20' },
  { id: 'compras', label: 'Compras', path: 'M5 7.5h14l-1.2 10.1a1.7 1.7 0 0 1-1.7 1.4H7.9a1.7 1.7 0 0 1-1.7-1.4ZM9.2 7.5a2.8 2.8 0 0 1 5.6 0' },
]

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 backdrop-blur-md v-safe-bottom">
      <ul className="mx-auto flex max-w-md px-2 py-1.5">
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <li key={t.id} className="flex-1">
              <button
                onClick={() => onTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 ${
                  active ? 'bg-clay-soft text-clay' : 'text-ink-faint active:bg-surface-2'
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-[21px]" fill="none" aria-hidden>
                  <path
                    d={t.path}
                    stroke="currentColor"
                    strokeWidth={active ? 2 : 1.6}
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
