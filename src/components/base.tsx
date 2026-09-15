import type { ReactNode } from 'react'
import { MACIZOS, PATHS, TONO } from './tokens'
import type { IconName, Tono } from './tokens'

/* ------------------------------------------------------------------
   EL KIT

   Tres piezas, y no hay una cuarta:

     A. tarjeta héroe   — una por pantalla, la que manda
     B. tarjeta normal  — todo lo demás
     C. chip            — lo que se toca en fila

   Antes había seis variantes de tarjeta con cuatro paddings y dos
   radios, y el resultado era una pantalla donde nada terminaba a la
   misma altura que lo de al lado. La regla nueva es aburrida a
   propósito: mismo radio, misma sombra, mismo borde, y el padding sale
   de la escala de espacio.

   Del color, una sola cosa: lavanda es la acción. Los otros pasteles
   dicen el momento del día y va uno por tarjeta.
   ------------------------------------------------------------------ */

export function Icono({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.6,
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

/* ---------------- A y B: la tarjeta ---------------- */

/** El padding sale de la escala y no de la inspiración del momento.
    `lista` es para una fila; `normal` para una tarjeta; `hero` para la
    única tarjeta grande de la pantalla. */
type Aire = 'lista' | 'normal' | 'hero'

const AIRE: Record<Aire, string> = {
  lista: 'p-3',
  normal: 'p-4',
  hero: 'p-5',
}

const CAJA = 'rounded-[var(--radius-card)] bg-surface shadow-sm'

export function Card({
  children,
  aire = 'normal',
  className = '',
}: {
  children: ReactNode
  aire?: Aire
  className?: string
}) {
  return <div className={`${CAJA} ${AIRE[aire]} ${className}`}>{children}</div>
}

/** La misma caja, que además se toca. */
export function CardButton({
  children,
  aire = 'normal',
  className = '',
  onClick,
  label,
}: {
  children: ReactNode
  aire?: Aire
  className?: string
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${CAJA} ${AIRE[aire]} w-full text-left transition-transform duration-150 active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  )
}

/* ---------------- C: chips y pastillas ---------------- */

/** Un dato corto y quieto: el momento del día, un número, una etiqueta.
    No se toca. */
export function Pill({
  tono = 'neutro',
  children,
  className = '',
}: {
  tono?: Tono
  children: ReactNode
  className?: string
}) {
  const t = TONO[tono]
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 t-label ${t.bg} ${t.fg} ${className}`}
    >
      {children}
    </span>
  )
}

/** Lo mismo, pero se toca. Activo = lavanda lleno; el resto, blanco con
    un borde finito. Es el mismo gesto en toda la app. */
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
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill px-3.5 text-[13.5px] font-medium transition-colors duration-150 ${
        activo
          ? 'bg-lavanda text-lavanda-ink'
          : 'border border-line bg-surface text-ink-soft active:bg-surface-2'
      }`}
    >
      {icono && <Icono name={icono} size={16} strokeWidth={1.7} />}
      {children}
    </button>
  )
}

/** La fila que se desliza. El sangrado a los costados es exactamente el
    margen de la pantalla, así el primer chip arranca donde arrancan las
    tarjetas y no un poco más adentro. */
export function FilaChips({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="v-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5"
    >
      {children}
    </div>
  )
}

/* ---------------- la baldosa del ícono ---------------- */

export function Tile({
  name,
  tono,
  size = 38,
  icon = 19,
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
      <Icono name={name} size={icon} strokeWidth={1.7} />
    </span>
  )
}

/* ---------------- títulos ---------------- */

/** Título de sección. Dieciséis píxeles hasta el contenido, treinta y
    dos hasta la sección anterior: es lo que hace que se lean como
    bloques y no como una lista larga de cosas. */
export function TituloSeccion({
  children,
  accion,
  className = '',
}: {
  children: ReactNode
  accion?: { label: string; onClick: () => void }
  className?: string
}) {
  return (
    <div className={`mb-4 flex items-baseline justify-between gap-3 ${className}`}>
      <h2 className="t-title text-ink">{children}</h2>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="shrink-0 text-[13.5px] font-medium text-lavanda active:opacity-70"
        >
          {accion.label}
        </button>
      )}
    </div>
  )
}

/** El rótulo de un bloque secundario: más chico que un título, para que
    «Comer afuera» no pese lo mismo que «Lo que sigue hoy». */
export function Rotulo({
  children,
  accion,
}: {
  children: ReactNode
  accion?: { label: string; onClick: () => void }
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h3 className="t-label text-ink-faint">{children}</h3>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="shrink-0 t-label text-lavanda active:opacity-70"
        >
          {accion.label}
        </button>
      )}
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
      ? 'bg-lavanda text-lavanda-ink'
      : variante === 'suave'
        ? 'bg-lavanda-tenue text-lavanda'
        : 'text-lavanda'
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-pill px-4 text-[14.5px] font-semibold transition-transform duration-150 active:scale-[0.98] ${estilo} ${className}`}
    >
      {icono && <Icono name={icono} size={17} strokeWidth={1.9} />}
      {children}
    </button>
  )
}

/* ---------------- vacío ---------------- */

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
    <div className="flex flex-col items-center px-4 py-4 text-center">
      <Tile name={icono} tono={tono} size={44} icon={22} />
      <p className="t-title mt-3 text-ink">{titulo}</p>
      {detalle && <p className="t-meta mt-1.5 max-w-[32ch] text-ink-faint">{detalle}</p>}
      {accion && (
        <Boton variante="suave" onClick={accion.onClick} className="mt-4">
          {accion.label}
        </Boton>
      )}
    </div>
  )
}

/* ---------------- la hoja ---------------- */

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
        <div className="shrink-0 px-5 pt-3 pb-4">
          <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-line-strong" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="t-title text-ink">{titulo}</h2>
              {bajada && <p className="t-meta mt-1 text-ink-faint">{bajada}</p>}
            </div>
            <button
              type="button"
              onClick={onCerrar}
              className="-mt-0.5 shrink-0 rounded-pill px-3 py-1.5 text-[13.5px] font-semibold text-lavanda active:bg-surface-2"
            >
              Listo
            </button>
          </div>
        </div>
        <div className="v-no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-8 v-safe-bottom">
          {children}
        </div>
      </div>
    </div>
  )
}
