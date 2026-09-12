import type { Meal } from './types'
import type { Vianda } from './store'
import { compatibleReplacements, findNext, prepTasksFor } from './domain'

/* ------------------------------------------------------------------
   ASISTENTE — arquitectura, no chatbot.

   La respuesta no es texto libre: es una estructura que la app sabe
   dibujar con sus propios componentes. Hoy la resuelven reglas locales.
   Mañana la puede resolver un modelo: el contrato de entrada/salida es
   el mismo, y la UI no se entera del cambio.
   ------------------------------------------------------------------ */

export interface AssistantAnswer {
  title: string
  note?: string
  meals?: { meal: Meal; why?: string }[]
  tasks?: string[]
  /** Lo que el asistente todavía no sabe hacer. Se dice, no se inventa. */
  unsupported?: boolean
}

export interface AssistantQuery {
  text: string
  app: Vianda
}

export const SUGGESTIONS = [
  'Tengo más hambre',
  'Mañana salgo 6:30',
  'No tengo yogur',
  '¿Qué preparo ahora?',
  'Cambiame la merienda',
  'Algo que llene y se lleve',
]

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w))

export const askAssistant = ({ text, app }: AssistantQuery): AssistantAnswer => {
  const t = norm(text)
  const { meals, today } = app
  const next = today ? findNext(today, meals) : undefined

  /* Más hambre → subir saciedad de la próxima comida */
  if (has(t, 'mas hambre', 'poco', 'chico', 'no me llena', 'contundente', 'que llene')) {
    const base = next?.meal
    const options = (base
      ? compatibleReplacements(base, meals, { limit: 4 })
      : meals.map((meal) => ({ meal, why: '' }))
    ).filter(({ meal }) => meal.satiety === 'potente')

    return {
      title: 'Opciones que llenan más',
      note: base ? `En lugar de ${base.name.toLowerCase()}.` : undefined,
      meals: options.length
        ? options
        : meals.filter((m) => m.satiety === 'potente').slice(0, 4).map((meal) => ({ meal })),
    }
  }

  /* Salgo temprano → desayuno transportable y rápido */
  if (has(t, 'salgo', 'temprano', '6:30', '6.30', 'apurado', 'sin tiempo')) {
    const options = meals
      .filter((m) => m.category === 'desayuno' && m.portable)
      .sort((a, b) => a.prepMinutes - b.prepMinutes)
      .slice(0, 3)
      .map((meal) => ({
        meal: meal,
        why:
          meal.makeNightBefore
            ? 'se deja listo la noche anterior'
            : `${meal.prepMinutes} min a la mañana`,
      }))
    return {
      title: 'Desayunos para salir temprano',
      note: 'Todos se pueden llevar.',
      meals: options,
    }
  }

  /* Falta un ingrediente → filtrar la biblioteca */
  const missing = ['yogur', 'huevo', 'pan', 'pollo', 'avena', 'queso', 'fruta'].find((i) =>
    t.includes(i),
  )
  if (missing && has(t, 'no tengo', 'sin', 'se acabo', 'falta')) {
    const options = meals
      .filter(
        (m) =>
          !m.ingredients.some((i) => norm(i).includes(missing)) &&
          !norm(m.name).includes(missing) &&
          (next ? m.category === next.meal.category : true),
      )
      .slice(0, 4)
      .map((meal) => ({ meal, why: `sin ${missing}` }))

    return {
      title: `Sin ${missing}`,
      note: options.length ? undefined : 'Casi todo lo cargado lo usa. Vale sumar más opciones.',
      meals: options,
    }
  }

  /* Qué preparo ahora → tareas de la noche */
  if (has(t, 'que preparo', 'preparar', 'noche', 'dejar listo')) {
    const tasks = app.tomorrow ? prepTasksFor(app.tomorrow, meals).map((x) => x.label) : []
    return {
      title: 'Para dejar listo esta noche',
      note: 'Sale del menú de mañana.',
      tasks,
    }
  }

  /* Cambiar una comida puntual */
  const slotWord = (
    [
      ['desayuno', 'desayuno'],
      ['almuerzo', 'almuerzo'],
      ['merienda', 'merienda'],
      ['cena', 'cena'],
      ['snack', 'snack'],
    ] as const
  ).find(([w]) => t.includes(w))

  if (slotWord && has(t, 'cambia', 'cambiame', 'otra', 'otro', 'reemplaz')) {
    const planned = today?.meals.find(
      (p) => app.mealById(p.mealId)?.category === slotWord[1],
    )
    const current = planned ? app.mealById(planned.mealId) : undefined
    if (current) {
      return {
        title: `Reemplazos para la ${slotWord[1]}`,
        meals: compatibleReplacements(current, meals, { limit: 3 }),
      }
    }
  }

  /* Transportable + potente */
  if (has(t, 'llevar', 'mochila', 'transport')) {
    const options = meals
      .filter((m) => m.portable && m.satiety !== 'liviana')
      .slice(0, 4)
      .map((meal) => ({ meal, why: 'se lleva bien' }))
    return { title: 'Se llevan y llenan', meals: options }
  }

  /* Compras: todavía no. Se dice, no se simula. */
  if (has(t, 'comprar', 'compra', 'super', 'lista')) {
    return {
      title: 'Todavía no',
      note:
        'La lista de compras se arma en la próxima etapa, cuando estén cargadas las cantidades reales de cada comida.',
      unsupported: true,
    }
  }

  return {
    title: 'No lo puedo resolver todavía',
    note: 'Probá con alguna de las sugerencias de arriba.',
    unsupported: true,
  }
}
