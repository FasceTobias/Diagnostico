import { Icono } from './base'
import type { IconName } from './tokens'

/* ------------------------------------------------------------------
   NAVEGACIÓN

   Cinco lugares del mismo ancho, que son las cinco cosas que hace la
   app. Sin botón central: en una app de comida no hay una acción que se
   repita tanto como para ganarse ese lugar.

   Se apoya en el papel con una línea, no con una sombra. La sombra la
   hacía parecer pegada encima de la pantalla; la línea la integra.
   ------------------------------------------------------------------ */

export type Tab = 'inicio' | 'hoy' | 'comidas' | 'compras' | 'perfil'

const DESTINOS: { id: Tab; label: string; icono: IconName }[] = [
  { id: 'inicio', label: 'Inicio', icono: 'inicio' },
  { id: 'hoy', label: 'Hoy', icono: 'hoy' },
  { id: 'comidas', label: 'Comidas', icono: 'comidas' },
  { id: 'compras', label: 'Compras', icono: 'compras' },
  { id: 'perfil', label: 'Perfil', icono: 'perfil' },
]

export function Nav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-veil backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md items-stretch px-2 v-safe-bottom">
        {DESTINOS.map((d) => {
          const activo = tab === d.id
          return (
            <li key={d.id} className="flex-1">
              <button
                type="button"
                onClick={() => onTab(d.id)}
                aria-current={activo ? 'page' : undefined}
                className={`flex h-[58px] w-full flex-col items-center justify-center gap-1 ${
                  activo ? 'text-lavanda' : 'text-ink-faint'
                }`}
              >
                <Icono name={d.icono} size={21} strokeWidth={activo ? 1.9 : 1.6} />
                <span className={`text-[10.5px] ${activo ? 'font-semibold' : 'font-medium'}`}>
                  {d.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
