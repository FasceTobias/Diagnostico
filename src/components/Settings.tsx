import type { Cuenta } from '../lib/auth'
import type { DayContext, InsulinSettings, Preferences, Slot } from '../lib/types'
import { CONTEXT_NOTE, SLOT_LABEL, SLOT_ORDER } from '../lib/types'
import { Sheet } from './Sheet'
import { ContextSwitch, SectionLabel } from './ui'

/* Configuración: lo que no se toca todos los días.
   Vive detrás de un ícono en el encabezado, no en la navegación. */

export function SettingsSheet({
  open,
  onClose,
  times,
  onTime,
  context,
  onContext,
  prefs,
  onPrefs,
  cuenta,
  onCuenta,
}: {
  open: boolean
  onClose: () => void
  times: Record<Slot, string>
  onTime: (slot: Slot, time: string) => void
  insulin: InsulinSettings
  onInsulin: (next: InsulinSettings) => void
  context: DayContext
  onContext: (c: DayContext) => void
  prefs: Preferences
  onPrefs: (next: Preferences) => void
  cuenta: Cuenta
  onCuenta: () => void
}) {
  return (
    <>
      <Sheet open={open} onClose={onClose} title="Configuración">
        {/* El contexto ya no vive en HOY: es una decisión ocasional, no algo
            que haya que estar configurando todos los días. */}
        <SectionLabel>Cómo viene el día de hoy</SectionLabel>
        <div className="mt-3">
          <ContextSwitch value={context} onChange={onContext} />
          <p className="mt-2 px-1 text-[12px] leading-relaxed text-ink-faint">
            {CONTEXT_NOTE[context]} Cambiarlo rearma sólo lo que todavía no pasó.
          </p>
        </div>

        {/* Preferencias: por ahora una sola, la que efectivamente hace algo.
            El resto del onboarding todavía no existe. */}
        <SectionLabel className="mt-10">Preferencias</SectionLabel>
        <Toggle
          on={prefs.reduceAddedSugar}
          onToggle={() => onPrefs({ ...prefs, reduceAddedSugar: !prefs.reduceAddedSugar })}
          title="Preferir menos azúcar agregada"
          detail="Entre dos opciones parecidas, desempata la que tiene menos. No esconde ni bloquea nada."
        />

        {/* La cuenta sólo aparece si hay proyecto configurado. Sin backend
            la app no tiene cuentas y nombrarlas sería prometer algo que no
            existe. */}
        {cuenta.estado !== 'sin-backend' && (
          <>
            <SectionLabel className="mt-10">Cuenta</SectionLabel>
            <button
              onClick={onCuenta}
              className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 text-left transition-colors active:bg-surface-2"
            >
              <span className="min-w-0">
                <span className="block text-[16px] text-ink">
                  {cuenta.estado === 'dentro' ? 'Tu cuenta' : 'Entrar o crear una cuenta'}
                </span>
                <span className="v-label-sm mt-0.5 block truncate text-ink-faint">
                  {cuenta.estado === 'dentro'
                    ? cuenta.email
                    : 'Para que tu comida no viva sólo en este teléfono'}
                </span>
              </span>
              <span aria-hidden className="text-[13px] text-ink-faint">
                ›
              </span>
            </button>
          </>
        )}

        <SectionLabel className="mt-10">Horarios</SectionLabel>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Son aproximados y se pueden mover cuando quieras. La app los usa para
          saber qué viene ahora, no para apurarte.
        </p>
        <div className="border-t border-line">
          {SLOT_ORDER.map((slot) => (
            <label key={slot} className="flex items-center justify-between gap-4 border-b border-line py-3">
              <span className="text-[15px] text-ink">{SLOT_LABEL[slot]}</span>
              <input
                type="time"
                value={times[slot]}
                onChange={(e) => onTime(slot, e.target.value)}
                className="rounded-[8px] border border-line bg-transparent px-3 py-2 text-[15px] text-ink v-tnum outline-none focus:border-accent"
              />
            </label>
          ))}
        </div>

      </Sheet>
    </>
  )
}

function Toggle({
  on,
  onToggle,
  title,
  detail,
}: {
  on: boolean
  onToggle: () => void
  title: string
  detail: string
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className="mt-3 flex w-full items-center gap-3.5 rounded-xl border-b border-line px-1 py-3.5 text-left transition-colors active:bg-surface-2"
    >
      <span
        className={`relative h-6 w-10 shrink-0 rounded-pill transition-colors duration-200 ${
          on ? 'bg-accent' : 'bg-line-strong'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
            on ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-faint">
          {detail}
        </span>
      </span>
    </button>
  )
}
