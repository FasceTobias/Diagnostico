import { useState } from 'react'
import type { InsulinSettings, Meal, Slot } from '../lib/types'
import { CARB_UNIT } from '../lib/format'
import { carbMath, formatUnits, ratioFor } from '../lib/insulin'
import { Sheet } from './Sheet'

/* ------------------------------------------------------------------
   CALCULADORA DE REFERENCIA

   Se abre a mano. Nunca aparece sola, nunca en una tarjeta, nunca en una
   lista. Hace una división y la muestra con la cuenta a la vista, para que
   se entienda de dónde sale el número.

   Las cuatro cosas quedan separadas y rotuladas:
     1. los carbohidratos de la comida
     2. tu relación configurada
     3. el resultado matemático
     4. la decisión, que es tuya
   ------------------------------------------------------------------ */

export function CarbCalculator({
  open,
  onClose,
  insulin,
  meal,
  slot,
  time,
  onEditRatio,
}: {
  open: boolean
  onClose: () => void
  insulin: InsulinSettings
  meal?: Meal
  slot?: Slot
  time?: string
  onEditRatio?: () => void
}) {
  const [carbs, setCarbs] = useState<string>(meal ? String(meal.carbs) : '')

  const ratio = ratioFor(insulin, slot, time)
  const value = Number(carbs.replace(',', '.'))
  const result = ratio ? carbMath(value, ratio.gramsPerUnit) : null

  return (
    <Sheet open={open} onClose={onClose} title="Calculadora de referencia">
      {/* 1 — los carbohidratos */}
      <label className="block">
        <span className="v-label text-ink-faint">Carbohidratos de la comida</span>
        <span className="mt-2 flex items-baseline gap-2">
          <input
            inputMode="decimal"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            className="w-28 border-b-[1.5px] border-line-strong bg-transparent pb-2 text-[30px] v-serif text-ink v-tnum outline-none focus:border-clay"
          />
          <span className="text-[16px] text-ink-soft">{CARB_UNIT}</span>
        </span>
      </label>

      {meal && (
        <p className="mt-2 text-[13px] text-ink-faint">
          De {meal.name.toLowerCase()}. Podés ajustarlo si comés más o menos.
        </p>
      )}

      {meal && !meal.carbsVerified && (
        <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
          <span className="font-semibold text-ink-soft">
            Estos carbohidratos no están verificados.
          </span>{' '}
          Son un valor de demostración. El resultado de abajo es aritmética sobre
          un número que todavía no es real.
        </p>
      )}

      {/* 2 — tu relación */}
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="v-label text-ink-faint">Tu relación configurada</p>
          <p className="mt-1.5 text-[17px] font-semibold text-ink v-tnum">
            {ratio ? `1 u por ${ratio.gramsPerUnit} ${CARB_UNIT}` : 'Sin configurar'}
          </p>
        </div>
        {onEditRatio && (
          <button
            onClick={onEditRatio}
            className="v-label-sm shrink-0 border-b border-clay pb-0.5 text-ink-soft active:text-ink"
          >
            Editar
          </button>
        )}
      </div>

      {/* 3 — la cuenta */}
      <div className="mt-5 border-y border-line py-5">
        <p className="v-label text-ink-faint">Resultado matemático</p>
        {result ? (
          <>
            <p className="v-serif-lg mt-2 text-[46px] text-ink v-tnum">
              {formatUnits(result.rounded)}
              <span className="ml-2 text-[18px] font-normal text-ink-soft">
                {result.rounded === 1 ? 'unidad' : 'unidades'}
              </span>
            </p>
            <p className="mt-3 text-[14px] text-ink-soft v-tnum">
              {result.carbs} ÷ {result.gramsPerUnit} = {formatUnits(Math.round(result.units * 100) / 100)}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[15px] text-ink-faint">
            {ratio ? 'Escribí los carbohidratos.' : 'Configurá primero tu relación.'}
          </p>
        )}
      </div>

      {/* 4 — la decisión */}
      <p className="mt-5 text-[13px] leading-relaxed text-ink-soft">
        Esto es una división, no una indicación. No mira tu glucemia, ni lo que
        hiciste hoy, ni nada más. <span className="text-ink">La dosis la decidís vos</span>,
        con lo que te indicó tu médico.
      </p>
    </Sheet>
  )
}
