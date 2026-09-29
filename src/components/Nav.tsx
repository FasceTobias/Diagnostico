import { Icono } from './base'
import type { IconName } from './tokens'

/* ------------------------------------------------------------------
   NAVEGACIÓN

   Lugares del mismo ancho, que son las tareas principales de la
   app. Sin botón central: en una app de comida no hay una acción que se
   repita tanto como para ganarse ese lugar.

   Se apoya en el papel con una línea, no con una sombra. La sombra la
   hacía parecer pegada encima de la pantalla; la línea la integra.
   ------------------------------------------------------------------ */

export type Tab = 'inicio' | 'hoy' | 'semana' | 'comidas' | 'compras' | 'perfil' | 'guia'

const DESTINOS: { id: Tab; label: string; icono: IconName }[] = [
  { id: 'inicio', label: 'Inicio', icono: 'inicio' },
  { id: 'semana', label: 'Semana', icono: 'semana' },
  { id: 'hoy', label: 'Hoy', icono: 'hoy' },
  { id: 'comidas', label: 'Comidas', icono: 'comidas' },
  { id: 'compras', label: 'Compras', icono: 'compras' },
  { id: 'perfil', label: 'Perfil', icono: 'perfil' },
]

export function Nav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-veil backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md items-stretch px-1 v-safe-bottom">
        {DESTINOS.map((d) => {
          const activo = tab === d.id
          return (
            <li key={d.id} className="flex-1">
              <button
                type="button"
                onClick={() => onTab(d.id)}
                aria-current={activo ? 'page' : undefined}
                className={`relative flex h-[62px] w-full flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                  activo ? 'text-lavanda' : 'text-ink-faint'
                }`}
              >
                <span aria-hidden className={`absolute top-0 h-[3px] w-8 rounded-full bg-accent transition-all duration-200 ${activo ? 'opacity-100' : 'scale-x-0 opacity-0'}`} />
                <Icono name={d.icono} size={21} strokeWidth={activo ? 1.9 : 1.6} />
                <span className={`text-[12px] ${activo ? 'font-semibold' : 'font-medium'}`}>
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
