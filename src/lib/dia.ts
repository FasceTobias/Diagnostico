import type { DayPlan, Meal, PlannedMeal, Slot } from './types'
import { minutesOf, nowMinutes } from './format'

/* ------------------------------------------------------------------
   EL DÍA, SIN CHECKLIST

   La regla del producto: la app sigue el día con la menor cantidad de
   interacción posible. Si son las 16:30 y el almuerzo estaba a las
   13:00, el almuerzo pasó. No hace falta que nadie lo confirme.

   Por eso el estado de una comida no sale de `status` sino del reloj.
   `status` sigue existiendo y sigue mandando cuando hay algo que decir
   —la cambiaste, la salteaste, registraste qué comiste— pero el caso
   normal, que es no tocar nada, no requiere tocar nada.

   Cuatro estados y ninguno es una tarea pendiente:

     pasada     ya fue, con o sin confirmación
     ahora      es el momento de comerla
     próxima    la que viene después
     más tarde  el resto del día

   El margen es de 45 minutos para atrás y para adelante: si el almuerzo
   es 13:00, a las 12:30 ya es «ahora» y a las 13:40 todavía lo es.
   Comer a horario exacto no lo hace nadie.
   ------------------------------------------------------------------ */

export type EstadoComida = 'pasada' | 'ahora' | 'proxima' | 'mas-tarde'

export const ESTADO_LABEL: Record<EstadoComida, string> = {
  pasada: 'Pasada',
  ahora: 'Ahora',
  proxima: 'Próxima',
  'mas-tarde': 'Más tarde',
}

/** El margen alrededor de la hora en el que una comida es «ahora». */
const MARGEN = 45

export interface ComidaDelDia {
  planned: PlannedMeal
  meal?: Meal
  estado: EstadoComida
  minutos: number
}

/** El día entero, con el estado de cada comida resuelto por el reloj.

    Las comidas vienen en el orden del plan, que es el orden del día.
    Sólo una puede ser «ahora» y sólo una «próxima»: si hubiera dos de
    cada una, la pantalla dejaría de poder decir qué te toca. */
export const comidasDelDia = (
  day: DayPlan,
  meals: Meal[],
  at = nowMinutes(),
): ComidaDelDia[] => {
  const conHora = day.meals.map((planned) => ({
    planned,
    meal: meals.find((m) => m.id === planned.mealId),
    minutos: minutesOf(planned.time),
  }))

  /* Pasó si el reloj la dejó atrás, o si el usuario dijo que ya está.
     Las dos cosas cierran una comida; la segunda casi nunca hace falta. */
  const cerrada = (c: (typeof conHora)[number]) =>
    c.planned.status === 'eaten' ||
    c.planned.status === 'skipped' ||
    c.minutos < at - MARGEN

  const abiertas = conHora.filter((c) => !cerrada(c))
  const primera = abiertas[0]
  const hayAhora = primera !== undefined && primera.minutos <= at + MARGEN

  return conHora.map((c) => {
    if (cerrada(c)) return { ...c, estado: 'pasada' as const }
    if (hayAhora && c === primera) return { ...c, estado: 'ahora' as const }
    const indice = abiertas.indexOf(c)
    const esProxima = hayAhora ? indice === 1 : indice === 0
    return { ...c, estado: esProxima ? ('proxima' as const) : ('mas-tarde' as const) }
  })
}

/** La que hay que mirar ahora: la de este momento si la hay, y si no la
    que viene. Es lo que va arriba de todo, en Inicio y en Hoy. */
export const comidaActual = (dia: ComidaDelDia[]): ComidaDelDia | undefined =>
  dia.find((c) => c.estado === 'ahora') ?? dia.find((c) => c.estado === 'proxima')

/** Lo que queda por comer. No es «lo que no marcaste»: es lo que el
    reloj todavía no dejó atrás. */
export const pendientes = (dia: ComidaDelDia[]) =>
  dia.filter((c) => c.estado !== 'pasada')

/** Las que ya pasaron, de la más reciente a la más vieja. */
export const pasadas = (dia: ComidaDelDia[]) =>
  dia.filter((c) => c.estado === 'pasada')

/** Lo que el usuario efectivamente dijo que comió, cuando lo dijo. Es
    opcional por diseño: sirve para tener el historial derecho, no para
    que el día avance. */
export const registradas = (dia: ComidaDelDia[]) =>
  dia.filter((c) => c.planned.status === 'eaten')

export const esSlot = (dia: ComidaDelDia[], slot: Slot) => dia.find((c) => c.planned.slot === slot)
