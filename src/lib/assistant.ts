import type { DayContext, Meal, ResolveReason, Slot } from './types'
import { SLOT_LABEL } from './types'
import type { Vianda } from './store'
import {
  candidatesFor,
  compatibleReplacements,
  findNext,
  prepTasksFor,
  rescueOptions,
} from './domain'

/* ------------------------------------------------------------------
   ASISTENTE — arquitectura, no chatbot.

   La respuesta no es texto libre: es una estructura que la app sabe
   dibujar con sus propios componentes. Hoy la resuelven reglas locales.
   Mañana la puede resolver un modelo: el contrato de entrada/salida es
   el mismo, y la UI no se entera del cambio.

   Todo lo que propone sale del mismo filtro que usa la rotación, así que
   nunca sugiere algo que no sirva para el día que estás teniendo.
   ------------------------------------------------------------------ */

export interface AssistantAnswer {
  title: string
  note?: string
  meals?: { meal: Meal; why?: string }[]
  tasks?: string[]
  /** Un cambio de contexto que resuelve el pedido de raíz. */
  suggestContext?: DayContext
  /** Abre «Resolver ahora» en el paso que corresponde. El asistente propone
      acciones, no párrafos. */
  action?: { reason: ResolveReason; slot?: Slot; label: string }
  /** Lo que el asistente todavía no sabe hacer. Se dice, no se inventa. */
  unsupported?: boolean
}

export interface AssistantQuery {
  text: string
  app: Vianda
}

export const SUGGESTIONS = [
  'Estoy en la calle y no traje almuerzo',
  '¿Qué puedo comprar ahora?',
  'Tengo más hambre',
  'Pensé que volvía pero no vuelvo',
  'Tengo 10 minutos',
  'No preparé nada',
  'Mañana salgo 6:30',
  'No tengo yogur',
]

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w))

/* Snack y merienda no son lo mismo, así que se reconocen por separado. */
const SLOT_WORDS: [Slot, string[]][] = [
  ['breakfast', ['desayuno', 'desayunar']],
  ['snack_am', ['snack de manana', 'snack am', 'snack de la manana']],
  ['lunch', ['almuerzo', 'almorzar']],
  ['snack_pm', ['snack de tarde', 'snack pm', 'snack de la tarde']],
  ['merienda', ['merienda', 'merendar']],
  ['dinner', ['cena', 'cenar']],
]

const findSlot = (t: string): Slot | undefined => {
  for (const [slot, words] of SLOT_WORDS) if (words.some((w) => t.includes(w))) return slot
  // "snack" a secas: el que venga más adelante en el día
  if (t.includes('snack')) return 'snack_pm'
  return undefined
}

export const askAssistant = ({ text, app }: AssistantQuery): AssistantAnswer => {
  const t = norm(text)
  const { meals, today } = app
  const context = today?.context ?? 'mixto'
  const next = today ? findNext(today, meals) : undefined

  /* ---- Estoy afuera ----
     Es el caso más urgente: pasa a las 12:30, parado, sin nada encima.
     Por eso va primero y responde con una acción, no con un párrafo. */
  const onTheStreet = has(
    t,
    'en la calle',
    'estoy afuera',
    'no traje',
    'no vuelvo',
    'pense que volvia',
    'me quede afuera',
  )
  const wantsToBuy = has(t, 'que puedo comprar', 'comprar ahora', 'donde compro', 'comprar algo')

  if (onTheStreet || wantsToBuy) {
    const slot = findSlot(t) ?? next?.planned.slot
    const slotName = slot ? SLOT_LABEL[slot].toLowerCase() : 'la próxima comida'
    const notComingBack = has(t, 'no vuelvo', 'pense que volvia')

    return {
      title: onTheStreet ? `Estás afuera y no tenés ${slotName}` : `Qué buscar para ${slotName}`,
      note: notComingBack
        ? 'Resolvé lo de ahora, y si querés dejo el resto del día como día en la calle.'
        : 'Te muestro qué tipo de opción buscar, no lugares concretos.',
      action: {
        reason: 'sin-comida',
        slot,
        label: `Resolver ${slotName} ahora`,
      },
      suggestContext: notComingBack ? 'calle' : undefined,
    }
  }

  /* ---- Poco tiempo, ahora ---- */
  if (has(t, '10 minutos', '15 minutos', 'poco tiempo', 'cinco minutos')) {
    const slot = findSlot(t) ?? next?.planned.slot
    return {
      title: 'Con poco tiempo',
      note: 'Filtrá por «tengo poco tiempo» y te quedan sólo las que salen rápido.',
      action: {
        reason: 'hambre',
        slot,
        label: `Ver opciones rápidas`,
      },
    }
  }

  /* El día cambió: eso se resuelve con el contexto, no comida por comida. */
  if (has(t, 'todo el dia afuera', 'todo el dia en la calle', 'no vuelvo', 'afuera todo el dia')) {
    return {
      title: 'Pasá el día a «En la calle»',
      note:
        'Con eso todo lo pendiente se rearma solo: nada que no se pueda llevar, y desayuno, almuerzo y merienda con saciedad potente.',
      suggestContext: 'calle',
    }
  }
  if (has(t, 'me quedo en casa', 'hoy no salgo', 'trabajo desde casa')) {
    return {
      title: 'Pasá el día a «En casa»',
      note: 'Se libera la restricción de transporte y entran las comidas que se cocinan en el momento.',
      suggestContext: 'casa',
    }
  }

  /* No preparé nada: lo que se resuelve en minutos. */
  if (has(t, 'no prepare', 'no tengo nada', 'me olvide', 'sin preparar')) {
    const slot = findSlot(t) ?? next?.planned.slot ?? 'breakfast'
    const options = rescueOptions(slot, meals, 4)
    return {
      title: `Para resolver ${SLOT_LABEL[slot].toLowerCase()} ya`,
      note: 'Sin preparación previa.',
      meals: options,
    }
  }

  /* Más hambre: subir la saciedad de lo que viene. */
  if (has(t, 'mas hambre', 'poco', 'chico', 'no me llena', 'contundente', 'que llene')) {
    const slot = findSlot(t) ?? next?.planned.slot
    const pool = slot
      ? candidatesFor(slot, context, meals).filter((m) => m.satiety === 'potente')
      : meals.filter((m) => m.satiety === 'potente')

    const base = slot === next?.planned.slot ? next?.meal : undefined
    return {
      title: 'Opciones que llenan más',
      note: base ? `En lugar de ${base.name.toLowerCase()}.` : undefined,
      meals: pool
        .filter((m) => m.id !== base?.id)
        .slice(0, 4)
        .map((meal) => ({ meal, why: 'potente' })),
    }
  }

  /* Salgo temprano: desayuno transportable y rápido. */
  if (has(t, 'salgo', 'temprano', '6:30', '6.30', 'apurado', 'sin tiempo')) {
    const options = meals
      .filter((m) => m.category === 'desayuno' && m.portable)
      .sort((a, b) => a.prepMinutes - b.prepMinutes)
      .slice(0, 3)
      .map((meal) => ({
        meal,
        why: meal.makeNightBefore
          ? 'se deja listo la noche anterior'
          : `${meal.prepMinutes} min a la mañana`,
      }))
    return {
      title: 'Desayunos para salir temprano',
      note: 'Todos se pueden llevar.',
      meals: options,
    }
  }

  /* Falta un ingrediente: filtrar la biblioteca. */
  const missing = ['yogur', 'huevo', 'pan', 'pollo', 'avena', 'queso', 'fruta', 'atun'].find(
    (i) => t.includes(i),
  )
  if (missing && has(t, 'no tengo', 'sin ', 'se acabo', 'falta')) {
    const slot = findSlot(t) ?? next?.planned.slot
    const pool = slot ? candidatesFor(slot, context, meals) : meals
    const options = pool
      .filter(
        (m) =>
          !m.ingredients.some((i) => norm(i).includes(missing)) &&
          !norm(m.name).includes(missing),
      )
      .slice(0, 4)
      .map((meal) => ({ meal, why: `sin ${missing}` }))

    return {
      title: `Sin ${missing}`,
      note: options.length ? undefined : 'Casi todo lo cargado lo usa. Vale sumar más opciones.',
      meals: options,
    }
  }

  /* Qué preparo ahora: tareas de la noche. */
  if (has(t, 'que preparo', 'preparar', 'noche', 'dejar listo')) {
    const tasks = app.tomorrow ? prepTasksFor(app.tomorrow, meals).map((x) => x.label) : []
    return {
      title: 'Para dejar listo esta noche',
      note: 'Sale del menú de mañana.',
      tasks,
    }
  }

  /* Cambiar una comida puntual, o pedir opciones de un momento del día. */
  const slot = findSlot(t)
  if (slot) {
    const planned = today?.meals.find((p) => p.slot === slot)
    const current = planned ? app.mealById(planned.mealId) : undefined

    if (current && has(t, 'cambia', 'cambiame', 'otra', 'otro', 'reemplaz')) {
      return {
        title: `Reemplazos para ${SLOT_LABEL[slot].toLowerCase()}`,
        meals: compatibleReplacements(current, meals, { slot, context }),
      }
    }

    return {
      title: `Opciones de ${SLOT_LABEL[slot].toLowerCase()}`,
      note: 'Las que sirven para el día que estás teniendo.',
      meals: candidatesFor(slot, context, meals)
        .slice(0, 4)
        .map((meal) => ({ meal, why: meal.satiety })),
    }
  }

  /* Transportable y que llene. */
  if (has(t, 'llevar', 'mochila', 'transport')) {
    return {
      title: 'Se llevan y llenan',
      meals: meals
        .filter((m) => m.portable && m.satiety !== 'liviana')
        .slice(0, 4)
        .map((meal) => ({ meal, why: 'se lleva bien' })),
    }
  }

  /* Compras: todavía no. Se dice, no se simula. */
  if (has(t, 'comprar', 'compra', 'super', 'lista')) {
    return {
      title: 'Todavía no',
      note: 'La lista de compras se arma cuando estén cargadas las cantidades reales de cada comida.',
      unsupported: true,
    }
  }

  return {
    title: 'No lo puedo resolver todavía',
    note: 'Probá con alguna de las sugerencias de arriba.',
    unsupported: true,
  }
}
