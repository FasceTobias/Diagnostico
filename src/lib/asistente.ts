import type { Category, DayContext, Meal, Venue } from './types'
import { VENUES } from './types'
import { FOODS } from './foods'
import { sirveEn } from './busquedas'

/* ------------------------------------------------------------------
   EL ASISTENTE

   Tres cosas que este archivo NO hace, y que definen el producto:

     · No conversa. La salida no es un párrafo: es una estructura que la
       app dibuja con sus propias tarjetas. Nadie quiere leer tres
       oraciones a las 12:40 con hambre.
     · No inventa comida. Todo lo que devuelve sale del catálogo, con su
       porción y su número. Si no hay nada, lo dice.
     · No decide por vos. Muestra opciones y te deja elegir.

   Hoy lo resuelven reglas: un intérprete que saca de la frase los datos
   que el catálogo entiende —momento, situación, lugar, sabor, tiempo,
   ingredientes— y una búsqueda sobre esos datos. No es un modelo de
   lenguaje y no pretende serlo.

   Cuando haya un modelo detrás, entra por la misma puerta: recibe el
   texto y devuelve un `Entendido`. El resto de la app —la búsqueda, las
   tarjetas, los ajustes— no se entera del cambio. Por eso lo que se
   interpreta y lo que se busca están separados en dos funciones.
   ------------------------------------------------------------------ */

export interface Entendido {
  momento?: Category
  situacion?: DayContext
  lugar?: Venue
  sabor?: 'dulce' | 'salado'
  /** Techo de minutos, de punta a punta. */
  minutos?: number
  saciedad?: 'liviana' | 'potente'
  /** Que no haya que cocinar ni calentar. */
  sinCocinar?: boolean
  paraLlevar?: boolean
  /** Lo que dijo que tiene. Claves del catálogo de alimentos. */
  tengo: string[]
  /** Lo que dijo que NO tiene o no quiere. */
  sinEsto: string[]
}

const VACIO: Entendido = { tengo: [], sinEsto: [] }

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const tiene = (t: string, ...palabras: string[]) => palabras.some((p) => t.includes(norm(p)))

/* Palabra entera, para que «pan» no se active con «panadería» ni «te»
   con «tenés». Es la diferencia entre una sugerencia útil y una que
   parece rota. */
const palabraEntera = (t: string, palabra: string) =>
  new RegExp(`(^|[^a-z0-9])${norm(palabra).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(t)

/* ---------------- 1. entender ---------------- */

const MOMENTOS: [Category, string[]][] = [
  ['desayuno', ['desayuno', 'desayunar', 'a la mañana', 'manana temprano']],
  ['almuerzo', ['almuerzo', 'almorzar', 'mediodia']],
  ['merienda', ['merienda', 'merendar', 'la tarde']],
  ['cena', ['cena', 'cenar', 'a la noche']],
  ['snack', ['snack', 'entre comidas', 'picar', 'media manana', 'media tarde']],
]

const SITUACIONES: [DayContext, string[]][] = [
  ['casa', ['en casa', 'estoy en casa', 'no salgo', 'desde casa']],
  ['calle', ['en la calle', 'estoy afuera', 'afuera', 'no vuelvo', 'no traje']],
  ['mixto', ['en el trabajo', 'en la oficina', 'trabajando', 'la facultad', 'cursando']],
]

/** Cuánto tarda, cuando lo dijo con un número. */
const minutosDe = (t: string): number | undefined => {
  const m = t.match(/(\d{1,3})\s*(min|minutos?)/)
  if (m) return Number(m[1])
  if (tiene(t, 'poco tiempo', 'apurado', 'rapido', 'ya', 'sin tiempo')) return 10
  if (tiene(t, 'media hora')) return 30
  return undefined
}

/** Los alimentos del catálogo que la frase nombra.

    Dos formas de encontrarlos, y la segunda es la que importa: nadie
    dice «tengo yogur natural», dice «tengo yogur». Así que además del
    nombre completo se prueba la primera palabra, y si pega vale por
    todas las variantes: tener yogur es tener yogur. La cabeza tiene que
    ser de cuatro letras para arriba, si no «pan» te traería el pan de
    miga y el pan de pancho de arriba. */
const alimentosEn = (t: string): string[] => {
  const claves = Object.keys(FOODS)
  const pega = (p: string) => palabraEntera(t, p) || palabraEntera(t, `${p}s`)

  const exactas = claves.filter((c) => pega(norm(c)))
  const porCabeza = claves.filter((c) => {
    const cabeza = norm(c).split(' ')[0]
    return cabeza.length >= 4 && pega(cabeza)
  })

  const todas = [...new Set([...exactas, ...porCabeza])]
  /* Si nombró el completo —«pan integral»— el genérico sobra. */
  return todas.filter(
    (a) => !exactas.some((b) => b !== a && norm(b).includes(`${norm(a)} `)),
  )
}

/** Cómo se dicen esos alimentos en una línea: si hay tres yogures, es
    «yogur». Nadie quiere leer «yogur natural, yogur entero». */
const paraDecir = (claves: string[]): string[] => {
  const porCabeza = new Map<string, string[]>()
  for (const c of claves) {
    const cabeza = c.split(' ')[0]
    porCabeza.set(cabeza, [...(porCabeza.get(cabeza) ?? []), c])
  }
  return [...porCabeza].map(([cabeza, lista]) => (lista.length > 1 ? cabeza : lista[0]))
}

export const entender = (texto: string): Entendido => {
  const t = norm(texto)
  const e: Entendido = { ...VACIO, tengo: [], sinEsto: [] }

  for (const [cat, palabras] of MOMENTOS) if (tiene(t, ...palabras)) { e.momento = cat; break }
  for (const [ctx, palabras] of SITUACIONES) if (tiene(t, ...palabras)) { e.situacion = ctx; break }

  const lugar = VENUES.find((v) => tiene(t, norm(v)))
  if (lugar) {
    e.lugar = lugar
    e.situacion = 'calle'
  }
  if (tiene(t, 'mcdonald', 'burger', 'fast food', 'comida rapida')) e.lugar = 'restaurante'

  if (tiene(t, 'dulce', 'postre', 'chocolate', 'antojo')) e.sabor = 'dulce'
  if (tiene(t, 'salado', 'salada')) e.sabor = 'salado'

  e.minutos = minutosDe(t)
  if (tiene(t, 'que llene', 'mucha hambre', 'contundente', 'no me llena', 'mas hambre'))
    e.saciedad = 'potente'
  /* «poco» no entra acá: «tengo poco tiempo» no quiere decir que
     quiera algo liviano, quiere decir que está apurado. */
  if (tiene(t, 'liviano', 'liviana', 'algo chico', 'ligero')) e.saciedad = 'liviana'

  if (tiene(t, 'sin cocinar', 'no prepare', 'no cocine', 'sin cocina', 'no tengo nada hecho'))
    e.sinCocinar = true
  if (tiene(t, 'para llevar', 'llevarme', 'en la mochila', 'al trabajo', 'a la facultad'))
    e.paraLlevar = true

  /* Lo que tiene y lo que le falta.

     El modo despensa sólo se enciende si la frase dice que tenés algo.
     Sin esa regla, «quiero algo dulce» encontraba el dulce de leche y
     te contestaba con recetas que llevan dulce de leche, que no es
     ni cerca lo que preguntaste. Una palabra de comida suelta es una
     palabra de comida suelta, no una heladera. */
  const alimentos = alimentosEn(t)
  const niega = /\b(sin|no tengo|me falta|se me acabo|no hay|no me queda)\b/
  const posee = /\b(tengo|tenemos|hay|me queda|me quedo|sobro|sobra|compre)\b/.test(t)

  for (const a of alimentos) {
    const i = t.indexOf(norm(a).split(' ')[0])
    const antes = t.slice(Math.max(0, i - 24), i)
    if (niega.test(antes)) e.sinEsto.push(a)
    else if (posee) e.tengo.push(a)
  }

  return e
}

/** ¿Entendió algo? Si la frase no dejó ningún dato, no hay búsqueda que
    hacer y la app lo dice en vez de devolver el catálogo entero. */
export const entendioAlgo = (e: Entendido) =>
  Boolean(
    e.momento ||
      e.situacion ||
      e.lugar ||
      e.sabor ||
      e.minutos ||
      e.saciedad ||
      e.sinCocinar ||
      e.paraLlevar ||
      e.tengo.length ||
      e.sinEsto.length,
  )

/* ---------------- 2. decirlo en una línea ----------------

   La app repite lo que entendió antes de mostrar nada. Es la única
   manera de que el usuario sepa por qué le está mostrando eso y pueda
   corregir en un toque. */

export const resumir = (e: Entendido, momentoPorDefecto: Category): string => {
  const partes: string[] = []

  if (e.tengo.length) partes.push(`con ${paraDecir(e.tengo).join(', ')}`)
  if (e.sabor) partes.push(`algo ${e.sabor}`)
  if (!e.sabor && !e.tengo.length) partes.push(`para ${e.momento ?? momentoPorDefecto}`)
  else if (e.momento) partes.push(`para ${e.momento}`)

  if (e.lugar) partes.push(`en ${e.lugar}`)
  else if (e.situacion === 'calle') partes.push('en la calle')
  else if (e.situacion === 'mixto' || e.paraLlevar) partes.push('que se pueda llevar')
  else if (e.situacion === 'casa') partes.push('en casa')

  if (e.minutos) partes.push(`en ${e.minutos} minutos o menos`)
  if (e.sinCocinar) partes.push('sin cocinar')
  if (e.saciedad === 'potente') partes.push('que llene')
  if (e.saciedad === 'liviana') partes.push('liviano')
  if (e.sinEsto.length) partes.push(`sin ${paraDecir(e.sinEsto).join(' ni ')}`)

  const frase = partes.join(', ')
  return frase.charAt(0).toUpperCase() + frase.slice(1) + '.'
}

/* ---------------- 3. buscar ---------------- */

export interface Opcion {
  meal: Meal
  /** Cuando dijo qué tiene: lo que le falta para hacerla. Vacío quiere
      decir que le sale con lo que hay. */
  faltan: string[]
}

export interface Respuesta {
  entendido: Entendido
  resumen: string
  opciones: Opcion[]
  /** Un cambio de contexto que arregla el pedido de raíz, cuando lo hay. */
  cambiarA?: DayContext
  /** Para afinar sin escribir de nuevo. */
  ajustes: { label: string; texto: string }[]
  /** No se entendió la frase. Se dice; no se devuelve cualquier cosa. */
  sinEntender?: boolean
}

const AJUSTES: { label: string; texto: string; cuando: (e: Entendido) => boolean }[] = [
  { label: 'Más rápido', texto: 'en 10 minutos', cuando: (e) => !e.minutos },
  { label: 'Que llene más', texto: 'que llene', cuando: (e) => e.saciedad !== 'potente' },
  { label: 'Algo más liviano', texto: 'liviano', cuando: (e) => e.saciedad !== 'liviana' },
  { label: 'Sin cocinar', texto: 'sin cocinar', cuando: (e) => !e.sinCocinar },
  { label: 'Para llevar', texto: 'para llevar', cuando: (e) => !e.paraLlevar },
  { label: 'Algo dulce', texto: 'algo dulce', cuando: (e) => e.sabor !== 'dulce' },
  { label: 'Algo salado', texto: 'algo salado', cuando: (e) => e.sabor !== 'salado' },
]

/** Cuántos ingredientes de la comida NO están en lo que dijo tener.
    Los de despensa —sal, aceite, azúcar— no cuentan: nadie dice «tengo
    sal» y nadie se queda sin hacer algo por eso. */
/** ¿La comida lleva alguno de estos? Mira la lista de ingredientes y
    también el ingrediente principal: lo comprado afuera no trae lista,
    pero un tostado es pan igual. */
const lleva = (meal: Meal, cosas: string[]) =>
  cosas.some(
    (x) =>
      meal.ingredients.some((i) => i.item === x) ||
      meal.mainIngredient === x ||
      meal.mainIngredient.startsWith(`${x} `) ||
      x.startsWith(`${meal.mainIngredient} `),
  )

const faltantes = (meal: Meal, tengo: string[]): string[] =>
  meal.ingredients
    .filter((i) => !FOODS[i.item]?.pantry && !tengo.includes(i.item))
    .map((i) => i.item)

/** Si la frase nombra una comida del catálogo, eso es la respuesta.
    Parece obvio y no lo estaba: escribir «milanesa con puré» devolvía
    «no entendí», porque el intérprete buscaba situaciones y no platos.
    Alguien que escribe el nombre de algo quiere eso. */
const porNombre = (texto: string, meals: Meal[]): Meal[] => {
  const t = norm(texto).trim()
  if (t.length < 4) return []
  const palabras = t.split(/\s+/).filter((p) => p.length > 3)
  if (!palabras.length) return []

  return meals
    .map((m) => {
      const n = norm(m.name)
      if (n === t) return { m, punto: 100 }
      if (n.includes(t)) return { m, punto: 60 }
      const pegan = palabras.filter((p) => n.includes(p)).length
      return { m, punto: pegan === palabras.length ? 40 + pegan : pegan >= 2 ? 20 + pegan : 0 }
    })
    .filter((x) => x.punto > 0)
    .sort((a, b) => b.punto - a.punto)
    .slice(0, 8)
    .map((x) => x.m)
}

export const buscar = (
  e: Entendido,
  meals: Meal[],
  momentoPorDefecto: Category,
  limite = 10,
  /** El texto original, para poder buscar por nombre si no se entendió
      ninguna condición. */
  texto?: string,
): Respuesta => {
  const resumen = resumir(e, momentoPorDefecto)
  const ajustes = AJUSTES.filter((a) => a.cuando(e)).slice(0, 4).map(({ label, texto }) => ({ label, texto }))

  if (!entendioAlgo(e)) {
    /* Antes de rendirse: capaz escribió el nombre de una comida. */
    const porNombreTexto = texto ? porNombre(texto, meals) : []
    if (porNombreTexto.length) {
      return {
        entendido: e,
        resumen: `Comidas que se llaman así.`,
        opciones: porNombreTexto.map((meal) => ({ meal, faltan: [] as string[] })),
        ajustes,
      }
    }
    return { entendido: e, resumen: '', opciones: [], ajustes, sinEntender: true }
  }

  const momento = e.momento ?? momentoPorDefecto

  /* ---- modo despensa: dijo qué tiene ----
     Acá el orden no es «lo más rico» sino «lo que te sale ya». Primero
     lo que no le falta nada, después lo que le falta una sola cosa: eso
     contesta las dos preguntas juntas, qué hago con esto y qué me falta
     para lo otro. */
  if (e.tengo.length) {
    const conTodo = meals
      .filter((m) => m.ingredients.length > 0 && m.origen === 'casera')
      .map((meal) => ({ meal, faltan: faltantes(meal, e.tengo) }))
      /* Que use al menos uno de los que nombró, si no es cualquier receta. */
      .filter(({ meal }) => meal.ingredients.some((i) => e.tengo.includes(i.item)))
      .filter(({ meal }) => !lleva(meal, e.sinEsto))
      .sort(
        (a, b) =>
          a.faltan.length - b.faltan.length ||
          Number(sirveEn(b.meal, momento)) - Number(sirveEn(a.meal, momento)) ||
          a.meal.prepMinutes - b.meal.prepMinutes,
      )
      .filter(({ faltan }) => faltan.length <= 2)
      .slice(0, limite)

    return { entendido: e, resumen, opciones: conTodo, ajustes }
  }

  /* ---- modo búsqueda: filtros sobre el catálogo ---- */
  let pool = meals.filter((m) => !m.esBebida)

  if (e.lugar) pool = pool.filter((m) => m.venues?.includes(e.lugar!))
  else if (e.situacion === 'calle') pool = pool.filter((m) => m.buyOutside || m.portable)
  else if (e.situacion === 'casa') pool = pool.filter((m) => !m.buyOutside)

  if (e.paraLlevar || e.situacion === 'mixto') pool = pool.filter((m) => m.portable)
  if (e.sabor === 'dulce') pool = pool.filter((m) => m.sabor === 'dulce')
  if (e.sabor === 'salado') pool = pool.filter((m) => m.sabor === 'salado' || m.sabor === 'mixta')
  if (e.minutos !== undefined) pool = pool.filter((m) => (m.totalMinutes ?? m.prepMinutes) <= e.minutos!)
  if (e.sinCocinar) pool = pool.filter((m) => m.prepMinutes <= 5 && !m.needsReheat)
  if (e.saciedad === 'potente') pool = pool.filter((m) => m.satiety === 'potente')
  if (e.saciedad === 'liviana') pool = pool.filter((m) => m.satiety !== 'potente')
  if (e.sinEsto.length) pool = pool.filter((m) => !lleva(m, e.sinEsto))

  const sinLugar = !e.lugar && !e.situacion
  const opciones = pool
    .sort(
      (a, b) =>
        Number(sirveEn(b, momento)) - Number(sirveEn(a, momento)) ||
        (sinLugar ? Number(a.buyOutside) - Number(b.buyOutside) : 0) ||
        Number(b.everyday) - Number(a.everyday) ||
        Number(a.frequency === 'ocasional') - Number(b.frequency === 'ocasional') ||
        a.prepMinutes - b.prepMinutes,
    )
    .slice(0, limite)
    .map((meal) => ({ meal, faltan: [] as string[] }))

  return {
    entendido: e,
    resumen,
    opciones,
    ajustes,
    /* Si pidió algo de todo el día y no de una comida, el arreglo de
       fondo es cambiar el contexto, no elegir un plato. */
    cambiarA:
      e.situacion && !e.lugar && !e.momento && !e.sabor ? e.situacion : undefined,
  }
}

/** La puerta única: texto adentro, respuesta afuera. El día que haya un
    modelo, cambia lo que hay entre estas dos líneas y nada más. */
export const preguntar = (texto: string, meals: Meal[], momento: Category): Respuesta =>
  buscar(entender(texto), meals, momento, 10, texto)

/* Ejemplos para cuando la caja está vacía. Son los que de verdad se
   escriben, no una demostración de lo que el sistema puede parsear. */
export const EJEMPLOS = [
  'Tengo hambre y estoy en el trabajo',
  'Quiero algo dulce',
  'Tengo yogur, banana y avena',
  'Estoy en una panadería',
  'Algo salado en 10 minutos',
  'No preparé nada para la cena',
  'No tengo pan',
]
