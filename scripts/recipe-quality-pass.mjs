/* Pasada de calidad puntual sobre familias que heredaron instrucciones
   genéricas. Idempotente: sólo reemplaza el texto problemático original. */
import { readFileSync, writeFileSync } from 'node:fs'
const path = 'data/catalogo/ampliacion.json'
const recipes = JSON.parse(readFileSync(path, 'utf8'))
let fixed = 0
for (const r of recipes) {
  const ingredients = r.items.map((i) => i.item)
  const has = (x) => ingredients.includes(x)
  const original = r.steps.map((s) => s.text).join(' ')
  let steps

  if (original.includes('legumbres ya cocidas') && r.prepType === 'cook') {
    const legumes = ingredients.filter((x) => /cocid/.test(x))
    const proteins = ingredients.filter((x) => ['pollo','cerdo','lomo','carne picada','chorizo','merluza'].includes(x))
    const starches = ingredients.filter((x) => ['arroz','fideos','papa','batata','polenta'].includes(x))
    const vegetables = ingredients.filter((x) => ![...legumes,...proteins,...starches,'salsa de tomate','leche','queso','queso rallado'].includes(x))
    steps = [
      `Lavá y cortá ${vegetables.join(', ') || 'las verduras'} en trozos parejos. Medí el resto de los ingredientes de la lista.`,
      `En una olla, rehogá ${has('cebolla') ? 'la cebolla' : 'las verduras'} y agregá ${vegetables.filter((x) => x !== 'cebolla').join(', ') || 'las demás verduras'}. ${proteins.filter((x) => x !== 'merluza').length ? `Sumá ${proteins.filter((x) => x !== 'merluza').join(' y ')} y cociná bien antes de incorporar el líquido.` : ''}`,
      `Sumá ${[...starches,...(has('salsa de tomate') ? ['salsa de tomate'] : [])].join(', ') || 'los ingredientes restantes'} y agua suficiente para cubrir apenas. Cociná a hervor suave, revolviendo de vez en cuando, hasta que los ingredientes crudos estén tiernos.`,
      `${legumes.length ? `Incorporá ${legumes.join(' y ')} ya cocidos y calentá 5 minutos más. ` : ''}${has('merluza') ? 'Agregá la merluza hacia el final y cociná suavemente hasta que quede opaca y se desmenuce fácilmente. ' : ''}Repartí en ${r.servings} porciones; refrigerá pronto lo que guardes.`,
    ]
    if (r.slug === 'sopa-de-pollo-con-fideos') steps = [
      'Lavá y cortá zanahoria, cebolla y zapallito; cortá el pollo en trozos pequeños.',
      'Rehogá la cebolla, añadí pollo y cociná hasta que cambie de color. Sumá las verduras y agua suficiente para cubrirlas generosamente.',
      'Herví suavemente unos 15 minutos; agregá los fideos y cociná el tiempo indicado en el envase, hasta que estén tiernos y el pollo completamente cocido.',
      `Repartí en ${r.servings} platos. Enfriá y refrigerá pronto las porciones que guardes.`,
    ]
    if (r.slug === 'crema-de-zanahoria-y-calabaza' || r.slug === 'crema-de-brocoli-con-queso' || r.slug === 'sopa-de-batata-y-puerro') steps = [
      `Lavá y cortá ${vegetables.join(', ')}${starches.length ? ', ' + starches.join(', ') : ''} en trozos similares.`,
      'Cociná las verduras en una olla con agua hasta que estén tiernas; usá sólo el líquido necesario para cubrirlas.',
      `Procesá fuera del fuego. Incorporá ${[...ingredients.filter((x) => ['leche','queso'].includes(x))].join(' y ')} y calentá suavemente sin dejar que hierva fuerte.`,
      `Serví en ${r.servings} porciones; enfriá y refrigerá pronto lo que guardes.`,
    ]
  }

  if (original.includes('Cortá fruta o verduras según la lista')) {
    const cooked = ingredients.filter((x) => ['arroz','fideos','papa','batata','calabaza','remolacha','brócoli','huevo','pollo','merluza'].includes(x))
    const raw = ingredients.filter((x) => ![...cooked,'garbanzos cocidos','lentejas cocidas','porotos cocidos','atún','sardina','aceite de oliva','yogur natural','ricota','queso','muzzarella','nuez'].includes(x))
    const cooking = cooked.map((x) => ['arroz','fideos'].includes(x) ? `herví ${x} según el envase` : x === 'huevo' ? 'herví el huevo 10 minutos' : ['pollo','merluza'].includes(x) ? `cociná ${x} completamente` : `cociná ${x} hasta que esté tierno`)
    steps = [
      cooked.length ? `Por separado, ${cooking.join('; ')}. Enfriá rápidamente si vas a comer la ensalada fría.` : `Escurrí ${ingredients.filter((x) => /cocid|atún|sardina/.test(x)).join(', ') || 'los ingredientes en conserva'} y medí las cantidades de la lista.`,
      `Lavá y cortá ${raw.join(', ') || 'los ingredientes frescos'}; ${cooked.length ? 'escurrí y cortá los ingredientes cocidos en trozos cómodos para comer.' : 'prepará los demás ingredientes según la lista.'}`,
      `Mezclá ${ingredients.filter((x) => x !== 'aceite de oliva').join(', ')}${has('aceite de oliva') ? ' y agregá el aceite de oliva al servir' : ''}.`,
      `Repartí en ${r.servings} porciones. Si es vianda, refrigerá enseguida y transportá con frío.`,
    ]
    if (r.slug === 'ensalada-de-frutas-y-yogur-en-frasco') steps = [
      'Lavá las frutillas y la manzana; cortalas junto con la banana en trozos pequeños.',
      'Distribuí la fruta en los frascos y agregá el yogur natural medido.',
      `Tapá y mantené refrigerado hasta comer; dividí en ${r.servings} porciones.`,
    ]
  }

  if (original.includes('cobertura de papa, calabaza o berenjena')) {
    const top = ingredients.find((x) => ['papa','calabaza','berenjena','choclo'].includes(x))
    const protein = ingredients.find((x) => ['pollo','carne picada','lentejas cocidas'].includes(x))
    steps = [
      `Prepará ${top}: ${top === 'berenjena' ? 'cortá en láminas y horneá hasta ablandar' : 'cociná hasta que esté tierno y hacé un puré'}; medí los demás ingredientes.`,
      `Rehogá ${has('cebolla') ? 'la cebolla' : 'las verduras'}; agregá ${protein || 'el relleno'} y cociná ${protein === 'lentejas cocidas' ? 'hasta que se caliente y se evapore el líquido' : 'hasta que esté completamente cocido y sin exceso de líquido'}.`,
      `Poné el relleno en una fuente y cubrí con ${top === 'berenjena' ? 'las láminas de berenjena' : `el puré de ${top}`}${has('queso') ? '; distribuí el queso encima' : has('muzzarella') ? '; distribuí la muzzarella encima' : ''}.`,
      `Horneá a 190 °C durante 20–25 minutos, hasta dorar. Dejá reposar 10 minutos y dividí en ${r.servings} porciones.`,
    ]
  }

  if (original.includes('queso o ricota')) {
    const filling = has('ricota') ? 'ricota' : has('queso') ? 'queso' : ''
    steps = r.steps.map((s) => s.text.replace('queso o ricota', filling))
  }

  if (original.includes('si corresponde') && !steps) {
    const side = ingredients.find((x) => ['arroz','papa','calabaza','batata','pan'].includes(x))
    steps = r.steps.map((s) => s.text
      .replace(/Cociná (arroz|papa|batata) por separado si corresponde\./g, (_, x) =>
        x === 'arroz' ? 'Herví el arroz por separado según el tiempo del envase.' : `Cociná ${x} por separado hasta que esté tierno.`)
      .replace('Cociná la guarnición aparte si corresponde y repartí albóndigas, salsa y guarnición por igual.',
        side ? `Cociná ${side} hasta que esté tierno y repartí las albóndigas y la guarnición en ${r.servings} porciones.` : `Repartí las albóndigas y la salsa en ${r.servings} porciones.`)
      .replace('Cociná la guarnición por separado si corresponde.', side === 'pan' ? 'Tostá el pan y serví el revuelto encima.' : 'Serví el revuelto recién hecho.'))
  }

  const specifics = {
    'tarta-de-zapallitos-y-choclo': [1, 'Rehogá la cebolla y el zapallito hasta que pierdan líquido; sumá el choclo y dejá entibiar.'],
    'tarta-de-berenjena-y-tomate': [3, 'Batí los huevos, mezclalos con la berenjena y el tomate escurridos y distribuí sobre la base; agregá la muzzarella.'],
    'tarta-de-zanahoria-y-atun': [3, 'Escurrí el atún y mezclalo con la zanahoria y cebolla cocidas y los huevos; distribuí sobre la base.'],
    'tarta-de-choclo-y-jamon': [1, 'Calentá el choclo y mezclalo con el jamón cortado en tiras; dejá entibiar antes de sumar los huevos y el queso.'],
    'tarta-de-remolacha-ricota-y-nuez': [1, 'Cociná la remolacha hasta que esté tierna, pelala, rallala y escurrila; mezclá con ricota y nueces picadas.'],
    'tarta-de-tomate-atun-y-huevo': [3, 'Escurrí el atún y mezclalo con el tomate cocido, los huevos y el queso; distribuí sobre la base.'],
    'tacos-de-merluza-con-ensalada-de-repollo': [1, 'Cociná la merluza hasta que quede opaca; cortá finos el repollo y la zanahoria y mezclalos con el yogur natural.'],
  }
  if (specifics[r.slug]) {
    steps ??= r.steps.map((s) => s.text)
    const [idx, text] = specifics[r.slug]
    steps[idx] = text
  }
  if (r.slug === 'empanadas-de-humita') steps = [
    'Rehogá la cebolla picada; agregá el choclo y la leche y cociná hasta que espese. Retirá del fuego y mezclá el queso; enfriá el relleno.',
    'Distribuí el relleno en las 12 tapas, humedecé los bordes y cerrá bien.',
    'Horneá a 200 °C durante 20–25 minutos, hasta que estén doradas; cada porción son 2 empanadas.',
  ]
  if (r.slug === 'humita-en-olla') steps = [
    'Cortá la cebolla, el morrón y la calabaza; separá y medí el choclo.',
    'Rehogá cebolla y morrón. Agregá la calabaza, el choclo y la leche; mezclá y cociná a fuego bajo, revolviendo seguido, hasta que la calabaza esté tierna y la humita espese.',
    `Incorporá el queso al final y serví en ${r.servings} porciones. Refrigerá pronto lo que guardes.`,
  ]

  if (steps && steps.join(' ') !== original) { r.steps = steps.map((text) => ({ text })); fixed++ }
}
writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n')
console.log(`Preparaciones corregidas: ${fixed}`)
