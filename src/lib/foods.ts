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
  /** Carbohidratos de referencia por 100 g (o por 100 ml, para lo
      líquido). Sirve para derivar el número de un plato a partir de lo
      que lleva, en vez de estimarlo a ojo. */
  carbsPer100g?: number
  /** Carbohidratos de una unidad, cuando la receta cuenta unidades y no
      gramos: una rebanada de pan, un huevo, un tomate. */
  carbsPerUnit?: number
  /** Cómo se cuenta una unidad cuando el nombre no se puede contar:
      «2 rebanadas de pan», no «2 pan». Sólo para `unit: 'u'`. */
  unidad?: { uno: string; varios: string }
  /** Básico de alacena: sal, aceite, agua, especias. Existe como
      ingrediente —una receta lo puede nombrar y contar— pero no entra
      en la lista semanal. Nadie compra sal todas las semanas. */
  pantryBasic?: boolean
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

/* Los carbohidratos que lleva cada ingrediente son de tablas de
   composición estándar, redondeados. Son una referencia, no una
   etiqueta: sirven para derivar el número de un plato a partir de lo
   que lleva y para discutir con el número que ya tenía, no para
   declararlo verificado. Un valor pasa a verificado cuando alguien tuvo
   el envase en la mano.

   Los frutos secos van con el carbohidrato disponible, sin fibra: una
   nuez tiene 14 g por cada 100 y la mitad no se absorbe. */

export const FOODS: Record<string, Food> = {
  // --- verdulería ---
  banana: { plural: 'bananas', aisle: 'verdulería', carbsPer100g: 22, carbsPerUnit: 25 },
  manzana: { plural: 'manzanas', aisle: 'verdulería', carbsPer100g: 12, carbsPerUnit: 18 },
  frutilla: { plural: 'frutillas', aisle: 'verdulería', buy: { unit: 'g', step: 250 }, carbsPer100g: 6 },
  tomate: { plural: 'tomates', aisle: 'verdulería', carbsPer100g: 3.5, carbsPerUnit: 4 },
  lechuga: { plural: 'lechugas', aisle: 'verdulería', buy: { unit: 'u', per: 4 }, carbsPer100g: 2, carbsPerUnit: 6 },
  palta: { plural: 'paltas', aisle: 'verdulería', carbsPer100g: 2, carbsPerUnit: 4 },
  cebolla: { plural: 'cebollas', aisle: 'verdulería', carbsPer100g: 8, carbsPerUnit: 9 },
  'cebolla morada': { plural: 'cebollas moradas', aisle: 'verdulería', carbsPer100g: 8, carbsPerUnit: 9 },
  zanahoria: { plural: 'zanahorias', aisle: 'verdulería', carbsPer100g: 8, carbsPerUnit: 6 },
  papa: { plural: 'papas', aisle: 'verdulería', buy: { unit: 'kg' }, carbsPer100g: 17 },
  calabaza: { aisle: 'verdulería', buy: { unit: 'kg' }, carbsPer100g: 8 },
  zapallito: { plural: 'zapallitos', aisle: 'verdulería', carbsPer100g: 3, carbsPerUnit: 5 },
  espinaca: { aisle: 'verdulería', buy: { unit: 'g', step: 250, label: 'atado' }, carbsPer100g: 1.5 },
  morrón: { plural: 'morrones', aisle: 'verdulería', carbsPer100g: 6, carbsPerUnit: 9 },
  limón: { plural: 'limones', aisle: 'verdulería', buy: { unit: 'u', per: 3 }, carbsPer100g: 3, carbsPerUnit: 2 },

  // --- agregados para el catálogo v2 ---
  // Los cuatro que faltaban y obligaban a reusar un ingrediente parecido.
  maní: { aisle: 'almacén', buy: { unit: 'g', step: 100, label: 'paquete' }, carbsPer100g: 12 },
  helado: { aisle: 'congelados', buy: { unit: 'g', step: 500, label: 'pote' }, carbsPer100g: 24 },
  'postre lácteo': { plural: 'postres lácteos', aisle: 'lácteos', buy: { unit: 'u', step: 4 }, carbsPer100g: 17, carbsPerUnit: 20 },
  gaseosa: { aisle: 'almacén', buy: { unit: 'ml', step: 1500, label: 'botella' }, carbsPer100g: 11 },

  'gaseosa sin azúcar': { aisle: 'almacén', buy: { unit: 'ml', step: 1500, label: 'botella' }, carbsPer100g: 0 },
  'dulce de leche': { aisle: 'almacén', buy: { unit: 'g', step: 400, label: 'pote' }, carbsPer100g: 55 },
  'galletitas dulces': { aisle: 'almacén', buy: { unit: 'paquete', per: 18 }, carbsPer100g: 70, carbsPerUnit: 5 },
  'galletitas de agua': { aisle: 'almacén', buy: { unit: 'paquete', per: 20 }, carbsPer100g: 72, carbsPerUnit: 4.5 },
  té: { aisle: 'almacén', buy: { unit: 'u', per: 25, label: 'caja' }, unidad: { uno: 'saquito', varios: 'saquitos' }, carbsPer100g: 0, carbsPerUnit: 0 },
  'mate cocido': { aisle: 'almacén', buy: { unit: 'u', per: 25, label: 'caja' }, unidad: { uno: 'saquito', varios: 'saquitos' }, carbsPer100g: 0, carbsPerUnit: 0 },

  // --- carnicería y rotisería ---
  asado: { aisle: 'carnicería', buy: { unit: 'kg' }, carbsPer100g: 0 },
  vacío: { aisle: 'carnicería', buy: { unit: 'kg' }, carbsPer100g: 0 },
  chorizo: { plural: 'chorizos', aisle: 'carnicería', buy: { unit: 'u', step: 4 }, carbsPer100g: 1, carbsPerUnit: 1 },
  'milanesa de carne': { plural: 'milanesas de carne', aisle: 'carnicería', carbsPer100g: 10, carbsPerUnit: 12 },
  'pechuga de pollo': { plural: 'pechugas de pollo', aisle: 'carnicería', buy: { unit: 'kg' }, carbsPer100g: 0 },
  'pollo entero': { aisle: 'carnicería', buy: { unit: 'u' }, carbsPer100g: 0, carbsPerUnit: 0 },

  // --- almacén y fideería ---
  ravioles: { aisle: 'almacén', buy: { unit: 'g', step: 500, label: 'plancha' }, carbsPer100g: 30 },
  ñoquis: { aisle: 'almacén', buy: { unit: 'g', step: 500, label: 'plancha' }, carbsPer100g: 30 },
  'pan de pancho': { plural: 'panes de pancho', aisle: 'panadería', buy: { unit: 'u', step: 4 }, carbsPer100g: 50, carbsPerUnit: 30 },
  'pan francés': { aisle: 'panadería', buy: { unit: 'g', step: 250 }, carbsPer100g: 55 },
  'pan de miga': { aisle: 'panadería', buy: { unit: 'u', per: 8, label: 'plancha' }, unidad: { uno: 'rebanada', varios: 'rebanadas' }, carbsPer100g: 50, carbsPerUnit: 12 },
  acelga: { aisle: 'verdulería', buy: { unit: 'g', step: 250, label: 'atado' }, carbsPer100g: 2 },
  arvejas: { aisle: 'almacén', buy: { unit: 'g', per: 300, label: 'lata' }, carbsPer100g: 12 },
  'crema de leche': { aisle: 'lácteos', buy: { unit: 'ml', step: 200 }, carbsPer100g: 3 },
  'ricota': { aisle: 'lácteos', buy: { unit: 'g', step: 250, label: 'pote' }, carbsPer100g: 3 },
  'queso rallado': { aisle: 'lácteos', buy: { unit: 'g', step: 100 }, carbsPer100g: 2 },

  // --- carnicería ---
  pollo: { aisle: 'carnicería', buy: { unit: 'kg' }, carbsPer100g: 0 },
  'milanesa de pollo': { plural: 'milanesas de pollo', aisle: 'carnicería', carbsPer100g: 10, carbsPerUnit: 12 },
  jamón: { aisle: 'carnicería', buy: { unit: 'g', step: 100 }, carbsPer100g: 1 },

  // --- lácteos ---
  huevo: { plural: 'huevos', aisle: 'lácteos', buy: { unit: 'u', step: 6 }, carbsPer100g: 0.7, carbsPerUnit: 0.4 },
  'yogur natural': { plural: 'yogures naturales', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'pote' }, carbsPer100g: 5 },
  'yogur entero': { plural: 'yogures enteros', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'pote' }, carbsPer100g: 5 },
  leche: { aisle: 'lácteos', buy: { unit: 'ml', step: 1000, label: 'litro' }, carbsPer100g: 5 },
  queso: { aisle: 'lácteos', buy: { unit: 'g', step: 100 }, carbsPer100g: 2 },

  // --- panadería ---
  pan: { aisle: 'panadería', buy: { unit: 'paquete', per: 18 }, unidad: { uno: 'rebanada', varios: 'rebanadas' }, carbsPer100g: 50, carbsPerUnit: 15 },
  'pan integral': { aisle: 'panadería', buy: { unit: 'paquete', per: 18 }, unidad: { uno: 'rebanada', varios: 'rebanadas' }, carbsPer100g: 45, carbsPerUnit: 12 },
  'tortilla de trigo': { plural: 'tortillas de trigo', aisle: 'panadería', buy: { unit: 'paquete', per: 6 }, carbsPer100g: 50, carbsPerUnit: 25 },

  // --- almacén ---
  avena: { aisle: 'almacén', buy: { unit: 'g', step: 500 }, carbsPer100g: 60 },
  granola: { aisle: 'almacén', buy: { unit: 'g', step: 500 }, carbsPer100g: 65 },
  arroz: { aisle: 'almacén', buy: { unit: 'kg' }, carbsPer100g: 78 },
  'lentejas cocidas': { aisle: 'almacén', buy: { unit: 'g', per: 400, label: 'lata' }, carbsPer100g: 17 },
  atún: { aisle: 'almacén', buy: { unit: 'lata' }, unidad: { uno: 'lata', varios: 'latas' }, carbsPer100g: 0, carbsPerUnit: 0 },
  nuez: { plural: 'nueces', aisle: 'almacén', buy: { unit: 'g', step: 250 }, carbsPer100g: 7 },
  almendra: { plural: 'almendras', aisle: 'almacén', buy: { unit: 'g', step: 250 }, carbsPer100g: 9 },
  'mantequilla de maní': { aisle: 'almacén', buy: { unit: 'g', step: 350, label: 'frasco' }, carbsPer100g: 20 },
  choclo: { plural: 'choclos', aisle: 'almacén', buy: { unit: 'lata' }, carbsPer100g: 19, carbsPerUnit: 27 },
  harina: { aisle: 'almacén', buy: { unit: 'kg' }, carbsPer100g: 73 },
  café: { aisle: 'almacén', buy: { unit: 'g', step: 250 }, carbsPer100g: 0 },

  // --- agregados para la fase C ---
  merluza: { aisle: 'carnicería', buy: { unit: 'g', step: 250, label: 'filete' }, carbsPer100g: 0 },
  'pan rallado': { aisle: 'almacén', buy: { unit: 'g', step: 500 }, carbsPer100g: 70 },
  berenjena: { plural: 'berenjenas', aisle: 'verdulería', carbsPer100g: 6, carbsPerUnit: 15 },
  'brócoli': { aisle: 'verdulería', buy: { unit: 'u', per: 1 }, carbsPer100g: 4, carbsPerUnit: 16 },
  'garbanzos cocidos': { aisle: 'almacén', buy: { unit: 'g', per: 400, label: 'lata' }, carbsPer100g: 22 },
  polenta: { aisle: 'almacén', buy: { unit: 'g', step: 500 }, carbsPer100g: 79 },
  'dulce de membrillo': { aisle: 'almacén', buy: { unit: 'g', step: 500 }, carbsPer100g: 60 },
  salchicha: { plural: 'salchichas', aisle: 'carnicería', buy: { unit: 'u', per: 6, label: 'paquete' }, carbsPer100g: 3, carbsPerUnit: 2 },
  panceta: { aisle: 'carnicería', buy: { unit: 'g', step: 200 }, carbsPer100g: 0 },
  remolacha: { plural: 'remolachas', aisle: 'verdulería', carbsPer100g: 8 },
  pepino: { plural: 'pepinos', aisle: 'verdulería', carbsPer100g: 2, carbsPerUnit: 4 },
  naranja: { plural: 'naranjas', aisle: 'verdulería', buy: { unit: 'u', per: 6 }, carbsPer100g: 9, carbsPerUnit: 17 },
  mandarina: { plural: 'mandarinas', aisle: 'verdulería', buy: { unit: 'u', per: 6 }, carbsPer100g: 11, carbsPerUnit: 8 },
  pera: { plural: 'peras', aisle: 'verdulería', carbsPer100g: 12, carbsPerUnit: 21 },
  durazno: { plural: 'duraznos', aisle: 'verdulería', carbsPer100g: 9, carbsPerUnit: 13 },
  uva: { plural: 'uvas', aisle: 'verdulería', buy: { unit: 'g', step: 500 }, carbsPer100g: 16 },
  bizcochos: { aisle: 'panadería', buy: { unit: 'g', step: 250, label: 'paquete' }, carbsPer100g: 60 },
  'prepizza': { plural: 'prepizzas', aisle: 'panadería', buy: { unit: 'u', per: 2 }, carbsPer100g: 50, carbsPerUnit: 90 },
  'tapas de empanada': { aisle: 'congelados', buy: { unit: 'u', per: 12, label: 'paquete' }, carbsPer100g: 45, carbsPerUnit: 16 },
  'verduras congeladas': { aisle: 'congelados', buy: { unit: 'g', step: 500, label: 'paquete' }, carbsPer100g: 8 },
  'sopa crema': { aisle: 'almacén', buy: { unit: 'u', per: 1, label: 'sobre' }, unidad: { uno: 'sobre', varios: 'sobres' }, carbsPer100g: 60, carbsPerUnit: 12 },
  'atún al natural': { aisle: 'almacén', buy: { unit: 'lata' }, unidad: { uno: 'lata', varios: 'latas' }, carbsPer100g: 0, carbsPerUnit: 0 },
  'fideos integrales': { aisle: 'almacén', buy: { unit: 'g', per: 500, label: 'paquete' }, carbsPer100g: 70 },
  'pan de salvado': { aisle: 'panadería', buy: { unit: 'paquete', per: 18 }, carbsPer100g: 45, carbsPerUnit: 12 },

  'galletas de arroz': { aisle: 'almacén', buy: { unit: 'u', per: 12, label: 'paquete' }, carbsPer100g: 78, carbsPerUnit: 6 },
  'pizza congelada': { plural: 'pizzas congeladas', aisle: 'congelados', buy: { unit: 'u', per: 1 }, carbsPer100g: 28, carbsPerUnit: 120 },
  grasa: { aisle: 'almacén', buy: { unit: 'g', step: 250 }, carbsPer100g: 0 },

  // --- envasados y cosas de góndola ---
  'galletitas sin azúcar': { aisle: 'almacén', buy: { unit: 'g', per: 150, label: 'paquete' }, carbsPer100g: 60, carbsPerUnit: 4 },
  'barra proteica': { plural: 'barras proteicas', aisle: 'almacén', buy: { unit: 'u' }, carbsPer100g: 40, carbsPerUnit: 20 },
  'barra de cereal': { plural: 'barras de cereal', aisle: 'almacén', buy: { unit: 'u' }, carbsPer100g: 65, carbsPerUnit: 18 },
  chocolate: { aisle: 'almacén', buy: { unit: 'g', step: 100 }, carbsPer100g: 50 },
  'frutos secos con chocolate': { aisle: 'almacén', buy: { unit: 'g', step: 150 }, carbsPer100g: 35 },
  'gelatina sin azúcar': { plural: 'gelatinas sin azúcar', aisle: 'almacén', buy: { unit: 'u' }, carbsPer100g: 0, carbsPerUnit: 0 },
  'flan sin azúcar': { plural: 'flanes sin azúcar', aisle: 'lácteos', buy: { unit: 'u' }, carbsPer100g: 10, carbsPerUnit: 12 },
  'budín sin azúcar': { plural: 'budines sin azúcar', aisle: 'panadería', buy: { unit: 'u', per: 300 }, carbsPer100g: 30, carbsPerUnit: 25 },
  'mermelada sin azúcar': { aisle: 'almacén', buy: { unit: 'g', per: 350, label: 'frasco' }, carbsPer100g: 12 },
  manteca: { aisle: 'lácteos', buy: { unit: 'g', step: 200 }, carbsPer100g: 0 },
  yerba: { aisle: 'almacén', buy: { unit: 'g', step: 500 }, carbsPer100g: 0 },
  budín: { plural: 'budines', aisle: 'panadería', buy: { unit: 'u', per: 300 }, carbsPer100g: 55, carbsPerUnit: 44 },
  medialuna: { plural: 'medialunas', aisle: 'panadería', buy: { unit: 'u' }, carbsPer100g: 48, carbsPerUnit: 24 },
  alfajor: { plural: 'alfajores', aisle: 'almacén', buy: { unit: 'u' }, carbsPer100g: 58, carbsPerUnit: 32 },
  'queso untable': { aisle: 'lácteos', buy: { unit: 'g', per: 300, label: 'pote' }, carbsPer100g: 4 },
  'yogur bebible': { plural: 'yogures bebibles', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'botellita' }, carbsPer100g: 12 },
  'yogur saborizado sin azúcar': { plural: 'yogures saborizados sin azúcar', aisle: 'lácteos', buy: { unit: 'g', per: 200, label: 'pote' }, carbsPer100g: 4 },

  // --- más cosas de todos los días ---
  fideos: { aisle: 'almacén', buy: { unit: 'g', per: 500, label: 'paquete' }, carbsPer100g: 75 },
  'salsa de tomate': { aisle: 'almacén', buy: { unit: 'g', per: 400, label: 'lata' }, carbsPer100g: 6 },
  muzzarella: { aisle: 'lácteos', buy: { unit: 'g', step: 100 }, carbsPer100g: 3 },
  'carne picada': { aisle: 'carnicería', buy: { unit: 'g', step: 250 }, carbsPer100g: 0 },
  'pan de hamburguesa': { plural: 'panes de hamburguesa', aisle: 'panadería', buy: { unit: 'u', per: 4 }, carbsPer100g: 50, carbsPerUnit: 28 },
  'masa de tarta': { plural: 'masas de tarta', aisle: 'congelados', buy: { unit: 'u', per: 2 }, carbsPer100g: 45, carbsPerUnit: 112 },
  'masa de pizza': { plural: 'masas de pizza', aisle: 'panadería', buy: { unit: 'u' }, carbsPer100g: 50, carbsPerUnit: 140 },

  // --- productos que faltaban y obligaban a usar uno parecido ---
  // Cada uno reemplaza a un "parecido" que la lista de compras hacía
  // comprar mal: pochoclo compraba harina, el mousse compraba una barra
  // de chocolate, los duraznos en almíbar compraban una manzana.
  'maíz para pochoclo': { aisle: 'almacén', buy: { unit: 'g', step: 500, label: 'paquete' }, carbsPer100g: 72 },
  'duraznos en almíbar': { aisle: 'almacén', buy: { unit: 'u', label: 'lata' }, unidad: { uno: 'lata', varios: 'latas' }, carbsPer100g: 15, carbsPerUnit: 60 },
  'papas fritas de paquete': { aisle: 'almacén', buy: { unit: 'g', step: 100, label: 'paquete' }, carbsPer100g: 52 },
  turrón: { plural: 'turrones', aisle: 'almacén', buy: { unit: 'u', step: 3 }, carbsPer100g: 55, carbsPerUnit: 22 },
  'mousse de chocolate': { plural: 'mousses de chocolate', aisle: 'lácteos', buy: { unit: 'u', step: 4 }, carbsPer100g: 20, carbsPerUnit: 20 },
  'bocadito de chocolate': { plural: 'bocaditos de chocolate', aisle: 'almacén', buy: { unit: 'u', step: 6 }, carbsPer100g: 55, carbsPerUnit: 10 },
  'mezcla de frutos secos': { aisle: 'almacén', buy: { unit: 'g', step: 200, label: 'paquete' }, carbsPer100g: 10 },

  // --- básicos de alacena ---
  // No van a la lista semanal. Una receta los nombra y los cuenta, pero
  // la compra los ignora: si aparecieran, todas las semanas arrancarían
  // con "agua, sal, aceite" y la lista dejaría de servir.
  agua: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0 },
  sal: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0, carbsPerUnit: 0 },
  aceite: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0 },
  'aceite de oliva': { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0 },
  azúcar: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 100 },
  canela: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0, carbsPerUnit: 0 },
  orégano: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0, carbsPerUnit: 0 },
  pimentón: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0, carbsPerUnit: 0 },
  comino: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0, carbsPerUnit: 0 },
  pimienta: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0, carbsPerUnit: 0 },
  vinagre: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 0 },
  mayonesa: { aisle: 'almacén', pantryBasic: true, carbsPer100g: 5 },
  caldo: { aisle: 'almacén', pantryBasic: true, unidad: { uno: 'cubito', varios: 'cubitos' }, carbsPer100g: 0, carbsPerUnit: 1 },
}

/** Los que no entran en la lista semanal. */
export const esBasico = (item: string): boolean => foodOf(item).pantryBasic === true

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
    case 'u': {
      const u = food.unidad
      if (!u) return `${nice(qty)} ${name}`
      return `${nice(qty)} ${qty === 1 ? u.uno : u.varios} de ${item}`
    }
    case 'rebanada':
      return `${nice(qty)} ${qty === 1 ? 'rebanada' : 'rebanadas'} de ${item}`
    case 'cda':
      return `${nice(qty)} ${qty === 1 ? 'cucharada' : 'cucharadas'} de ${item}`
    case 'puñado':
      return `${nice(qty)} ${qty === 1 ? 'puñado' : 'puñados'} de ${item}`
    case 'pizca':
      return `${qty === 1 ? 'Una pizca' : `${nice(qty)} pizcas`} de ${item}`
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

/* ------------------------------------------------------------------
   SI NO TENÉS

   Con qué se reemplaza un ingrediente cuando falta. Es una de las
   preguntas que más se hace alguien parado frente a la heladera, y no
   se puede deducir del catálogo: que dos cosas estén en la misma
   góndola no las hace intercambiables.

   Por eso esto es una tabla escrita a mano y está lejos de completa.
   Sólo entran reemplazos que funcionan de verdad en el plato, y cada
   uno se escribió pensando en esa comida, no en la categoría. Lo que
   no está, no está: la ficha simplemente no muestra la sección.
   ------------------------------------------------------------------ */

export const SUSTITUTOS: Record<string, string[]> = {
  palta: ['queso untable', 'ricota'],
  pan: ['pan integral', 'galletas de arroz', 'tortilla de trigo'],
  'pan integral': ['pan', 'galletas de arroz'],
  'queso untable': ['ricota', 'palta', 'queso'],
  ricota: ['queso untable', 'queso'],
  'yogur natural': ['yogur entero', 'leche'],
  granola: ['avena', 'nuez', 'galletitas de agua'],
  avena: ['granola'],
  leche: ['yogur natural', 'agua'],
  manteca: ['aceite de oliva'],
  'mermelada sin azúcar': ['dulce de membrillo', 'banana'],
  'milanesa de pollo': ['milanesa de carne', 'pechuga de pollo'],
  'milanesa de carne': ['milanesa de pollo'],
  pollo: ['pechuga de pollo', 'atún al natural', 'huevo'],
  'pechuga de pollo': ['pollo', 'atún'],
  atún: ['atún al natural', 'pollo', 'huevo'],
  'atún al natural': ['atún', 'pollo'],
  papa: ['calabaza'],
  calabaza: ['papa'],
  arroz: ['fideos', 'polenta', 'papa'],
  fideos: ['arroz', 'fideos integrales', 'ñoquis'],
  'fideos integrales': ['fideos', 'arroz'],
  'salsa de tomate': ['tomate', 'crema de leche'],
  muzzarella: ['queso', 'queso rallado'],
  queso: ['muzzarella', 'queso untable'],
  'queso rallado': ['queso', 'muzzarella'],
  'lentejas cocidas': ['garbanzos cocidos', 'arvejas'],
  'garbanzos cocidos': ['lentejas cocidas', 'arvejas'],
  espinaca: ['acelga', 'zapallito'],
  acelga: ['espinaca'],
  zapallito: ['berenjena', 'zanahoria'],
  lechuga: ['espinaca', 'acelga'],
  banana: ['manzana', 'pera', 'durazno'],
  manzana: ['pera', 'banana'],
  nuez: ['almendra', 'maní'],
  almendra: ['nuez', 'maní'],
  'maní': ['almendra', 'nuez'],
  'dulce de leche': ['mermelada sin azúcar', 'dulce de membrillo'],
  'masa de tarta': ['masa de pizza', 'prepizza'],
  'tortilla de trigo': ['pan', 'pan de miga'],
}

/** Con qué se reemplaza, si está escrito. Vacío quiere decir que no lo
    sabemos, no que no exista. */
export const sustitutosDe = (item: string): string[] => SUSTITUTOS[item] ?? []

/** "12 huevos" · "1,5 kg de pollo" — para donde haga falta una sola línea. */
export const shoppingText = (item: string, qty: number, unit: Unit): string => {
  const { value, unit: u, label } = shoppingParts(item, qty, unit)
  return u ? `${value} ${u} de ${label}` : `${value} ${label}`
}
