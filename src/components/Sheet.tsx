import { useEffect, type ReactNode } from 'react'

/* Bottom sheet: acá vive todo lo secundario.
   La pantalla principal se mantiene con una sola acción visible. */

/* Los sheets se apilan (la calculadora se abre sobre Configuración), así que
   el bloqueo del scroll de fondo se cuenta: sólo lo libera el último en cerrar. */
let openSheets = 0

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    openSheets += 1
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      openSheets -= 1
      if (openSheets === 0) document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/35 v-fade backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="v-sheet-in relative max-h-[88vh] overflow-y-auto rounded-t-sheet bg-bg shadow-lg v-safe-bottom"
      >
        <div className="sticky top-0 z-10 bg-bg/95 pt-2.5 backdrop-blur">
          <div aria-hidden className="mx-auto h-1 w-9 rounded-full bg-line-strong" />
          {title && (
            <h2 className="px-5 pt-3 pb-1 text-[22px] v-display text-ink">{title}</h2>
          )}
        </div>
        <div className="px-5 pt-1 pb-7">{children}</div>
      </div>
    </div>
  )
}
