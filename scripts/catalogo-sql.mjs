/* Genera el seed SQL del catálogo desde data/catalogo/*.json.

   Una sola fuente, dos salidas: la app lee el JSON directo y la base
   recibe esto. Un dato se corrige en un solo lugar.

   El seed es idempotente: `on conflict (slug) do update`. Correrlo dos
   veces no duplica nada, y correrlo después de editar el JSON actualiza
   lo que cambió sin tocar lo que no.

       npm run catalogo:sql
*/

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const q = (v) => (v === null || v === undefined || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const n = (v) => (v === null || v === undefined ? 'null' : String(v))
const b = (v) => (v ? 'true' : 'false')
const arr = (xs) => (xs?.length ? `array[${xs.map(q).join(', ')}]` : `'{}'`)

/* Las etiquetas de la app y las del vocabulario de la base no se llaman
   igual en todos los casos: acá está el puente, explícito. */
const TAG = {
  'para llevar': 'para_llevar',
  'en casa': 'casa',
  rápido: 'rapido',
  emergencia: 'emergencia',
  potente: 'potente',
  normal: 'normal',
  liviano: 'liviana',
  práctico: 'rapido',
  antojo: 'dulce',
  dulce: 'dulce',
  salado: 'salado',
  kiosco: 'comprable',
  supermercado: 'comprable',
  envasado: 'comprable',
  evento: 'evento',
  salida: 'calle',
}

/* El enum de la base no lleva tildes: los tipos se escriben en ASCII para
   que sean escribibles desde cualquier teclado y cualquier cliente. */
const ORIGEN = {
  casera: 'casera',
  envasada: 'envasada',
  'panadería': 'panaderia',
  'rotisería': 'rotiseria',
  restaurante: 'restaurante',
  kiosco: 'kiosco',
  supermercado: 'supermercado',
  'heladería': 'heladeria',
}

const MOMENTO = {
  desayuno: 'desayuno',
  snack: 'media_tarde',
  almuerzo: 'almuerzo',
  merienda: 'merienda',
  cena: 'cena',
}

/* Sólo los archivos de catálogo, que son los versionados: en esa
   carpeta también viven revisiones —duplicados.json— que no son
   entradas y no tienen por qué terminar en el seed. */
const entradas = readdirSync(resolve(ROOT, 'data/catalogo'))
  .filter((f) => /^v\d+\.json$/.test(f))
  .sort()
  .flatMap((f) => JSON.parse(readFileSync(resolve(ROOT, 'data/catalogo', f), 'utf8')))

const out = [
  '-- ==================================================================',
  '-- Catálogo v1 — generado por scripts/catalogo-sql.mjs. No editar.',
  '--',
  `-- ${entradas.length} entradas, todas ESTIMADAS: la porción está`,
  '-- documentada y el número calculado sobre esa porción, pero ninguna',
  '-- se midió contra una etiqueta. Eso es la fase D.',
  '--',
  '-- Idempotente: se puede correr las veces que haga falta.',
  '-- ==================================================================',
  '',
]

for (const e of entradas) {
  const porDefecto = e.portions.find((p) => p.default) ?? e.portions[0]
  const tags = [
    ...new Set([
      MOMENTO[e.category],
      e.satiety,
      ...e.tags.map((t) => TAG[t]).filter(Boolean),
      ...(e.buyOutside ? ['calle', 'comprable'] : []),
      e.sabor === 'mixta' ? null : e.sabor === 'neutral' ? null : e.sabor,
      ...e.momentos.map((m) => MOMENTO[m]),
      ...(e.makeNightBefore ? ['preparar_noche_anterior'] : []),
      ...(e.portable ? ['para_llevar'] : []),
      ...(e.activeMinutes === 0 ? ['sin_cocinar'] : []),
    ]),
  ].filter(Boolean)

  out.push(
    `-- ${e.name}`,
    `insert into meals (`,
    `  profile_id, slug, name, description, category, data_state,`,
    `  carbs_total, carbs_source, carbs_confidence, portion,`,
    `  main_ingredient, subcategories, prep_minutes, satiety,`,
    `  portable, needs_cold, needs_reheat, make_night_before, freezable,`,
    `  difficulty, freq, drink, everyday, added_sugar, notes,`,
    `  buy_outside, venues, price_level, handheld, carbs_from_items,`,
    `  origin, flavor, moments, total_minutes, is_drink,`,
    `  prep_type, yields,`,
    `  source_name`,
    `) values (`,
    `  null, ${q(e.slug)}, ${q(e.name)}, ${q(e.description)}, ${q(e.category)}, 'estimado',`,
    `  ${n(porDefecto.carbs)}, 'estimacion', 'estimada', ${q(porDefecto.label)},`,
    `  ${q(e.mainIngredient)}, ${arr(e.tags)}, ${n(e.activeMinutes)}, ${q(e.satiety)},`,
    `  ${b(e.portable)}, ${b(e.needsCold)}, ${b(e.needsReheat)}, ${b(e.makeNightBefore)}, ${b(e.freezable)},`,
    `  ${n(e.difficulty)}, ${q(e.frequency)}, ${q(e.drink)}, ${b(e.everyday)}, ${b(e.addedSugar)}, ${q(e.notes)},`,
    `  ${b(e.buyOutside)}, ${e.venues.length ? `array[${e.venues.map(q).join(', ')}]::venue[]` : `'{}'`}, ${n(e.priceLevel)}, ${b(e.handheld)}, ${b(e.items.length > 0)},`,
    `  ${q(ORIGEN[e.origen])}::food_origin, ${q(e.sabor)}::flavor, array[${e.momentos.map(q).join(', ')}]::meal_category[], ${n(e.totalMinutes)}, ${b(e.esBebida)},`,
    `  ${q(e.prepType)}::prep_type, ${q(e.rinde)},`,
    `  'porción estándar calculada'`,
    `)`,
    // El predicado tiene que coincidir con el del índice parcial, si no
    // Postgres no sabe cuál usar para inferir el conflicto.
    `on conflict (slug) where profile_id is null and slug is not null do update set`,
    `  name = excluded.name, description = excluded.description,`,
    `  category = excluded.category, carbs_total = excluded.carbs_total,`,
    `  portion = excluded.portion, main_ingredient = excluded.main_ingredient,`,
    `  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,`,
    `  satiety = excluded.satiety, portable = excluded.portable,`,
    `  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,`,
    `  make_night_before = excluded.make_night_before, freezable = excluded.freezable,`,
    `  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,`,
    `  everyday = excluded.everyday, added_sugar = excluded.added_sugar,`,
    `  notes = excluded.notes, buy_outside = excluded.buy_outside,`,
    `  venues = excluded.venues, price_level = excluded.price_level,`,
    `  handheld = excluded.handheld, origin = excluded.origin,`,
    `  flavor = excluded.flavor, moments = excluded.moments,`,
    `  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,`,
    `  prep_type = excluded.prep_type, yields = excluded.yields,`,
    `  updated_at = now();`,
    '',
  )

  // Las porciones se rehacen enteras: son pocas y así no quedan huérfanas.
  out.push(
    `delete from meal_portions where meal_id = (select id from meals where slug = ${q(e.slug)} and profile_id is null);`,
  )
  e.portions.forEach((p, i) => {
    out.push(
      `insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)`,
      `  select id, ${q(p.label)}, ${n(p.grams)}, ${n(p.carbs)}, ${b(p.default)}, ${i}`,
      `  from meals where slug = ${q(e.slug)} and profile_id is null;`,
    )
  })

  if (tags.length) {
    out.push(
      `insert into meal_tags (meal_id, tag_slug)`,
      `  select m.id, t.slug from meals m, tags t`,
      `  where m.slug = ${q(e.slug)} and m.profile_id is null and t.slug in (${tags.map(q).join(', ')})`,
      `  on conflict do nothing;`,
    )
  }
  out.push('')
}

mkdirSync(resolve(ROOT, 'supabase/seed'), { recursive: true })
writeFileSync(resolve(ROOT, 'supabase/seed/0001_catalogo.sql'), out.join('\n') + '\n')
console.log(`supabase/seed/0001_catalogo.sql — ${entradas.length} entradas`)
