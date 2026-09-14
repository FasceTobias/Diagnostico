import type { Category, Drink, Meal, Origen, Portion, Sabor, Tag, Unit, Venue } from './types'
import { RECETAS } from './recetas'
import crudo from '../../data/catalogo/v1.json'

/* ------------------------------------------------------------------
   EL CATÁLOGO

   La biblioteca de verdad. Vive en `data/catalogo/*.json`, que es la
   única fuente: de ahí sale esto —lo que la app usa hoy— y también el
   seed SQL que va a Supabase (`npm run catalogo:sql`). Un dato se corrige
   en un solo lugar.

   Todas las entradas entran como **estimadas**: la porción está
   documentada y el número calculado sobre esa porción, pero ninguna se
   midió contra una etiqueta. Para eso hace falta el envase en la mano, y
   por eso la app las muestra con la tilde: ~42 g CHO.

   Sobre la comida que suele quedar afuera de estas apps —pizza,
   empanadas, medialunas, alfajor, helado, gaseosa común—: está, con su
   número. No porque dé lo mismo comerla todos los días, sino porque el
   día que la comas vas a necesitar el número, y si la app no la tiene,
   estimás a ojo.

   Lo que las separa no es una advertencia, es `frequency`: las de todos
   los días y las de cada tanto. El plan propone una comida «de vez en
   cuando» más o menos una vez por semana, y la app lo dice en el
   detalle. Ni prohibir ni festejar: que el plan se parezca a una semana
   normal.
   ------------------------------------------------------------------ */

interface PorcionJson {
  label: string
  carbs: number
  grams: number | null
  default: boolean
}

interface EntradaJson {
  slug: string
  name: string
  category: Meal['category']
  /* De dónde sale la comida. No es lo mismo que dónde se come: define qué
     genera en la lista de compras —ingredientes, un producto, o nada—. */
  origen: Origen
  /* Dulce o salado. Lo que la app busca cuando pedís «algo salado». */
  sabor: Sabor
  /* Los momentos en los que sirve. Un tostado no es sólo desayuno. */
  momentos: string[]
  description: string
  portions: PorcionJson[]
  tags: string[]
  satiety: Meal['satiety']
  prepMinutes: number
  totalMinutes: number | null
  esBebida: boolean
  mainIngredient: string
  everyday: boolean
  addedSugar: boolean
  frequency: Meal['frequency']
  difficulty: number
  portable: boolean
  needsCold: boolean
  needsReheat: boolean
  makeNightBefore: boolean
  freezable: boolean
  handheld: boolean
  buyOutside: boolean
  venues: string[]
  priceLevel: number | null
  drink: string | null
  items: { item: string; qty: number; unit: string }[]
  notes: string
}

const aPorcion = (p: PorcionJson): Portion => ({
  label: p.label,
  carbs: p.carbs,
  grams: p.grams ?? undefined,
})

const aMeal = (e: EntradaJson): Meal => {
  const porciones = e.portions.map(aPorcion)
  const porDefecto = e.portions.find((p) => p.default) ?? e.portions[0]

  return {
    id: e.slug,
    name: e.name,
    description: e.description || undefined,
    category: e.category,
    /* La categoría sigue siendo una —para agrupar y ordenar—, pero el motor
       arma la semana mirando `momentos`: la misma comida puede servir para
       más de uno sin necesidad de duplicar la entrada. */
    momentos: e.momentos.length ? (e.momentos as Category[]) : [e.category],
    origen: e.origen,
    sabor: e.sabor,
    esBebida: e.esBebida || undefined,
    tags: e.tags as Tag[],
    mainIngredient: e.mainIngredient,
    portion: porDefecto.label,
    carbs: porDefecto.carbs,
    /* Una porción estándar calculada es una estimación honesta, no una
       medición. Se muestra con tilde hasta que haya etiqueta o receta. */
    carbSource: 'estimación',
    confidence: 'estimada',
    carbsVerified: false,
    isDemo: false,
    portions: porciones.length > 1 ? porciones : undefined,
    prepMinutes: e.prepMinutes,
    /* Activo y total no son lo mismo: una empanada son diez minutos de
       armado y cuarenta de horno. Si sólo guardás uno, mentís en el otro. */
    totalMinutes: e.totalMinutes ?? undefined,
    satiety: e.satiety,
    portable: e.portable,
    needsCold: e.needsCold,
    needsReheat: e.needsReheat,
    makeNightBefore: e.makeNightBefore,
    freezable: e.freezable,
    difficulty: e.difficulty as Meal['difficulty'],
    frequency: e.frequency,
    everyday: e.everyday,
    addedSugar: e.addedSugar,
    drink: (e.drink ?? undefined) as Drink | undefined,
    favorite: false,
    tested: false,
    notes: e.notes || undefined,
    /* Lo que hay que dejar hecho la noche anterior sale de la comida, no
       de una lista aparte: si se prepara antes, la tarea es prepararla. */
    prepSteps: e.makeNightBefore ? [`Dejar lista: ${e.name.toLowerCase()}`] : [],
    /* La receta, si la tiene. Vive en `recetas.ts` porque es prosa, no
       data: el JSON guarda el número, el otro archivo cómo se hace. */
    steps: RECETAS[e.slug],
    buyOutside: e.buyOutside,
    venues: e.venues.length ? (e.venues as Venue[]) : undefined,
    priceLevel: (e.priceLevel ?? undefined) as Meal['priceLevel'],
    handheld: e.handheld,
    ingredients: e.items.map((i) => ({
      item: i.item,
      qty: i.qty,
      unit: i.unit as Unit,
    })),
  }
}

export const CATALOGO: Meal[] = (crudo as EntradaJson[]).map(aMeal)
