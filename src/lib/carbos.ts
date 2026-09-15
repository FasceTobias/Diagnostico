import type { Ingredient, Meal, Unit } from './types'
import { foodOf } from './foods'

/* ------------------------------------------------------------------
   CARBOHIDRATOS DERIVADOS

   Cuánto carbohidrato tiene un plato según lo que lleva, en vez de
   según lo que alguien estimó una vez.

   No pisa el número del catálogo. Los dos conviven a propósito: el
   declarado es lo que la app muestra, el derivado es con qué se lo
   discute. Cuando no coinciden, la comida entra en una lista para
   revisar —puede estar mal el número, pueden estar mal los
   ingredientes, o puede que la receta rinda más de lo que dice—.

   Lo derivado tampoco es la verdad: sale de tablas de composición, no
   de la etiqueta del producto que tenés en la mano. Por eso una comida
   sólo pasa a «verificado» con el envase enfrente, nunca por esta
   cuenta.
   ------------------------------------------------------------------ */

/** Cuántos gramos pesa una medida casera. La cucharada y el puñado son
    aproximaciones aceptadas; la pizca es cero y no vale la pena
    discutirlo. */
const GRAMOS: Partial<Record<Unit, number>> = {
  cda: 12,
  puñado: 30,
  pizca: 0,
}

/** Los carbohidratos de una cantidad de un ingrediente.
    `undefined` quiere decir que falta la referencia, que no es lo
    mismo que cero. */
export const carbsDeItem = (item: string, qty: number, unit: Unit): number | undefined => {
  const f = foodOf(item)

  if (unit === 'u' || unit === 'rebanada' || unit === 'lata' || unit === 'pote') {
    if (f.carbsPerUnit !== undefined) return f.carbsPerUnit * qty
    return undefined
  }

  const gramos = unit === 'g' || unit === 'ml' ? qty : (GRAMOS[unit] ?? 0) * qty
  if (f.carbsPer100g === undefined) return undefined
  return (f.carbsPer100g * gramos) / 100
}

/** El número que abre una etiqueta de porción y el sustantivo que le
    sigue: «3 empanadas» → 3, «empanadas». */
const contar = (label: string): { n: number; que: string } => {
  const m = label.trim().match(/^(½|\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (!m) return { n: 1, que: label.trim().toLowerCase() }
  const n = m[1] === '½' ? 0.5 : Number(m[1].replace(',', '.'))
  return { n: n || 1, que: m[2].toLowerCase() }
}

/** Qué parte de la receta es una porción.

    Si la receta rinde seis empanadas y la porción son tres, media. Si
    no dice cuánto rinde, se asume que hace exactamente una porción,
    que es como estaba cargado el catálogo hasta ahora. */
export const fraccionDePorcion = (rinde: string | undefined, porcion: string): number => {
  if (!rinde) return 1
  const r = contar(rinde)
  const p = contar(porcion)
  if (r.n <= 0) return 1
  /* Mismo sustantivo —empanadas y empanadas—: la porción son p de r.
     Distinto —«2 platos» contra «1 plato hondo»—: una de las que
     rinde, que es lo único que se puede afirmar. */
  const mismoQue = r.que.startsWith(p.que.split(' ')[0]) || p.que.startsWith(r.que.split(' ')[0])
  return mismoQue ? p.n / r.n : 1 / r.n
}

export interface Derivado {
  /** Los de toda la receta. */
  total?: number
  /** Los de la porción por defecto. */
  porPorcion?: number
  /** Ingredientes sin referencia cargada. Con uno solo, no hay cuenta. */
  faltan: string[]
  fraccion: number
}

export const derivar = (
  items: readonly Ingredient[],
  rinde: string | undefined,
  porcion: string,
): Derivado => {
  const fraccion = fraccionDePorcion(rinde, porcion)
  const faltan: string[] = []
  let total = 0

  for (const i of items) {
    const c = carbsDeItem(i.item, i.qty, i.unit)
    if (c === undefined) faltan.push(i.item)
    else total += c
  }

  if (!items.length || faltan.length) return { faltan, fraccion }
  return { total: Math.round(total), porPorcion: Math.round(total * fraccion), faltan, fraccion }
}

export const derivarDeMeal = (meal: Meal): Derivado =>
  derivar(meal.ingredients, meal.rinde, meal.portion)

export interface Brecha {
  declarado: number
  derivado: number
  diferencia: number
  /** Una diferencia que cambia una decisión: ocho gramos o más, y al
      menos un quinto del número. Menos que eso lo explica el tamaño de
      una cebolla. */
  importante: boolean
}

export const brecha = (declarado: number, d: Derivado): Brecha | undefined => {
  if (d.porPorcion === undefined) return undefined
  const diferencia = d.porPorcion - declarado
  const abs = Math.abs(diferencia)
  return {
    declarado,
    derivado: d.porPorcion,
    diferencia,
    importante: abs >= 8 && abs >= declarado * 0.2,
  }
}
