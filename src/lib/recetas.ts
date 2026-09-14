import type { Step } from './types'

/* ------------------------------------------------------------------
   LAS RECETAS

   El catálogo vive en JSON porque es data: números, porciones, etiquetas.
   Esto no lo es. Son instrucciones escritas para alguien que nunca hizo
   el plato, y la prosa se lee mejor acá que escapada dentro de un JSON.

   La clave es el slug del catálogo. Una comida sin receta simplemente no
   aparece en este archivo: la pantalla muestra el detalle igual, sin los
   pasos.

   Cómo se escriben: `text` es lo que hacés, en una línea y con el número
   adentro —«6 cucharadas», no «un poco»—. `detail` es lo que nadie te
   dice y por eso te sale mal la primera vez. `minutes` son los de ese
   paso, y pueden solaparse: el horno calienta mientras cortás.

   Dos de las que había se cayeron acá: una pedía que hubiera sobrado
   tortilla del día anterior y la otra era la misma receta escrita dos
   veces.
   ------------------------------------------------------------------ */

export const RECETAS: Record<string, Step[]> = {
  'avena-nocturna': [
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
  'sandwich-completo': [
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
  'budincitos-huevo': [
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
  'tortilla-papa': [
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
  'huevos-revueltos-tostadas': [
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
  'huevos-duros-snack': [
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
  'sandwich-chico': [
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
  'arroz-con-pollo': [
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
  'wrap-pollo': [
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
  'ensalada-lentejas': [
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
  'arroz-atun': [
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
  'omelette-queso': [
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
  'sandwich-merienda-llevar': [
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
  'milanesa-pure': [
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
  'revuelto-zapallitos': [
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
  'sopa-calabaza': [
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
  'fideos-tuco': [
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
  'tarta-jamon-queso': [
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
  'hamburguesa-casera': [
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
  'pizza-casera': [
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
  'sandwich-cena-rapido': [
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
  'panqueques-dulce': [
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
      text: 'Untá con una cucharada de dulce de leche y doblá',
      minutes: 2,
      detail:
        'Una cucharada por panqueque y no más: son once gramos cada una y se suman sin que te des cuenta. Enrollados o doblados en cuatro, y fríos al otro día siguen buenos.',
    },
  ],
  'tostado-jamon-queso': [
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
}
