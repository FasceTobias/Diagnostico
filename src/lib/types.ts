/* Modelo de dominio. Espeja el esquema de Supabase (supabase/schema.sql)
   para que migrar de local a remoto no toque la UI. */

/* Seis momentos. Snack y merienda NO son lo mismo:
   el snack aguanta entre comidas, la merienda es una comida. */
export type Slot =
  | 'breakfast'
  | 'snack_am'
  | 'lunch'
  | 'snack_pm'
  | 'merienda'
  | 'dinner'

export type Category = 'desayuno' | 'snack' | 'almuerzo' | 'merienda' | 'cena'

/* Etiquetas descriptivas. Ninguna dice si algo es bueno o malo: dicen qué
   es, dónde se consigue y para qué sirve. Una barra de chocolate en la
   calle puede ser exactamente lo que necesitás. */
export type Tag =
  | 'para llevar'
  | 'en casa'
  | 'rápido'
  | 'emergencia'
  | 'potente'
  | 'normal'
  | 'liviano'
  | 'práctico'
  | 'antojo'
  | 'dulce'
  | 'salado'
  | 'kiosco'
  | 'supermercado'
  | 'envasado'
  | 'evento'
  | 'salida'

/* Cada cuánto tiene sentido que aparezca. Es un dato de rotación, no un
   juicio: «ocasional» significa que no todos los días, no que esté mal. */
export type Frequency = 'habitual' | 'ocasional' | 'emergencia'

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  habitual: 'Habitual',
  ocasional: 'De vez en cuando',
  emergencia: 'Para salir del paso',
}

/* Producto envasado. Acá el carbohidrato no se estima: se lee de la
   etiqueta. Mientras no esté cargada, sigue siendo DEMO.

   Nada de esto se inventa: si el campo está vacío es porque todavía no
   miramos el envase. */
export interface PackagedInfo {
  brand?: string
  product?: string
  /** Tamaño del envase: "paquete de 150 g", "botella de 500 ml" */
  size?: string
  /** "1 barra (40 g)" */
  servingSize?: string
  servingsPerPack?: number
  carbsPerServing?: number
  /** Total del envase, cuando te comés el paquete entero */
  carbsPerPack?: number
  /** Azúcares totales por porción, como figuran en la etiqueta */
  sugarPerServing?: number
  /** Azúcares añadidos, cuando la etiqueta los declara aparte */
  addedSugarPerServing?: number
  caloriesPerServing?: number
  /** De dónde salió el dato: "etiqueta", "web del fabricante"… */
  source?: string
  /** La etiqueta fue leída y cargada de verdad */
  verified?: boolean
  labelPhotoUrl?: string
}

/* Bebidas. Una comida no es sólo lo sólido: un tostado con café es un
   tostado con café, no un tostado. */
export type Drink =
  | 'café'
  | 'café con leche'
  | 'mate'
  | 'té'
  | 'agua'
  | 'bebida sin azúcar'
  | 'jugo'

export const DRINKS: Drink[] = [
  'café',
  'café con leche',
  'mate',
  'té',
  'agua',
  'bebida sin azúcar',
  'jugo',
]

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

/** Dónde transcurre el día. No se deduce del día de la semana:
   un sábado también podés estar todo el día en la calle. */
export type DayContext = 'casa' | 'calle' | 'mixto'

/* Dónde se consigue una opción que no cocinás vos. No hace falta integrar
   negocios reales: alcanza con saber QUÉ TIPO de lugar buscar. */
export type Venue =
  | 'kiosco'
  | 'supermercado'
  | 'cafetería'
  | 'panadería'
  | 'rotisería'
  | 'restaurante'
  | 'estación de servicio'
  | 'casa de comidas'

/* El orden es el de utilidad real cuando estás parado en la calle con
   hambre: primero donde hay comida hecha, último donde hay un paquete. */
export const VENUES: Venue[] = [
  'rotisería',
  'casa de comidas',
  'panadería',
  'cafetería',
  'supermercado',
  'restaurante',
  'kiosco',
  'estación de servicio',
]

/* Ingredientes con cantidad: sin esto la lista de compras no puede decir
   "12 huevos", sólo "huevo". */
export type Unit =
  | 'u'
  | 'g'
  | 'ml'
  | 'rebanada'
  | 'cda'
  | 'puñado'
  | 'pote'
  | 'lata'

/* Un paso de preparación. Corto: la app no es un blog de cocina.
   Los minutos son los de ese paso; pueden solaparse con el anterior
   (el horno calienta mientras cortás). */
export interface Step {
  text: string
  minutes?: number
  /** Lo mismo, contado entero: cantidades, temperaturas, cómo te das
      cuenta de que está. Sólo se ve si lo pedís. */
  detail?: string
}

export interface Ingredient {
  /** Clave del catálogo de alimentos (foods.ts) */
  item: string
  qty: number
  unit: Unit
}

export type Aisle =
  | 'verdulería'
  | 'carnicería'
  | 'lácteos'
  | 'almacén'
  | 'panadería'
  | 'congelados'
  | 'otros'

export const AISLES: Aisle[] = [
  'verdulería',
  'carnicería',
  'lácteos',
  'panadería',
  'almacén',
  'congelados',
  'otros',
]

export interface Meal {
  id: string
  name: string
  category: Category
  tags: Tag[]
  /** Ingrediente principal. Lo usa la rotación para no repetir pollo tres días. */
  mainIngredient: string
  ingredients: Ingredient[]
  portion: string
  /** Cuando existan fotos reales, ocupan el lugar del ícono. */
  photoUrl?: string
  carbs: number
  carbSource: CarbSource
  confidence: Confidence
  /** Los carbos fueron revisados contra una fuente real. Los demo, nunca. */
  carbsVerified: boolean
  prepMinutes: number
  satiety: Satiety
  portable: boolean
  needsCold: boolean
  needsReheat: boolean
  makeNightBefore: boolean
  freezable: boolean
  difficulty: 1 | 2 | 3
  /** Cada cuánto tiene sentido. Para la rotación, no para juzgar. */
  frequency: Frequency
  /** La bebida que la acompaña, cuando la comida la tiene. */
  drink?: Drink
  /** ¿Es algo que una persona comería un martes cualquiera?

      Las opciones de gimnasio, de dieta específica o de receta de internet
      no desaparecen: pierden prioridad. La base de la app es comida
      normal. */
  everyday: boolean
  /** Tiene azúcar agregada. NO la bloquea ni la marca como mala: sólo
      permite preferir la alternativa cuando existe una equivalente. */
  addedSugar?: boolean
  /** Producto de góndola: la etiqueta manda sobre cualquier estimación. */
  packaged?: PackagedInfo
  favorite: boolean
  tested: boolean
  rating?: number
  notes?: string
  /** Tareas que genera la noche anterior. Se agrupan entre comidas.
      No son la receta: son etiquetas de checklist. */
  prepSteps?: string[]
  /** Cómo se hace, en tres a cinco pasos. Sólo donde hace falta: un
      tostado o unas tostadas con queso untable no necesitan instrucciones. */
  steps?: Step[]

  /* --- Opciones que se compran afuera ---
     Quedan FUERA de la rotación normal: el plan de la semana no puede
     decirte "comprá empanadas". Aparecen sólo cuando las pedís. */
  buyOutside: boolean
  venues?: Venue[]
  /** 1 barato · 2 medio · 3 caro. Para "quiero gastar poco". */
  priceLevel?: 1 | 2 | 3
  /** Se come caminando, sin sentarse ni cubiertos. */
  handheld?: boolean

  isDemo: boolean
}

/* ------------------------------------------------------------------
   RESOLVER AHORA — cuando el plan del día no coincide con la realidad.
   ------------------------------------------------------------------ */

export type ResolveReason =
  | 'sin-comida'
  | 'hambre'
  | 'dulce'
  | 'evento'
  | 'cambio-dia'
  | 'sin-preparar'
  | 'reemplazar'

export const RESOLVE_REASON: Record<ResolveReason, string> = {
  'sin-comida': 'No traje comida',
  hambre: 'Tengo hambre ahora',
  dulce: 'Quiero algo dulce',
  evento: 'Evento o tarde larga',
  'cambio-dia': 'Cambió mi día',
  'sin-preparar': 'No preparé nada',
  reemplazar: 'Quiero reemplazar una comida',
}

export type ResolveFilter = 'mucha-hambre' | 'rapido' | 'barato'

export const RESOLVE_FILTER: Record<ResolveFilter, string> = {
  'mucha-hambre': 'Que llene',
  rapido: 'Rápido',
  barato: 'Barato',
}

/* ------------------------------------------------------------------
   INSULINA — configuración personal.

   La app NO decide dosis. Guarda una relación que el usuario configura y
   ofrece una calculadora que el usuario abre a mano. Nada automático,
   nada en las tarjetas, nada silencioso.
   ------------------------------------------------------------------ */

/** 1 unidad cada `gramsPerUnit` gramos de carbohidratos.
    El alcance permite, a futuro, relaciones distintas por momento del día
    o por franja horaria. Hoy se usa solamente la general. */
export interface InsulinRatio {
  id: string
  scope: 'general' | Slot
  gramsPerUnit: number
  /** Franja horaria, para cuando haga falta. "06:00" */
  fromTime?: string
  toTime?: string
}

export interface InsulinSettings {
  /** Apagado hasta que el usuario lo active. No domina la app. */
  enabled: boolean
  ratios: InsulinRatio[]
}

/* ------------------------------------------------------------------
   PREFERENCIAS

   El lugar donde más adelante va a vivir lo que el usuario elija en el
   onboarding: objetivo, gustos, cuánto cocina, cuántas horas pasa afuera,
   horarios. Todavía no hay pantallas para casi nada de esto — están acá
   para que las decisiones de hoy no lo compliquen mañana.

   Lo único que hoy hace algo es reduceAddedSugar.
   ------------------------------------------------------------------ */

export type Goal = 'ordenarme' | 'bajar' | 'mantener' | 'subir'

/* ------------------------------------------------------------------
   EL PERFIL

   Lo que la app sabe de vos. Todo opcional y todo salteable: se pregunta
   una vez, se puede cambiar siempre, y con cualquier campo vacío la app
   funciona igual.

   Una aclaración que vale para todo este bloque: **nada de esto cambia
   qué comida te muestra la app**. No hay comida prohibida, no hay lista
   negra por tipo de diabetes, no hay modo dieta. Lo que cambia es qué
   información aparece al lado de la comida y qué herramientas se
   encienden. La pizza sigue siendo pizza; lo que suma la app es saber
   cuántos carbohidratos tiene y cuándo te conviene.
   ------------------------------------------------------------------ */

export type DiabetesType =
  | 'tipo-1'
  | 'tipo-2'
  | 'gestacional'
  | 'prediabetes'
  | 'sin-diabetes'
  | 'prefiero-no-decir'

export const DIABETES_LABEL: Record<DiabetesType, string> = {
  'tipo-1': 'Tipo 1',
  'tipo-2': 'Tipo 2',
  gestacional: 'Gestacional',
  prediabetes: 'Prediabetes',
  'sin-diabetes': 'No tengo diabetes',
  'prefiero-no-decir': 'Prefiero no decirlo',
}

export const DIABETES_NOTE: Record<DiabetesType, string> = {
  'tipo-1': 'Contás carbohidratos y usás insulina. La app te muestra los dos.',
  'tipo-2': 'Algunos usan insulina y otros no. Vos elegís qué ver.',
  gestacional: 'Suele ser por un tiempo. Lo podés cambiar cuando quieras.',
  prediabetes: 'Ver los carbohidratos ayuda; no hace falta nada más.',
  'sin-diabetes': 'La app sirve igual: es organizar la comida del día.',
  'prefiero-no-decir': 'Perfecto. Podés encender lo que te sirva a mano.',
}

/** Quién usa la app: vos, o alguien a quien acompañás. */
export type Rol = 'para-mi' | 'acompanio'

export interface Perfil {
  /** Cómo querés que te llamemos. Vacío es una respuesta válida. */
  nombre: string
  rol: Rol
  diabetes: DiabetesType | null
  /** Ver los carbohidratos al lado de cada comida. */
  contarCarbos: boolean
  /** Hasta dónde llegó el onboarding. Se puede retomar. */
  paso: number
  /** Lo terminó o lo salteó: en los dos casos no vuelve a aparecer solo. */
  listo: boolean
}

export const DEFAULT_PERFIL: Perfil = {
  nombre: '',
  rol: 'para-mi',
  diabetes: null,
  contarCarbos: true,
  paso: 0,
  listo: false,
}

export interface Preferences {
  /** Qué busca. Hoy no cambia nada: queda guardado. */
  goal: Goal
  /** Entre dos opciones parecidas, preferir la que tiene menos azúcar
      agregada. No bloquea ni esconde nada: sólo desempata. */
  reduceAddedSugar: boolean
  /** Ids de comidas que le gustan y que no. Sin pantalla todavía. */
  likes: string[]
  dislikes: string[]
  /** Cuánto cocina y cuántas horas pasa afuera, de 0 a 3. */
  cooks?: number
  hoursOutside?: number
  /** Para desempatar cuando la app propone algo suelto. */
  dulceOSalado?: 'dulce' | 'salado' | 'los dos'
}

export const DEFAULT_PREFERENCES: Preferences = {
  goal: 'ordenarme',
  reduceAddedSugar: true,
  likes: [],
  dislikes: [],
}

export const DEFAULT_INSULIN: InsulinSettings = {
  enabled: false,
  ratios: [{ id: 'general', scope: 'general', gramsPerUnit: 15 }],
}

export interface PlannedMeal {
  slot: Slot
  mealId: string
  /** "08:30" */
  time: string
  status: MealStatus
  /** Los snacks son opcionales: se comen si el día los pide. */
  optional: boolean
  replacedFrom?: string
  note?: string
}

export interface DayPlan {
  /** ISO yyyy-mm-dd */
  date: string
  context: DayContext
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
  snack_am: 'Snack de mañana',
  lunch: 'Almuerzo',
  snack_pm: 'Snack de tarde',
  merienda: 'Merienda',
  dinner: 'Cena',
}

/** Etiqueta corta para listas densas. */
export const SLOT_SHORT: Record<Slot, string> = {
  breakfast: 'Desayuno',
  snack_am: 'Media mañana',
  lunch: 'Almuerzo',
  snack_pm: 'Media tarde',
  merienda: 'Merienda',
  dinner: 'Cena',
}

export const SLOT_ORDER: Slot[] = [
  'breakfast',
  'snack_am',
  'lunch',
  'snack_pm',
  'merienda',
  'dinner',
]

export const SLOT_CATEGORY: Record<Slot, Category> = {
  breakfast: 'desayuno',
  snack_am: 'snack',
  lunch: 'almuerzo',
  snack_pm: 'snack',
  merienda: 'merienda',
  dinner: 'cena',
}

/** Los snacks se suman o se sacan según cómo venga el día. */
export const OPTIONAL_SLOTS: Slot[] = ['snack_am', 'snack_pm']

/** Para hablar como se habla: "tenés que almorzar", no "resolver lunch". */
export const SLOT_VERB: Record<Slot, string> = {
  breakfast: 'desayunar',
  snack_am: 'comer algo a media mañana',
  lunch: 'almorzar',
  snack_pm: 'comer algo a media tarde',
  merienda: 'merendar',
  dinner: 'cenar',
}

export const STATUS_LABEL: Record<MealStatus, string> = {
  pending: 'Pendiente',
  prepared: 'Preparado',
  eaten: 'Comido',
  skipped: 'Hoy no',
  replaced: 'Cambiado',
}

export const CONTEXT_LABEL: Record<DayContext, string> = {
  casa: 'En casa',
  calle: 'En la calle',
  mixto: 'Mixto',
}

/** Qué implica cada contexto para el armado del día. */
export const CONTEXT_NOTE: Record<DayContext, string> = {
  casa: 'Podés cocinar en el momento.',
  calle: 'Todo tiene que poder llevarse.',
  mixto: 'Desayuno, snacks y almuerzo se llevan; merienda y cena en casa.',
}
