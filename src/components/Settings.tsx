import { useState } from 'react'
import type { InsulinSettings, Slot } from '../lib/types'
import { SLOT_LABEL, SLOT_ORDER } from '../lib/types'
import { CARB_UNIT } from '../lib/format'
import { Sheet } from './Sheet'
import { CarbCalculator } from './CarbCalculator'

/* Configuración: lo que no se toca todos los días.
   Vive detrás de un ícono en el encabezado, no en la navegación. */

export function SettingsSheet({
  open,
  onClose,
  times,
  onTime,
  insulin,
  onInsulin,
}: {
  open: boolean
  onClose: () => void
  times: Record<Slot, string>
  onTime: (slot: Slot, time: string) => void
  insulin: InsulinSettings
  onInsulin: (next: InsulinSettings) => void
}) {
  const [calc, setCalc] = useState(false)

  const general = insulin.ratios.find((r) => r.scope === 'general')

  const setGrams = (grams: number) =>
    onInsulin({
      ...insulin,
      ratios: insulin.ratios.map((r) =>
        r.scope === 'general' ? { ...r, gramsPerUnit: grams } : r,
      ),
    })

  return (
    <>
      <Sheet open={open} onClose={onClose} title="Configuración">
        <h3 className="v-eyebrow text-ink-faint">Horarios</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Son aproximados y se pueden mover cuando quieras. La app los usa para
          saber qué viene ahora, no para apurarte.
        </p>
        <div className="mt-3 divide-y divide-line">
          {SLOT_ORDER.map((slot) => (
            <label key={slot} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[15px] text-ink">{SLOT_LABEL[slot]}</span>
              <input
                type="time"
                value={times[slot]}
                onChange={(e) => onTime(slot, e.target.value)}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-[15px] text-ink v-tnum outline-none focus:border-clay"
              />
            </label>
          ))}
        </div>

        {/* ---- Insulina: existe, pero no domina ---- */}
        <h3 className="v-eyebrow mt-9 text-ink-faint">Relación insulina / carbohidratos</h3>

        <button
          onClick={() => onInsulin({ ...insulin, enabled: !insulin.enabled })}
          aria-pressed={insulin.enabled}
          className="mt-3 flex w-full items-center gap-3.5 rounded-card border border-line px-4 py-3.5 text-left active:bg-surface-2"
        >
          <span
            className={`relative h-6 w-10 shrink-0 rounded-pill transition-colors duration-200 ${
              insulin.enabled ? 'bg-clay' : 'bg-line-strong'
            }`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                insulin.enabled ? 'left-[18px]' : 'left-0.5'
              }`}
            />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-medium text-ink">
              Guardar mi relación y usar la calculadora
            </span>
            <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-faint">
              Apagado, la app no muestra nada de insulina en ningún lado.
            </span>
          </span>
        </button>

        {insulin.enabled && general && (
          <div className="v-rise mt-3">
            <div className="rounded-card bg-surface px-4 py-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[17px] text-ink">
                <span className="font-semibold v-tnum">1 unidad</span>
                <span className="text-ink-soft">por</span>
                <input
                  inputMode="decimal"
                  value={general.gramsPerUnit}
                  onChange={(e) => {
                    const n = Number(e.target.value.replace(',', '.'))
                    if (Number.isFinite(n) && n > 0) setGrams(n)
                  }}
                  aria-label="Gramos de carbohidratos por unidad"
                  className="w-20 rounded-xl border border-line bg-bg px-3 py-2 text-[17px] font-semibold text-ink v-tnum outline-none focus:border-clay"
                />
                <span className="text-ink-soft">{CARB_UNIT}</span>
              </div>
            </div>

            <button
              onClick={() => setCalc(true)}
              className="mt-2 min-h-[48px] w-full rounded-card border border-line bg-surface text-[15px] font-semibold text-ink active:scale-[0.98]"
            >
              Abrir la calculadora
            </button>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
              Más adelante vas a poder guardar relaciones distintas por momento del
              día o por franja horaria. Por ahora se usa una sola para todo.
            </p>

            <p className="mt-3 rounded-2xl border border-line px-4 py-3.5 text-[13px] leading-relaxed text-ink-soft">
              Vianda guarda este número y hace la división cuando se la pedís.
              Nunca calcula ni sugiere dosis por su cuenta, y no reemplaza lo que
              te indicó tu médico.
            </p>
          </div>
        )}
      </Sheet>

      <CarbCalculator
        open={calc}
        onClose={() => setCalc(false)}
        insulin={insulin}
      />
    </>
  )
}
