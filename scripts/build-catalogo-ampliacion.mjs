import { readFileSync, writeFileSync } from 'node:fs'

const input = readFileSync('data/catalogo/nuevas.tsv', 'utf8').split('\n').filter((line) => line && !line.startsWith('#'))
const refs = JSON.parse(readFileSync('data/nutrition/sara2.json', 'utf8'))
const unitGrams = { huevo: 50, pan: 30, 'pan integral': 30, 'pan de miga': 25,
  'tortilla de trigo': 50, 'masa de tarta': 250, 'masa de pizza': 300,
  'tapas de empanada': 35, limón: 60 }
const methodSource = {
  tarta: 'https://cocinerosargentinos.com/recetas/vegetariano/tarta-de-zapallitos-y-choclo',
  empanada: 'https://www.argentina.gob.ar/alimentarsaberes/acocinar',
  guiso: 'https://www.argentina.gob.ar/node/213611',
  sopa: 'https://www.argentina.gob.ar/node/213612',
  ensalada: 'https://www.argentina.gob.ar/node/181869',
  milanesa: 'https://cocinerosargentinos.com/recetas/vegetariano/milanesas-de-berenjena',
  budin: 'https://www.argentina.gob.ar/node/213612',
  default: 'https://www.paulinacocina.net/viandas-saludables/13747',
}
export const prep = (method, name, items) => {
  const has = (s) => items.some((x) => x.item === s)
  const starch = items.filter((x) => ['arroz','fideos','papa','batata','polenta','ñoquis','ravioles'].includes(x.item)).map((x) => x.item).join(' y ')
  const protein = items.filter((x) => ['pollo','cerdo','lomo','carne picada','merluza','atún'].includes(x.item)).map((x) => x.item).join(' y ')
  const vegetables = items.filter((x) => ['cebolla','morrón','zanahoria','zapallito','berenjena','tomate','calabaza','batata','papa','espinaca','acelga','brócoli','repollo'].includes(x.item)).map((x) => x.item).join(', ')
  const pre = `Pesá los ingredientes según la lista; lavá y cortá ${vegetables || 'la fruta o las verduras'} cuando corresponda.`
  const steps = {
    simple: [pre, 'Dividí los ingredientes medidos en las porciones indicadas y combiná justo antes de comer.', 'Si hay lácteos o fruta cortada, conservá en heladera y transportá con frío.'],
    bebida: [pre, 'Prepará la infusión o mezclá la fruta con el líquido indicado; serví la cantidad de la lista.', 'Si lleva leche o fruta licuada, refrigerá lo que no consumas enseguida.'],
    frita: [pre, 'Uní harina, grasa y agua de a poco hasta formar una masa suave; reposá 15 min.', 'Dividí en discos, hacé un pequeño corte central y freí en aceite caliente de ambos lados hasta dorar. Escurrí y repartí.'],
    parrilla: [pre, 'Calentá bien la parrilla o plancha. Cociná la carne o chorizo de ambos lados hasta que esté bien cocido.', 'Prepará la ensalada o el pan según los ingredientes y serví dividido en porciones.'],
    pancho: [pre, 'Calentá las salchichas en agua a hervor suave 5 min hasta que estén bien calientes.', 'Abrí y calentá los panes; repartí salchichas y acompañamientos según la lista.'],
    arroz: [pre, 'Herví el arroz en agua hasta que esté tierno; escurrí y enfriá si se comerá frío.', 'Prepará y cortá los acompañamientos; mezclá con el arroz y dividí en las porciones indicadas.'],
    polenta: [pre, 'Herví agua según las instrucciones de la polenta y agregala en forma de lluvia, revolviendo para que no queden grumos.', 'Cociná la salsa por separado, serví la polenta en platos y distribuí salsa y queso medidos.'],
    huevoDuro: [pre, 'Poné los huevos en agua fría, llevá a hervor y cociná 10 min. Enfriá bajo agua y pelá.', 'Acompañá con el pan o las verduras medidos en la lista.'],
    huevoFrito: [pre, 'Calentá una sartén antiadherente con apenas aceite; cascá los huevos y cociná hasta que la clara esté firme.', 'Tostá o cortá el pan de la lista y serví enseguida.'],
    omelette: [pre, 'Batí los huevos. Volcá en sartén antiadherente caliente y cociná 2–3 min a fuego medio.', 'Distribuí el queso, doblá a la mitad y cociná hasta que el huevo esté firme. Serví con el pan indicado.'],
    milanesaLista: [pre, 'Calentá el horno a 200 °C. Acomodá las milanesas ya empanadas en placa apenas aceitada.', 'Horneá 20–25 min, girando a mitad; comprobá que la carne esté completamente cocida.', 'Cociná la papa u otra guarnición indicada y repartí milanesas y guarnición entre las porciones.'],
    budinSalado: [pre, 'Cociná y escurrí bien la espinaca. Batí los huevos y mezclá con la harina, el queso y la verdura.', 'Distribuí en moldes individuales apenas aceitados y horneá a 180 °C 20–25 min hasta que el centro esté firme.', 'Dejá entibiar y repartí según el número de porciones.'],
    tortilla: [pre, `Cociná ${vegetables || 'las verduras'} hasta que estén tiernas; escurrí el líquido si lo hay.`, 'Batí los huevos, mezclalos con el relleno y volcá en una sartén apenas aceitada.', 'Cociná a fuego medio y tapado 6–8 min; da vuelta con un plato y cociná otros 5 min hasta que el centro esté firme.'],
    tarta: [pre, `Rehogá ${vegetables || 'el relleno'} y escurrilo; ${has('pollo') ? 'cociná el pollo completamente.' : 'dejá entibiar.'}`, 'Estirá la masa en tartera de 24 cm, pinchá la base y precocinala 8 min a 190 °C.', `Mezclá el relleno con ${[has('huevo') && 'huevo', (has('queso') || has('ricota')) && 'queso o ricota'].filter(Boolean).join(' y ') || 'los demás ingredientes'}; distribuí en la base.`, 'Horneá 25–30 min a 190 °C hasta que la base dore y el relleno esté firme. Entibiá antes de cortar.'],
    empanada: [pre, 'Cociná la cebolla y el relleno en sartén hasta que no quede líquido; dejá enfriar antes de armar.', 'Repartí el relleno en 12 tapas, humedecé los bordes y cerrá con repulgue firme.', 'Acomodá en placa y horneá a 200 °C durante 20–25 min hasta dorar; cada porción son 2 empanadas.'],
    guiso: name.toLowerCase().includes('arroz con leche') ? [pre, 'Poné la leche en una olla con el arroz y la canela; calentá hasta hervor suave.', 'Cociná 25–30 min revolviendo para que no se pegue; agregá azúcar hacia el final.', 'Repartí en porciones y enfriá en heladera.'] : [pre, `Rehogá ${vegetables || 'las verduras firmes'} 5 min en olla amplia; dorá ${protein || 'el relleno'} si corresponde.`, `Sumá ${starch || 'el ingrediente principal'}, ${has('salsa de tomate') ? 'la salsa de tomate y' : ''} agua suficiente para apenas cubrir.`, `Cociná a hervor suave hasta que ${starch || 'las verduras'} esté tierno; incorporá legumbres ya cocidas al final.`, 'Probá la sazón y serví dividido en las porciones indicadas.'],
    sopa: [pre, 'Rehogá la cebolla 4 min. Sumá verduras troceadas y agua hasta apenas cubrir.', 'Cociná a hervor suave 20–25 min; agregá las legumbres ya cocidas o los fideos según su tiempo de cocción.', 'Si es crema, procesá fuera del fuego y agregá leche o queso al final. Dividí en los platos indicados.'],
    pastel: [pre, 'Cociná por separado el relleno con cebolla hasta que no quede líquido y ablandá la cobertura de papa, calabaza o berenjena.', 'Poné el relleno en fuente de 24 × 20 cm, cubrí con el puré o las láminas y distribuí el queso.', 'Horneá a 190 °C durante 20–25 min, hasta gratinar. Dejá reposar 10 min para cortar las porciones.'],
    ensalada: [pre, ...(starch || protein || has('huevo') ? [`Cociná ${starch || protein || 'los huevos'} por separado hasta que esté listo; enfriá rápidamente.`] : []), 'Cortá fruta o verduras según la lista y mezclá los ingredientes; agregá el aderezo al final si corresponde.', 'Dividí en recipientes. Si es vianda, refrigerá de inmediato y mantené frío hasta comer.'],
    sandwich: [pre, ...(protein || has('huevo') || has('milanesa de carne') || has('milanesa de pollo') ? [`Cociná ${protein || (has('huevo') ? 'los huevos' : 'la milanesa')} completamente y dejá enfriar si lo vas a llevar.`] : []), `Tostá ${has('pan') || has('pan integral') || has('pan de miga') ? 'el pan' : 'la base'}; distribuí los ingredientes medidos en partes iguales.`, 'Cerrá o serví abierto según la preparación. Refrigerá si lleva huevo, carne o lácteos.'],
    wrap: [pre, `Cociná ${protein || 'el relleno'} hasta que esté listo; cortá las verduras finas.`, 'Calentá las tortillas 30 segundos por lado sin resecar; distribuí el relleno medido.', 'Doblá los laterales y enrollá firme. Para llevar, envolvé y conservá frío.'],
    hamburguesa: [pre, 'Pisá las legumbres o picá la carne; mezclá con verduras cocidas, huevo y pan rallado según la lista.', 'Formá medallones iguales y dejalos 10 min en heladera para que mantengan la forma.', 'Cociná 5–7 min por lado en sartén o 20 min a 200 °C, hasta que el centro esté bien cocido.'],
    albondiga: [pre, 'Mezclá la proteína o legumbres con huevo y cebolla; formá bolitas del mismo tamaño.', 'Dorá en sartén con poco aceite y agregá la salsa; tapá y cociná a fuego bajo 15–20 min.', 'Cociná la guarnición aparte si corresponde y repartí albóndigas, salsa y guarnición por igual.'],
    milanesa: [pre, 'Si usás berenjena o calabaza, cortá láminas de 1 cm y ablandalas 8 min antes de empanar.', 'Pasá cada pieza por huevo batido y pan rallado; presioná para fijar el rebozado.', 'Horneá sobre placa aceitada a 200 °C 20–25 min, dando vuelta a mitad de cocción; cociná la guarnición aparte.'],
    airfryer: [pre, 'Formá o empaná piezas de tamaño parejo; precalentá la freidora de aire a 190 °C.', 'Acomodá en una sola capa sin amontonar y cociná 12–18 min, dando vuelta a mitad de tiempo.', 'Comprobá que el pollo esté completamente cocido; prepará la guarnición y dividí en porciones.'],
    horno: [pre, `Prepará ${vegetables || 'las verduras'} en trozos parejos y precalentá el horno a 200 °C.`, name.toLowerCase().includes('rellen') ? 'Ablandá las piezas principales, ahuecalas y mezclá su pulpa con el relleno ya cocido; rellená y cubrí con queso.' : `Distribuí la proteína ${protein ? '('+protein+')' : ''} y las verduras en fuente sin amontonar; agregá aceite medido.`, `Horneá ${has('merluza') ? '15–20 min (precociná la papa aparte si la hay)' : '25–35 min'}, hasta que la proteína esté cocida y las verduras tiernas.`, 'Dividí en porciones iguales antes de guardar o servir.'],
    pasta: [pre, 'Herví la pasta en abundante agua según el paquete y reservá media taza del agua de cocción.', `Rehogá el relleno ${protein || vegetables || 'de la salsa'} y sumá tomate o lácteos según los ingredientes.`, 'Mezclá la pasta con la salsa; ajustá textura con un poco del agua reservada y repartí en platos.'],
    risotto: [pre, 'Rehogá cebolla y el ingrediente principal; agregá arroz crudo y mezclá 2 min.', 'Sumá agua o caldo caliente de a un cucharón, revolviendo a menudo durante 18–22 min.', 'Apagá cuando el grano esté tierno y cremoso; incorporá queso, reposá 2 min y serví.'],
    salteado: [pre, `Cociná ${starch || 'la guarnición'} por separado si corresponde.`, `En sartén caliente cociná ${protein || 'el huevo o las verduras'} hasta su punto seguro; reservá.`, 'Salteá verduras firmes primero y blandas después; reuní todo, mezclá 2 min y repartí.'],
    pizza: [pre, 'Precalentá el horno fuerte a 220 °C con la placa adentro.', name.toLowerCase().includes('calzone') ? 'Extendé la masa, poné el relleno frío en una mitad, doblá y sellá el borde.' : 'Extendé la masa, distribuí salsa y relleno sin sobrecargar; agregá queso.', 'Horneá 15–20 min hasta base dorada y queso fundido. Cortá las porciones indicadas.'],
    budin: [pre, 'Precalentá el horno a 180 °C y forrá un molde de budín o moldes individuales.', 'Mezclá ingredientes húmedos por un lado y harina por otro; uní sin batir de más.', 'Volcá en el molde y horneá 30–40 min (individuales: 20–25); un palillo debe salir sin masa cruda.', 'Enfriá sobre rejilla y cortá en el número de porciones indicado.'],
    panqueque: [pre, 'Batí huevos, leche y harina hasta lograr una mezcla fluida sin grumos; dejá reposar 5 min.', 'Verté una capa fina en sartén apenas aceitada y cociná 1–2 min de cada lado.', 'Prepará la fruta o el relleno y distribuí parejo sobre los panqueques terminados.'],
    galletita: [pre, 'Precalentá el horno a 180 °C. Mezclá ingredientes secos y luego los húmedos hasta formar masa.', 'Formá galletitas del mismo tamaño sobre placa con papel o aceitada, separadas entre sí.', 'Horneá 12–16 min hasta bordes apenas dorados; dejá enfriar completamente antes de guardar.'],
    frio: [pre, 'Lavá y cortá la fruta u otros ingredientes; medí cada cantidad de la lista.', 'Repartí en recipientes iguales, agregando lo crocante al momento de comer.', name.toLowerCase().includes('congelado') ? 'Poné las porciones en moldes pequeños y congelá al menos 2 horas; mantené congelado hasta servir.' : 'Tapá y conservá en heladera. Para llevar, usá lonchera fría.'],
    barrita: [pre, 'Mezclá avena y frutos secos con la miel, banana o pasta indicada hasta compactar.', 'Presioná fuerte en molde pequeño forrado, de 2 cm de espesor.', 'Enfriá al menos 2 h y cortá en partes iguales; envolvé cada barra.'],
    pochoclo: [pre, 'Calentá aceite medido en olla con tapa y agregá los granos en una sola capa.', 'Tapá y agitá cada tanto; apagá al espaciarse los estallidos.', 'Dejá enfriar, mezclá con maní y dividí en bolsitas del mismo tamaño.'],
    chipa: [pre, 'Precalentá el horno a 200 °C. Mezclá almidón, queso rallado, huevo y leche hasta obtener masa suave.', 'Formá 12 bolitas parejas y ponelas separadas en placa.', 'Horneá 15–20 min hasta que inflen y se doren levemente; serví tibios.'],
    flan: [pre, 'Calentá la leche sin hervir; batí huevos con azúcar y mezclá lentamente.', 'Volcá en seis moldes y colocá en fuente con agua caliente hasta media altura.', 'Cociná a baño María a 160 °C 35–40 min hasta cuajar; enfriá y refrigerá.'],
    canelon: [pre, 'Batí harina, huevos y leche; cociná panqueques finos 1–2 min por lado.', 'Cociná y escurrí el relleno, repartilo en los panqueques y enrollá.', 'Poné salsa en la fuente, acomodá los canelones, cubrí con más salsa y horneá 20 min a 190 °C.'],
    croqueta: [pre, 'Cociná arroz o verdura principal y dejá entibiar; mezclá con huevo, queso y pan rallado.', 'Moldeá croquetas iguales con las manos húmedas.', 'Horneá a 200 °C 20–25 min, girando a mitad de cocción, hasta dorar.'],
    ñoqui: [pre, 'Cociná la papa o calabaza, escurrí muy bien y hacé un puré seco.', 'Mezclá con huevo y harina sin amasar en exceso; formá rollitos y cortá ñoquis.', 'Herví por tandas hasta que floten, 2–3 min; prepará la salsa y serví dividido en porciones.'],
    pastafrola: [pre, 'Batí manteca blanda con azúcar; agregá los huevos y después la harina hasta formar una masa tierna. Enfriá 15 min.', 'Reservá un cuarto de la masa. Estirá el resto en tartera de 24 cm; ablandá el dulce de membrillo con unas cucharadas de agua caliente y extendelo encima.', 'Formá tiras con la masa reservada y cruzalas sobre el dulce. Horneá 30–35 min a 180 °C; enfriá y cortá 12 porciones.'],
  }
  const base = steps[method]
  if (!base) throw Error(`Método sin instrucciones: ${method}`)
  return base.map((text) => ({ text }))
}
const slug = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const output = input.map((line, index) => {
  const [name, category, method, ingredients, total, servings, carry] = line.split('|')
  if (!name || !category || !method || !ingredients || !total || !servings || !carry) throw Error(`Línea ${index + 1} incompleta`)
  const items = ingredients.split(';').map((spec) => {
    const [item, qty, unit] = spec.split(':')
    if (!refs[item] || !['g','ml','u'].includes(unit) || !(Number(qty) > 0)) throw Error(`${name}: ingrediente inválido: ${spec}`)
    return { item, qty: Number(qty), unit }
  })
  const s = Number(servings)
  const nutrition = ['kcal','protein','fat','carbs','fiber'].reduce((acc, field) => {
    const total = items.reduce((n, i) => n + refs[i.item][field] * i.qty * (i.unit === 'u' ? (unitGrams[i.item] ?? 100) / 100 : 0.01), 0)
    acc[field] = Math.round(total / s * 10) / 10
    return acc
  }, {})
  const portable = carry === 'si'
  const cook = !['ensalada','frio','sandwich','wrap','barrita'].includes(method)
  const source = methodSource[method] ?? methodSource.default
  const id = slug(name)
  const starts = ['desayuno','merienda','snack'].includes(category)
  return {
    slug: id, name, category, momentos: starts ? (category === 'snack' ? ['snack'] : ['desayuno','merienda']) : ['almuerzo','cena'],
    origen: 'casera', sabor: starts ? (['budin','galletita','panqueque','frio','flan','barrita'].includes(method) ? 'dulce' : 'salado') : 'salado',
    description: `${name} con ${items.slice(0, 3).map((i) => i.item).join(', ')}; rinde ${s} porciones.`,
    portions: [{ label: `1 de ${s} porciones`, carbs: Math.round(nutrition.carbs), grams: null, default: true }],
    tags: [portable ? 'para llevar' : 'en casa', Number(total) <= 30 ? 'rápido' : 'casero'],
    satiety: starts ? 'normal' : 'potente', prepType: cook ? 'cook' : 'assemble',
    activeMinutes: Math.min(Number(total), cook ? 25 : 15), totalMinutes: method === 'barrita' || name.toLowerCase().includes('congelado') ? Number(total) + 120 : Number(total),
    cookMinutes: cook ? Math.max(0, Number(total) - Math.min(Number(total), 25)) : 0,
    rinde: `${s} porciones`, servings: s, esBebida: false, mainIngredient: items[0].item, everyday: true,
    addedSugar: items.some((i) => i.item === 'azúcar' || i.item === 'miel'),
    frequency: items.some((i) => i.item === 'azúcar') ? 'ocasional' : 'habitual', difficulty: Number(total) > 50 ? 2 : 1,
    portable, needsCold: portable && items.some((i) => ['pollo','carne picada','cerdo','merluza','atún','huevo','leche','queso','ricota','yogur natural'].includes(i.item)),
    needsReheat: portable && cook && !['budin','galletita','chipa','empanada','tarta'].includes(method),
    makeNightBefore: portable && Number(total) > 20, freezable: ['guiso','tarta','empanada','albondiga','hamburguesa','pastel'].includes(method),
    handheld: ['sandwich','wrap','empanada','galletita','barrita','chipa'].includes(method), buyOutside: false,
    venues: [], priceLevel: items.some((i) => ['lomo','merluza','sardina','muzzarella','nuez'].includes(i.item)) ? 2 : 1, drink: null, items, notes: '', method,
    equipment: method === 'airfryer' ? 'freidora de aire' : ['horno','tarta','pizza','empanada','budin','galletita','pastel','milanesa','chipa','flan','canelon','pastafrola'].includes(method) ? 'horno' : ['frio','ensalada','barrita','sandwich','wrap'].includes(method) ? 'sin cocción final' : 'hornalla y sartén/olla',
    storage: portable ? 'Hasta 2 días refrigerado en recipiente cerrado; transportar con frío si lleva ingredientes perecederos.' : 'Consumir recién hecho o refrigerar hasta 2 días.',
    reheat: portable && cook ? 'Recalentar hasta que esté bien caliente en horno o sartén; no dejar a temperatura ambiente.' : null,
    nutrition, nutritionSource: 'SARA 2 (Ministerio de Salud de Argentina), valores de ingredientes por 100 g; masas caseras estimadas y porciones divididas.',
    researchSource: source, steps: prep(method, name, items),
  }
})
const ids = new Set()
for (const x of output) { if (ids.has(x.slug)) throw Error(`Duplicado: ${x.slug}`); ids.add(x.slug) }
writeFileSync('data/catalogo/ampliacion.json', JSON.stringify(output, null, 2) + '\n')
console.log(`${output.length} recetas nuevas, completas y calculadas por porción`)
