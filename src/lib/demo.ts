import type { Ingredient, Meal, Unit } from './types'

/* ------------------------------------------------------------------
   DATOS DE DEMOSTRACIÓN — NO SON DATOS REALES

   Existen sólo para que la interfaz tenga algo que mostrar y para poder
   probar la rotación, la lista de compras y «Resolver ahora».

   Los carbohidratos NO están verificados: son valores plausibles, no
   medidos. Todas llevan carbsVerified: false y la app las marca como DEMO
   en todas las pantallas.

   carbSource / confidence quedan con valores variados a propósito: el día
   que una comida real se marque carbsVerified: true, el sistema de
   confianza se enciende solo, sin tocar ninguna pantalla.
   ------------------------------------------------------------------ */

const i = (item: string, qty: number, unit: Unit = 'u'): Ingredient => ({ item, qty, unit })

const demo = (
  m: Omit<Meal, 'isDemo' | 'carbsVerified' | 'buyOutside' | 'frequency' | 'everyday'> & {
    buyOutside?: boolean
    frequency?: Meal['frequency']
    /** Por defecto todo es cotidiano. Lo que no lo es, lo dice. */
    everyday?: boolean
  },
): Meal => ({
  buyOutside: false,
  frequency: 'habitual',
  everyday: true,
  ...m,
  carbsVerified: false,
  isDemo: true,
})

/** Opción que se compra afuera. Nunca entra en la rotación del plan ni en
    la lista de compras: aparece sólo desde «Resolver ahora». */
const afuera = (
  m: Omit<
    Meal,
    | 'isDemo' | 'carbsVerified' | 'buyOutside' | 'ingredients' | 'prepSteps'
    | 'makeNightBefore' | 'freezable' | 'needsCold' | 'needsReheat'
    | 'difficulty' | 'tested' | 'favorite' | 'carbSource' | 'confidence'
    | 'portable' | 'prepMinutes' | 'mainIngredient' | 'frequency' | 'everyday'
  > & { frequency?: Meal['frequency']; prepMinutes?: number; everyday?: boolean },
): Meal =>
  demo({
    ...m,
    mainIngredient: m.venues?.[0] ?? 'afuera',
    ingredients: [],
    carbSource: m.packaged ? 'etiqueta' : 'estimación',
    confidence: 'estimada',
    prepMinutes: m.prepMinutes ?? 5,
    portable: true,
    needsCold: false,
    needsReheat: false,
    makeNightBefore: false,
    freezable: false,
    difficulty: 1,
    favorite: false,
    tested: false,
    buyOutside: true,
  })

export const DEMO_MEALS: Meal[] = [
  /* ================= LO QUE COCINÁS VOS ================= */

  /* ---- Desayuno ---- */
  demo({
    id: 'm-avena',
    everyday: false,
    name: 'Avena con banana y nueces',
    category: 'desayuno',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'avena',
    ingredients: [i('avena', 60, 'g'), i('yogur natural', 150, 'g'), i('leche', 80, 'ml'), i('banana', 1), i('nuez', 20, 'g'), i('canela', 1, 'cda')],
    portion: '1 frasco de 400 ml',
    carbs: 58, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 8, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'Se deja lista la noche anterior en el frasco. Aguanta bien hasta el mediodía.',
    prepSteps: ['Dejar la avena en remojo en el frasco', 'Cortar banana'],
    steps: [
      {
        text: 'Poné 6 cucharadas de avena en un frasco',
        minutes: 1,
        detail:
          'Seis cucharadas soperas bien llenas son los 60 gramos. Usá un frasco de 400 ml o más grande: la avena crece durante la noche y si la ponés al ras se desborda.',
      },
      {
        text: 'Agregá medio pote de yogur y un tercio de vaso de leche',
        minutes: 1,
        detail:
          'La avena tiene que quedar tapada por el líquido, pero no flotando. Si dudás, quedate corto: mañana podés sumar un chorro de leche, sacar es imposible.',
      },
      {
        text: 'Tirá una cucharadita de canela y revolvé',
        minutes: 1,
        detail:
          'Revolvé con una cuchara larga y raspá bien el fondo del frasco. Ahí abajo es donde siempre queda avena seca apelmazada.',
      },
      {
        text: 'Tapá el frasco y metelo en la heladera hasta mañana',
        detail:
          'Necesita seis horas como mínimo, así que hacelo antes de acostarte. Aguanta tres días tapado, o sea que podés dejar dos o tres frascos hechos de una sola vez.',
      },
      {
        text: 'A la mañana, cortá la banana en rodajas y ponela arriba',
        minutes: 2,
        detail:
          'Recién a la mañana, no la noche anterior: la banana cortada se pone marrón y da impresión, aunque esté perfecta.',
      },
      {
        text: 'Sumá un puñado de nueces y listo',
        minutes: 1,
        detail:
          'Unos 20 gramos, lo que te entra en el hueco de la mano. Van al final porque de noche se ablandan y pierden todo el crocante. Si salís corriendo, llevalas en una bolsita aparte.',
      },
    ],
  }),
  demo({
    id: 'm-sandwich',
    name: 'Sándwich completo',
    category: 'desayuno',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'huevo',
    ingredients: [i('pan integral', 2, 'rebanada'), i('huevo', 2), i('queso', 40, 'g'), i('tomate', 1), i('palta', 0.5)],
    portion: '1 sándwich',
    carbs: 46, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 18, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'La palta, a último momento o con limón.',
    prepSteps: ['Armar el sándwich', 'Hervir huevos'],
    steps: [
      {
        text: 'Poné los 2 huevos en una olla chica con agua fría',
        minutes: 1,
        detail:
          'Agua fría desde el arranque, que los tape dos dedos por encima. Si los tirás en agua que ya está hirviendo, la cáscara se raja.',
      },
      {
        text: 'Prendé fuego fuerte y esperá a que el agua hierva',
        minutes: 4,
        detail:
          'Está hirviendo cuando ves burbujas grandes que suben sin parar y el agua se mueve sola. Las burbujitas chicas del principio no cuentan.',
      },
      {
        text: 'Contá 8 minutos y apagá el fuego',
        minutes: 8,
        detail:
          'Ocho minutos desde que hierve: la clara queda firme y la yema amarilla hasta el centro. Si te pasás de diez, la yema se pone gris verdosa en el borde.',
      },
      {
        text: 'Pasá los huevos por agua fría y pelalos',
        minutes: 2,
        detail:
          'Tiralos en un bol con agua de la canilla un minuto. Después golpeá la cáscara contra la mesada para rajarla toda y pelalos abajo del chorro: sale limpia.',
      },
      {
        text: 'Tostá las 2 rebanadas de pan',
        minutes: 2,
        detail:
          'Apenas doradas. Si el sándwich es para llevar, dejá que el pan se enfríe antes de armarlo: el pan caliente larga vapor y se ablanda solo adentro del papel.',
      },
      {
        text: 'Cortá el tomate en rodajas finas y secalas con papel',
        minutes: 1,
        detail:
          'Apoyá las rodajas sobre un papel de cocina y palmealas. El agua del tomate es lo que te arruina el pan a las tres horas.',
      },
      {
        text: 'Armá el sándwich: el queso pegado al pan, el resto en el medio',
        minutes: 2,
        detail:
          'El orden importa: queso abajo, después huevo en rodajas, después tomate, y otra vez queso arriba si te queda. El queso hace de barrera y el pan no se moja. Sal y orégano encima del huevo.',
      },
      {
        text: 'La palta, recién cuando lo vayas a comer',
        detail:
          'Cortada se pone marrón en veinte minutos. Si el sándwich es para más tarde, llevá el medio palta entero con el carozo y agregala ahí, o pisala con unas gotas de limón y sumala igual.',
      },
    ],
  }),
  demo({
    id: 'm-budincitos',
    everyday: false,
    name: 'Budincitos de huevo, queso y espinaca',
    category: 'desayuno',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'huevo',
    ingredients: [i('huevo', 6), i('queso', 80, 'g'), i('espinaca', 100, 'g'), i('harina', 40, 'g')],
    portion: '3 budincitos (rinde 6)',
    carbs: 22, carbSource: 'receta', confidence: 'media',
    prepMinutes: 30, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: true,
    difficulty: 2, favorite: false, tested: true, rating: 4,
    notes: 'Rinden dos días y se congelan bien.',
    prepSteps: ['Hornear los budincitos', 'Porcionar en tuppers'],
    steps: [
      {
        text: 'Prendé el horno a 180° y dejalo calentar',
        minutes: 10,
        detail:
          'Con calor arriba y abajo. Mientras levanta temperatura te sobra tiempo para hacer toda la mezcla, así que no estás esperando al pedo.',
      },
      {
        text: 'Picá la espinaca chiquita y escurrila apretando',
        minutes: 3,
        detail:
          'Si es fresca, lavala y cortala en tiritas. Si es congelada, descongelala y apretala con las manos sobre la pileta hasta que no largue más agua. Toda el agua que le dejes te queda adentro del budincito.',
      },
      {
        text: 'Rompé los 6 huevos en un bol y batilos',
        minutes: 2,
        detail:
          'Con tenedor alcanza. Treinta segundos, hasta que sea una mezcla pareja sin hilos de clara transparente.',
      },
      {
        text: 'Sumá el queso rallado, la espinaca y 2 cucharadas de harina',
        minutes: 2,
        detail:
          'La harina va de a poco y revolviendo, si no se hace bollitos. Sal y pimienta. La mezcla queda líquida, como para volcarla: está bien así.',
      },
      {
        text: 'Llená los moldecitos hasta las tres cuartas partes',
        minutes: 2,
        detail:
          'Pincelá los moldes con aceite o usá pirotines de papel, si no se pegan y los rompés al sacarlos. No los llenes hasta arriba porque crecen y se desbordan.',
      },
      {
        text: 'Horneá 20 minutos, hasta que estén dorados y firmes',
        minutes: 20,
        detail:
          'Sacudí un poco la bandeja: si el centro tiembla como gelatina, les falta. Cuando está quieto, están. Salen seis o siete y aguantan tres días en la heladera.',
      },
    ],
  }),
  demo({
    id: 'm-tortilla',
    name: 'Tortilla de papa en tupper',
    category: 'desayuno',
    tags: ['para llevar', 'normal'],
    mainIngredient: 'papa',
    ingredients: [i('papa', 2), i('huevo', 4), i('cebolla', 0.5), i('aceite de oliva', 2, 'cda')],
    portion: '2 porciones (rinde para 2 días)',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 30, satiety: 'normal',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: true,
    difficulty: 2, favorite: false, tested: true, rating: 4,
    notes: 'Se come fría sin problema.',
    prepSteps: ['Hacer la tortilla de papa', 'Porcionar en tuppers'],
    steps: [
      {
        text: 'Pelá las 2 papas y cortalas en rodajas bien finas',
        minutes: 6,
        detail:
          'De dos o tres milímetros, como una moneda. Cuanto más finas, menos tardan en ablandarse. No tienen que quedar todas iguales, pero sí parecidas.',
      },
      {
        text: 'Cortá media cebolla en tiras finas',
        minutes: 2,
        detail:
          'Cortala al medio, apoyá la parte plana en la tabla y hacé tiras de un lado al otro. Así no se te resbala.',
      },
      {
        text: 'Cocinalas juntas en la sartén a fuego bajo con aceite',
        minutes: 12,
        detail:
          'Aceite hasta la mitad de las papas y la llama chica. Acá no se doran, se ablandan: si ves que toman color marrón, bajá más el fuego. Están cuando el tenedor entra en una papa sin hacer fuerza.',
      },
      {
        text: 'Sacalas con una espumadera y dejá escurrir el aceite',
        minutes: 2,
        detail:
          'Ponelas en un colador o sobre papel de cocina. Si el aceite se va con la papa, la tortilla queda pesada y aceitosa.',
      },
      {
        text: 'Batí los 4 huevos con sal y volcá la papa caliente adentro',
        minutes: 2,
        detail:
          'Mezclá y dejá reposar un minuto. La papa caliente empieza a cocinar el huevo y la tortilla queda mucho mejor armada.',
      },
      {
        text: 'Volcá todo en la sartén y cociná 4 minutos a fuego medio',
        minutes: 4,
        detail:
          'Fuego medio es la perilla a la mitad. Dejá quieto: si revolvés se te hace un revuelto. Los bordes se van a ver cocidos y el centro todavía blando.',
      },
      {
        text: 'Tapá con un plato, dá vuelta la sartén y devolvela',
        minutes: 4,
        detail:
          'Apoyá un plato grande boca abajo sobre la sartén, agarralo con una mano, dá vuelta todo de una y la tortilla queda en el plato. Deslizala de nuevo a la sartén para hacer el otro lado. Si te da miedo, hacelo sobre la pileta.',
      },
    ],
  }),
  demo({
    id: 'm-tostadas-huevo',
    name: 'Huevos revueltos con tostadas',
    drink: 'café con leche',
    category: 'desayuno',
    tags: ['en casa', 'potente'],
    mainIngredient: 'huevo',
    ingredients: [i('pan', 2, 'rebanada'), i('huevo', 3), i('queso', 40, 'g'), i('tomate', 1)],
    portion: '1 plato',
    carbs: 38, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 10, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    steps: [
      {
        text: 'Rompé 3 huevos en un bol y batilos con un tenedor',
        minutes: 1,
        detail:
          'Con sal, unas veinte vueltas de tenedor, hasta que no queden hilos transparentes de clara. Si los batís de más el huevo queda gomoso.',
      },
      {
        text: 'Poné la sartén a fuego bajo con un poco de aceite o manteca',
        minutes: 1,
        detail:
          'Fuego bajo, la llama chica. El huevo revuelto se arruina con fuego fuerte: se seca y se hace grumos duros en dos minutos.',
      },
      {
        text: 'Volcá el huevo y revolvé despacio sin parar',
        minutes: 4,
        detail:
          'Con una cuchara de madera, empujando desde los bordes hacia el centro. Se van a ir armando montoncitos blandos: eso es exactamente lo que buscás.',
      },
      {
        text: 'Sacalo de la sartén cuando todavía se ve húmedo',
        minutes: 1,
        detail:
          'Va a parecer que le falta. No le falta: el calor lo termina de cocinar en el plato. Si esperás a verlo seco en la sartén, llega seco a la mesa.',
      },
      {
        text: 'Mientras tanto, tostá las 2 rebanadas de pan',
        minutes: 3,
        detail:
          'Bien tostadas y firmes: tienen que aguantar el huevo arriba sin doblarse.',
      },
      {
        text: 'Serví el huevo sobre las tostadas con el queso y el tomate',
        minutes: 1,
        detail:
          'El queso arriba del huevo caliente, para que se ablande solo. Esto se come en el momento: no sirve para llevar.',
      },
    ],
  }),
  demo({
    id: 'm-yogur-granola',
    name: 'Yogur con granola',
    category: 'desayuno',
    tags: ['emergencia', 'rápido', 'liviano'],
    mainIngredient: 'yogur entero',
    ingredients: [i('yogur entero', 200, 'g'), i('granola', 40, 'g')],
    portion: '1 pote + 1 puñado',
    carbs: 44, carbSource: 'etiqueta', confidence: 'alta',
    prepMinutes: 2, satiety: 'liviana',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 3,
    notes: 'Plan de emergencia: cero preparación. No aguanta muchas horas.',
  }),

  /* ---- Snack ---- */
  demo({
    id: 'm-nueces',
    everyday: false,
    name: 'Nueces y almendras',
    category: 'snack',
    tags: ['para llevar', 'liviano', 'rápido'],
    mainIngredient: 'nuez',
    ingredients: [i('nuez', 15, 'g'), i('almendra', 15, 'g')],
    portion: '1 puñado (30 g)',
    carbs: 4, carbSource: 'etiqueta', confidence: 'alta',
    prepMinutes: 2, satiety: 'liviana',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 4,
    prepSteps: ['Porcionar frutos secos'],
  }),
  demo({
    id: 'm-manzana-mani',
    everyday: false,
    name: 'Manzana con mantequilla de maní',
    category: 'snack',
    tags: ['para llevar', 'normal'],
    mainIngredient: 'manzana',
    ingredients: [i('manzana', 1), i('mantequilla de maní', 20, 'g')],
    portion: '1 manzana + 1 cucharada',
    carbs: 24, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 3, satiety: 'normal',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    prepSteps: ['Lavar fruta'],
  }),
  demo({
    id: 'm-huevos-queso',
    everyday: false,
    name: 'Huevos duros con queso en cubos',
    category: 'snack',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'huevo',
    ingredients: [i('huevo', 2), i('queso', 40, 'g')],
    portion: '1 tupper chico',
    carbs: 3, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 20, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Casi sin carbohidratos. Sirve cuando faltan muchas horas para comer.',
    prepSteps: ['Hervir huevos'],
    steps: [
      {
        text: 'Poné los huevos en una olla con agua fría que los tape',
        minutes: 1,
        detail:
          'Hacé cuatro o seis de una vez aunque hoy comas dos: con cáscara aguantan una semana en la heladera y te resuelven varios snacks.',
      },
      {
        text: 'Prendé fuego fuerte y esperá a que hierva',
        minutes: 4,
        detail:
          'Hierve cuando las burbujas son grandes y no paran. Recién ahí arranca la cuenta.',
      },
      {
        text: 'Contá 10 minutos y apagá',
        minutes: 10,
        detail:
          'Diez minutos para que la yema quede firme y se pueda cortar en cubos sin desarmarse. Con ocho queda más cremosa en el centro.',
      },
      {
        text: 'Pasalos por agua fría un minuto y pelalos',
        minutes: 3,
        detail:
          'El golpe de frío despega la cáscara de la clara. Rompela contra la mesada, rodalos un poco con la mano para rajarla toda y pelalos bajo el chorro de agua.',
      },
      {
        text: 'Cortá el queso en cubos y guardá todo junto',
        minutes: 2,
        detail:
          'Un queso que no se desarme, tipo cremoso o port salut, en cubos de un bocado. En un tupper chico con los huevos ya pelados es el snack más rápido que vas a tener.',
      },
    ],
  }),
  demo({
    id: 'm-mini-sandwich',
    name: 'Sándwich chico de queso y jamón',
    category: 'snack',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'pan de salvado',
    ingredients: [i('pan integral', 1, 'rebanada'), i('queso', 30, 'g'), i('jamón', 30, 'g')],
    portion: '1 sándwich chico',
    carbs: 22, carbSource: 'receta', confidence: 'media',
    prepMinutes: 5, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    prepSteps: ['Armar el sándwich chico'],
    steps: [
      {
        text: 'Tostá la rebanada de pan y cortala al medio',
        minutes: 3,
        detail:
          'Apenas dorada. Si es para llevar, dejala enfriar antes de armar el sándwich: el pan caliente larga vapor y se ablanda solo.',
      },
      {
        text: 'Poné el queso y el jamón y cerralo',
        minutes: 2,
        detail:
          'Una feta de cada uno. Es un snack para aguantar dos horas, no un almuerzo: si te parece chico, está bien que sea chico.',
      },
    ],
  }),

  /* ---- Almuerzo ---- */
  demo({
    id: 'm-pollo-arroz',
    name: 'Pollo al horno con arroz y ensalada',
    category: 'almuerzo',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'pollo',
    ingredients: [i('pollo', 200, 'g'), i('arroz', 70, 'g'), i('tomate', 1), i('lechuga', 0.5), i('aceite de oliva', 1, 'cda')],
    portion: '1 tupper grande',
    carbs: 58, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 40, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: true, makeNightBefore: true, freezable: true,
    difficulty: 2, favorite: true, tested: true, rating: 5,
    prepSteps: ['Cocinar pollo', 'Hacer arroz', 'Armar el tupper del almuerzo'],
    steps: [
      {
        text: 'Prendé el horno a 200° y dejalo calentar',
        minutes: 10,
        detail:
          'Mientras calienta hacés todo lo demás: condimentar el pollo y poner el agua del arroz. No esperes con los brazos cruzados.',
      },
      {
        text: 'Poné el pollo en una fuente con sal, pimienta y aceite',
        minutes: 3,
        detail:
          'Un chorro de aceite y lo que tengas a mano: limón, ajo, pimentón, orégano. Frotalo con la mano para que quede cubierto por todos lados.',
      },
      {
        text: 'Horneá 25 minutos',
        minutes: 25,
        detail:
          'A los quince minutos abrí y dalo vuelta. Está listo cuando lo pinchás con un cuchillo en la parte más gorda y el jugo que sale es transparente. Si sale rosado, le faltan cinco minutos más.',
      },
      {
        text: 'Mientras se hornea, herví el arroz',
        minutes: 15,
        detail:
          'Dos tazas de agua por cada taza de arroz, y sal cuando rompe el hervor. Tapado y fuego bajo. Está cuando se tomó toda el agua, más o menos quince minutos.',
      },
      {
        text: 'Cortá el tomate y la lechuga y armá el tupper',
        minutes: 5,
        detail:
          'La ensalada en un compartimento aparte o en otro tupper, y el aceite recién antes de comer: si la aliñás ahora, al mediodía la lechuga es un trapo.',
      },
      {
        text: 'Dejá enfriar antes de tapar',
        detail:
          'Si cerrás el tupper en caliente, el vapor se condensa adentro y a la mañana siguiente tenés todo mojado. Diez minutos destapado sobre la mesada alcanzan.',
      },
    ],
  }),
  demo({
    id: 'm-wrap-pollo',
    name: 'Tortilla de trigo rellena de pollo y vegetales',
    category: 'almuerzo',
    tags: ['para llevar', 'normal'],
    mainIngredient: 'pollo',
    ingredients: [i('tortilla de trigo', 1), i('pollo', 150, 'g'), i('lechuga', 0.5), i('tomate', 1), i('zanahoria', 1), i('yogur natural', 30, 'g')],
    portion: '1 tortilla grande',
    carbs: 42, carbSource: 'receta', confidence: 'media',
    prepMinutes: 15, satiety: 'normal',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 4,
    notes: 'Envolver en papel manteca para que no se abra en la mochila.',
    prepSteps: ['Cocinar pollo', 'Armar el rollo'],
    steps: [
      {
        text: 'Cortá el pollo ya cocido en tiras finas',
        minutes: 3,
        detail:
          'Pollo que sobró del día anterior, o una pechuga hecha a la plancha. En tiras finas: si lo dejás en trozos grandes, al morder se te sale todo el relleno de un lado.',
      },
      {
        text: 'Rallá la zanahoria con la parte gruesa del rallador',
        minutes: 2,
        detail:
          'La parte de los agujeros grandes. Rallada fina larga agua y te moja la tortilla.',
      },
      {
        text: 'Cortá el tomate y sacale las semillas',
        minutes: 2,
        detail:
          'Cortalo al medio y sacá con la cuchara la parte del centro con las semillas. Eso es agua pura: es lo que rompe el wrap.',
      },
      {
        text: 'Untá la tortilla con el yogur',
        minutes: 1,
        detail:
          'Yogur natural con sal, pimienta y unas gotas de limón hace de aderezo y no lleva nada de azúcar. Untá todo menos dos dedos del borde.',
      },
      {
        text: 'Poné el relleno en el centro, en una franja',
        minutes: 2,
        detail:
          'Todo junto en una franja horizontal en el medio, no desparramado. Si llenás hasta los bordes, al enrollar se escapa por los costados.',
      },
      {
        text: 'Doblá los costados hacia adentro y enrollá apretado',
        minutes: 2,
        detail:
          'Primero los dos lados cortos hacia adentro, después enrollás desde abajo. Así queda cerrado abajo y no se cae nada.',
      },
      {
        text: 'Envolvelo en papel manteca bien ajustado',
        minutes: 2,
        detail:
          'El papel es lo que lo mantiene armado hasta el mediodía. No lo saques del papel: cortá el wrap al medio con el papel puesto y comelo desde ahí.',
      },
    ],
  }),
  demo({
    id: 'm-lentejas',
    name: 'Ensalada de lentejas con huevo y palta',
    category: 'almuerzo',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'lentejas cocidas',
    ingredients: [i('lentejas cocidas', 200, 'g'), i('huevo', 2), i('palta', 0.5), i('cebolla morada', 0.5), i('tomate', 1), i('limón', 0.5)],
    portion: '1 tupper grande',
    carbs: 40, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 25, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Se come fría. Muy buena para días de mucho movimiento.',
    prepSteps: ['Hervir huevos', 'Armar el tupper del almuerzo'],
    steps: [
      {
        text: 'Herví los 2 huevos: agua fría, 10 minutos desde el hervor',
        minutes: 15,
        detail:
          'Si ya tenés huevos duros hechos en la heladera, saltá este paso y arrancá por el siguiente: esta comida pasa a ser de diez minutos.',
      },
      {
        text: 'Escurrí las lentejas y enjuagalas bajo el chorro',
        minutes: 2,
        detail:
          'Volcalas en un colador y pasales agua un rato moviéndolas con la mano. Sacás el líquido espeso de la lata, que es el que deja sabor a lata y suma mucha sal.',
      },
      {
        text: 'Cortá media cebolla morada bien finita',
        minutes: 3,
        detail:
          'Lo más fina que puedas. Si te resulta muy fuerte de gusto, dejala cinco minutos en un bol con agua fría y después escurrila: pierde el picor y queda igual de crocante.',
      },
      {
        text: 'Cortá el tomate en cubos y el huevo en cuartos',
        minutes: 3,
        detail:
          'Al huevo cortalo con el cuchillo mojado y no se te desarma la yema.',
      },
      {
        text: 'Mezclá todo con limón, aceite, sal y orégano',
        minutes: 3,
        detail:
          'El jugo de medio limón y un chorro de aceite. Probá y corregí: las lentejas de lata vienen sosas y aguantan más sal de la que pensás.',
      },
      {
        text: 'La palta, en cubos y al final',
        minutes: 1,
        detail:
          'Si el tupper es para mañana, no le pongas la palta hoy: se pone marrón. Llevala aparte o sumala a la mañana.',
      },
    ],
  }),
  demo({
    id: 'm-arroz-atun',
    name: 'Arroz con atún, huevo y vegetales',
    category: 'almuerzo',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'atún',
    ingredients: [i('arroz', 70, 'g'), i('atún', 1, 'lata'), i('huevo', 1), i('choclo', 0.5, 'lata'), i('morrón', 0.5), i('mayonesa', 1, 'cda')],
    portion: '1 tupper grande',
    carbs: 62, carbSource: 'receta', confidence: 'media',
    prepMinutes: 25, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Se come frío. Sale rápido si el arroz ya está hecho.',
    prepSteps: ['Hacer arroz', 'Hervir huevos', 'Armar el tupper del almuerzo'],
    steps: [
      {
        text: 'Herví el arroz: 2 tazas de agua por 1 de arroz',
        minutes: 15,
        detail:
          'Sal cuando rompe el hervor, tapado y fuego bajo. Está cuando se tomó toda el agua y al probar un grano no tiene el centro duro.',
      },
      {
        text: 'Esparcilo en una fuente y dejalo enfriar destapado',
        minutes: 5,
        detail:
          'Extendido y sin tapa se enfría rápido y los granos quedan sueltos. Amontonado en la olla se apelmaza y te queda un bloque.',
      },
      {
        text: 'Mientras tanto, herví el huevo 10 minutos',
        minutes: 10,
        detail:
          'Va en otra hornalla al mismo tiempo que el arroz, así no sumás tiempo. O usás uno de los que ya tenés hechos.',
      },
      {
        text: 'Escurrí bien el atún y el choclo',
        minutes: 2,
        detail:
          'Al atún apretalo contra la tapa de la lata para sacarle todo el líquido. Si le dejás el aceite o el agua, la mezcla queda aguada.',
      },
      {
        text: 'Cortá el morrón en cubos chicos y el huevo en rodajas',
        minutes: 3,
        detail:
          'El morrón va crudo: es el que le da el crocante al plato, que si no es todo blando.',
      },
      {
        text: 'Mezclá todo con una cucharada de mayonesa',
        minutes: 2,
        detail:
          'Una cucharada alcanza para unir. Aguanta dos días en la heladera y se come frío, así que no necesitás microondas en ningún lado.',
      },
    ],
  }),

  /* ---- Merienda ----
     La merienda es una comida, no un snack: puede ser bastante fuerte. */
  demo({
    id: 'm-tostadas-queso',
    name: 'Tostadas con queso y tomate',
    drink: 'café con leche',
    category: 'merienda',
    tags: ['en casa', 'normal', 'rápido'],
    mainIngredient: 'pan',
    ingredients: [i('pan', 2, 'rebanada'), i('queso', 50, 'g'), i('tomate', 1), i('café', 10, 'g'), i('leche', 150, 'ml')],
    portion: '2 tostadas + 1 taza',
    carbs: 32, carbSource: 'receta', confidence: 'media',
    prepMinutes: 7, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
  }),
  demo({
    id: 'm-omelette',
    name: 'Omelette de espinaca y queso con pan',
    category: 'merienda',
    tags: ['en casa', 'potente'],
    mainIngredient: 'huevo',
    ingredients: [i('huevo', 3), i('espinaca', 60, 'g'), i('queso', 40, 'g'), i('pan', 1, 'rebanada')],
    portion: '1 omelette',
    carbs: 20, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 12, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'Para cuando la cena va a ser tarde.',
    steps: [
      {
        text: 'Poné la espinaca en la sartén con un poco de aceite',
        minutes: 3,
        detail:
          'Fuego medio. Un puñado grande que se va a reducir a casi nada: no te asustes por el volumen. Si es congelada, escurrila apretando fuerte antes.',
      },
      {
        text: 'Cocinala hasta que se ablande y sacala del fuego',
        minutes: 2,
        detail:
          'Dos o tres minutos moviéndola. Está cuando perdió todo el volumen y se ve brillante y blanda.',
      },
      {
        text: 'Batí los 3 huevos con sal y volcalos en la sartén',
        minutes: 2,
        detail:
          'La sartén tiene que estar caliente pero a fuego medio. Volcá y no toques nada durante el primer minuto: ahí abajo se está armando la base.',
      },
      {
        text: 'Cuando deje de estar líquido, poné el queso en una mitad',
        minutes: 3,
        detail:
          'Mirá el centro: mientras esté aguado, esperá. Cuando está apenas húmedo pero ya no corre, ponés el queso y la espinaca de un solo lado.',
      },
      {
        text: 'Doblá el omelette al medio con una espátula',
        minutes: 2,
        detail:
          'Levantá el lado vacío y tapá el relleno. Un minuto más en la sartén para que el queso se derrita y va al plato.',
      },
      {
        text: 'Tostá la rebanada de pan para acompañar',
        minutes: 2,
        detail:
          'Es la mitad de los carbohidratos del plato: si mirás el número de arriba, es sobre todo por el pan.',
      },
    ],
  }),
  demo({
    id: 'm-sandwich-merienda',
    name: 'Sándwich de queso, tomate y huevo',
    category: 'merienda',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'pan integral',
    ingredients: [i('pan integral', 2, 'rebanada'), i('queso', 50, 'g'), i('huevo', 1), i('tomate', 1)],
    portion: '1 sándwich',
    carbs: 40, carbSource: 'receta', confidence: 'media',
    prepMinutes: 20, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Merienda de verdad para los días en la calle.',
    prepSteps: ['Hervir huevos', 'Armar el sándwich de la merienda'],
    steps: [
      {
        text: 'Herví el huevo: agua fría, 10 minutos desde el hervor',
        minutes: 15,
        detail:
          'Si ya tenés huevos duros hechos, saltá este paso: el sándwich sale en cinco minutos.',
      },
      {
        text: 'Pelalo después de pasarlo por agua fría',
        minutes: 2,
        detail:
          'Un minuto en agua fría, después golpeás la cáscara contra la mesada y sale entera bajo el chorro.',
      },
      {
        text: 'Cortá el huevo y el tomate en rodajas',
        minutes: 2,
        detail:
          'Al huevo, con el cuchillo mojado, que no se desarma. Al tomate sacale el agua apoyando las rodajas en papel de cocina.',
      },
      {
        text: 'Armá el sándwich con el queso contra las dos tapas',
        minutes: 2,
        detail:
          'Queso, después huevo y tomate en el medio, después queso. El queso hace de barrera para que el pan no se moje.',
      },
      {
        text: 'Orégano, sal y un hilo de aceite de oliva',
        minutes: 1,
        detail:
          'El orégano y el aceite son lo que lo convierten en una merienda de verdad y no en un sándwich triste.',
      },
    ],
  }),
  demo({
    id: 'm-yogur-completo',
    everyday: false,
    name: 'Yogur con avena, fruta y nueces',
    category: 'merienda',
    tags: ['para llevar', 'potente'],
    mainIngredient: 'yogur entero',
    ingredients: [i('yogur entero', 250, 'g'), i('avena', 40, 'g'), i('frutilla', 100, 'g'), i('nuez', 20, 'g')],
    portion: '1 frasco grande',
    carbs: 52, carbSource: 'receta', confidence: 'media',
    prepMinutes: 6, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 4,
    prepSteps: ['Armar el frasco de yogur', 'Lavar fruta'],
  }),

  /* ---- Cena ---- */
  demo({
    id: 'm-milanesa',
    name: 'Milanesa de pollo al horno con puré de calabaza',
    category: 'cena',
    tags: ['en casa', 'potente'],
    mainIngredient: 'milanesa de pollo',
    ingredients: [i('milanesa de pollo', 2), i('calabaza', 400, 'g'), i('lechuga', 0.5)],
    portion: '1 plato',
    carbs: 45, carbSource: 'receta', confidence: 'media',
    prepMinutes: 40, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: true, makeNightBefore: false, freezable: true,
    difficulty: 2, favorite: false, tested: true, rating: 4,
    steps: [
      {
        text: 'Prendé el horno a 200° con la bandeja adentro',
        minutes: 10,
        detail:
          'La bandeja se calienta junto con el horno. Cuando apoyás la milanesa sobre metal caliente se dora abajo sola: si la ponés en una bandeja fría, queda blanda de ese lado.',
      },
      {
        text: 'Pelá la calabaza y cortala en cubos',
        minutes: 5,
        detail:
          'Cubos parejos de unos tres centímetros, del tamaño de un dado grande. Si los hacés disparejos, unos se deshacen y otros quedan duros.',
      },
      {
        text: 'Ponele aceite y sal a la calabaza',
        minutes: 1,
        detail:
          'Un chorro de aceite y mezclá con la mano hasta que todos los cubos brillen. Sin aceite se secan en el horno en vez de dorarse.',
      },
      {
        text: 'Sacá la bandeja caliente y poné la milanesa y la calabaza',
        minutes: 2,
        detail:
          'Con repasador o manoplas, que la bandeja quema. Todo en una sola capa y separado: amontonado se cocina al vapor y no se dora nada.',
      },
      {
        text: 'Horneá 25 minutos y dá vuelta la milanesa a la mitad',
        minutes: 25,
        detail:
          'A los quince minutos abrí y dala vuelta. La calabaza está lista cuando la pinchás con un tenedor y entra sin resistencia.',
      },
      {
        text: 'Pisá la calabaza con un tenedor ahí mismo',
        minutes: 3,
        detail:
          'En la misma fuente, con un tenedor común. No hace falta manteca ni leche ni procesadora: la calabaza horneada ya es cremosa sola.',
      },
    ],
  }),
  demo({
    id: 'm-revuelto',
    name: 'Revuelto de zapallitos con huevo',
    category: 'cena',
    tags: ['en casa', 'rápido', 'liviano'],
    mainIngredient: 'huevo',
    ingredients: [i('zapallito', 2), i('huevo', 3), i('cebolla', 0.5), i('pan', 1, 'rebanada')],
    portion: '1 plato',
    carbs: 18, carbSource: 'receta', confidence: 'alta',
    prepMinutes: 15, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Cena liviana para cuando se come tarde.',
    steps: [
      {
        text: 'Cortá los 2 zapallitos en cubos chicos',
        minutes: 4,
        detail:
          'Sin pelar, sacando sólo las puntas. Cubos de un centímetro: cuanto más chicos, más rápido se hacen.',
      },
      {
        text: 'Cortá media cebolla finita',
        minutes: 2,
        detail:
          'Cortala al medio, apoyá el lado plano en la tabla y hacé tiras. Así no se te escapa por la mesada.',
      },
      {
        text: 'Cocinalas juntas a fuego medio con la sartén tapada',
        minutes: 5,
        detail:
          'Con un chorro de aceite y sal. La tapa es clave: el zapallito larga su propia agua y se cocina ahí adentro sin que tengas que hacer nada.',
      },
      {
        text: 'Destapá y dejá que se evapore el agua',
        minutes: 2,
        detail:
          'Un par de minutos destapado para que se vaya el líquido. Si le tirás el huevo con la sartén llena de agua, te queda una sopa.',
      },
      {
        text: 'Batí los 3 huevos y volcalos encima',
        minutes: 1,
        detail:
          'Batidos con sal, con tenedor. Volcá sobre las verduras calientes, repartido por toda la sartén.',
      },
      {
        text: 'Revolvé hasta que el huevo se corte y sacalo',
        minutes: 2,
        detail:
          'Cortarse acá quiere decir pasar de líquido a sólido, nada malo. Revolvé todo junto y sacá del fuego cuando el huevo todavía se ve un poco húmedo: en el plato se termina.',
      },
    ],
  }),
  demo({
    id: 'm-sopa-calabaza',
    name: 'Sopa de calabaza con pan y queso',
    category: 'cena',
    tags: ['en casa', 'normal'],
    mainIngredient: 'calabaza',
    ingredients: [i('calabaza', 500, 'g'), i('cebolla', 1), i('caldo', 1, 'u'), i('pan', 1, 'rebanada'), i('queso', 40, 'g')],
    portion: '1 plato hondo',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 30, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: true, makeNightBefore: false, freezable: true,
    difficulty: 1, favorite: false, tested: true, rating: 3,
    steps: [
      {
        text: 'Pelá la calabaza y cortala en trozos grandes',
        minutes: 6,
        detail:
          'Acá no importa la prolijidad: después se procesa todo. Trozos grandes y disparejos, nadie se va a enterar.',
      },
      {
        text: 'Cortá la cebolla en trozos, también grandes',
        minutes: 2,
        detail:
          'Lo mismo que la calabaza: va a terminar hecha crema, así que el tamaño y la prolijidad no cambian nada. Una cebolla entera.',
      },
      {
        text: 'Poné todo en una olla y cubrí con caldo',
        minutes: 1,
        detail:
          'Caldo justo hasta tapar las verduras, ni un dedo más. Podés agregar después si queda espesa; sacar líquido es imposible.',
      },
      {
        text: 'Herví 18 minutos hasta que la calabaza esté blanda',
        minutes: 18,
        detail:
          'Fuego medio, con la olla tapada. Está cuando pinchás un trozo con un tenedor y se parte solo.',
      },
      {
        text: 'Apagá el fuego y procesá con la minipimer',
        minutes: 3,
        detail:
          'Fuera del fuego y con la minipimer metida hasta el fondo antes de encenderla, si no salpica todo y te quemás. Si queda muy espesa, un poco más de caldo caliente.',
      },
      {
        text: 'Serví con el pan y el queso arriba',
        minutes: 1,
        detail:
          'El queso rallado o en cubitos se derrite solo con el calor de la sopa. El pan no es un adorno: es lo que la convierte en una cena y no en una entrada.',
      },
    ],
  }),

  /* ================= LO QUE COMPRÁS AFUERA =================

     Agrupadas por tipo de lugar, con platos concretos. No son negocios
     reales ni carbohidratos medidos: son el tipo de cosa que vas a
     encontrar. Todo DEMO hasta que lo verifiquemos con lugares de verdad.
     ========================================================= */

  /* ---- Rotisería ---- */
  afuera({
    id: 'c-rot-pollo', name: 'Pollo con guarnición', category: 'almuerzo',
    tags: ['potente'], portion: '1 porción', carbs: 45, satiety: 'potente',
    venues: ['rotisería'], priceLevel: 2, handheld: false,
    notes: 'La guarnición cambia mucho los carbohidratos: puré y papas suben, ensalada no.',
  }),
  afuera({
    id: 'c-rot-milanesa', name: 'Milanesa con ensalada', category: 'almuerzo',
    tags: ['potente'], portion: '1 porción', carbs: 30, satiety: 'potente',
    venues: ['rotisería'], priceLevel: 2, handheld: false,
  }),
  afuera({
    id: 'c-rot-carne', name: 'Carne con verduras', category: 'almuerzo',
    tags: ['potente'], portion: '1 porción', carbs: 20, satiety: 'potente',
    venues: ['rotisería'], priceLevel: 3, handheld: false,
  }),
  afuera({
    id: 'c-rot-tortilla', name: 'Porción de tortilla de papa', category: 'almuerzo',
    tags: ['rápido', 'normal'], portion: '1 porción', carbs: 35, satiety: 'normal',
    venues: ['rotisería'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-rot-empanadas', name: 'Empanadas', category: 'almuerzo',
    tags: ['rápido', 'potente'], portion: '3 unidades', carbs: 60, satiety: 'potente',
    venues: ['rotisería'], priceLevel: 1, handheld: true,
    notes: 'Unos 20 g por empanada, muy variable según tamaño y relleno.',
  }),
  afuera({
    id: 'c-rot-tarta', name: 'Porción de tarta de verdura', category: 'almuerzo',
    tags: ['rápido', 'normal'], portion: '1 porción', carbs: 38, satiety: 'normal',
    venues: ['rotisería'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-rot-cena-milanesa', name: 'Milanesa con puré', category: 'cena',
    tags: ['potente'], portion: '1 porción', carbs: 55, satiety: 'potente',
    venues: ['rotisería'], priceLevel: 2, handheld: false,
  }),

  /* ---- Supermercado ---- */
  afuera({
    id: 'c-sup-sandwich', name: 'Sándwich preparado', category: 'almuerzo',
    tags: ['rápido', 'normal'], portion: '1 sándwich', carbs: 40, satiety: 'normal',
    venues: ['supermercado'], priceLevel: 1, handheld: true,
    notes: 'Suele traer la etiqueta con los carbohidratos: conviene leerla.',
  }),
  afuera({
    id: 'c-sup-ensalada', name: 'Ensalada con pollo', category: 'almuerzo',
    tags: ['normal'], portion: '1 bandeja', carbs: 18, satiety: 'normal',
    venues: ['supermercado'], priceLevel: 2, handheld: false,
    notes: 'Pocos carbohidratos. Puede quedar corta si el día fue largo.',
  }),
  afuera({
    id: 'c-sup-yogur', name: 'Yogur con fruta y frutos secos', category: 'snack',
    tags: ['rápido', 'dulce', 'supermercado'], portion: '1 pote + 1 fruta', carbs: 34, satiety: 'normal',
    venues: ['supermercado'], priceLevel: 1, handheld: true,
    notes: 'Acá sí conviene leer la etiqueta: el número está en el pote.',
  }),
  afuera({
    id: 'c-sup-queso-fruta', name: 'Queso con fruta y galletas', category: 'snack',
    tags: ['rápido', 'potente'], portion: '1 porción', carbs: 28, satiety: 'potente',
    venues: ['supermercado'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-sup-desayuno', name: 'Yogur con granola', category: 'desayuno',
    tags: ['emergencia', 'rápido', 'liviano'], portion: '1 pote + 1 paquete', carbs: 44, satiety: 'liviana',
    venues: ['supermercado'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-sup-merienda', name: 'Yogur con fruta', category: 'merienda',
    tags: ['rápido', 'dulce', 'supermercado'], portion: '1 pote + 1 fruta', carbs: 36, satiety: 'normal',
    venues: ['supermercado'], priceLevel: 1, handheld: true,
  }),

  /* ---- Panadería ---- */
  afuera({
    id: 'c-pan-sandwich', name: 'Sándwich de jamón y queso', category: 'almuerzo',
    tags: ['rápido', 'normal'], portion: '1 sándwich', carbs: 42, satiety: 'normal',
    venues: ['panadería'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-pan-tarta', name: 'Porción de tarta', category: 'almuerzo',
    tags: ['rápido', 'normal'], portion: '1 porción', carbs: 38, satiety: 'normal',
    venues: ['panadería'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-pan-desayuno', name: 'Medialunas',
    drink: 'café con leche', category: 'desayuno',
    tags: ['emergencia', 'rápido', 'normal'], portion: '1 taza + 2 medialunas', carbs: 50, satiety: 'normal',
    venues: ['panadería'], priceLevel: 1, handheld: true,
    notes: 'Los carbohidratos varían mucho según el tamaño de la medialuna.',
  }),
  afuera({
    id: 'c-pan-merienda', name: 'Sándwich de queso y tomate', category: 'merienda',
    tags: ['rápido', 'potente'], portion: '1 sándwich', carbs: 42, satiety: 'potente',
    venues: ['panadería'], priceLevel: 2, handheld: true,
  }),

  /* ---- Cafetería ---- */
  afuera({
    id: 'c-caf-tostado', name: 'Tostado de jamón y queso', category: 'almuerzo',
    tags: ['rápido', 'normal'], portion: '1 tostado', carbs: 34, satiety: 'normal',
    venues: ['cafetería'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-caf-merienda', name: 'Tostadas',
    drink: 'café con leche', category: 'merienda',
    tags: ['rápido', 'normal'], portion: '1 taza + 2 tostadas', carbs: 38, satiety: 'normal',
    venues: ['cafetería'], priceLevel: 1, handheld: false,
  }),

  /* ---- Restaurante ---- */
  afuera({
    id: 'c-res-milanesa', name: 'Milanesa con guarnición', category: 'almuerzo',
    tags: ['potente'], portion: '1 plato', carbs: 60, satiety: 'potente',
    venues: ['restaurante'], priceLevel: 3, handheld: false,
  }),
  afuera({
    id: 'c-res-pollo', name: 'Pollo a la plancha con ensalada', category: 'almuerzo',
    tags: ['potente'], portion: '1 plato', carbs: 15, satiety: 'potente',
    venues: ['restaurante'], priceLevel: 3, handheld: false,
  }),
  afuera({
    id: 'c-res-pastas', name: 'Pastas con salsa', category: 'almuerzo',
    tags: ['potente'], portion: '1 plato', carbs: 85, satiety: 'potente',
    venues: ['restaurante'], priceLevel: 3, handheld: false,
    notes: 'De lo que más carbohidratos tiene. Conviene mirarlo bien.',
  }),
  afuera({
    id: 'c-res-cena', name: 'Pollo con ensalada', category: 'cena',
    tags: ['potente'], portion: '1 plato', carbs: 15, satiety: 'potente',
    venues: ['restaurante'], priceLevel: 3, handheld: false,
  }),

  /* ---- Kiosco y estación de servicio ---- */
  afuera({
    id: 'c-kio-frutos', name: 'Mix de frutos secos', category: 'snack',
    tags: ['emergencia', 'rápido', 'liviano'], portion: '1 paquete chico', carbs: 10, satiety: 'liviana',
    venues: ['kiosco', 'estación de servicio'], priceLevel: 2, handheld: true,
    notes: 'Si tiene pasas o arándanos, los carbohidratos suben bastante.',
  }),
  afuera({
    id: 'c-kio-barrita', name: 'Barrita de cereal', category: 'snack',
    tags: ['emergencia', 'rápido', 'liviano'], portion: '1 barrita', carbs: 22, satiety: 'liviana',
    venues: ['kiosco', 'estación de servicio'], priceLevel: 1, handheld: true,
    notes: 'El número está en el envase.',
  }),
  afuera({
    id: 'c-kio-sandwich', name: 'Sándwich envasado', category: 'almuerzo',
    tags: ['emergencia', 'rápido', 'normal'], portion: '1 sándwich', carbs: 40, satiety: 'normal',
    venues: ['estación de servicio', 'kiosco'], priceLevel: 2, handheld: true,
  }),
  afuera({
    id: 'c-kio-cena', name: 'Sándwich caliente', category: 'cena',
    tags: ['emergencia', 'rápido', 'normal'], portion: '1 sándwich', carbs: 40, satiety: 'normal',
    venues: ['estación de servicio'], priceLevel: 2, handheld: true,
  }),

  /* ================= LO QUE TAMBIÉN SE COME =================

     Una semana real no es pollo, avena y ensalada siete días seguidos.
     Acá entran las cosas prácticas, las envasadas y las dulces: no están
     de contrabando, son parte del día.

     `frequency` dice cada cuánto tiene sentido que aparezcan. Es un dato
     de rotación, no una nota de conducta.
     ========================================================= */

  /* ---- Desayuno ---- */
  demo({
    id: 'm-tostadas-untable',
    name: 'Tostadas con queso untable y tomate',
    drink: 'café con leche',
    category: 'desayuno',
    tags: ['en casa', 'rápido', 'salado'],
    mainIngredient: 'pan',
    ingredients: [i('pan', 2, 'rebanada'), i('queso untable', 40, 'g'), i('tomate', 1), i('café', 10, 'g'), i('leche', 150, 'ml')],
    portion: '2 tostadas + 1 taza',
    carbs: 32, carbSource: 'receta', confidence: 'media',
    prepMinutes: 5, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
  }),
  demo({
    id: 'm-yogur-galletitas',
    name: 'Yogur saborizado con galletitas',
    category: 'desayuno',
    tags: ['para llevar', 'rápido', 'práctico', 'envasado', 'dulce'],
    mainIngredient: 'yogur saborizado sin azúcar',
    ingredients: [i('yogur saborizado sin azúcar', 200, 'g'), i('galletitas sin azúcar', 30, 'g')],
    portion: '1 pote + unas galletitas',
    carbs: 26, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 2, satiety: 'liviana',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    packaged: { servingSize: '1 pote (200 g)', servingsPerPack: 1 },
    notes: 'Los dos tienen etiqueta: cuando las carguemos, este número deja de ser estimado.',
  }),

  /* ---- Snack ---- */
  demo({
    id: 'm-barra-proteica',
    name: 'Barra proteica de chocolate',
    category: 'snack',
    tags: ['para llevar', 'rápido', 'práctico', 'envasado', 'dulce', 'kiosco'],
    mainIngredient: 'barra proteica',
    ingredients: [i('barra proteica', 1)],
    portion: '1 barra',
    carbs: 20, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 1, satiety: 'normal',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 4,
    packaged: { servingSize: '1 barra (40 g)', servingsPerPack: 1 },
    notes: 'Entra en cualquier bolsillo y aguanta el día entero en la mochila.',
    prepSteps: ['Guardar una barra en la mochila'],
  }),
  demo({
    id: 'm-galletitas-queso',
    name: 'Galletitas con queso untable',
    category: 'snack',
    tags: ['para llevar', 'rápido', 'práctico', 'salado', 'envasado'],
    mainIngredient: 'galletitas sin azúcar',
    ingredients: [i('galletitas sin azúcar', 40, 'g'), i('queso untable', 40, 'g')],
    portion: '5 o 6 galletitas',
    carbs: 24, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 3, satiety: 'normal',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    packaged: { servingSize: '30 g' },
  }),
  demo({
    id: 'm-yogur-sin-azucar',
    name: 'Yogur saborizado sin azúcar',
    category: 'snack',
    tags: ['para llevar', 'rápido', 'práctico', 'envasado', 'dulce', 'supermercado'],
    mainIngredient: 'yogur saborizado sin azúcar',
    ingredients: [i('yogur saborizado sin azúcar', 200, 'g')],
    portion: '1 pote',
    carbs: 12, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 1, satiety: 'liviana',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    packaged: { servingSize: '1 pote (200 g)', servingsPerPack: 1 },
  }),
  demo({
    id: 'm-chocolate',
    name: 'Porción de chocolate',
    category: 'snack',
    frequency: 'ocasional',
    tags: ['para llevar', 'rápido', 'antojo', 'dulce', 'envasado'],
    mainIngredient: 'chocolate',
    ingredients: [i('chocolate', 25, 'g')],
    portion: '2 o 3 cuadraditos',
    carbs: 14, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 1, satiety: 'liviana',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
    packaged: { servingSize: '25 g' },
    notes: 'La porción es lo que cambia el número. La etiqueta lo dice por cada 25 g.',
  }),
  demo({
    id: 'm-frutos-chocolate',
    name: 'Frutos secos con chocolate',
    category: 'snack',
    frequency: 'ocasional',
    tags: ['para llevar', 'rápido', 'antojo', 'dulce', 'envasado'],
    mainIngredient: 'frutos secos con chocolate',
    ingredients: [i('frutos secos con chocolate', 35, 'g')],
    portion: '1 puñado',
    carbs: 16, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 2, satiety: 'normal',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
    prepSteps: ['Porcionar frutos secos'],
  }),
  demo({
    id: 'm-gelatina',
    name: 'Gelatina sin azúcar',
    category: 'snack',
    tags: ['en casa', 'rápido', 'dulce', 'liviano', 'envasado'],
    mainIngredient: 'gelatina sin azúcar',
    ingredients: [i('gelatina sin azúcar', 1)],
    portion: '1 porción',
    carbs: 2, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 2, satiety: 'liviana',
    portable: false, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 3,
    notes: 'Casi sin carbohidratos. Sirve cuando querés algo dulce y nada más.',
  }),

  /* ---- Merienda ---- */
  demo({
    id: 'm-tostado-cafe',
    name: 'Tostado de jamón y queso',
    drink: 'café con leche',
    category: 'merienda',
    tags: ['en casa', 'rápido', 'salado'],
    mainIngredient: 'pan',
    ingredients: [i('pan', 2, 'rebanada'), i('jamón', 40, 'g'), i('queso', 40, 'g'), i('café', 10, 'g'), i('leche', 150, 'ml')],
    portion: '1 tostado + 1 taza',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 8, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
  }),
  demo({
    id: 'm-barra-fruta',
    name: 'Barra proteica con fruta',
    category: 'merienda',
    tags: ['para llevar', 'rápido', 'práctico', 'envasado'],
    mainIngredient: 'barra proteica',
    ingredients: [i('barra proteica', 1), i('banana', 1)],
    portion: '1 barra + 1 fruta',
    carbs: 44, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 2, satiety: 'normal',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'La merienda de los días que no pasás por casa.',
    prepSteps: ['Guardar una barra en la mochila', 'Lavar fruta'],
  }),
  demo({
    id: 'm-untable-mermelada',
    name: 'Tostadas con queso untable y mermelada',
    drink: 'café',
    category: 'merienda',
    tags: ['en casa', 'rápido', 'dulce'],
    mainIngredient: 'pan',
    ingredients: [i('pan', 2, 'rebanada'), i('queso untable', 40, 'g'), i('mermelada sin azúcar', 30, 'g'), i('café', 10, 'g')],
    portion: '2 tostadas + 1 taza',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 4, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
  }),

  /* ---- Almuerzo ---- */
  demo({
    id: 'm-fideos',
    name: 'Fideos con salsa y queso',
    category: 'almuerzo',
    tags: ['en casa', 'potente'],
    mainIngredient: 'fideos',
    ingredients: [i('fideos', 100, 'g'), i('salsa de tomate', 150, 'g'), i('queso', 30, 'g')],
    portion: '1 plato',
    carbs: 78, carbSource: 'receta', confidence: 'media',
    prepMinutes: 20, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: true, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'De lo que más carbohidratos tiene del día. Conviene mirarlo bien.',
    prepSteps: ['Hervir fideos', 'Armar el tupper del almuerzo'],
    steps: [
      {
        text: 'Poné una olla con bastante agua a fuego fuerte',
        minutes: 8,
        detail:
          'Bastante agua de verdad: los fideos necesitan lugar para moverse. Tapala mientras calienta y hierve antes.',
      },
      {
        text: 'Mientras tanto, calentá la salsa a fuego bajo',
        minutes: 8,
        detail:
          'Si es de lata o de tetra, un chorro de aceite, sal, orégano y un poquito de azúcar si está muy ácida. Fuego bajo, revolviendo cada tanto.',
      },
      {
        text: 'Cuando el agua hierva, ponele sal y tirá los fideos',
        minutes: 1,
        detail:
          'Sal recién cuando hierve, un puñado. Revolvé apenas los tirás para que no se peguen entre ellos en el fondo.',
      },
      {
        text: 'Herví los fideos un minuto menos que lo que dice el paquete',
        minutes: 10,
        detail:
          'Un minuto menos, porque después se terminan de hacer en la salsa. Probá uno: tiene que estar blando pero con el centro todavía firme.',
      },
      {
        text: 'Guardá medio vaso del agua antes de escurrir',
        minutes: 1,
        detail:
          'Sacalo con una taza antes de volcar la olla. Si después la salsa queda seca, ese agua la arregla mejor que el aceite.',
      },
      {
        text: 'Escurrí, mezclá con la salsa y sumá el queso fuera del fuego',
        minutes: 2,
        detail:
          'Volcá los fideos en la olla de la salsa, no al revés, y mezclá un minuto a fuego bajo. El queso al final, con el fuego apagado.',
      },
    ],
  }),
  demo({
    id: 'm-tarta-jamon',
    name: 'Tarta de jamón y queso con ensalada',
    category: 'almuerzo',
    tags: ['para llevar', 'normal', 'práctico'],
    mainIngredient: 'masa de tarta',
    ingredients: [i('masa de tarta', 1), i('jamón', 100, 'g'), i('queso', 150, 'g'), i('huevo', 2), i('lechuga', 0.5)],
    portion: '2 porciones (rinde para 2 días)',
    carbs: 42, carbSource: 'receta', confidence: 'media',
    prepMinutes: 35, satiety: 'normal',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: true,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Se come fría y rinde dos días.',
    prepSteps: ['Hornear la tarta', 'Porcionar en tuppers'],
    steps: [
      {
        text: 'Prendé el horno a 200° y dejalo calentar',
        minutes: 10,
        detail:
          'Mientras calienta armás toda la tarta. La masa podés dejarla ya puesta en la tartera esperando.',
      },
      {
        text: 'Poné una tapa de masa en la tartera y pinchala con un tenedor',
        minutes: 3,
        detail:
          'Pinchá el fondo diez o quince veces. Es para que el vapor se escape y la masa no se infle como un globo en el medio.',
      },
      {
        text: 'Cortá el jamón y el queso en cubos',
        minutes: 3,
        detail:
          'En cubos y no en fetas: en fetas se agrupan todas juntas en un rincón y la mitad de la tarta queda vacía.',
      },
      {
        text: 'Batí los 2 huevos y mezclalos con el jamón y el queso',
        minutes: 2,
        detail:
          'Pimienta sí, sal casi nada: el jamón y el queso ya vienen salados.',
      },
      {
        text: 'Volcá el relleno y tapá con la otra masa',
        minutes: 3,
        detail:
          'Repartilo parejo. Después ponés la segunda tapa y cerrás el borde apretando con los dedos todo alrededor, o lo doblás hacia adentro.',
      },
      {
        text: 'Horneá 25 minutos hasta que esté dorada',
        minutes: 25,
        detail:
          'Está cuando la tapa tomó color marrón dorado parejo, no sólo en los bordes. Entera son seis porciones: dos cenas y dos almuerzos para llevar.',
      },
    ],
  }),
  demo({
    id: 'm-hamburguesa',
    name: 'Hamburguesa casera con ensalada',
    category: 'almuerzo',
    frequency: 'ocasional',
    tags: ['en casa', 'potente', 'antojo'],
    mainIngredient: 'carne picada',
    ingredients: [i('carne picada', 180, 'g'), i('pan de hamburguesa', 1), i('queso', 30, 'g'), i('tomate', 1), i('lechuga', 0.5)],
    portion: '1 hamburguesa',
    carbs: 38, carbSource: 'receta', confidence: 'media',
    prepMinutes: 20, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    steps: [
      {
        text: 'Armá 1 medallón con la carne, aplastado y fino',
        minutes: 4,
        detail:
          'Los 180 gramos en una sola hamburguesa, aplastada con la mano hasta que quede más ancha que el pan: en la sartén se encoge.',
      },
      {
        text: 'Hacele un hueco en el centro con el pulgar',
        minutes: 1,
        detail:
          'Un pozito en el medio, sin llegar a agujerearla. Sin eso, la hamburguesa se infla en el centro y te queda una pelota que no entra en el pan.',
      },
      {
        text: 'Salá recién ahora, de los dos lados',
        minutes: 1,
        detail:
          'Si salás la carne antes de armar el medallón, la sal le saca el agua y queda seca y dura.',
      },
      {
        text: 'Cocinala 4 minutos de un lado a fuego fuerte, sin tocarla',
        minutes: 4,
        detail:
          'La sartén tiene que estar bien caliente antes de que la carne entre. No la aplastes ni la muevas: esa costra marrón que se forma es todo el gusto.',
      },
      {
        text: 'Dala vuelta una sola vez y hacé 4 minutos del otro lado',
        minutes: 4,
        detail:
          'Una sola vuelta. Cada vez que la das vuelta de más, perdés jugo.',
      },
      {
        text: 'Ponele el queso arriba, apagá y tapá',
        minutes: 2,
        detail:
          'Con el fuego apagado y una tapa encima, el vapor derrite el queso en menos de un minuto sin recocer la carne.',
      },
      {
        text: 'Tostá el pan del lado de adentro y armá',
        minutes: 4,
        detail:
          'Los dos panes boca abajo en la misma sartén treinta segundos. El pan tostado aguanta los jugos y no se deshace. Lechuga, tomate y listo.',
      },
    ],
  }),

  /* ---- Cena ---- */
  demo({
    id: 'm-pizza',
    name: 'Pizza casera con muzzarella',
    category: 'cena',
    frequency: 'ocasional',
    tags: ['en casa', 'potente', 'antojo'],
    mainIngredient: 'masa de pizza',
    ingredients: [i('masa de pizza', 1), i('salsa de tomate', 120, 'g'), i('muzzarella', 200, 'g')],
    portion: '2 porciones grandes',
    carbs: 72, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 25, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: true, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'Bastantes carbohidratos y muy variable según la masa.',
    steps: [
      {
        text: 'Prendé el horno al máximo con la bandeja adentro',
        minutes: 10,
        detail:
          'Al máximo y por lo menos diez minutos. El horno bien caliente es la única diferencia entre una pizza y una tarta blanda.',
      },
      {
        text: 'Extendé la salsa sobre la masa, sin llegar al borde',
        minutes: 3,
        detail:
          'Con el revés de una cuchara, en espiral desde el centro. Dejá dos dedos de borde libre. Poca salsa: de más, la masa queda cruda en el medio.',
      },
      {
        text: 'Cubrí con la muzzarella sin tapar del todo',
        minutes: 2,
        detail:
          'En rodajas o rallada, dejando huecos. Si la tapás entera, el vapor no escapa y la pizza queda aguada.',
      },
      {
        text: 'Pasala a la bandeja caliente, bien abajo en el horno',
        minutes: 1,
        detail:
          'Abajo de todo es donde más calor hay por debajo, que es lo que necesita la base para quedar crocante.',
      },
      {
        text: 'Horneá 12 minutos',
        minutes: 12,
        detail:
          'Está cuando el queso hace globitos y los bordes de la masa están dorados. Si el queso ya burbujea pero el borde está pálido, subila un estante.',
      },
      {
        text: 'Orégano recién al sacarla',
        detail:
          'Si se lo ponés antes, en el horno se quema y amarga. Va al final, sobre el queso caliente.',
      },
    ],
  }),
  demo({
    id: 'm-sandwich-caliente',
    name: 'Sándwich caliente con huevo',
    category: 'cena',
    tags: ['en casa', 'rápido', 'salado'],
    mainIngredient: 'pan',
    ingredients: [i('pan', 2, 'rebanada'), i('huevo', 2), i('queso', 40, 'g'), i('jamón', 40, 'g')],
    portion: '1 sándwich',
    carbs: 36, carbSource: 'receta', confidence: 'media',
    prepMinutes: 12, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Cena de las noches en que llegás tarde y no querés cocinar.',
    steps: [
      {
        text: 'Hacé los 2 huevos a la plancha con la yema firme',
        minutes: 5,
        detail:
          'Fuego medio, un poco de aceite, y tapá la sartén dos minutos: el vapor cocina la yema desde arriba sin que tengas que darlos vuelta. Yema firme, porque si se rompe te moja todo el pan.',
      },
      {
        text: 'Poné queso sobre las dos rebanadas de pan',
        minutes: 1,
        detail:
          'Queso abajo y arriba. Derretido es lo que después mantiene el sándwich cerrado.',
      },
      {
        text: 'Armá con el jamón y el huevo en el medio',
        minutes: 2,
        detail:
          'Si el huevo sobresale, dobla los bordes hacia adentro: lo que queda afuera se quema en la sandwichera.',
      },
      {
        text: 'Tostalo hasta que el queso se derrita',
        minutes: 4,
        detail:
          'En sandwichera, o en una sartén a fuego medio con una cacerola encima haciendo peso. Dos minutos de cada lado.',
      },
    ],
  }),
  demo({
    id: 'm-flan',
    name: 'Flan sin azúcar',
    category: 'snack',
    tags: ['en casa', 'rápido', 'dulce', 'liviano', 'envasado'],
    mainIngredient: 'flan sin azúcar',
    ingredients: [i('flan sin azúcar', 1)],
    portion: '1 porción',
    carbs: 10, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 2, satiety: 'liviana',
    portable: false, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
  }),

  /* ---- Para comprar: kiosco y estación de servicio ---- */
  afuera({
    id: 'c-kio-barra-prot', name: 'Barra proteica de chocolate', category: 'snack',
    tags: ['rápido', 'práctico', 'envasado', 'dulce', 'kiosco'], portion: '1 barra',
    carbs: 20, satiety: 'normal', venues: ['kiosco', 'estación de servicio'],
    priceLevel: 2, handheld: true,
    packaged: { servingSize: '1 barra (40 g)', servingsPerPack: 1 },
    notes: 'El número está en el envase: vale la pena leerlo una vez y cargarlo.',
  }),
  afuera({
    id: 'c-kio-alfajor', name: 'Alfajor sin azúcar', category: 'snack',
    frequency: 'ocasional',
    tags: ['rápido', 'dulce', 'antojo', 'envasado', 'kiosco'], portion: '1 alfajor',
    carbs: 28, satiety: 'liviana', venues: ['kiosco', 'estación de servicio'],
    priceLevel: 1, handheld: true,
    packaged: { servingSize: '1 alfajor' },
    notes: 'Sin azúcar no es sin carbohidratos: la masa sigue contando.',
  }),
  afuera({
    id: 'c-kio-galletitas', name: 'Galletitas sin azúcar', category: 'snack',
    tags: ['rápido', 'práctico', 'envasado', 'dulce', 'kiosco'], portion: '1 paquete chico',
    carbs: 26, satiety: 'liviana', venues: ['kiosco', 'supermercado'],
    priceLevel: 1, handheld: true,
    packaged: { servingSize: '30 g', servingsPerPack: 4 },
    notes: 'Ojo con el paquete entero: la etiqueta habla por porción.',
  }),
  afuera({
    id: 'c-kio-bebida', name: 'Bebida zero y frutos secos', category: 'snack',
    tags: ['rápido', 'práctico', 'envasado', 'kiosco'], portion: '1 botella + 1 paquete chico',
    carbs: 8, satiety: 'liviana', venues: ['kiosco', 'estación de servicio'],
    priceLevel: 2, handheld: true,
    notes: 'La bebida zero no suma carbohidratos; los frutos secos, casi nada.',
  }),
  afuera({
    id: 'c-kio-merienda', name: 'Barra proteica',
    drink: 'café', category: 'merienda',
    tags: ['rápido', 'práctico', 'envasado', 'kiosco'], portion: '1 barra + 1 café',
    carbs: 22, satiety: 'normal', venues: ['estación de servicio', 'kiosco'],
    priceLevel: 2, handheld: true,
  }),

  /* ---- Para comprar: supermercado ---- */
  afuera({
    id: 'c-sup-yogur-sa', name: 'Yogur sin azúcar con fruta', category: 'snack',
    tags: ['rápido', 'práctico', 'envasado', 'dulce', 'supermercado'], portion: '1 pote + 1 fruta',
    carbs: 26, satiety: 'liviana', venues: ['supermercado'], priceLevel: 1, handheld: true,
    packaged: { servingSize: '1 pote (200 g)' },
  }),
  afuera({
    id: 'c-sup-postre', name: 'Postre o flan sin azúcar', category: 'snack',
    frequency: 'ocasional',
    tags: ['rápido', 'dulce', 'antojo', 'envasado', 'supermercado'], portion: '1 pote',
    carbs: 12, satiety: 'liviana', venues: ['supermercado'], priceLevel: 1, handheld: true,
  }),
  afuera({
    id: 'c-sup-queso-galletitas', name: 'Queso en fetas con galletitas', category: 'snack',
    tags: ['rápido', 'práctico', 'salado', 'envasado', 'supermercado'], portion: '1 porción',
    carbs: 24, satiety: 'potente', venues: ['supermercado'], priceLevel: 2, handheld: true,
  }),
  afuera({
    id: 'c-sup-barra', name: 'Barra de cereal o proteica', category: 'snack',
    tags: ['rápido', 'práctico', 'envasado', 'dulce', 'supermercado'], portion: '1 barra',
    carbs: 22, satiety: 'liviana', venues: ['supermercado'], priceLevel: 1, handheld: true,
    packaged: { servingSize: '1 barra' },
  }),

  /* ---- Para comprar: panadería y cafetería ---- */
  afuera({
    id: 'c-pan-budin', name: 'Budín', category: 'merienda', drink: 'café con leche',
    frequency: 'ocasional',
    tags: ['rápido', 'dulce', 'antojo'], portion: '1 porción + 1 taza',
    carbs: 45, satiety: 'normal', venues: ['panadería', 'cafetería'], priceLevel: 1, handheld: false,
  }),
  afuera({
    id: 'c-caf-tostado-merienda', name: 'Tostado con café', category: 'merienda',
    tags: ['rápido', 'salado'], portion: '1 tostado + 1 taza',
    carbs: 36, satiety: 'potente', venues: ['cafetería'], priceLevel: 2, handheld: false,
  }),
  demo({
    id: 'm-sandwich-untable',
    name: 'Sándwich de queso untable y jamón',
    category: 'desayuno',
    tags: ['para llevar', 'rápido', 'práctico', 'salado'],
    mainIngredient: 'pan integral',
    ingredients: [i('pan integral', 2, 'rebanada'), i('queso untable', 50, 'g'), i('jamón', 50, 'g'), i('tomate', 1)],
    portion: '1 sándwich',
    carbs: 40, carbSource: 'receta', confidence: 'media',
    prepMinutes: 5, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'El más rápido de armar de noche.',
    prepSteps: ['Armar el sándwich'],
  }),
  demo({
    id: 'm-panqueques',
    name: 'Panqueques con queso untable y mermelada',
    category: 'desayuno',
    frequency: 'ocasional',
    tags: ['para llevar', 'dulce', 'potente'],
    mainIngredient: 'harina',
    ingredients: [i('harina', 80, 'g'), i('huevo', 2), i('leche', 200, 'ml'), i('queso untable', 50, 'g'), i('mermelada sin azúcar', 40, 'g')],
    portion: '3 panqueques (rinde 6)',
    carbs: 52, carbSource: 'receta', confidence: 'media',
    prepMinutes: 30, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: true,
    difficulty: 2, favorite: false, tested: true, rating: 5,
    notes: 'Se hacen la noche anterior y rinden dos días.',
    prepSteps: ['Hacer panqueques', 'Porcionar en tuppers'],
    steps: [
      {
        text: 'Poné la harina en un bol y hacé un hueco en el centro',
        minutes: 1,
        detail:
          'Los 80 gramos son unas seis cucharadas. El hueco en el medio es para volcar ahí los huevos: así se mezcla desde el centro hacia afuera y se hacen menos grumos.',
      },
      {
        text: 'Rompé los 2 huevos en el hueco y empezá a batir',
        minutes: 2,
        detail:
          'Batí sólo el centro al principio, incorporando harina de a poco desde los bordes. Va a quedar una pasta espesa: está bien.',
      },
      {
        text: 'Sumá la leche de a chorros, batiendo',
        minutes: 3,
        detail:
          'De a poco y sin parar de batir. Si tirás toda la leche de una, se hacen grumos y después no hay forma de sacarlos. Queda líquida, como crema.',
      },
      {
        text: 'Dejá reposar la mezcla 10 minutos',
        minutes: 10,
        detail:
          'Afuera de la heladera. La harina se hidrata y los panqueques salen tiernos en vez de gomosos. Este rato no hacés nada: aprovechá para lavar el bol.',
      },
      {
        text: 'Calentá una sartén chica y pasale apenas aceite',
        minutes: 2,
        detail:
          'Con un papel de cocina con unas gotas de aceite. Si ponés mucho, el panqueque se fríe y se rompe.',
      },
      {
        text: 'Volcá un cucharón y girá la sartén para repartir',
        minutes: 10,
        detail:
          'Un cucharón por panqueque. Levantá la sartén y hacela girar para que la mezcla cubra todo el fondo en una capa fina. Dalo vuelta cuando los bordes se despegan solos, al minuto más o menos. Salen seis u ocho.',
      },
      {
        text: 'Untá con el queso y la mermelada y doblá',
        minutes: 2,
        detail:
          'Enrollados o doblados en cuatro. Fríos al otro día siguen buenos: son la merienda del día siguiente sin hacer nada.',
      },
    ],
  }),

  /* ================= LO QUE SE COME UN MARTES =================

     La base de la biblioteca. Café, mate, tostadas, tostado, sándwich:
     lo que efectivamente se desayuna y se merienda acá.

     La bebida va como campo, no como parte del nombre: un tostado con
     café es un tostado con café, no dos comidas.
     ========================================================= */

  /* ---- Desayuno ---- */
  demo({
    id: 'd-tostadas-manteca',
    name: 'Tostadas con manteca',
    category: 'desayuno',
    tags: ['en casa', 'rápido'],
    mainIngredient: 'pan',
    drink: 'café con leche',
    ingredients: [i('pan', 2, 'rebanada'), i('manteca', 15, 'g'), i('café', 10, 'g'), i('leche', 180, 'ml')],
    portion: '2 tostadas + 1 taza',
    carbs: 32, carbSource: 'receta', confidence: 'media',
    prepMinutes: 4, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 4,
  }),
  demo({
    id: 'd-tostadas-jamon',
    name: 'Tostadas con jamón y queso',
    category: 'desayuno',
    tags: ['en casa', 'rápido', 'salado'],
    mainIngredient: 'pan',
    drink: 'café con leche',
    ingredients: [i('pan', 2, 'rebanada'), i('jamón', 40, 'g'), i('queso', 40, 'g'), i('café', 10, 'g'), i('leche', 180, 'ml')],
    portion: '2 tostadas + 1 taza',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 5, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
  }),
  demo({
    id: 'd-mate-tostadas',
    name: 'Tostadas con queso untable',
    category: 'desayuno',
    tags: ['en casa', 'rápido'],
    mainIngredient: 'pan',
    drink: 'mate',
    ingredients: [i('pan', 3, 'rebanada'), i('queso untable', 50, 'g'), i('yerba', 50, 'g')],
    portion: '3 tostadas + mate',
    carbs: 40, carbSource: 'receta', confidence: 'media',
    prepMinutes: 6, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'El mate estira el desayuno un buen rato.',
  }),
  demo({
    id: 'd-budin',
    name: 'Budín sin azúcar',
    category: 'desayuno',
    tags: ['en casa', 'rápido', 'dulce'],
    mainIngredient: 'budín sin azúcar',
    drink: 'café con leche',
    ingredients: [i('budín sin azúcar', 80, 'g'), i('café', 10, 'g'), i('leche', 180, 'ml')],
    portion: '2 rebanadas + 1 taza',
    carbs: 34, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 3, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
    notes: 'Sin azúcar no quiere decir sin carbohidratos: la harina sigue estando.',
  }),
  demo({
    id: 'd-galletitas',
    name: 'Galletitas sin azúcar',
    category: 'desayuno',
    tags: ['en casa', 'rápido', 'dulce', 'envasado'],
    mainIngredient: 'galletitas sin azúcar',
    drink: 'café con leche',
    ingredients: [i('galletitas sin azúcar', 40, 'g'), i('café', 10, 'g'), i('leche', 180, 'ml')],
    portion: '5 o 6 galletitas + 1 taza',
    carbs: 30, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 3, satiety: 'liviana',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    packaged: { servingSize: '30 g' },
  }),
  demo({
    id: 'd-sandwich-rapido',
    name: 'Sándwich de jamón y queso',
    category: 'desayuno',
    tags: ['para llevar', 'rápido', 'salado', 'práctico'],
    mainIngredient: 'pan',
    drink: 'café',
    ingredients: [i('pan', 2, 'rebanada'), i('jamón', 40, 'g'), i('queso', 40, 'g')],
    portion: '1 sándwich',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 4, satiety: 'normal',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 4,
    notes: 'El de los días que salís corriendo. Se arma en dos minutos.',
    prepSteps: ['Armar el sándwich'],
  }),
  demo({
    id: 'd-barra-cafe',
    name: 'Barra proteica de chocolate',
    category: 'desayuno',
    tags: ['para llevar', 'rápido', 'práctico', 'envasado', 'dulce'],
    mainIngredient: 'barra proteica',
    drink: 'café',
    ingredients: [i('barra proteica', 1)],
    portion: '1 barra + 1 café',
    carbs: 20, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 2, satiety: 'liviana',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 3,
    packaged: { servingSize: '1 barra (40 g)', servingsPerPack: 1 },
    notes: 'Para los días que no hay tiempo ni para tostar pan.',
    prepSteps: ['Guardar una barra en la mochila'],
  }),
  demo({
    id: 'd-mate-sandwich',
    name: 'Sándwich de queso',
    category: 'desayuno',
    tags: ['en casa', 'rápido', 'salado'],
    mainIngredient: 'pan',
    drink: 'mate',
    ingredients: [i('pan', 2, 'rebanada'), i('queso', 60, 'g'), i('yerba', 50, 'g')],
    portion: '1 sándwich + mate',
    carbs: 32, carbSource: 'receta', confidence: 'media',
    prepMinutes: 4, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
  }),

  /* ---- Merienda ---- */
  demo({
    id: 'me-mate-galletitas',
    name: 'Galletitas sin azúcar',
    category: 'merienda',
    tags: ['en casa', 'rápido', 'dulce', 'envasado'],
    mainIngredient: 'galletitas sin azúcar',
    drink: 'mate',
    ingredients: [i('galletitas sin azúcar', 50, 'g'), i('yerba', 50, 'g')],
    portion: '6 o 7 galletitas + mate',
    carbs: 32, carbSource: 'etiqueta', confidence: 'estimada',
    prepMinutes: 4, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    packaged: { servingSize: '30 g' },
  }),
  demo({
    id: 'me-mate-budin',
    name: 'Budín sin azúcar',
    category: 'merienda',
    tags: ['en casa', 'dulce'],
    mainIngredient: 'budín sin azúcar',
    drink: 'mate',
    ingredients: [i('budín sin azúcar', 90, 'g'), i('yerba', 50, 'g')],
    portion: '2 rebanadas + mate',
    carbs: 36, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 3, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
  }),
  demo({
    id: 'me-sandwich-mate',
    name: 'Sándwich de jamón y queso',
    category: 'merienda',
    tags: ['en casa', 'salado', 'potente'],
    mainIngredient: 'pan',
    drink: 'mate',
    ingredients: [i('pan', 2, 'rebanada'), i('jamón', 50, 'g'), i('queso', 50, 'g'), i('yerba', 50, 'g')],
    portion: '1 sándwich + mate',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 5, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
  }),

  /* ---- Con azúcar común: existe, no está prohibida ----
     Están acá justamente para que se vea que la app no las bloquea ni las
     marca. Aparecen menos seguido porque son de vez en cuando, no porque
     estén mal. Y cuando hay una versión con menos azúcar agregada, la
     preferencia del usuario desempata. */
  demo({
    id: 'me-budin-comun',
    name: 'Budín',
    category: 'merienda',
    frequency: 'ocasional',
    addedSugar: true,
    tags: ['en casa', 'dulce', 'antojo'],
    mainIngredient: 'budín',
    drink: 'café con leche',
    ingredients: [i('budín', 90, 'g'), i('café', 10, 'g'), i('leche', 180, 'ml')],
    portion: '2 rebanadas + 1 taza',
    carbs: 52, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 3, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
  }),
  demo({
    id: 's-alfajor',
    name: 'Alfajor',
    category: 'snack',
    frequency: 'ocasional',
    addedSugar: true,
    tags: ['para llevar', 'rápido', 'dulce', 'antojo', 'envasado', 'kiosco'],
    mainIngredient: 'alfajor',
    ingredients: [i('alfajor', 1)],
    portion: '1 alfajor',
    carbs: 38, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 1, satiety: 'liviana',
    portable: true, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
    packaged: { servingSize: '1 alfajor' },
    notes: 'El número está en el envase y cambia bastante entre marcas.',
  }),

  /* ---- Para comprar ---- */
  afuera({
    id: 'c-kio-alfajor-comun', name: 'Alfajor', category: 'snack',
    frequency: 'ocasional', addedSugar: true,
    tags: ['rápido', 'dulce', 'antojo', 'envasado', 'kiosco'], portion: '1 alfajor',
    carbs: 38, satiety: 'liviana', venues: ['kiosco', 'estación de servicio'],
    priceLevel: 1, handheld: true,
    packaged: { servingSize: '1 alfajor' },
  }),
  afuera({
    id: 'c-caf-budin', name: 'Budín', category: 'merienda',
    frequency: 'ocasional', addedSugar: true, drink: 'café con leche',
    tags: ['rápido', 'dulce', 'antojo'], portion: '1 porción + 1 taza',
    carbs: 55, satiety: 'normal', venues: ['cafetería', 'panadería'],
    priceLevel: 1, handheld: false,
  }),
  afuera({
    id: 'c-kio-gaseosa-zero', name: 'Bebida sin azúcar', category: 'snack',
    tags: ['rápido', 'práctico', 'envasado', 'kiosco'], portion: '1 botella chica',
    carbs: 0, satiety: 'liviana', venues: ['kiosco', 'estación de servicio'],
    priceLevel: 1, handheld: true, drink: 'bebida sin azúcar',
    notes: 'Cero carbohidratos. Sirve para acompañar cualquier otra cosa.',
  }),
  afuera({
    id: 'c-kio-gaseosa', name: 'Gaseosa común', category: 'snack',
    frequency: 'ocasional', addedSugar: true,
    tags: ['rápido', 'dulce', 'envasado', 'kiosco'], portion: '1 botella chica (500 ml)',
    carbs: 53, satiety: 'liviana', venues: ['kiosco', 'estación de servicio'],
    priceLevel: 1, handheld: true, drink: 'jugo',
    notes: 'Bastantes carbohidratos y llegan rápido. El número está en la etiqueta.',
  }),

  /* ---- Desayunos cotidianos que además se llevan ----
     Los días mixtos y de calle piden desayuno transportable y que aguante.
     Sin estos, lo cotidiano quedaba sólo para los días en casa. */
  demo({
    id: 'd-tostado-llevar',
    name: 'Tostado de jamón y queso',
    category: 'desayuno',
    tags: ['para llevar', 'rápido', 'salado', 'práctico'],
    mainIngredient: 'pan',
    drink: 'café',
    ingredients: [i('pan', 2, 'rebanada'), i('jamón', 50, 'g'), i('queso', 50, 'g')],
    portion: '1 tostado',
    carbs: 34, carbSource: 'receta', confidence: 'media',
    prepMinutes: 7, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'Envuelto en papel manteca aguanta bien hasta media mañana.',
    prepSteps: ['Armar el tostado'],
    steps: [
      {
        text: 'Armá el tostado con el jamón y el queso',
        minutes: 2,
        detail:
          'Una feta de cada uno entre las dos rebanadas. Con pan de molde aguanta el viaje mucho mejor que con pan francés.',
      },
      {
        text: 'Tostalo hasta que el queso se derrita',
        minutes: 4,
        detail:
          'Sandwichera, o sartén a fuego medio con una cacerola encima haciendo peso, dos minutos de cada lado. El queso derretido lo sella y no se abre en la mochila.',
      },
      {
        text: 'Dejalo enfriar un minuto y envolvelo en papel manteca',
        minutes: 1,
        detail:
          'Papel, nunca film: el film no deja salir el vapor y a las dos horas el tostado está blando y húmedo.',
      },
    ],
  }),
  demo({
    id: 'd-tortilla-pan',
    name: 'Sándwich de tortilla de papa',
    category: 'desayuno',
    tags: ['para llevar', 'salado', 'potente'],
    mainIngredient: 'papa',
    drink: 'café',
    ingredients: [i('pan', 2, 'rebanada'), i('papa', 1), i('huevo', 2), i('cebolla', 0.5)],
    portion: '1 sándwich',
    carbs: 48, carbSource: 'receta', confidence: 'media',
    prepMinutes: 8, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
    notes: 'Si quedó tortilla de la noche anterior, sale en dos minutos.',
    prepSteps: ['Armar el sándwich'],
    steps: [
      {
        text: 'Cortá una porción de la tortilla del día anterior',
        minutes: 2,
        detail:
          'Fría y directo de la heladera. Para esto, la tortilla del día anterior es mejor que la recién hecha: está más firme y no se desarma.',
      },
      {
        text: 'Tostá las 2 rebanadas de pan',
        minutes: 3,
        detail:
          'Bien tostadas: tienen que aguantar una porción con peso sin doblarse.',
      },
      {
        text: 'Armá el sándwich y envolvelo',
        minutes: 3,
        detail:
          'Mayonesa o mostaza si querés. Envuelto en papel manteca llega entero al mediodía.',
      },
    ],
  }),
  demo({
    id: 'd-medialunas',
    name: 'Medialunas de jamón y queso',
    category: 'desayuno',
    frequency: 'ocasional',
    addedSugar: true,
    tags: ['para llevar', 'rápido', 'salado', 'antojo'],
    mainIngredient: 'medialuna',
    drink: 'café con leche',
    ingredients: [i('medialuna', 2), i('jamón', 40, 'g'), i('queso', 40, 'g')],
    portion: '2 medialunas',
    carbs: 46, carbSource: 'estimación', confidence: 'estimada',
    prepMinutes: 4, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 5,
    notes: 'La masa de la medialuna lleva azúcar: los carbos suben bastante.',
    prepSteps: ['Armar las medialunas'],
  }),
  demo({
    id: 'd-sandwich-queso-tomate',
    name: 'Sándwich de queso, tomate y huevo',
    category: 'desayuno',
    tags: ['para llevar', 'salado', 'potente'],
    mainIngredient: 'pan',
    drink: 'café',
    ingredients: [i('pan integral', 2, 'rebanada'), i('queso', 50, 'g'), i('huevo', 1), i('tomate', 1)],
    portion: '1 sándwich',
    carbs: 40, carbSource: 'receta', confidence: 'media',
    prepMinutes: 8, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    prepSteps: ['Hervir huevos', 'Armar el sándwich'],
    steps: [
      {
        text: 'Agarrá un huevo duro de los que dejaste hechos',
        minutes: 1,
        detail:
          'Acá está la gracia: con huevos duros en la heladera esto son cinco minutos. Si tenés que hervirlo ahora, son veinte.',
      },
      {
        text: 'Cortá el huevo y el tomate en rodajas',
        minutes: 3,
        detail:
          'Al huevo con el cuchillo mojado, que no se desarma. Al tomate secale el agua con papel de cocina o el pan llega mojado.',
      },
      {
        text: 'Armá con el queso contra las dos tapas y envolvelo',
        minutes: 3,
        detail:
          'Queso, después huevo y tomate, después queso. Papel manteca y listo.',
      },
    ],
  }),
]
