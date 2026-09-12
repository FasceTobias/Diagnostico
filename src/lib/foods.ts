import type { Aisle, Unit } from './types'

/* ------------------------------------------------------------------
   CATÁLOGO DE ALIMENTOS

   Dice dos cosas de cada ingrediente: en qué parte de la compra está y
   cómo se compra de verdad. Sin esto, la lista semanal diría "huevo" en
   vez de "12 huevos", que no sirve para nada parado en el súper.

   `de: false` para los que no llevan preposición: "6 bananas", no
   "6 de bananas".
   ------------------------------------------------------------------ */

export interface Food {
  plural?: string
  aisle: Aisle
  /** Cosas que ya tenés en casa. No van a la lista. */
  pantry?: boolean
  /** Cómo se compra. Si falta, se compra en la unidad de la receta. */
  buy?: {
    unit: Unit | 'kg' | 'paquete'
    /** Redondear para arriba a múltiplos de esto (huevos de a 6) */
    step?: number
    /** Cuántas unidades de receta trae un paquete */
    per?: number
    label?: string
  }
}

export const FOODS: Record<string, Food> = {
  // --- verdulería ---
  banana: { plural: 'bananas', aisle: 'verdulería' },
  manzana: { plural: 'manzanas', aisle: 'verdulería' },
  frutilla: { plural: 'frutillas', aisle: 'verdulería', buy: { unit: 'g', step: 250 } },
  tomate: { plural: 'tomates', aisle: 'verdulería' },
  lechuga: { plural: 'lechugas', aisle: 'verdulería', buy: { unit: 'u', per: 4 } },
  palta: { plural: 'paltas', aisle: 'verdulería' },
  cebolla: { plural: 'cebollas', aisle: 'verdulería' },
  'cebolla morada': { plural: 'cebollas moradas', aisle: 'verdulería' },
  zanahoria: { plural: 'zanahorias', aisle: 'verdulería' },
  papa: { plural: 'papas', aisle: 'verdulería', buy: { unit: 'kg' } },
  calabaza: { aisle: 'verdulería', buy: { unit: 'kg' } },
  zapallito: { plural: 'zapallitos', aisle: 'verdulería' },
  espinaca: { aisle: 'verdulería', buy: { unit: 'g', step: 250, label: 'atado' } },
  morrón: { plural: 'morrones', aisle: 'verdulería' },
  limón: { plural: 'limones', aisle: 'verdulería', buy: { unit: 'u', per: 3 } },

  // --- carnicería ---
  pollo: { aisle: 'carnicería', buy: { unit: 'kg' } },
  'milanesa de pollo': { plural: 'milanesas de pollo', aisle: 'carnicería' },
  jamón: { aisle: 'carnicería', buy: { unit: 'g', step: 100 } },

  // --- lácteos ---
  huevo: { plural: 'huevos', aisle: 'lácteos', buy: { unit: 'u', step: 6 } },
  'yogur natural': { plural: 'yogures naturales', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'pote' } },
  'yogur entero': { plural: 'yogures enteros', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'pote' } },
  leche: { aisle: 'lácteos', buy: { unit: 'ml', step: 1000, label: 'litro' } },
  queso: { aisle: 'lácteos', buy: { unit: 'g', step: 100 } },

  // --- panadería ---
  pan: { aisle: 'panadería', buy: { unit: 'paquete', per: 18 } },
  'pan integral': { aisle: 'panadería', buy: { unit: 'paquete', per: 18 } },
  'tortilla de trigo': { plural: 'tortillas de trigo', aisle: 'panadería', buy: { unit: 'paquete', per: 6 } },

  // --- almacén ---
  avena: { aisle: 'almacén', buy: { unit: 'g', step: 500 } },
  granola: { aisle: 'almacén', buy: { unit: 'g', step: 500 } },
  arroz: { aisle: 'almacén', buy: { unit: 'kg' } },
  'lentejas cocidas': { aisle: 'almacén', buy: { unit: 'g', per: 400, label: 'lata' } },
  atún: { aisle: 'almacén', buy: { unit: 'lata' } },
  nuez: { plural: 'nueces', aisle: 'almacén', buy: { unit: 'g', step: 250 } },
  almendra: { plural: 'almendras', aisle: 'almacén', buy: { unit: 'g', step: 250 } },
  'mantequilla de maní': { aisle: 'almacén', buy: { unit: 'g', step: 350, label: 'frasco' } },
  choclo: { aisle: 'almacén', buy: { unit: 'lata' } },
  harina: { aisle: 'almacén', buy: { unit: 'kg' } },
  café: { aisle: 'almacén', buy: { unit: 'g', step: 250 } },

  // --- ya está en casa ---
  'aceite de oliva': { aisle: 'almacén', pantry: true },
  sal: { aisle: 'almacén', pantry: true },
  canela: { aisle: 'almacén', pantry: true },
  orégano: { aisle: 'almacén', pantry: true },
  mayonesa: { aisle: 'almacén', pantry: true },
  caldo: { aisle: 'almacén', pantry: true },
}

export const foodOf = (item: string): Food =>
  FOODS[item] ?? { aisle: 'otros' }

/** "½" en vez de "0.5": nadie compra 0,5 paltas. */
const nice = (n: number) => {
  if (n === 0.5) return '½'
  if (Number.isInteger(n)) return String(n)
  return String(Math.round(n * 10) / 10).replace('.', ',')
}

/** Cómo se escribe un ingrediente dentro de una receta.
    "2 huevos" · "60 g de avena" · "½ palta" */
export const ingredientText = (item: string, qty: number, unit: Unit): string => {
  const food = foodOf(item)
  const name = qty === 1 || qty === 0.5 ? item : (food.plural ?? item)

  switch (unit) {
    case 'u':
      return `${nice(qty)} ${name}`
    case 'rebanada':
      return `${nice(qty)} ${qty === 1 ? 'rebanada' : 'rebanadas'} de ${item}`
    case 'cda':
      return `${nice(qty)} ${qty === 1 ? 'cucharada' : 'cucharadas'} de ${item}`
    case 'puñado':
      return `${nice(qty)} ${qty === 1 ? 'puñado' : 'puñados'} de ${item}`
    case 'pote':
      return `${nice(qty)} ${qty === 1 ? 'pote' : 'potes'} de ${item}`
    case 'lata':
      return `${nice(qty)} ${qty === 1 ? 'lata' : 'latas'} de ${item}`
    default:
      return `${nice(qty)} ${unit} de ${item}`
  }
}

/** Cómo se escribe en la lista de compras: en cantidad de compra real.
    "12 huevos" · "1,5 kg de pollo" · "1 paquete de pan" */
export const shoppingText = (item: string, qty: number, unit: Unit): string => {
  const food = foodOf(item)
  const buy = food.buy
  const plural = food.plural ?? item

  if (!buy) return ingredientText(item, Math.ceil(qty), unit)

  if (buy.unit === 'kg') {
    const kg = Math.ceil((qty / 1000) * 2) / 2
    return kg >= 1 ? `${nice(kg)} kg de ${item}` : `${Math.ceil(qty / 100) * 100} g de ${item}`
  }

  if (buy.unit === 'paquete') {
    const packs = Math.max(1, Math.ceil(qty / (buy.per ?? 1)))
    return `${packs} ${packs === 1 ? 'paquete' : 'paquetes'} de ${item}`
  }

  if (buy.per) {
    const n = Math.max(1, Math.ceil(qty / buy.per))
    // Una lechuga rinde varias comidas: se compra una, no media por plato.
    if (buy.unit === 'u') return `${n} ${n === 1 ? item : plural}`
    const label = buy.label ?? 'unidad'
    const labelPlural = label === 'pote' ? 'potes' : label === 'lata' ? 'latas' : `${label}s`
    return `${n} ${n === 1 ? label : labelPlural} de ${item}`
  }

  if (buy.step) {
    const n = Math.ceil(qty / buy.step) * buy.step
    if (buy.unit === 'u') return `${n} ${n === 1 ? item : plural}`
    if (buy.label) {
      const packs = Math.ceil(qty / buy.step)
      return `${packs} ${packs === 1 ? buy.label : buy.label + 's'} de ${item}`
    }
    return `${n} ${buy.unit} de ${item}`
  }

  const n = Math.ceil(qty)
  return buy.unit === 'u' ? `${n} ${n === 1 ? item : plural}` : `${n} ${buy.unit} de ${item}`
}
