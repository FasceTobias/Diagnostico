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

  // --- agregados para el catálogo v2 ---
  // Los cuatro que faltaban y obligaban a reusar un ingrediente parecido.
  maní: { aisle: 'almacén', buy: { unit: 'g', step: 100, label: 'paquete' } },
  helado: { aisle: 'congelados', buy: { unit: 'g', step: 500, label: 'pote' } },
  'postre lácteo': { plural: 'postres lácteos', aisle: 'lácteos', buy: { unit: 'u', step: 4 } },
  gaseosa: { aisle: 'almacén', buy: { unit: 'ml', step: 1500, label: 'botella' } },

  'gaseosa sin azúcar': { aisle: 'almacén', buy: { unit: 'ml', step: 1500, label: 'botella' } },
  'dulce de leche': { aisle: 'almacén', buy: { unit: 'g', step: 400, label: 'pote' } },
  azúcar: { aisle: 'almacén', pantry: true },
  'galletitas dulces': { aisle: 'almacén', buy: { unit: 'paquete', per: 18 } },
  'galletitas de agua': { aisle: 'almacén', buy: { unit: 'paquete', per: 20 } },
  té: { aisle: 'almacén', buy: { unit: 'u', per: 25, label: 'caja' } },
  agua: { aisle: 'almacén', pantry: true },
  'mate cocido': { aisle: 'almacén', buy: { unit: 'u', per: 25, label: 'caja' } },

  // --- carnicería y rotisería ---
  asado: { aisle: 'carnicería', buy: { unit: 'kg' } },
  vacío: { aisle: 'carnicería', buy: { unit: 'kg' } },
  chorizo: { plural: 'chorizos', aisle: 'carnicería', buy: { unit: 'u', step: 4 } },
  'milanesa de carne': { plural: 'milanesas de carne', aisle: 'carnicería' },
  'pechuga de pollo': { plural: 'pechugas de pollo', aisle: 'carnicería', buy: { unit: 'kg' } },
  'pollo entero': { aisle: 'carnicería', buy: { unit: 'u' } },

  // --- almacén y fideería ---
  ravioles: { aisle: 'almacén', buy: { unit: 'g', step: 500, label: 'plancha' } },
  ñoquis: { aisle: 'almacén', buy: { unit: 'g', step: 500, label: 'plancha' } },
  'pan de pancho': { plural: 'panes de pancho', aisle: 'panadería', buy: { unit: 'u', step: 4 } },
  'pan francés': { aisle: 'panadería', buy: { unit: 'g', step: 250 } },
  'pan de miga': { aisle: 'panadería', buy: { unit: 'u', per: 8, label: 'plancha' } },
  acelga: { aisle: 'verdulería', buy: { unit: 'g', step: 250, label: 'atado' } },
  arvejas: { aisle: 'almacén', buy: { unit: 'g', per: 300, label: 'lata' } },
  'crema de leche': { aisle: 'lácteos', buy: { unit: 'ml', step: 200 } },
  'ricota': { aisle: 'lácteos', buy: { unit: 'g', step: 250, label: 'pote' } },
  'queso rallado': { aisle: 'lácteos', buy: { unit: 'g', step: 100 } },

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
  choclo: { plural: 'choclos', aisle: 'almacén', buy: { unit: 'lata' } },
  harina: { aisle: 'almacén', buy: { unit: 'kg' } },
  café: { aisle: 'almacén', buy: { unit: 'g', step: 250 } },

  // --- agregados para la fase C ---
  merluza: { aisle: 'carnicería', buy: { unit: 'g', step: 250, label: 'filete' } },
  'pan rallado': { aisle: 'almacén', buy: { unit: 'g', step: 500 } },
  berenjena: { plural: 'berenjenas', aisle: 'verdulería' },
  'brócoli': { aisle: 'verdulería', buy: { unit: 'u', per: 1 } },
  'garbanzos cocidos': { aisle: 'almacén', buy: { unit: 'g', per: 400, label: 'lata' } },
  polenta: { aisle: 'almacén', buy: { unit: 'g', step: 500 } },
  'dulce de membrillo': { aisle: 'almacén', buy: { unit: 'g', step: 500 } },
  salchicha: { plural: 'salchichas', aisle: 'carnicería', buy: { unit: 'u', per: 6, label: 'paquete' } },
  panceta: { aisle: 'carnicería', buy: { unit: 'g', step: 200 } },
  remolacha: { plural: 'remolachas', aisle: 'verdulería' },
  pepino: { plural: 'pepinos', aisle: 'verdulería' },
  naranja: { plural: 'naranjas', aisle: 'verdulería', buy: { unit: 'u', per: 6 } },
  mandarina: { plural: 'mandarinas', aisle: 'verdulería', buy: { unit: 'u', per: 6 } },
  pera: { plural: 'peras', aisle: 'verdulería' },
  durazno: { plural: 'duraznos', aisle: 'verdulería' },
  uva: { plural: 'uvas', aisle: 'verdulería', buy: { unit: 'g', step: 500 } },
  bizcochos: { aisle: 'panadería', buy: { unit: 'g', step: 250, label: 'paquete' } },
  'prepizza': { plural: 'prepizzas', aisle: 'panadería', buy: { unit: 'u', per: 2 } },
  'tapas de empanada': { aisle: 'congelados', buy: { unit: 'u', per: 12, label: 'paquete' } },
  'verduras congeladas': { aisle: 'congelados', buy: { unit: 'g', step: 500, label: 'paquete' } },
  'sopa crema': { aisle: 'almacén', buy: { unit: 'u', per: 1, label: 'sobre' } },
  'atún al natural': { aisle: 'almacén', buy: { unit: 'lata' } },
  'fideos integrales': { aisle: 'almacén', buy: { unit: 'g', per: 500, label: 'paquete' } },
  'pan de salvado': { aisle: 'panadería', buy: { unit: 'paquete', per: 18 } },

  'galletas de arroz': { aisle: 'almacén', buy: { unit: 'u', per: 12, label: 'paquete' } },
  'pizza congelada': { plural: 'pizzas congeladas', aisle: 'congelados', buy: { unit: 'u', per: 1 } },
  grasa: { aisle: 'almacén', buy: { unit: 'g', step: 250 } },

  // --- envasados y cosas de góndola ---
  'galletitas sin azúcar': { aisle: 'almacén', buy: { unit: 'g', per: 150, label: 'paquete' } },
  'barra proteica': { plural: 'barras proteicas', aisle: 'almacén', buy: { unit: 'u' } },
  'barra de cereal': { plural: 'barras de cereal', aisle: 'almacén', buy: { unit: 'u' } },
  chocolate: { aisle: 'almacén', buy: { unit: 'g', step: 100 } },
  'frutos secos con chocolate': { aisle: 'almacén', buy: { unit: 'g', step: 150 } },
  'gelatina sin azúcar': { plural: 'gelatinas sin azúcar', aisle: 'almacén', buy: { unit: 'u' } },
  'flan sin azúcar': { plural: 'flanes sin azúcar', aisle: 'lácteos', buy: { unit: 'u' } },
  'budín sin azúcar': { plural: 'budines sin azúcar', aisle: 'panadería', buy: { unit: 'u', per: 300 } },
  'mermelada sin azúcar': { aisle: 'almacén', buy: { unit: 'g', per: 350, label: 'frasco' } },
  manteca: { aisle: 'lácteos', buy: { unit: 'g', step: 200 } },
  yerba: { aisle: 'almacén', buy: { unit: 'g', step: 500 } },
  budín: { plural: 'budines', aisle: 'panadería', buy: { unit: 'u', per: 300 } },
  medialuna: { plural: 'medialunas', aisle: 'panadería', buy: { unit: 'u' } },
  alfajor: { plural: 'alfajores', aisle: 'almacén', buy: { unit: 'u' } },
  'queso untable': { aisle: 'lácteos', buy: { unit: 'g', per: 300, label: 'pote' } },
  'yogur saborizado sin azúcar': { plural: 'yogures saborizados sin azúcar', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'pote' } },

  // --- más cosas de todos los días ---
  fideos: { aisle: 'almacén', buy: { unit: 'g', per: 500, label: 'paquete' } },
  'salsa de tomate': { aisle: 'almacén', buy: { unit: 'g', per: 400, label: 'lata' } },
  muzzarella: { aisle: 'lácteos', buy: { unit: 'g', step: 100 } },
  'carne picada': { aisle: 'carnicería', buy: { unit: 'g', step: 250 } },
  'pan de hamburguesa': { plural: 'panes de hamburguesa', aisle: 'panadería', buy: { unit: 'u', per: 4 } },
  'masa de tarta': { plural: 'masas de tarta', aisle: 'congelados', buy: { unit: 'u', per: 2 } },
  'masa de pizza': { plural: 'masas de pizza', aisle: 'panadería', buy: { unit: 'u' } },

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

/** Cómo se escribe en la lista de compras, partido en dos:
    la cantidad a un lado y el producto al otro, para poder componerlos
    con distinto peso. "12" + "huevos" · "1,5 kg" + "pollo". */
export interface ShoppingParts {
  /** La cifra sola: "12", "1,5", "250" */
  value: string
  /** La unidad, si la hay: "kg", "g", "paquete", "potes" */
  unit: string
  /** El producto: "huevos", "pollo", "pan" */
  label: string
}

export const shoppingParts = (item: string, qty: number, unit: Unit): ShoppingParts => {
  const food = foodOf(item)
  const buy = food.buy
  const plural = food.plural ?? item

  const count = (n: number) => ({ value: nice(n), unit: '', label: n === 1 ? item : plural })
  const pack = (n: number, word: string, wordPlural: string) => ({
    value: String(n),
    unit: n === 1 ? word : wordPlural,
    label: item,
  })

  if (!buy) {
    const n = Math.ceil(qty)
    return unit === 'u' ? count(n) : { value: nice(n), unit, label: item }
  }

  if (buy.unit === 'kg') {
    const kg = Math.ceil((qty / 1000) * 2) / 2
    return kg >= 1
      ? { value: nice(kg), unit: 'kg', label: item }
      : { value: String(Math.ceil(qty / 100) * 100), unit: 'g', label: item }
  }

  if (buy.unit === 'paquete') {
    return pack(Math.max(1, Math.ceil(qty / (buy.per ?? 1))), 'paquete', 'paquetes')
  }

  if (buy.per) {
    const n = Math.max(1, Math.ceil(qty / buy.per))
    // Una lechuga rinde varias comidas: se compra una, no media por plato.
    if (buy.unit === 'u') return count(n)
    const word = buy.label ?? 'unidad'
    return pack(n, word, word === 'pote' ? 'potes' : word === 'lata' ? 'latas' : `${word}s`)
  }

  if (buy.step) {
    if (buy.unit === 'u') return count(Math.ceil(qty / buy.step) * buy.step)
    if (buy.label) {
      const packs = Math.ceil(qty / buy.step)
      return pack(packs, buy.label, `${buy.label}s`)
    }
    return { value: String(Math.ceil(qty / buy.step) * buy.step), unit: buy.unit, label: item }
  }

  const n = Math.ceil(qty)
  return buy.unit === 'u' ? count(n) : { value: String(n), unit: buy.unit, label: item }
}

/** "12 huevos" · "1,5 kg de pollo" — para donde haga falta una sola línea. */
export const shoppingText = (item: string, qty: number, unit: Unit): string => {
  const { value, unit: u, label } = shoppingParts(item, qty, unit)
  return u ? `${value} ${u} de ${label}` : `${value} ${label}`
}
