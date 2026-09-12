import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'

/* Bottom sheet: acá vive todo lo secundario.
   Entra con un resorte corto y sale más rápido de lo que entró — así se
   siente ágil sin que parezca apurada. */

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

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <m.button
              aria-label="Cerrar"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-[#1c1814]/40"
            />
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 42, mass: 0.9 }}
              className="relative max-h-[88vh] overflow-y-auto rounded-t-sheet bg-bg shadow-lg v-safe-bottom"
            >
              <div className="sticky top-0 z-10 bg-bg/96 px-6 pt-3 backdrop-blur-sm">
                <div aria-hidden className="mx-auto h-1 w-9 rounded-full bg-line-strong" />
                {title && (
                  <h2 className="v-serif-lg pt-5 pb-4 text-[26px] text-ink">{title}</h2>
                )}
              </div>
              <div className="px-6 pt-1 pb-8">{children}</div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
