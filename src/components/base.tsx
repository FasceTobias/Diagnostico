import type { ReactNode } from 'react'
import { MACIZOS, PATHS, TONO } from './tokens'
import type { IconName, Tono } from './tokens'

/* ------------------------------------------------------------------
   EL KIT

   Todo lo que se dibuje de acá en adelante sale de estas piezas. La
   prueba para cualquier componente nuevo es una sola: ¿podría estar en
   la pantalla de inicio sin que se note que llegó después? Si no, se
   rehace con estas piezas hasta que sí.

   Cuatro cosas hacen el sistema, y son las cuatro que no se tocan:
   papel crema, tarjeta blanca de esquinas grandes, sombra que casi no
   está, y un solo acento pastel por tarjeta.
   ------------------------------------------------------------------ */

export function Icono({
  name,
  size = 22,
  className = '',
  strokeWidth = 1.7,
}: {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}) {
  const macizo = MACIZOS.includes(name)
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={macizo ? 'currentColor' : 'none'}
      aria-hidden
    >
      <path
        d={PATHS[name]}
        stroke={macizo ? 'none' : 'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------------- tarjeta ---------------- */

/** La tarjeta blanca. Es el 90% de la app: todo lo que se muestre vive
    adentro de una, y el papel crema se ve entre ellas. */
export function Card({
  children,
  className = '',
  padding = 'p-5',
}: {
  children: ReactNode
  className?: string
  padding?: string
}) {
  return (
    <div className={`rounded-[var(--radius-hero)] bg-surface shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  )
}

/** Una tarjeta que se toca. Misma caja, con respuesta al tacto. */
export function CardButton({
  children,
  className = '',
  padding = 'p-5',
  onClick,
  label,
}: {
  children: ReactNode
  className?: string
  padding?: string
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`w-full rounded-[var(--radius-hero)] bg-surface text-left shadow-sm transition-transform duration-150 active:scale-[0.985] ${padding} ${className}`}
    >
      {children}
    </button>
  )
}

/* ---------------- pastilla ---------------- */

/** Una etiqueta corta: el momento del día, un dato de la comida, el
    lugar donde se compra. Con punto cuando marca un estado. */
export function Pill({
  tono = 'neutro',
  children,
  dot = false,
  className = '',
}: {
  tono?: Tono
  children: ReactNode
  dot?: boolean
  className?: string
}) {
  const t = TONO[tono]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[13px] font-bold ${t.bg} ${t.fg} ${className}`}
    >
      {dot && <span className={`size-1.5 rounded-full ${t.fill}`} />}
      {children}
    </span>
  )
}

/* ---------------- baldosa de ícono ---------------- */

/** El cuadrado redondeado con el ícono adentro. Es el único lugar donde
    entra el pastel en una tarjeta, y por eso hay uno solo. */
export function Tile({
  name,
  tono,
  size = 40,
  icon = 21,
}: {
  name: IconName
  tono: Tono
  size?: number
  icon?: number
}) {
  const t = TONO[tono]
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[var(--radius-tile)] ${t.bg} ${t.fg}`}
      style={{ width: size, height: size }}
    >
      <Icono name={name} size={icon} strokeWidth={1.8} />
    </span>
  )
}

/* ---------------- título de sección ---------------- */

export function TituloSeccion({
  children,
  chispa = false,
  accion,
  className = '',
}: {
  children: ReactNode
  /** La chispa amarilla. Una sola por pantalla, en la sección que manda. */
  chispa?: boolean
  accion?: { label: string; onClick: () => void }
  className?: string
}) {
  return (
    <div className={`mb-3 flex items-center justify-between gap-3 ${className}`}>
      <h2 className="v-head flex items-center gap-1.5 text-[20px] text-ink">
        {children}
        {chispa && <Icono name="chispa" size={15} className="text-mantequilla" />}
      </h2>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="shrink-0 text-[14px] font-bold text-lavanda active:opacity-70"
        >
          {accion.label}
        </button>
      )}
    </div>
  )
}

/* ---------------- chips ----------------

   La fila de pastillas seleccionables: la situación, los lugares, los
   filtros de snacks. La activa va rellena de lavanda; las otras son
   blancas con un borde finito. Es el mismo gesto en toda la app. */

export function Chip({
  children,
  icono,
  activo = false,
  onClick,
}: {
  children: ReactNode
  icono?: IconName
  activo?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-pill px-3.5 text-[14.5px] font-bold transition-colors duration-150 ${
        activo
          ? 'bg-lavanda text-lavanda-ink'
          : 'border border-line bg-surface text-ink-soft active:bg-surface-2'
      }`}
    >
      {icono && <Icono name={icono} size={18} strokeWidth={activo ? 2 : 1.8} />}
      {children}
    </button>
  )
}

/** La fila que se desliza. El padding a los costados va acá adentro para
    que el primer y el último chip no queden pegados al borde. */
export function FilaChips({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="v-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
    >
      {children}
    </div>
  )
}

/* ---------------- botones ---------------- */

export function Boton({
  children,
  onClick,
  variante = 'principal',
  icono,
  className = '',
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variante?: 'principal' | 'suave' | 'texto'
  icono?: IconName
  className?: string
  type?: 'button' | 'submit'
}) {
  const estilo =
    variante === 'principal'
      ? 'bg-lavanda text-lavanda-ink shadow-sm'
      : variante === 'suave'
        ? 'bg-lavanda-tenue text-lavanda'
        : 'text-lavanda'
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-pill px-4 text-[15px] font-extrabold transition-transform duration-150 active:scale-[0.97] ${estilo} ${className}`}
    >
      {icono && <Icono name={icono} size={19} strokeWidth={2} />}
      {children}
    </button>
  )
}

/* ---------------- vacío ----------------

   Una sección sin nada no es un error: es un día que todavía no armaste.
   Dice qué falta y ofrece el camino, sin rellenar con datos de mentira. */

export function Vacio({
  icono,
  tono = 'lavanda',
  titulo,
  detalle,
  accion,
}: {
  icono: IconName
  tono?: Tono
  titulo: string
  detalle?: string
  accion?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center px-4 py-5 text-center">
      <Tile name={icono} tono={tono} size={48} icon={24} />
      <p className="v-head mt-3 text-[17px] text-ink">{titulo}</p>
      {detalle && <p className="mt-1 max-w-[34ch] text-[14px] text-ink-faint">{detalle}</p>}
      {accion && (
        <Boton variante="suave" onClick={accion.onClick} className="mt-4">
          {accion.label}
        </Boton>
      )}
    </div>
  )
}

/* ---------------- hoja ----------------

   Sube desde abajo, ocupa lo que necesita y se va tocando afuera. Las
   respuestas largas —«mostrame todos los snacks dulces»— viven acá y no
   en otra pantalla: la pregunta se hizo en Inicio y la respuesta vuelve
   a Inicio. */

export function Sheet({
  abierta,
  onCerrar,
  titulo,
  bajada,
  children,
}: {
  abierta: boolean
  onCerrar: () => void
  titulo: string
  bajada?: string
  children: ReactNode
}) {
  if (!abierta) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="v-fade absolute inset-0 bg-[var(--v-scrim)]"
      />
      <div className="v-sheet-in relative flex max-h-[86vh] w-full max-w-md flex-col rounded-t-[var(--radius-sheet)] bg-bg">
        <div className="shrink-0 px-5 pt-3 pb-2">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="v-head text-[20px] text-ink">{titulo}</h2>
              {bajada && <p className="mt-0.5 text-[14px] text-ink-faint">{bajada}</p>}
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="-mt-1 shrink-0 rounded-pill px-3 py-1.5 text-[14px] font-bold text-lavanda active:bg-surface-2"
            >
              Listo
            </button>
          </div>
        </div>
        <div className="v-no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-8 v-safe-bottom">
          {children}
        </div>
      </div>
    </div>
  )
}
