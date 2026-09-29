/* Corrige frases de plantilla que no describen los ingredientes reales.
   Las técnicas compartidas (hornear una tarta, hervir pasta) se mantienen. */
import { readFileSync, writeFileSync } from 'node:fs'
const addedPath = 'data/catalogo/ampliacion.json'
const legacyPath = 'data/catalogo/legacy-enrichment.json'
const added = JSON.parse(readFileSync(addedPath, 'utf8'))
const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'))
const old = JSON.parse(readFileSync('data/catalogo/v1.json', 'utf8'))
const byId = new Map(old.map((r) => [r.slug, r]))
const produce = new Set('tomate cebolla zanahoria papa batata calabaza zapallito berenjena espinaca acelga brócoli morrón pepino lechuga repollo remolacha champiñones frutilla manzana pera banana durazno naranja limón choclo palta puerro'.split(' '))
const perishable = new Set(['huevo','pollo','cerdo','lomo','carne picada','atún','merluza','jamón','queso','queso untable','ricota','muzzarella','yogur natural','leche'])
let changed = 0
for (const recipe of [...added, ...Object.entries(legacy).map(([slug, r]) => ({ ...byId.get(slug), ...r, slug, legacy: true }))]) {
  if (!recipe.steps?.length) continue
  const names = recipe.items.map((i) => i.item)
  const has = (x) => names.includes(x)
  const veggies = names.filter((x) => produce.has(x))
  const protein = names.filter((x) => ['pollo','cerdo','lomo','vacío','carne picada','merluza','atún'].includes(x))
  const original = recipe.steps.map((s) => s.text)
  let steps = original.map((text) => {
    if (text.includes('si usás legumbres ya cocidas, calentalas y pisalas')) return text.replace('; si usás legumbres ya cocidas, calentalas y pisalas', '')
    if (text.startsWith('Medí los ingredientes. Lavá ')) return text.replaceAll('picalo fino', 'picá fino').replaceAll('cortalo en cubos chicos', 'cortá en cubos chicos')
    if (text.includes('Cortá fruta o verduras según la lista')) return text.replace('Cortá fruta o verduras según la lista', `Lavá y cortá ${veggies.join(', ')}`)
    if (/^Medí los ingredientes\. Lavá .* y cortá en trozos adecuados/.test(text))
      return `Medí los ingredientes. ${veggies.map((x) => `Lavá ${x} y ${['papa','batata','calabaza','zanahoria','berenjena','zapallito','tomate','manzana','pera','banana'].includes(x) ? 'cortá en cubos chicos' : 'picá fino'}`).join('; ')}.`
    if (text.startsWith('Pesá los ingredientes según la lista; lavá y cortá'))
      return veggies.length ? `Medí los ingredientes. Lavá ${veggies.join(', ')} y cortá en trozos adecuados para la preparación.` : 'Medí cada ingrediente antes de empezar.'
    if (text === 'Cerrá o serví abierto según la preparación. Refrigerá si lleva huevo, carne o lácteos.')
      return `${/sándwich|tostado|pan de miga/i.test(recipe.name) ? 'Cerrá el sándwich y cortalo en porciones.' : 'Serví sobre el pan tostado.'}${names.some((x) => perishable.has(x)) ? ' Si lo llevás, guardalo tapado y con frío.' : ' Consumí recién armado para conservar la textura.'}`
    if (text === 'Tostá el pan; distribuí los ingredientes medidos en partes iguales.') {
      const bread = names.find((x) => /pan/.test(x)) ?? 'pan'
      const filling = names.filter((x) => x !== bread)
      return `Tostá ${bread}${/pan de miga/.test(bread) ? ' sólo si lo preferís' : ''}; distribuí ${filling.join(', ')} en ${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'}.`
    }
    if (text === 'Dividí los ingredientes medidos en las porciones indicadas y combiná justo antes de comer.')
      return `Dividí ${names.join(', ')} en ${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'}; combiná al servir.`
    if (text === 'Si hay lácteos o fruta cortada, conservá en heladera y transportá con frío.')
      return names.some((x) => perishable.has(x)) || veggies.some((x) => ['frutilla','manzana','pera','banana','durazno'].includes(x))
        ? 'Guardá en heladera en recipiente cerrado y transportá con frío.' : 'Guardá en recipiente cerrado hasta consumir.'
    if (text === 'Si lleva leche o fruta licuada, refrigerá lo que no consumas enseguida.')
      return has('leche') || has('yogur natural') || veggies.some((x) => ['frutilla','banana','manzana','pera'].includes(x)) ? 'Refrigerá lo que no consumas enseguida.' : 'Serví recién preparado.'
    if (text === 'Prepará la infusión o mezclá la fruta con el líquido indicado; serví la cantidad de la lista.')
      return `Prepará ${names.join(', ')} en la cantidad indicada en ingredientes; serví ${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'}.`
    if (text === 'Distribuí el ingrediente principal y las verduras en fuente sin amontonar.')
      return `Distribuí ${names.filter((x) => !['sal','aceite','aceite de oliva','orégano'].includes(x)).join(', ')} en una fuente sin amontonar.`
    if (text === 'Horneá 25–35 min, hasta que la proteína esté cocida y las verduras tiernas.')
      return protein.length ? `Horneá a 200 °C hasta que ${protein.join(' y ')} esté completamente cocido y las verduras tiernas; controlá desde los 25 minutos.` : `Horneá a 200 °C hasta que ${veggies.join(' y ') || 'la preparación'} esté tierna y la superficie dorada; controlá desde los 20 minutos.`
    if (text === 'Dividí en porciones iguales antes de guardar o servir.')
      return `Dividí en ${recipe.servings} ${recipe.servings === 1 ? 'porción' : 'porciones'} antes de guardar o servir.`
    if (text === 'Prepará la fruta o el relleno y distribuí parejo sobre los panqueques terminados.')
      return `Cortá ${veggies.join(', ') || 'el relleno'} y repartí con ${names.filter((x) => ['ricota','yogur natural','canela'].includes(x)).join(', ') || 'los demás ingredientes'} sobre los panqueques.`
    if (text.includes('el ingrediente principal')) return text.replace('el ingrediente principal', protein[0] ?? (has('calabaza') ? 'calabaza' : has('champiñones') ? 'champiñones' : names[0]))
    if (text.includes('prepará los demás ingredientes según la lista')) return text.replace('prepará los demás ingredientes según la lista', `escurrí y prepará ${names.filter((x) => !veggies.includes(x)).join(', ')}`)
    if (/Cociná .* hasta que esté listo; cortá las verduras finas/.test(text)) {
      const filling = protein[0] ?? (has('garbanzos') ? 'garbanzos' : 'berenjena')
      return filling === 'atún' ? 'Escurrí el atún de lata. Herví el huevo 10 minutos, enfriá y cortá tomate en cubos.' : filling === 'garbanzos' ? `Pisá los garbanzos cocidos y cortá ${veggies.join(', ')} fino.` : `Cortá ${veggies.join(', ')} fino y cociná ${filling} en sartén hasta que esté completamente cocido.`
    }
    if (text.startsWith('Pisá las legumbres o picá la carne;')) return `Pisá o picá ${protein[0] ?? names.find((x) => /lentejas|garbanzos|porotos/.test(x)) ?? names[0]}; mezclá con ${names.filter((x) => !['aceite','sal','pimienta'].includes(x) && x !== protein[0]).join(', ')} y formá medallones parejos.`
    if (text.startsWith('Mezclá la proteína o legumbres')) return `Mezclá ${protein[0] ?? 'lentejas cocidas'} con ${names.filter((x) => ['huevo','cebolla','zanahoria'].includes(x)).join(', ')} y formá albóndigas parejas.`
    if (text.includes('la guarnición')) return text.replace('la guarnición', names.find((x) => ['arroz','papa','batata','calabaza','lechuga','tomate'].includes(x)) ?? 'la ensalada').replace('cociná papa aparte', 'herví papa en cubos hasta que esté tierna')
    if (text.includes('Comprobá que el pollo esté completamente cocido') && !has('pollo')) return `Cociná los bocaditos hasta que estén dorados y firmes en el centro; repartí en ${recipe.servings} porciones.`
    if (text.includes('precociná la papa aparte si la hay')) return text.replace('(precociná la papa aparte si la hay)', has('papa') ? '(herví la papa en cubos 10 minutos antes)' : '').replace('la proteína', protein[0] ?? 'la merluza')
    if (text.includes('si corresponde')) return text.replace('dorá el relleno si corresponde', `incorporá ${protein[0] ?? (has('lentejas') ? 'lentejas cocidas' : 'garbanzos cocidos')}`).replace('dorá pollo si corresponde', 'dorá el pollo hasta que tome color').replace('agregá el aderezo al final si corresponde', `sumá ${names.filter((x) => /aceite|limón|vinagre/.test(x)).join(' y ') || 'los ingredientes restantes'} al final`)
    if (text.includes('Cortá fruta o verduras según la lista')) return text.replace('Cortá fruta o verduras según la lista', `Lavá y cortá ${veggies.join(', ')}`)
    if (text.includes('Cociná ') && text.includes(' por separado hasta que esté listo')) return text.replace('Cociná papa por separado hasta que esté listo', 'Herví la papa en cubos hasta que esté tierna').replace('Cociná los huevos por separado hasta que esté listo', 'Herví los huevos 10 minutos').replace('Cociná pollo por separado hasta que esté listo', 'Cociná el pollo en sartén hasta que esté completamente cocido')
    if (text.includes('según la lista')) return text.replace('según la lista', `con ${names.join(', ')}`)
    return text
  })

  const overrides = {
    'waffles-caseros-con-yogur-y-pera': [
      'Batí huevo y leche con harina hasta que no queden grumos. Lavá y cortá la pera.',
      'Calentá y aceità apenas la waflera; verté la mezcla en tandas sin llenar hasta el borde.',
      'Cociná cada waffle hasta que esté dorado y se desprenda fácilmente; serví con yogur y pera.',
    ],
    'polenta-gratinada-con-hongos': [
      'Cortá los champiñones y saltealos en sartén hasta que pierdan el líquido.',
      'Calentá la leche y añadí la polenta en forma de lluvia, revolviendo hasta que espese según el tiempo del envase.',
      'Pasá la polenta a una fuente; poné encima champiñones y muzzarella.',
      'Gratiná en horno a 200 °C unos 10 minutos, hasta que se derrita el queso. Dividí en las porciones indicadas.',
    ],
    'revuelto-de-huevo-y-arvejas-sobre-pan': [
      'Tostá el pan. Calentá las arvejas en sartén y batí los huevos.',
      'Agregá los huevos a la sartén, revolvé a fuego medio hasta que cuajen por completo y sumá el queso.',
      'Serví el revuelto sobre el pan tostado.',
    ],
    'pollo-al-limon-con-batatas': [
      'Cortá la batata en cubos chicos y la cebolla en tiras. Cortá el pollo en trozos parejos.',
      'Cociná la batata en sartén tapada con un poco de agua hasta que esté tierna; retirala.',
      'En la misma sartén rehogá cebolla y dorá el pollo. Añadí jugo de limón y cociná hasta que el pollo esté completamente cocido.',
      'Mezclá con la batata y repartí en las porciones indicadas. Para vianda, enfriá y guardá con frío.',
    ],
  }
  if (overrides[recipe.slug]) steps = overrides[recipe.slug]
  if (steps.join('\n') === original.join('\n')) continue
  changed++
  if (recipe.legacy) legacy[recipe.slug].steps = steps.map((text) => ({ text }))
  else recipe.steps = steps.map((text) => ({ text }))
}
writeFileSync(addedPath, JSON.stringify(added, null, 2) + '\n')
writeFileSync(legacyPath, JSON.stringify(legacy, null, 2) + '\n')
console.log(`Fichas con pasos aclarados: ${changed}`)
