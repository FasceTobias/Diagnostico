import type { Category, Meal, Origen } from '../lib/types'
import { ORIGEN_CORTO } from '../lib/types'

/* ------------------------------------------------------------------
   LAS CONSTANTES DEL KIT

   Tonos e íconos viven acá y no en `base.tsx` para que ese archivo
   exporte sólo componentes: es lo que le permite a Vite recargar en
   caliente sin perder el estado de la pantalla.
   ------------------------------------------------------------------ */

/* ---------------- tonos ----------------

   Un tono es un par: un fondo muy claro y una tinta que se lee encima.
   Nunca se usa el pastel puro para texto —no contrasta contra blanco—,
   así que el pastel vive en el fondo y la tinta es su versión oscura.

   Lavanda es la app: acción, selección, dato principal. Los otros cinco
   son señales de contenido —un momento del día, una categoría, una
   situación— y se reparten de a uno por tarjeta. */

export type Tono = 'lavanda' | 'menta' | 'mantequilla' | 'coral' | 'rosa' | 'azul' | 'neutro'

export const TONO: Record<Tono, { bg: string; fg: string; fill: string }> = {
  lavanda: { bg: 'bg-lavanda-tenue', fg: 'text-lavanda', fill: 'bg-lavanda' },
  menta: { bg: 'bg-menta-tenue', fg: 'text-menta-ink', fill: 'bg-menta' },
  mantequilla: { bg: 'bg-mantequilla-tenue', fg: 'text-mantequilla-ink', fill: 'bg-mantequilla' },
  coral: { bg: 'bg-coral-tenue', fg: 'text-coral-ink', fill: 'bg-coral' },
  rosa: { bg: 'bg-rosa-tenue', fg: 'text-rosa-ink', fill: 'bg-rosa' },
  azul: { bg: 'bg-azul-tenue', fg: 'text-azul-ink', fill: 'bg-azul' },
  neutro: { bg: 'bg-surface-2', fg: 'text-ink-soft', fill: 'bg-ink-faint' },
}

/* ---------------- íconos ----------------

   Línea simple, 24×24, mismo grosor en todos. Los dibujos entran acá y
   no en las pantallas: si mañana el set cambia, cambia en un archivo.

   Todos son de comida, de momentos del día o de lugares. No hay
   iconografía clínica: esta no es una app médica. */

export type IconName =
  // navegación
  | 'inicio'
  | 'hoy'
  | 'comidas'
  | 'compras'
  | 'perfil'
  // momentos del día
  | 'taza'
  | 'manzana'
  | 'plato'
  | 'luna'
  // dónde estás
  | 'casa'
  | 'trabajo'
  | 'calle'
  | 'afuera'
  // qué necesitás
  | 'hambre'
  | 'dulce'
  | 'salado'
  | 'rapido'
  | 'heladera'
  // lugares y utilidades
  | 'kiosco'
  | 'paquete'
  | 'pan'
  | 'lugar'
  | 'reloj'
  | 'flecha'
  | 'cambiar'
  | 'check'
  | 'mas'
  | 'chispa'
  | 'llevar'

const PATHS: Record<IconName, string> = {
  inicio: 'M4 10.4 12 4l8 6.4V19a1 1 0 0 1-1 1h-4.5v-5.2h-5V20H5a1 1 0 0 1-1-1Z',
  hoy: 'M4.8 6.6h14.4v12.6H4.8zM4.8 10.6h14.4M9 4.4v3.6M15 4.4v3.6',
  comidas:
    'M7 4v5.4a1.7 1.7 0 0 0 3.4 0V4M8.7 11.1V20M15.9 4c-1.2 1.5-1.7 3.2-1.7 5.1 0 1.5.6 2.3 1.7 2.3V20',
  compras: 'M6 7.8h12l-1.1 11a1.6 1.6 0 0 1-1.6 1.4H8.7a1.6 1.6 0 0 1-1.6-1.4ZM9.3 7.8a2.7 2.7 0 0 1 5.4 0',
  perfil:
    'M12 11.4a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4ZM4.8 20c.6-3.4 3.6-5.6 7.2-5.6s6.6 2.2 7.2 5.6',

  taza: 'M5.6 8.2h10.8v5.6a4.4 4.4 0 0 1-4.4 4.4h-2a4.4 4.4 0 0 1-4.4-4.4ZM16.4 9.8h1.2a2.2 2.2 0 0 1 0 4.4h-1.2M8.2 4.4v1.6M11.4 4.4v1.6M14.6 4.4v1.6',
  manzana:
    'M12 8.6c-1-1.1-2.3-1.6-3.5-1.3C6.8 7.8 5.9 9.7 6.3 11.8c.5 2.8 2.4 5.8 4.3 6.3.7.2.9-.3 1.4-.3s.7.5 1.4.3c1.9-.5 3.8-3.5 4.3-6.3.4-2.1-.5-4-2.2-4.5-1.2-.3-2.5.2-3.5 1.3ZM12 8.6V5.8M12 5.8c1.1 0 1.9-.8 2-1.9-1.2-.1-2 .7-2 1.9Z',
  plato: 'M14.2 19.8a6.6 6.6 0 1 0 0-13.2 6.6 6.6 0 0 0 0 13.2ZM4.4 4.2v3.6a1.6 1.6 0 0 0 3.2 0V4.2M6 9.4V20',
  luna: 'M19.2 14.8A7.8 7.8 0 0 1 9.2 4.8a7.9 7.9 0 1 0 10 10Z',

  casa: 'M4 10.4 12 4l8 6.4V19a1 1 0 0 1-1 1h-4.5v-5.2h-5V20H5a1 1 0 0 1-1-1Z',
  trabajo: 'M4.6 8.8h14.8v10H4.6zM9.2 8.8V7a1.4 1.4 0 0 1 1.4-1.4h2.8A1.4 1.4 0 0 1 14.8 7v1.8M4.6 13h14.8',
  calle:
    'M6.2 10.4a5.8 5.8 0 0 1 11.6 0v7.8a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8ZM9.2 10.4V7.8a2.8 2.8 0 0 1 5.6 0v2.6M9.4 15.2h5.2',
  afuera:
    'M4.6 9h14.8l-1.4-3.6H6ZM6 11.2v8h12v-8M9.8 19.2v-4.4h4.4v4.4M4.6 9c0 1.2.8 2.2 1.9 2.2s1.9-1 1.9-2.2c0 1.2.8 2.2 1.9 2.2s1.9-1 1.9-2.2c0 1.2.8 2.2 1.9 2.2s1.9-1 1.9-2.2',

  hambre:
    'M7 4v5.4a1.7 1.7 0 0 0 3.4 0V4M8.7 11.1V20M15.9 4c-1.2 1.5-1.7 3.2-1.7 5.1 0 1.5.6 2.3 1.7 2.3V20',
  dulce:
    'M6.8 12.6h10.4l-1.1 6a1.3 1.3 0 0 1-1.3 1H9.2a1.3 1.3 0 0 1-1.3-1ZM8.2 12.6a2.4 2.4 0 1 1 .6-4.6 3.4 3.4 0 0 1 6.4 0 2.4 2.4 0 1 1 .6 4.6',
  salado:
    'M4.8 9.8c0-2.7 3.2-4.8 7.2-4.8s7.2 2.1 7.2 4.8ZM4.8 12.6h14.4M4.8 15.4h14.4a3.2 3.2 0 0 1-3.2 3.2H8a3.2 3.2 0 0 1-3.2-3.2Z',
  rapido: 'M13.4 3.8 6.6 13.2h4.4l-.4 7 6.8-9.6h-4.4Z',
  heladera: 'M6.6 4.4h10.8v15.2H6.6zM6.6 10.6h10.8M9.4 7.2v1.8M9.4 12.8v2.2',

  kiosco: 'M5 9.4h14v9.8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1ZM4 9.4 6.4 4.6h11.2L20 9.4M9.6 13.4h4.8',
  paquete: 'M4.6 8.2 12 4.4l7.4 3.8v7.6L12 19.6l-7.4-3.8ZM4.6 8.2 12 12l7.4-3.8M12 12v7.6',
  pan: 'M6.4 9.2c0-2.3 2.5-3.8 5.6-3.8s5.6 1.5 5.6 3.8c0 1-.7 1.6-1.6 1.6v6.6a1.4 1.4 0 0 1-1.4 1.4H9.4A1.4 1.4 0 0 1 8 17.4v-6.6c-.9 0-1.6-.6-1.6-1.6Z',
  lugar:
    'M12 20.4s6-5.3 6-9.4a6 6 0 1 0-12 0c0 4.1 6 9.4 6 9.4ZM12 13.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  reloj: 'M12 20.2a8.2 8.2 0 1 0 0-16.4 8.2 8.2 0 0 0 0 16.4ZM12 7.6V12l3 1.8',
  flecha: 'M5 12h13M13 7l5 5-5 5',
  cambiar: 'M4.6 8.6h12.2M13.6 5.4l3.2 3.2-3.2 3.2M19.4 15.4H7.2M10.4 12.2l-3.2 3.2 3.2 3.2',
  check: 'M5.2 12.4 9.8 17 18.8 7.2',
  mas: 'M12 5.5v13M5.5 12h13',
  chispa: 'M12 4.5l1.6 4.4 4.4 1.6-4.4 1.6L12 16.5l-1.6-4.4L6 10.5l4.4-1.6Z',
  llevar:
    'M6.2 10.4a5.8 5.8 0 0 1 11.6 0v7.8a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8ZM9.2 10.4V7.8a2.8 2.8 0 0 1 5.6 0v2.6M9.4 15.2h5.2',
}

/** Los que se rellenan en vez de dibujarse con línea. */
const MACIZOS: IconName[] = ['chispa', 'rapido', 'luna']

export { PATHS, MACIZOS }

/* ---------------- momentos del día ----------------

   Cada momento tiene su color y su dibujo, siempre los mismos. Es lo
   que permite reconocer una fila de un vistazo, sin leerla. */

export const TONO_MOMENTO: Record<Category, Tono> = {
  desayuno: 'mantequilla',
  snack: 'menta',
  almuerzo: 'lavanda',
  merienda: 'rosa',
  cena: 'azul',
}

export const ICONO_MOMENTO: Record<Category, IconName> = {
  desayuno: 'taza',
  snack: 'manzana',
  almuerzo: 'plato',
  merienda: 'taza',
  cena: 'luna',
}

/** «~38 g» · «38 g». La tilde dice «estimado» sin gastar una etiqueta.
    Hoy la llevan todas: ninguna se midió contra un envase. */
export const carbs = (meal: Meal) =>
  `${!meal.carbsVerified || meal.confidence === 'estimada' ? '~' : ''}${meal.carbs} g`

/* ---------------- de dónde sale ----------------

   En una lista de resultados el momento del día no distingue nada —si
   pediste snacks, todo es snack—. Lo que sí cambia de fila en fila es
   si eso lo hacés, lo comprás envasado o lo pedís en un lugar, que
   además es la pregunta siguiente del que mira la lista. */

export const TILE_ORIGEN: Record<Origen, { icono: IconName; tono: Tono }> = {
  casera: { icono: 'plato', tono: 'lavanda' },
  envasada: { icono: 'paquete', tono: 'azul' },
  'panadería': { icono: 'pan', tono: 'mantequilla' },
  'rotisería': { icono: 'lugar', tono: 'coral' },
  restaurante: { icono: 'lugar', tono: 'coral' },
  kiosco: { icono: 'kiosco', tono: 'menta' },
  supermercado: { icono: 'compras', tono: 'azul' },
  'heladería': { icono: 'dulce', tono: 'rosa' },
}

/** «~30 g CH · 10 min · panadería». Lo secundario, en una sola línea.
    El tiempo es el de reloj: la diferencia entre activo y total es un
    dato de la ficha, no de una fila que se lee de reojo. */
export const meta = (meal: Meal): string => {
  const minutos = meal.totalMinutes ?? meal.prepMinutes
  return [`${carbs(meal)} CH`, minutos > 0 ? `${minutos} min` : null, ORIGEN_CORTO[meal.origen] || null]
    .filter(Boolean)
    .join(' · ')
}

