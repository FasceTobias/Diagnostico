import { useState } from 'react'
import type { DayContext, InsulinSettings, Preferences, Slot } from '../lib/types'
import { CONTEXT_NOTE, SLOT_LABEL, SLOT_ORDER } from '../lib/types'
import { CARB_UNIT } from '../lib/format'
import { Sheet } from './Sheet'
import { ContextSwitch, SectionLabel } from './ui'
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
  context,
  onContext,
  prefs,
  onPrefs,
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
                className="rounded-[8px] border border-line bg-transparent px-3 py-2 text-[15px] text-ink v-tnum outline-none focus:border-clay"
              />
            </label>
          ))}
        </div>

        {/* ---- Insulina: existe, pero no domina ---- */}
        <SectionLabel className="mt-10">Relación insulina / carbohidratos</SectionLabel>

        <Toggle
          on={insulin.enabled}
          onToggle={() => onInsulin({ ...insulin, enabled: !insulin.enabled })}
          title="Guardar mi relación y usar la calculadora"
          detail="Apagado, la app no muestra nada de insulina en ningún lado."
        />

        {insulin.enabled && general && (
          <div className="v-rise mt-3">
            <div className="border-b border-line py-5">
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
              className="mt-4 min-h-[48px] w-full rounded-[10px] border border-ink/80 text-[15px] font-semibold text-ink active:scale-[0.98]"
            >
              Abrir la calculadora
            </button>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
              Más adelante vas a poder guardar relaciones distintas por momento del
              día o por franja horaria. Por ahora se usa una sola para todo.
            </p>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
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
          on ? 'bg-clay' : 'bg-line-strong'
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
