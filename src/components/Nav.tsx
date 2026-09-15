import { Icono } from './base'
import type { IconName } from './tokens'

/* ------------------------------------------------------------------
   NAVEGACIÓN

   Cinco lugares del mismo ancho, que son las cinco cosas que hace la
   app: qué comés ahora, el día entero, la biblioteca, la compra y vos.

   No hay botón central: en una app de comida no existe una acción que
   se repita tanto como para ganarse ese lugar. El que había cuando
   esto era otra cosa se fue con ella.
   ------------------------------------------------------------------ */

export type Tab = 'inicio' | 'hoy' | 'comidas' | 'compras' | 'perfil'

const DESTINOS: { id: Tab; label: string; icono: IconName }[] = [
  { id: 'inicio', label: 'Inicio', icono: 'inicio' },
  { id: 'hoy', label: 'Hoy', icono: 'hoy' },
  { id: 'comidas', label: 'Comidas', icono: 'comidas' },
  { id: 'compras', label: 'Compras', icono: 'compras' },
  { id: 'perfil', label: 'Perfil', icono: 'perfil' },
]

function Destino({
  label,
  icono,
  activo,
  onClick,
}: {
  label: string
  icono: IconName
  activo: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={activo ? 'page' : undefined}
      className={`flex flex-1 flex-col items-center justify-start gap-0.5 pt-2.5 ${
        activo ? 'text-lavanda' : 'text-ink-faint'
      }`}
    >
      <Icono name={icono} size={22} strokeWidth={activo ? 2.1 : 1.7} />
      <span className={`text-[10.5px] ${activo ? 'font-extrabold' : 'font-semibold'}`}>
        {label}
      </span>
      {/* El punto del activo. El color solo nunca es la única señal. */}
      <span
        className={`size-1 rounded-full bg-lavanda transition-opacity duration-150 ${
          activo ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  )
}

export function Nav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-md bg-surface shadow-[0_-1px_16px_-6px_rgb(59_54_84/0.16)] v-safe-bottom">
        <div className="flex items-start px-1 pb-2">
          {DESTINOS.map((d) => (
            <Destino
              key={d.id}
              label={d.label}
              icono={d.icono}
              activo={tab === d.id}
              onClick={() => onTab(d.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}
