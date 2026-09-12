/* Modelo de dominio. Espeja el esquema de Supabase (supabase/schema.sql)
   para que migrar de local a remoto no toque la UI. */

export type Slot = 'breakfast' | 'snack_am' | 'lunch' | 'snack_pm' | 'dinner'

export type Category = 'desayuno' | 'snack' | 'almuerzo' | 'merienda' | 'cena'

export type Tag =
  | 'para llevar'
  | 'en casa'
  | 'rápido'
  | 'emergencia'
  | 'potente'
  | 'normal'
  | 'liviano'

/** Tres niveles, no un número: un número invita a optimizar. */
export type Satiety = 'liviana' | 'normal' | 'potente'

export type CarbSource = 'etiqueta' | 'receta' | 'estimación' | 'pendiente'

/** Cómo se muestra la confianza. Se deriva de la fuente pero puede bajarse a mano. */
export type Confidence = 'alta' | 'media' | 'estimada'

export type MealStatus =
  | 'pending'
  | 'prepared'
  | 'eaten'
  | 'skipped'
  | 'replaced'

export interface Meal {
  id: string
  name: string
  category: Category
  tags: Tag[]
  /** Ingrediente principal. Lo usa la rotación para no repetir pollo tres días. */
  mainIngredient: string
  ingredients: string[]
  portion: string
  carbs: number
  carbSource: CarbSource
  confidence: Confidence
  prepMinutes: number
  satiety: Satiety
  portable: boolean
  needsCold: boolean
  needsReheat: boolean
  makeNightBefore: boolean
  freezable: boolean
  difficulty: 1 | 2 | 3
  favorite: boolean
  tested: boolean
  rating?: number
  notes?: string
  /** Tareas que genera la noche anterior. Se agrupan entre comidas. */
  prepSteps?: string[]
  isDemo: boolean
}

export interface PlannedMeal {
  slot: Slot
  mealId: string
  /** "08:30" */
  time: string
  status: MealStatus
  replacedFrom?: string
  note?: string
}

export interface DayPlan {
  /** ISO yyyy-mm-dd */
  date: string
  meals: PlannedMeal[]
}

export interface PrepTask {
  id: string
  label: string
  /** De qué comidas salió. Si son varias, es una tarea agrupada. */
  sourceMealIds: string[]
  done: boolean
}

export type PackKind = 'meal' | 'gear'

export interface PackItem {
  id: string
  label: string
  kind: PackKind
  hint?: string
  mealId?: string
  done: boolean
}

export const SLOT_LABEL: Record<Slot, string> = {
  breakfast: 'Desayuno',
  snack_am: 'Snack',
  lunch: 'Almuerzo',
  snack_pm: 'Merienda',
  dinner: 'Cena',
}

export const SLOT_ORDER: Slot[] = [
  'breakfast',
  'snack_am',
  'lunch',
  'snack_pm',
  'dinner',
]

export const SLOT_CATEGORY: Record<Slot, Category> = {
  breakfast: 'desayuno',
  snack_am: 'snack',
  lunch: 'almuerzo',
  snack_pm: 'merienda',
  dinner: 'cena',
}

export const STATUS_LABEL: Record<MealStatus, string> = {
  pending: 'Pendiente',
  prepared: 'Preparado',
  eaten: 'Comido',
  skipped: 'Omitido',
  replaced: 'Cambiado',
}
