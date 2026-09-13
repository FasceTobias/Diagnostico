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
        text: 'Mezclar la avena con el yogur y la leche en el frasco',
        minutes: 3,
        detail:
          'Medio pote de yogur y un chorro de leche por cada tres cucharadas de avena. Tiene que quedar cubierta, no nadando: de noche la avena chupa casi todo el líquido.',
      },
      {
        text: 'Sumar la canela y revolver bien',
        minutes: 1,
        detail:
          'Una cucharadita al ras. Revolvé hasta que no queden grumos secos en el fondo del frasco, que es donde siempre se esconden.',
      },
      {
        text: 'Tapar y dejar en la heladera toda la noche',
        detail:
          'Mínimo seis horas. Aguanta tres días tapada, así que podés dejar dos o tres frascos hechos de una vez.',
      },
      {
        text: 'A la mañana, sumar la banana cortada y las nueces',
        minutes: 2,
        detail:
          'Recién a la mañana: si las ponés de noche la banana se pone marrón y las nueces se ablandan. Si salís apurado, llevalas aparte en una bolsita.',
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
    prepMinutes: 12, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: true, tested: true, rating: 5,
    notes: 'La palta, a último momento o con limón.',
    prepSteps: ['Armar el sándwich', 'Hervir huevos'],
    steps: [
      {
        text: 'Hervir los huevos desde que rompe el hervor',
        minutes: 8,
        detail:
          'Agua fría, huevos adentro, y contás los ocho minutos desde que burbujea fuerte. Pasalos por agua fría apenas salen: se pelan mucho mejor.',
      },
      {
        text: 'Tostar el pan y cortar el tomate',
        minutes: 2,
        detail:
          'El pan apenas dorado. El tomate en rodajas finas y, si el sándwich es para llevar, secalas con papel de cocina para que no lo mojen.',
      },
      {
        text: 'Armar con el queso y el huevo en rodajas',
        minutes: 2,
        detail:
          'El queso contra el pan y el tomate en el medio: así el pan no se humedece. Sal y orégano arriba del huevo.',
      },
      {
        text: 'La palta, recién al momento de comer o con unas gotas de limón',
        detail:
          'Se oxida en minutos. Si el sándwich es para más tarde, pisala con unas gotas de limón o llevala entera y agregala al momento.',
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
        text: 'Precalentar el horno a 180°',
        minutes: 10,
        detail:
          'Calor arriba y abajo. Mientras levanta temperatura te da el tiempo justo para hacer toda la mezcla.',
      },
      {
        text: 'Batir los huevos con el queso, la espinaca picada y la harina',
        minutes: 5,
        detail:
          'Seis huevos, un puñado de queso rallado y dos cucharadas de harina. La espinaca picada chica y bien escurrida: si viene con agua, los budincitos quedan aguados.',
      },
      {
        text: 'Repartir en moldecitos hasta tres cuartos',
        minutes: 2,
        detail:
          'Aceitá los moldes o usá pirotines. Hasta tres cuartos nomás, porque crecen.',
      },
      {
        text: 'Hornear hasta que estén firmes y dorados',
        minutes: 20,
        detail:
          'Están cuando el centro no se mueve al sacudir la bandeja. Salen seis o siete y aguantan tres días en la heladera.',
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
        text: 'Cortar la papa en rodajas finas y la cebolla en pluma',
        minutes: 8,
        detail:
          'Rodajas de dos o tres milímetros: cuanto más finas, menos tardan. La cebolla en tiras finas, una mediana cada dos papas.',
      },
      {
        text: 'Freír a fuego bajo hasta que la papa esté blanda',
        minutes: 12,
        detail:
          'Fuego bajo y con aceite que las cubra hasta la mitad. No se doran: se ablandan. Cuando el tenedor entra sin resistencia, están. Escurrilas bien.',
      },
      {
        text: 'Mezclar con los huevos batidos y salar',
        minutes: 2,
        detail:
          'Cuatro huevos para dos papas. Volcá la papa caliente sobre el huevo batido y dejala reposar un minuto ahí: cuaja mejor.',
      },
      {
        text: 'Cuajar en la sartén, dar vuelta con un plato y terminar',
        minutes: 8,
        detail:
          'Fuego medio, cuatro minutos de un lado. Tapás con un plato, das vuelta la sartén y la devolvés para terminar el otro lado. Fría al día siguiente está mejor que recién hecha.',
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
        text: 'Batir los huevos con una pizca de sal',
        minutes: 1,
        detail:
          'Dos o tres huevos. Batilos apenas, hasta que se una la yema: batidos de más quedan chiclosos.',
      },
      {
        text: 'Revolver a fuego bajo hasta que estén cremosos',
        minutes: 5,
        detail:
          'Fuego bajo y revolviendo casi todo el tiempo. Sacalos de la sartén cuando todavía se ven húmedos, porque siguen cocinándose con el calor de la sartén.',
      },
      {
        text: 'Tostar el pan y cortar el tomate',
        minutes: 3,
        detail:
          'Dos rebanadas bien tostadas: tienen que aguantar el huevo arriba. El tomate en rodajas con sal.',
      },
      {
        text: 'Servir el huevo sobre las tostadas con el queso',
        minutes: 1,
        detail:
          'El queso arriba del huevo caliente para que se ablande solo. Esto se come al momento: no es para llevar.',
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
    prepMinutes: 10, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Casi sin carbohidratos. Sirve cuando faltan muchas horas para comer.',
    prepSteps: ['Hervir huevos'],
    steps: [
      {
        text: 'Hervir los huevos desde que rompe el hervor',
        minutes: 10,
        detail:
          'Diez minutos exactos para que la yema quede firme y no verdosa. Hacé cuatro o seis de una: con cáscara aguantan una semana en la heladera.',
      },
      {
        text: 'Pasarlos por agua fría y pelarlos',
        minutes: 2,
        detail:
          'El golpe de frío despega la cáscara. Pelalos abajo del chorro de agua y salen limpios.',
      },
      {
        text: 'Cortar el queso en cubos y guardar todo junto',
        minutes: 2,
        detail:
          'Cubos de bocado, de un queso que no se desarme. En un tupper chico con los huevos ya pelados es el snack más rápido que tenés.',
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
        text: 'Tostar el pan',
        minutes: 3,
        detail:
          'Apenas dorado. Si es para llevar, dejalo enfriar antes de armarlo o el vapor lo ablanda.',
      },
      {
        text: 'Armar con el queso y el jamón',
        minutes: 2,
        detail:
          'Una feta de cada uno. Es un snack, no un almuerzo: si te queda grande, cortalo al medio y guardás la mitad.',
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
        text: 'Precalentar el horno a 200°',
        minutes: 10,
        detail:
          'Mientras levanta temperatura salpimentás el pollo y ponés el agua del arroz a hervir.',
      },
      {
        text: 'Salpimentar el pollo y hornear hasta que esté dorado',
        minutes: 25,
        detail:
          'Sal, pimienta, un chorro de aceite y lo que tengas a mano: limón, ajo, pimentón. Está listo cuando al pincharlo el jugo sale transparente.',
      },
      {
        text: 'Mientras tanto, hervir el arroz',
        minutes: 15,
        detail:
          'Dos medidas de agua por una de arroz y bastante sal. Se hace solo mientras el horno trabaja.',
      },
      {
        text: 'Cortar el tomate y la lechuga, y armar el tupper',
        minutes: 5,
        detail:
          'Dejalo enfriar antes de tapar: cerrado en caliente se llena de vapor. La ensalada aparte y el aceite recién antes de comer.',
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
        text: 'Cortar el pollo ya cocido en tiras',
        minutes: 3,
        detail:
          'Pollo del día anterior, o una pechuga a la plancha. En tiras finas, que se coma sin pelear.',
      },
      {
        text: 'Rallar la zanahoria y cortar el tomate y la lechuga',
        minutes: 5,
        detail:
          'La zanahoria rallada gruesa para que no largue agua. El tomate sin semillas: son las que mojan la tortilla.',
      },
      {
        text: 'Untar la tortilla con el yogur y repartir el relleno',
        minutes: 3,
        detail:
          'Yogur natural con sal y limón hace de aderezo. Dejá dos dedos libres en los bordes o al enrollar se escapa todo.',
      },
      {
        text: 'Envolver apretado en papel manteca',
        minutes: 2,
        detail:
          'Apretado y con el papel puesto: el papel es lo que lo sostiene armado hasta el mediodía. Cortalo al medio recién cuando lo vas a comer.',
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
    prepMinutes: 20, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Se come fría. Muy buena para días de mucho movimiento.',
    prepSteps: ['Hervir huevos', 'Armar el tupper del almuerzo'],
    steps: [
      {
        text: 'Hervir los huevos',
        minutes: 10,
        detail:
          'Diez minutos desde el hervor. Si ya tenés huevos duros hechos, salteás este paso entero.',
      },
      {
        text: 'Escurrir y enjuagar las lentejas',
        minutes: 2,
        detail:
          'Si son de lata, enjuagalas bien bajo el chorro: sacás el líquido espeso y el exceso de sal.',
      },
      {
        text: 'Cortar la cebolla morada, el tomate y la palta',
        minutes: 5,
        detail:
          'La cebolla bien fina y, si te resulta fuerte, dejala cinco minutos en agua fría. La palta al final, en cubos grandes.',
      },
      {
        text: 'Mezclar todo con jugo de limón y un chorrito de aceite',
        minutes: 3,
        detail:
          'Limón, aceite, sal y orégano. Mejora de un día para el otro, pero si es para llevar sumá la palta recién a la mañana.',
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
        text: 'Hervir el arroz y dejarlo enfriar',
        minutes: 15,
        detail:
          'Dos medidas de agua por una de arroz. Enfrialo esparcido en una fuente y destapado, así no se apelmaza.',
      },
      {
        text: 'Hervir el huevo',
        minutes: 10,
        detail:
          'Diez minutos. Va en la misma hornalla mientras el arroz se hace, o usás uno ya hecho.',
      },
      {
        text: 'Escurrir el atún y el choclo, cortar el morrón',
        minutes: 4,
        detail:
          'El atún bien escurrido, apretándolo contra la lata. El morrón crudo en cubos chicos, que es el que aporta el crujido.',
      },
      {
        text: 'Mezclar todo con la mayonesa',
        minutes: 2,
        detail:
          'Una cucharada alcanza. Aguanta dos días en la heladera y se come frío: no necesita microondas.',
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
        text: 'Saltear la espinaca hasta que reduzca',
        minutes: 3,
        detail:
          'Un puñado grande que se va a reducir a nada. Si es congelada, escurrila apretando fuerte.',
      },
      {
        text: 'Batir los huevos y volcarlos en la sartén',
        minutes: 2,
        detail:
          'Tres huevos con sal. Sartén caliente, fuego medio, y no lo toques los primeros treinta segundos.',
      },
      {
        text: 'Sumar el queso y doblar el omelette cuando cuaje',
        minutes: 5,
        detail:
          'Cuando la superficie deja de estar líquida, queso en una mitad y doblás con una espátula. Un minuto más y sale.',
      },
      {
        text: 'Tostar el pan',
        minutes: 2,
        detail:
          'Dos rebanadas para acompañar. Son la mitad de los carbohidratos del plato.',
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
    prepMinutes: 10, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Merienda de verdad para los días en la calle.',
    prepSteps: ['Hervir huevos', 'Armar el sándwich de la merienda'],
    steps: [
      {
        text: 'Hervir el huevo',
        minutes: 10,
        detail:
          'Diez minutos desde el hervor, o uno de los que ya tenés hechos.',
      },
      {
        text: 'Cortarlo en rodajas junto con el tomate',
        minutes: 2,
        detail:
          'Con el cuchillo mojado el huevo no se desarma. El tomate en rodajas finas y con sal.',
      },
      {
        text: 'Armar con el queso y un poco de orégano',
        minutes: 2,
        detail:
          'Queso contra el pan, huevo y tomate en el medio. Orégano y un hilo de aceite de oliva.',
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
    prepMinutes: 35, satiety: 'potente',
    portable: false, needsCold: false, needsReheat: true, makeNightBefore: false, freezable: true,
    difficulty: 2, favorite: false, tested: true, rating: 4,
    steps: [
      {
        text: 'Precalentar el horno a 200°',
        minutes: 10,
        detail:
          'Con la bandeja adentro: la milanesa apoyada sobre metal caliente se dora abajo y no queda blanda.',
      },
      {
        text: 'Pelar y cortar la calabaza en cubos',
        minutes: 5,
        detail:
          'Cubos parejos de unos tres centímetros para que se cocinen todos igual. Aceite y sal por encima.',
      },
      {
        text: 'Hornear la milanesa y la calabaza juntas',
        minutes: 25,
        detail:
          'Misma bandeja, misma temperatura. A los quince minutos das vuelta la milanesa. La calabaza está cuando se pincha sin esfuerzo.',
      },
      {
        text: 'Pisar la calabaza con un chorrito de aceite',
        minutes: 3,
        detail:
          'Con un tenedor y ahí mismo en la fuente. No hace falta manteca ni leche: la calabaza ya viene cremosa.',
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
        text: 'Cortar el zapallito en cubos y la cebolla fina',
        minutes: 5,
        detail:
          'Dos zapallitos y media cebolla. Cubos chicos: se hacen más rápido y quedan mejor en el revuelto.',
      },
      {
        text: 'Saltearlos hasta que estén blandos',
        minutes: 7,
        detail:
          'Fuego medio y tapado los primeros minutos: el zapallito larga su propia agua y se cocina ahí. Destapá al final para que evapore.',
      },
      {
        text: 'Sumar los huevos batidos y revolver hasta que cuajen',
        minutes: 3,
        detail:
          'Tres huevos. Revolvé enseguida para que se integre todo y sacalo cuando todavía se ve húmedo.',
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
        text: 'Cortar la calabaza y la cebolla',
        minutes: 8,
        detail:
          'Media calabaza y una cebolla. Como después se procesa, los cubos pueden ser grandes y disparejos: nadie se va a enterar.',
      },
      {
        text: 'Hervirlas en el caldo hasta que estén blandas',
        minutes: 18,
        detail:
          'Caldo justo hasta cubrir, no más. Siempre podés agregar después; sacar es imposible.',
      },
      {
        text: 'Procesar hasta que quede crema',
        minutes: 3,
        detail:
          'Con minipimer dentro de la olla y fuera del fuego. Si queda muy espesa, un poco más de caldo caliente.',
      },
      {
        text: 'Servir con el pan y el queso encima',
        minutes: 1,
        detail:
          'El pan es lo que la convierte en una cena de verdad. El queso rallado o en cubitos se derrite solo con el calor.',
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
        text: 'Calentar la salsa a fuego bajo',
        minutes: 8,
        detail:
          'Si es de lata, un chorro de aceite, sal y orégano le cambian la cara. Fuego bajo mientras esperás el agua.',
      },
      {
        text: 'Hervir los fideos según el paquete',
        minutes: 10,
        detail:
          'Bastante agua y sal cuando rompe el hervor. Un minuto menos de lo que dice el paquete: terminan de hacerse en la salsa.',
      },
      {
        text: 'Escurrir, mezclar con la salsa y sumar el queso',
        minutes: 2,
        detail:
          'Guardá medio vaso del agua de cocción: si la salsa quedó seca, la arregla. El queso al final, fuera del fuego.',
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
        text: 'Precalentar el horno a 200°',
        minutes: 10,
        detail:
          'Mientras calienta armás todo el relleno. La masa puede esperar ya puesta en la tartera.',
      },
      {
        text: 'Batir los huevos y mezclarlos con el jamón y el queso',
        minutes: 5,
        detail:
          'Tres huevos, jamón y queso en cubos y no en fetas: se reparte mejor. Pimienta; sal casi no hace falta.',
      },
      {
        text: 'Volcar sobre la masa y cubrir con la otra tapa',
        minutes: 3,
        detail:
          'Pinchá la base con un tenedor antes de volcar. Cerrá los bordes apretando con los dedos y, si te sobró huevo, pintá la tapa.',
      },
      {
        text: 'Hornear hasta que esté dorada',
        minutes: 25,
        detail:
          'Está cuando la tapa tomó color parejo. Entera son seis porciones: dos cenas y dos almuerzos para llevar.',
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
        text: 'Armar los medallones y salarlos',
        minutes: 5,
        detail:
          'Cien gramos cada uno, aplastados finos y con un hueco en el centro hecho con el pulgar: así no se inflan. Salá recién ahora, no antes.',
      },
      {
        text: 'Cocinarlos a fuego fuerte, cuatro minutos de cada lado',
        minutes: 8,
        detail:
          'Sartén bien caliente y sin tocarlos: la costra es lo que les da gusto. Una sola vuelta.',
      },
      {
        text: 'Sumar el queso arriba y tapar hasta que se derrita',
        minutes: 2,
        detail:
          'Fuego apagado y una tapa encima. El vapor derrite el queso en menos de un minuto.',
      },
      {
        text: 'Tostar el pan y armar con el tomate y la lechuga',
        minutes: 4,
        detail:
          'El pan tostado del lado de adentro aguanta los jugos. Y es casi todo el carbohidrato del plato.',
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
        text: 'Precalentar el horno al máximo',
        minutes: 10,
        detail:
          'Al máximo y con la bandeja adentro, diez minutos como mínimo. Es lo que separa una pizza de una tarta.',
      },
      {
        text: 'Estirar la salsa sobre la masa',
        minutes: 3,
        detail:
          'Poca salsa y hasta dos dedos del borde. De más, la masa queda cruda en el centro.',
      },
      {
        text: 'Cubrir con la muzzarella',
        minutes: 2,
        detail:
          'En rodajas o rallada, sin tapar del todo. El orégano recién al salir: adentro del horno se quema.',
      },
      {
        text: 'Hornear hasta que la muzzarella burbujee',
        minutes: 12,
        detail:
          'Abajo del todo si querés la base crocante. Está cuando el queso hace globitos y los bordes están dorados.',
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
    prepMinutes: 10, satiety: 'normal',
    portable: false, needsCold: false, needsReheat: false, makeNightBefore: false, freezable: false,
    difficulty: 1, favorite: false, tested: true, rating: 4,
    notes: 'Cena de las noches en que llegás tarde y no querés cocinar.',
    steps: [
      {
        text: 'Hacer los huevos a la plancha o revueltos',
        minutes: 5,
        detail:
          'Uno o dos. Si van a la plancha, dejá la yema firme: cortada moja todo el pan.',
      },
      {
        text: 'Armar el sándwich con el jamón y el queso',
        minutes: 2,
        detail:
          'Queso abajo y arriba, jamón y huevo en el medio: el queso derretido es lo que lo mantiene cerrado.',
      },
      {
        text: 'Tostarlo hasta que el queso se derrita',
        minutes: 4,
        detail:
          'En sandwichera, o en una sartén apretándolo con una cacerola encima. Cuatro minutos alcanzan.',
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
    prepMinutes: 25, satiety: 'potente',
    portable: true, needsCold: true, needsReheat: false, makeNightBefore: true, freezable: true,
    difficulty: 2, favorite: false, tested: true, rating: 5,
    notes: 'Se hacen la noche anterior y rinden dos días.',
    prepSteps: ['Hacer panqueques', 'Porcionar en tuppers'],
    steps: [
      {
        text: 'Batir la harina con los huevos y la leche hasta que no queden grumos',
        minutes: 5,
        detail:
          'Una taza de harina, dos huevos y dos tazas de leche. Empezá con poca leche y sumá de a poco: los grumos se van así, no batiendo más fuerte.',
      },
      {
        text: 'Dejar reposar la mezcla',
        minutes: 10,
        detail:
          'Diez minutos afuera de la heladera. La harina se hidrata y salen más tiernos. Este rato no estás haciendo nada: aprovechalo.',
      },
      {
        text: 'Hacer los panqueques de a uno en sartén caliente',
        minutes: 12,
        detail:
          'Sartén caliente apenas aceitada, un cucharón por panqueque, y girás la sartén para repartir. Se dan vuelta cuando los bordes se despegan solos. Salen seis u ocho.',
      },
      {
        text: 'Rellenar con el queso untable y la mermelada',
        minutes: 3,
        detail:
          'Untás y doblás en cuatro, o enrollás. Fríos al otro día siguen buenos: son la merienda del día siguiente.',
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
        text: 'Armar el tostado con el jamón y el queso',
        minutes: 2,
        detail:
          'Una feta de cada uno. Con pan de molde aguanta el viaje mejor que con pan francés.',
      },
      {
        text: 'Tostarlo hasta que el queso se derrita',
        minutes: 4,
        detail:
          'Sandwichera, o sartén con peso encima. El queso derretido lo sella y no se desarma en la mochila.',
      },
      {
        text: 'Envolverlo en papel manteca',
        minutes: 1,
        detail:
          'Papel, no film: el film lo transpira y a las dos horas está blando. Dejalo enfriar un minuto antes de envolver.',
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
        text: 'Cortar una porción de la tortilla del día anterior',
        minutes: 2,
        detail:
          'Fría y de la heladera está perfecta: para esto, la tortilla del día anterior es mejor que la recién hecha.',
      },
      {
        text: 'Tostar el pan',
        minutes: 3,
        detail:
          'Tostado firme: tiene que aguantar una porción con peso.',
      },
      {
        text: 'Armar el sándwich y envolverlo',
        minutes: 2,
        detail:
          'Un poco de mayonesa o mostaza si querés. Envuelto en papel manteca llega entero al mediodía.',
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
        text: 'Usar un huevo duro de los que dejaste hechos',
        minutes: 1,
        detail:
          'Acá está la gracia: con huevos duros en la heladera esto son cinco minutos. Sin ellos, quince.',
      },
      {
        text: 'Cortarlo en rodajas junto con el tomate',
        minutes: 3,
        detail:
          'Cuchillo mojado para el huevo. El tomate sin semillas y secado con papel, o el pan llega mojado.',
      },
      {
        text: 'Armar el sándwich con el queso y envolverlo',
        minutes: 3,
        detail:
          'Queso contra las dos tapas de pan y el resto en el medio. Papel manteca y listo.',
      },
    ],
  }),
]
