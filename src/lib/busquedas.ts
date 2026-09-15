import type { Category, Meal, Venue } from './types'

/* ------------------------------------------------------------------
   LAS PREGUNTAS

   La app existe para contestar seis o siete preguntas que alguien se
   hace parado frente a la heladera o caminando por la calle. Acá está
   cada una convertida en una búsqueda sobre el catálogo.

   Una decisión que vale la explicación: la respuesta se ordena, no se
   filtra hasta dejar tres. Ante «quiero algo dulce» la app no tiene que
   decidir por vos cuál: tiene que poner adelante lo que comerías un
   martes cualquiera y dejar el resto abajo, a mano.
   ------------------------------------------------------------------ */

/** Una comida sirve para un momento si lo tiene entre los suyos. El
    tostado es desayuno, merienda y snack: una entrada, tres momentos. */
export const sirveEn = (meal: Meal, cat: Category) =>
  (meal.momentos ?? [meal.category]).includes(cat)

/* El orden por defecto de cualquier respuesta: primero lo de todos los
   días, después lo de cada tanto; a igualdad, lo que sale más rápido.
   Las bebidas nunca encabezan una respuesta de comida. */
const orden = (a: Meal, b: Meal) =>
  Number(!!a.esBebida) - Number(!!b.esBebida) ||
  Number(b.everyday) - Number(a.everyday) ||
  Number(a.frequency === 'ocasional') - Number(b.frequency === 'ocasional') ||
  a.activeMinutes - b.activeMinutes ||
  (b.rating ?? 0) - (a.rating ?? 0)

export type Pregunta =
  | 'hambre'
  | 'dulce'
  | 'salado'
  | 'snack'
  | 'rapido'
  | 'sin-cocinar'

export const PREGUNTA: Record<Pregunta, { titulo: string; bajada: string }> = {
  hambre: {
    titulo: 'Tengo hambre ahora',
    bajada: 'Lo que entra en este momento del día y sale rápido.',
  },
  dulce: {
    titulo: 'Quiero algo dulce',
    bajada: 'Sin vueltas: lo dulce que se come de verdad, con su número.',
  },
  salado: {
    titulo: 'Quiero algo salado',
    bajada: 'De un sándwich a una milanesa. Todo lo salado, no sólo los snacks.',
  },
  snack: {
    titulo: 'Necesito un snack',
    bajada: 'Algo entre comidas, que no sea una comida.',
  },
  rapido: {
    titulo: 'Tengo poco tiempo',
    bajada: 'Diez minutos o menos, de principio a fin.',
  },
  'sin-cocinar': {
    titulo: 'No tengo nada preparado',
    bajada: 'Sin cocinar y sin calentar: se arma y se come.',
  },
}

/** La respuesta a una de las preguntas de Inicio, para el momento del
    día en el que está el usuario. */
export const responder = (
  pregunta: Pregunta,
  meals: Meal[],
  cat: Category,
  limite = 12,
): Meal[] => {
  const salado = (m: Meal) => m.sabor === 'salado' || m.sabor === 'mixta'

  const pool = meals.filter((m) => {
    switch (pregunta) {
      case 'hambre':
        return sirveEn(m, cat) && !m.esBebida && m.activeMinutes <= 15
      case 'dulce':
        return m.sabor === 'dulce' && !m.esBebida
      case 'salado':
        return salado(m) && !m.esBebida
      case 'snack':
        return sirveEn(m, 'snack') && !m.esBebida
      case 'rapido':
        return m.activeMinutes <= 10 && !m.esBebida
      case 'sin-cocinar':
        return m.activeMinutes <= 5 && !m.needsReheat && !m.esBebida
    }
  })

  /* Para las preguntas que no son de un momento en particular, lo que
     sirve para AHORA va primero igual. Querer algo dulce a las diez de
     la mañana y a las diez de la noche no es lo mismo. */
  const deAhora = pregunta === 'hambre' || pregunta === 'snack'
  return [...pool]
    .sort((a, b) =>
      deAhora
        ? orden(a, b)
        : Number(sirveEn(b, cat)) - Number(sirveEn(a, cat)) || orden(a, b),
    )
    .slice(0, limite)
}

/* ---------------- comer afuera ---------------- */

/** Lo que se pide en un lugar concreto. «Estoy en la calle» es
    demasiado abstracto; lo concreto es en qué puerta estás parado. */
export const porLugar = (meals: Meal[], venue: Venue, cat?: Category, limite = 12): Meal[] =>
  meals
    .filter((m) => m.venues?.includes(venue))
    .sort((a, b) =>
      cat ? Number(sirveEn(b, cat)) - Number(sirveEn(a, cat)) || orden(a, b) : orden(a, b),
    )
    .slice(0, limite)

/* ---------------- snacks ---------------- */

export type FiltroSnack = 'llevar' | 'dulces' | 'salados' | 'rapidos' | 'sin-cocinar' | 'trabajo'

export const FILTRO_SNACK: Record<FiltroSnack, string> = {
  llevar: 'Para llevar',
  dulces: 'Dulces',
  salados: 'Salados',
  rapidos: 'Rápidos',
  'sin-cocinar': 'Sin cocinar',
  trabajo: 'Para el trabajo',
}

export const snacks = (meals: Meal[], filtro: FiltroSnack, limite = 12): Meal[] => {
  const base = meals.filter((m) => sirveEn(m, 'snack') && !m.esBebida)
  const pool = base.filter((m) => {
    switch (filtro) {
      case 'llevar':
        return m.portable
      case 'dulces':
        return m.sabor === 'dulce'
      case 'salados':
        return m.sabor === 'salado' || m.sabor === 'mixta'
      case 'rapidos':
        return m.activeMinutes <= 5
      case 'sin-cocinar':
        return m.activeMinutes === 0
      case 'trabajo':
        /* En el trabajo no hay cocina: tiene que viajar y comerse como
           viene, sin pasar por el microondas de nadie. */
        return m.portable && !m.needsReheat
    }
  })
  return [...pool].sort(orden).slice(0, limite)
}

/* ---------------- alternativas ---------------- */

/** Otra cosa para el mismo momento. No es «cualquier otra»: tiene que
    servir para ese momento y no ser la que ya está puesta. */
export const alternativas = (
  meals: Meal[],
  cat: Category,
  exceptoId: string,
  limite = 12,
): Meal[] =>
  meals
    .filter((m) => sirveEn(m, cat) && m.id !== exceptoId && !m.esBebida && !m.buyOutside)
    .sort(orden)
    .slice(0, limite)
