import { readFileSync, writeFileSync } from 'node:fs'
import { prep } from './build-catalogo-ampliacion.mjs'
const old = JSON.parse(readFileSync('data/catalogo/v1.json', 'utf8'))
const ref = JSON.parse(readFileSync('data/nutrition/sara2.json', 'utf8'))
const weights = { huevo: 55, pan: 30, 'pan integral': 30, banana: 115, manzana: 150,
  tomate: 115, cebolla: 120, zanahoria: 75, palta: 180, limón: 60,
  'milanesa de carne': 130, 'milanesa de pollo': 130, 'pan de hamburguesa': 65,
  'pan de pancho': 60, 'galletitas de agua': 6, 'galletitas dulces': 7,
  'galletas de arroz': 8, lechuga: 200, naranja: 160, choclo: 250,
  'pollo entero': 1000, atún: 120, 'atún al natural': 120, 'masa de tarta': 250,
  'tapas de empanada': 35, prepizza: 250, 'masa de pizza': 300,
  'pan de miga': 25, 'caldo': 250, 'salchicha': 55,
}
// Rendimientos revisados contra cantidades y tamaño declarado de la porción.
// Las preparaciones que ya tenían un rinde explícito conservan ese dato.
const yields = {
  'budin-casero': 8, 'pochoclo': 2, 'milanesa-pure': 2,
  'milanesa-napolitana': 2, 'ravioles-salsa': 2,
  'tortilla-papa': 2, 'panqueques-dulce': 2,
  'pizza-casera': 4, 'sopa-calabaza': 2,
  'ravioles-cena-rapida': 2, 'budincitos-huevo': 6,
  'flan-dulce-de-leche': 4, 'arroz-con-leche': 2,
  'tortas-fritas': 4, 'bizcochuelo': 8,
  'galletitas-avena-caseras': 6,
}
const weight = (i) => {
  if (i.unit === 'g' || i.unit === 'ml') return i.qty
  if (i.unit === 'pizca') return i.qty * .5
  if (i.unit === 'cda') return i.qty * 15
  if (i.unit === 'puñado') return i.qty * 30
  if (i.unit === 'rebanada') return i.qty * 30
  if (i.unit === 'pote') return i.qty * 200
  if (i.unit === 'lata') return i.qty * (i.item === 'choclo' ? 300 : 120)
  if (i.unit === 'u') return i.qty * (weights[i.item] ?? 100)
  return null
}
const method = (e) => {
  const n = e.name.toLowerCase()
  if (/café|mate|té |^té$|licuado|jugo|submarino/.test(n)) return 'bebida'
  if (/galletitas de agua|galletas de arroz|con galletitas|con bizcochos|fruta con queso|queso en cubos|queso con dulce|yogur con|cereales con|avena con|picada|bastones de|tomates cherry/.test(n)) return 'simple'
  if (/pochoclo/.test(n)) return 'pochoclo'
  if (/tortas fritas/.test(n)) return 'frita'
  if (/flan/.test(n)) return 'flan'
  if (/budincitos de huevo/.test(n)) return 'budinSalado'
  if (/choripán|asado/.test(n)) return 'parrilla'
  if (/panchos/.test(n)) return 'pancho'
  if (/polenta/.test(n)) return 'polenta'
  if (/huevo duro|huevos duros/.test(n)) return 'huevoDuro'
  if (/huevo frito/.test(n)) return 'huevoFrito'
  if (/omelette/.test(n)) return 'omelette'
  if (/milanesa/.test(n) && e.items.some(i => i.item.startsWith('milanesa de '))) return 'milanesaLista'
  if (/arroz con atún|arroz primavera/.test(n)) return 'arroz'
  if (/zapallitos rellenos|berenjenas a la parmesana/.test(n)) return 'horno'
  if (/tarta/.test(n)) return 'tarta'
  if (/empanad/.test(n)) return 'empanada'
  if (/guiso|cazuela|arroz con leche/.test(n)) return 'guiso'
  if (/sopa/.test(n)) return 'sopa'
  if (/pastel/.test(n)) return 'pastel'
  if (/ensalada/.test(n)) return 'ensalada'
  if (/wrap/.test(n)) return 'wrap'
  if (/sándwich|sandwich|tostad|pan con|pan y|choripán|pancho/.test(n)) return 'sandwich'
  if (/hamburguesa/.test(n)) return 'hamburguesa'
  if (/milanesa/.test(n)) return 'milanesa'
  if (/budín|bizcochuelo/.test(n)) return 'budin'
  if (/galletita|bizcochos/.test(n)) return 'galletita'
  if (/panqueque/.test(n)) return 'panqueque'
  if (/tortilla|omelette|revuelto|huevo/.test(n)) return 'tortilla'
  if (/pizza/.test(n)) return 'pizza'
  if (/fideos|ravioles|ñoquis/.test(n)) return 'pasta'
  if (/polenta|arroz/.test(n)) return 'guiso'
  if (/horno|pollo|merluza|bife|asado/.test(n)) return 'horno'
  return e.prepType === 'assemble' ? 'sandwich' : 'salteado'
}
const result = {}
for (const e of old) {
  if (e.prepType === 'ready' || e.buyOutside || e.origen !== 'casera') continue
  const count = Number(e.rinde?.match(/^\d+/)?.[0] ?? 1)
  const portionCount = Number(e.portions.find(p => p.default)?.label.match(/^\d+/)?.[0] ?? 1)
  const divisor = yields[e.slug] ?? (e.rinde ? Math.max(1, count / portionCount) : 1)
  const nutrients = ['kcal','protein','fat','carbs','fiber'].reduce((a, field) => {
    a[field] = Math.round(e.items.reduce((n, i) => n + (ref[i.item]?.[field] ?? 0) * (weight(i) ?? 0) / 100, 0) / divisor * 10) / 10
    return a
  }, {})
  const missing = e.items.filter(i => !ref[i.item] || weight(i) === null)
  if (missing.length) throw Error(`${e.name}: referencia/unidad faltante ${missing.map(i => i.item+':'+i.unit)}`)
  const mode = method(e)
  result[e.slug] = {
    servings: divisor,
    nutrition: nutrients,
    nutritionSource: 'Estimación por ingredientes de SARA 2 (Ministerio de Salud de Argentina); envasados y unidades domésticas aproximados: revisar etiqueta y porción real.',
    equipment: ['tarta','pizza','empanada','budin','galletita','pastel','milanesa','horno'].includes(mode) ? 'horno' : 'hornalla, sartén o armado en frío',
    storage: e.portable ? 'Refrigerar hasta 2 días y transportar con frío si lleva ingredientes perecederos.' : 'Consumir recién preparado o refrigerar hasta 2 días.',
    reheat: e.needsReheat ? 'Calentar hasta que esté bien caliente en horno o sartén.' : null,
    steps: prep(mode, e.name, e.items, e.totalMinutes),
  }
}
writeFileSync('data/catalogo/legacy-enrichment.json', JSON.stringify(result, null, 2)+'\n')
const diffs = old.filter(e => result[e.slug]).map(e => [e.name,e.portions.find(p=>p.default).carbs,result[e.slug].nutrition.carbs]).filter(x => Math.abs(x[1]-x[2]) > Math.max(15,x[1]*.45))
console.log(`${Object.keys(result).length} preparaciones previas completadas; ${diffs.length} diferencias grandes entre carbohidratos previos y cálculo por ingredientes`)
console.log(diffs.slice(0,25))
