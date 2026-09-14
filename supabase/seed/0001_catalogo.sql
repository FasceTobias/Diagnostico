-- ==================================================================
-- Catálogo v1 — generado por scripts/catalogo-sql.mjs. No editar.
--
-- 119 entradas, todas ESTIMADAS: la porción está
-- documentada y el número calculado sobre esa porción, pero ninguna
-- se midió contra una etiqueta. Eso es la fase D.
--
-- Idempotente: se puede correr las veces que haga falta.
-- ==================================================================

-- Tostadas con queso untable
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-queso-untable', 'Tostadas con queso untable', 'El desayuno de todos los días. La bebida va aparte.', 'desayuno', 'estimado',
  26, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'rápido', 'salado'], 5, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-queso-untable' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 60, 26, true, 0
  from meals where slug = 'tostadas-queso-untable' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 tostadas', 90, 39, false, 1
  from meals where slug = 'tostadas-queso-untable' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tostada', 30, 13, false, 2
  from meals where slug = 'tostadas-queso-untable' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-queso-untable' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'salado', 'merienda')
  on conflict do nothing;

-- Tostadas con manteca y mermelada
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-manteca-mermelada', 'Tostadas con manteca y mermelada', 'Lo dulce de la mañana, sin vueltas.', 'desayuno', 'estimado',
  32, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'rápido', 'dulce'], 5, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-manteca-mermelada' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 60, 32, true, 0
  from meals where slug = 'tostadas-manteca-mermelada' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 tostadas', 90, 48, false, 1
  from meals where slug = 'tostadas-manteca-mermelada' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-manteca-mermelada' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'dulce', 'merienda')
  on conflict do nothing;

-- Tostadas con dulce de leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-dulce-de-leche', 'Tostadas con dulce de leche', 'Once gramos por cucharada de dulce de leche, arriba del pan.', 'desayuno', 'estimado',
  37, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'rápido', 'dulce'], 4, 'normal',
  false, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-dulce-de-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 65, 37, true, 0
  from meals where slug = 'tostadas-dulce-de-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-dulce-de-leche' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'dulce', 'merienda')
  on conflict do nothing;

-- Tostado de jamón y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostado-jamon-queso', 'Tostado de jamón y queso', 'Cae bien a cualquier hora, y por eso sirve para las tres.', 'desayuno', 'estimado',
  30, 'estimacion', 'estimada', '1 tostado',
  'pan', array['en casa', 'rápido', 'salado', 'potente'], 7, 'potente',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostado-jamon-queso' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tostado', 110, 30, true, 0
  from meals where slug = 'tostado-jamon-queso' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostado-jamon-queso' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'casa', 'rapido', 'salado', 'merienda', 'media_tarde', 'para_llevar')
  on conflict do nothing;

-- Huevos revueltos con tostadas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'huevos-revueltos-tostadas', 'Huevos revueltos con tostadas', 'Con dos huevos aguanta hasta el mediodía.', 'desayuno', 'estimado',
  28, 'estimacion', 'estimada', '1 plato',
  'huevo', array['en casa', 'salado', 'potente'], 10, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'huevos-revueltos-tostadas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 200, 28, true, 0
  from meals where slug = 'huevos-revueltos-tostadas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'huevos-revueltos-tostadas' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'casa', 'salado')
  on conflict do nothing;

-- Huevo duro con pan
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'huevo-duro-pan', 'Huevo duro con pan', 'Para la mañana en que no querés cocinar pero tampoco salir sin comer.', 'desayuno', 'estimado',
  14, 'estimacion', 'estimada', '1 huevo y 1 tostada',
  'huevo', array['en casa', 'rápido', 'salado'], 2, 'normal',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'huevo-duro-pan' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 huevo y 1 tostada', 90, 14, true, 0
  from meals where slug = 'huevo-duro-pan' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'huevo-duro-pan' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'salado', 'media_tarde', 'para_llevar')
  on conflict do nothing;

-- Yogur con granola y fruta
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'yogur-granola-fruta', 'Yogur con granola y fruta', 'De las más armadas de la lista, y se lleva sin drama.', 'desayuno', 'estimado',
  38, 'estimacion', 'estimada', '1 pote',
  'yogur natural', array['para llevar', 'rápido', 'dulce'], 3, 'potente',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-granola-fruta' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 250, 38, true, 0
  from meals where slug = 'yogur-granola-fruta' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin granola', 210, 12, false, 1
  from meals where slug = 'yogur-granola-fruta' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-granola-fruta' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'para_llevar', 'rapido', 'dulce', 'merienda', 'media_tarde')
  on conflict do nothing;

-- Medialunas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'medialunas-panaderia', 'Medialunas', 'Veinticuatro gramos cada una, y de los que entran rápido. Para un domingo.', 'desayuno', 'estimado',
  48, 'estimacion', 'estimada', '2 medialunas',
  'medialuna', array['dulce', 'antojo', 'salida'], 0, 'normal',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'medialunas-panaderia' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 medialunas', null, 48, true, 0
  from meals where slug = 'medialunas-panaderia' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 medialuna', null, 24, false, 1
  from meals where slug = 'medialunas-panaderia' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 medialunas', null, 72, false, 2
  from meals where slug = 'medialunas-panaderia' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'medialunas-panaderia' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'dulce', 'calle', 'comprable', 'merienda', 'para_llevar', 'sin_cocinar')
  on conflict do nothing;

-- Factura
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'factura-panaderia', 'Factura', 'Una sola, con el café. La de crema o la de membrillo andan parecido.', 'desayuno', 'estimado',
  26, 'estimacion', 'estimada', '1 factura',
  'medialuna', array['dulce', 'antojo', 'salida'], 0, 'liviana',
  false, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'factura-panaderia' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 factura', null, 26, true, 0
  from meals where slug = 'factura-panaderia' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'factura-panaderia' and m.profile_id is null and t.slug in ('desayuno', 'liviana', 'dulce', 'calle', 'comprable', 'merienda', 'sin_cocinar')
  on conflict do nothing;

-- Sándwich de queso para llevar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-queso-manana', 'Sándwich de queso para llevar', 'Se arma en dos minutos y se come en el colectivo.', 'desayuno', 'estimado',
  28, 'estimacion', 'estimada', '1 sándwich',
  'pan', array['para llevar', 'rápido', 'salado'], 3, 'normal',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-queso-manana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', 110, 28, true, 0
  from meals where slug = 'sandwich-queso-manana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-queso-manana' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'para_llevar', 'rapido', 'salado', 'media_tarde', 'merienda', 'preparar_noche_anterior')
  on conflict do nothing;

-- Cereales con leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'cereales-leche', 'Cereales con leche', 'El desayuno más rápido que existe después del café solo.', 'desayuno', 'estimado',
  42, 'estimacion', 'estimada', '1 tazón',
  'granola', array['en casa', 'rápido', 'dulce'], 2, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['desayuno']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'cereales-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tazón', 280, 42, true, 0
  from meals where slug = 'cereales-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'cereales-leche' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'dulce')
  on conflict do nothing;

-- Budín casero
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'budin-casero', 'Budín casero', 'Uno rinde ocho porciones y aguanta toda la semana.', 'desayuno', 'estimado',
  35, 'estimacion', 'estimada', '1 porción',
  'budín', array['en casa', 'dulce'], 15, 'liviana',
  true, false, false, false, true,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda', 'snack']::meal_category[], 60, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'budin-casero' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 80, 35, true, 0
  from meals where slug = 'budin-casero' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'budin-casero' and m.profile_id is null and t.slug in ('desayuno', 'liviana', 'casa', 'dulce', 'merienda', 'media_tarde', 'para_llevar')
  on conflict do nothing;

-- Tostadas con palta
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-palta', 'Tostadas con palta', 'La palta se pone marrón: si es para llevar, va entera y se pisa ahí.', 'desayuno', 'estimado',
  28, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'rápido', 'salado'], 5, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-palta' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 110, 28, true, 0
  from meals where slug = 'tostadas-palta' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-palta' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'salado', 'merienda')
  on conflict do nothing;

-- Sólo mate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'mate-solo-manana', 'Sólo mate', 'Mucha gente no desayuna. Está bien que la app lo sepa y no te invente un plato.', 'desayuno', 'estimado',
  0, 'estimacion', 'estimada', '1 mate',
  'yerba', array['en casa', 'rápido'], 2, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['desayuno']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mate-solo-manana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 mate', null, 0, true, 0
  from meals where slug = 'mate-solo-manana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mate-solo-manana' and m.profile_id is null and t.slug in ('desayuno', 'liviana', 'casa', 'rapido')
  on conflict do nothing;

-- Avena con banana y nueces
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'avena-nocturna', 'Avena con banana y nueces', 'Se deja lista la noche anterior y a la mañana ya está.', 'desayuno', 'estimado',
  58, 'estimacion', 'estimada', '1 frasco de 400 ml',
  'avena', array['para llevar', 'dulce', 'potente'], 8, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, false, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'avena-nocturna' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 frasco de 400 ml', 400, 58, true, 0
  from meals where slug = 'avena-nocturna' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'avena-nocturna' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'para_llevar', 'dulce', 'merienda', 'preparar_noche_anterior')
  on conflict do nothing;

-- Tostadas con palta y huevo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-palta-huevo', 'Tostadas con palta y huevo', 'La palta sola no aguanta hasta el mediodía; con dos huevos sí.', 'desayuno', 'estimado',
  30, 'estimacion', 'estimada', '2 tostadas',
  'huevo', array['en casa', 'salado', 'potente'], 10, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-palta-huevo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 180, 30, true, 0
  from meals where slug = 'tostadas-palta-huevo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-palta-huevo' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'casa', 'salado', 'merienda')
  on conflict do nothing;

-- Sándwich de tortilla de papa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-tortilla', 'Sándwich de tortilla de papa', 'Con la tortilla del día anterior se arma en dos minutos.', 'desayuno', 'estimado',
  38, 'estimacion', 'estimada', '1 sándwich',
  'papa', array['para llevar', 'salado', 'potente'], 5, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['desayuno', 'almuerzo', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-tortilla' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', 220, 38, true, 0
  from meals where slug = 'sandwich-tortilla' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-tortilla' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'para_llevar', 'salado', 'almuerzo', 'merienda', 'preparar_noche_anterior')
  on conflict do nothing;

-- Banana
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'banana', 'Banana', 'La fruta más práctica que hay: viene con envase.', 'snack', 'estimado',
  25, 'estimacion', 'estimada', '1 banana',
  'banana', array['para llevar', 'rápido', 'dulce'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'banana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 banana', 120, 25, true, 0
  from meals where slug = 'banana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'banana' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'rapido', 'dulce')
  on conflict do nothing;

-- Manzana
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'manzana', 'Manzana', 'Aguanta días en la mochila sin quejarse.', 'snack', 'estimado',
  20, 'estimacion', 'estimada', '1 manzana',
  'manzana', array['para llevar', 'rápido', 'dulce'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'manzana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 manzana', 150, 20, true, 0
  from meals where slug = 'manzana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'manzana' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'rapido', 'dulce')
  on conflict do nothing;

-- Puñado de maní
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'punado-mani', 'Puñado de maní', 'Casi sin carbohidratos y aguanta bastante.', 'snack', 'estimado',
  6, 'estimacion', 'estimada', '30 g',
  'maní', array['para llevar', 'salado', 'práctico', 'envasado'], 1, 'normal',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'salado'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'punado-mani' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '30 g', 30, 6, true, 0
  from meals where slug = 'punado-mani' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'punado-mani' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'salado', 'rapido', 'comprable')
  on conflict do nothing;

-- Mezcla de frutos secos
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'frutos-secos', 'Mezcla de frutos secos', 'Nueces y almendras. Pocos carbohidratos y mucho aguante.', 'snack', 'estimado',
  9, 'estimacion', 'estimada', '30 g',
  'nuez', array['para llevar', 'práctico', 'envasado'], 1, 'normal',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'frutos-secos' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '30 g', 30, 9, true, 0
  from meals where slug = 'frutos-secos' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'frutos-secos' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'rapido', 'comprable', 'dulce')
  on conflict do nothing;

-- Barra de cereal
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'barra-cereal', 'Barra de cereal', 'Aguanta en la mochila y se come caminando.', 'snack', 'estimado',
  17, 'estimacion', 'estimada', '1 barra',
  'barra de cereal', array['para llevar', 'kiosco', 'envasado', 'dulce', 'práctico'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'barra-cereal' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 barra', 25, 17, true, 0
  from meals where slug = 'barra-cereal' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'barra-cereal' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'comprable', 'dulce', 'rapido')
  on conflict do nothing;

-- Barra proteica
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'barra-proteica', 'Barra proteica', 'Llena más que la de cereal y cuesta el triple.', 'snack', 'estimado',
  20, 'estimacion', 'estimada', '1 barra',
  'barra proteica', array['para llevar', 'kiosco', 'envasado', 'práctico'], 1, 'normal',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'barra-proteica' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 barra', 45, 20, true, 0
  from meals where slug = 'barra-proteica' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'barra-proteica' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'comprable', 'rapido', 'dulce')
  on conflict do nothing;

-- Galletitas de agua con queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'galletitas-agua-queso', 'Galletitas de agua con queso', 'Salado y práctico. Las galletitas son casi todo el carbohidrato.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '6 galletitas',
  'galletitas de agua', array['para llevar', 'salado', 'práctico'], 3, 'normal',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'galletitas-agua-queso' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '6 galletitas', 60, 22, true, 0
  from meals where slug = 'galletitas-agua-queso' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 galletitas', 30, 11, false, 1
  from meals where slug = 'galletitas-agua-queso' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'galletitas-agua-queso' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'salado', 'rapido')
  on conflict do nothing;

-- Galletitas dulces
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'galletitas-dulces', 'Galletitas dulces', 'Las de paquete, las de toda la vida.', 'snack', 'estimado',
  30, 'estimacion', 'estimada', '6 galletitas',
  'galletitas dulces', array['para llevar', 'envasado', 'dulce', 'supermercado'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'galletitas-dulces' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '6 galletitas', 60, 30, true, 0
  from meals where slug = 'galletitas-dulces' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 galletitas', 30, 15, false, 1
  from meals where slug = 'galletitas-dulces' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'galletitas-dulces' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'comprable', 'dulce', 'merienda')
  on conflict do nothing;

-- Alfajor simple
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'alfajor-simple', 'Alfajor simple', 'Treinta gramos en algo que se come en dos minutos. Mejor saberlo antes.', 'snack', 'estimado',
  30, 'estimacion', 'estimada', '1 alfajor',
  'alfajor', array['kiosco', 'envasado', 'dulce', 'antojo'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'alfajor-simple' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 alfajor', 45, 30, true, 0
  from meals where slug = 'alfajor-simple' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'alfajor-simple' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Yogur bebible
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'yogur-bebible', 'Yogur bebible', 'De supermercado o kiosco. Se toma caminando.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 botellita',
  'yogur entero', array['supermercado', 'envasado', 'dulce', 'para llevar'], 1, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-bebible' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 botellita', 200, 22, true, 0
  from meals where slug = 'yogur-bebible' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-bebible' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Yogur natural
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'yogur-natural', 'Yogur natural', 'Sin nada arriba. Doce gramos, y llena bastante para lo que es.', 'snack', 'estimado',
  12, 'estimacion', 'estimada', '1 pote',
  'yogur natural', array['para llevar', 'envasado', 'supermercado'], 1, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-natural' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 190, 12, true, 0
  from meals where slug = 'yogur-natural' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-natural' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'comprable', 'dulce', 'merienda')
  on conflict do nothing;

-- Queso en cubos
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'queso-cubos', 'Queso en cubos', 'Casi cero carbohidratos. Sirve cuando faltan horas para comer.', 'snack', 'estimado',
  1, 'estimacion', 'estimada', '40 g',
  'queso', array['para llevar', 'salado', 'práctico'], 2, 'normal',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'queso-cubos' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '40 g', 40, 1, true, 0
  from meals where slug = 'queso-cubos' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'queso-cubos' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'salado', 'rapido')
  on conflict do nothing;

-- Huevos duros
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'huevos-duros-snack', 'Huevos duros', 'Hacés seis de una y te resuelven varios días.', 'snack', 'estimado',
  1, 'estimacion', 'estimada', '2 huevos',
  'huevo', array['para llevar', 'salado', 'práctico'], 3, 'normal',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['snack']::meal_category[], 20, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'huevos-duros-snack' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 huevos', 110, 1, true, 0
  from meals where slug = 'huevos-duros-snack' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'huevos-duros-snack' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'salado', 'rapido', 'preparar_noche_anterior')
  on conflict do nothing;

-- Sándwich chico de jamón y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-chico', 'Sándwich chico de jamón y queso', 'Un snack, no un almuerzo. Si te queda grande, cortalo al medio.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 sándwich chico',
  'pan', array['para llevar', 'salado', 'rápido'], 3, 'normal',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-chico' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich chico', 80, 22, true, 0
  from meals where slug = 'sandwich-chico' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-chico' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'salado', 'rapido', 'preparar_noche_anterior')
  on conflict do nothing;

-- Turrón de maní
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'turron-mani', 'Turrón de maní', 'De kiosco, de los baratos. Veinticuatro gramos.', 'snack', 'estimado',
  24, 'estimacion', 'estimada', '1 turrón',
  'maní', array['kiosco', 'envasado', 'dulce', 'antojo'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'turron-mani' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 turrón', 35, 24, true, 0
  from meals where slug = 'turron-mani' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'turron-mani' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Galletas de arroz con queso untable
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-arroz', 'Galletas de arroz con queso untable', 'Livianas de verdad, no de las que dicen que lo son.', 'snack', 'estimado',
  16, 'estimacion', 'estimada', '3 galletas',
  'galletitas de agua', array['para llevar', 'práctico'], 2, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-arroz' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 galletas', 45, 16, true, 0
  from meals where slug = 'tostadas-arroz' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-arroz' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'rapido')
  on conflict do nothing;

-- Pochoclo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pochoclo', 'Pochoclo', 'Para una película. Más aire que otra cosa, pero el maíz suma.', 'snack', 'estimado',
  18, 'estimacion', 'estimada', '1 bol chico',
  'harina', array['en casa', 'salado', 'antojo'], 5, 'liviana',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pochoclo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 bol chico', 25, 18, true, 0
  from meals where slug = 'pochoclo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pochoclo' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'casa', 'salado', 'dulce')
  on conflict do nothing;

-- Ensalada de frutas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ensalada-frutas', 'Ensalada de frutas', 'Se deja hecha y aguanta dos días en la heladera.', 'snack', 'estimado',
  28, 'estimacion', 'estimada', '1 pote',
  'manzana', array['para llevar', 'dulce'], 8, 'liviana',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-frutas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 250, 28, true, 0
  from meals where slug = 'ensalada-frutas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-frutas' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'dulce', 'merienda', 'preparar_noche_anterior')
  on conflict do nothing;

-- Milanesa con puré
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'milanesa-pure', 'Milanesa con puré', 'De las comidas más normales que hay. El puré es la mitad del número.', 'almuerzo', 'estimado',
  42, 'estimacion', 'estimada', '1 plato',
  'milanesa de pollo', array['en casa', 'potente'], 20, 'potente',
  false, false, true, false, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 35, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'milanesa-pure' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 400, 42, true, 0
  from meals where slug = 'milanesa-pure' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con medio puré', 300, 27, false, 1
  from meals where slug = 'milanesa-pure' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'milanesa-pure' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena')
  on conflict do nothing;

-- Milanesa a la napolitana con papas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'milanesa-napolitana', 'Milanesa a la napolitana con papas', 'Con jamón, queso y salsa arriba. Las papas son la mitad del número.', 'almuerzo', 'estimado',
  56, 'estimacion', 'estimada', '1 plato',
  'milanesa de carne', array['en casa', 'potente', 'antojo'], 20, 'potente',
  false, false, true, false, false,
  2, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 40, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'milanesa-napolitana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 450, 56, true, 0
  from meals where slug = 'milanesa-napolitana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'milanesa-napolitana' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'dulce', 'salado', 'cena')
  on conflict do nothing;

-- Pollo al horno con papas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pollo-horno-papas', 'Pollo al horno con papas', 'Se hace una vez y rinde dos comidas.', 'almuerzo', 'estimado',
  40, 'estimacion', 'estimada', '1 plato',
  'pollo', array['en casa', 'potente'], 10, 'potente',
  false, false, true, true, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 45, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pollo-horno-papas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 450, 40, true, 0
  from meals where slug = 'pollo-horno-papas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pollo-horno-papas' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena', 'preparar_noche_anterior')
  on conflict do nothing;

-- Fideos con tuco
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'fideos-tuco', 'Fideos con tuco', 'De lo que más carbohidratos tiene del día. Conviene mirarlo bien.', 'almuerzo', 'estimado',
  62, 'estimacion', 'estimada', '1 plato',
  'fideos', array['en casa', 'potente'], 10, 'potente',
  false, false, true, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 20, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'fideos-tuco' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 350, 62, true, 0
  from meals where slug = 'fideos-tuco' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Medio plato', 175, 31, false, 1
  from meals where slug = 'fideos-tuco' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'fideos-tuco' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena')
  on conflict do nothing;

-- Ravioles con salsa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ravioles-salsa', 'Ravioles con salsa', 'Los de plancha, del súper. Cinco minutos de agua hirviendo.', 'almuerzo', 'estimado',
  68, 'estimacion', 'estimada', '1 plato',
  'ravioles', array['en casa', 'potente', 'rápido'], 10, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 15, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ravioles-salsa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 350, 68, true, 0
  from meals where slug = 'ravioles-salsa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ravioles-salsa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'rapido', 'salado', 'cena')
  on conflict do nothing;

-- Ñoquis con salsa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'noquis-salsa', 'Ñoquis con salsa', 'Los del 29. De los platos con más carbohidratos de la lista.', 'almuerzo', 'estimado',
  72, 'estimacion', 'estimada', '1 plato',
  'ñoquis', array['en casa', 'potente'], 10, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 15, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'noquis-salsa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 350, 72, true, 0
  from meals where slug = 'noquis-salsa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'noquis-salsa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena')
  on conflict do nothing;

-- Arroz con pollo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'arroz-con-pollo', 'Arroz con pollo', 'Se come frío o caliente y viaja bien en tupper.', 'almuerzo', 'estimado',
  50, 'estimacion', 'estimada', '1 plato',
  'arroz', array['para llevar', 'potente'], 15, 'potente',
  true, true, false, true, true,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 30, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'arroz-con-pollo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 400, 50, true, 0
  from meals where slug = 'arroz-con-pollo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'arroz-con-pollo' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'salado', 'cena', 'preparar_noche_anterior')
  on conflict do nothing;

-- Tortilla de papa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tortilla-papa', 'Tortilla de papa', 'Fría al día siguiente está mejor que recién hecha.', 'almuerzo', 'estimado',
  30, 'estimacion', 'estimada', '2 porciones',
  'papa', array['para llevar', 'en casa'], 20, 'normal',
  true, true, false, true, false,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena', 'snack']::meal_category[], 30, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tortilla-papa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 250, 30, true, 0
  from meals where slug = 'tortilla-papa' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 125, 15, false, 1
  from meals where slug = 'tortilla-papa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tortilla-papa' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'para_llevar', 'casa', 'salado', 'cena', 'media_tarde', 'preparar_noche_anterior')
  on conflict do nothing;

-- Empanadas de carne caseras
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'empanadas-caseras', 'Empanadas de carne caseras', 'Veintidós gramos cada una, calculado sobre la receta.', 'almuerzo', 'estimado',
  66, 'estimacion', 'estimada', '3 empanadas',
  'harina', array['potente', 'antojo'], 30, 'potente',
  true, false, true, false, true,
  3, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 90, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'empanadas-caseras' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 empanadas', 300, 66, true, 0
  from meals where slug = 'empanadas-caseras' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 empanada', 100, 22, false, 1
  from meals where slug = 'empanadas-caseras' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 empanadas', 200, 44, false, 2
  from meals where slug = 'empanadas-caseras' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'empanadas-caseras' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'dulce', 'salado', 'cena', 'para_llevar')
  on conflict do nothing;

-- Ensalada completa con pollo y huevo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ensalada-completa', 'Ensalada completa con pollo y huevo', 'Completa de verdad: con papa, huevo y pollo llena como un plato caliente.', 'almuerzo', 'estimado',
  26, 'estimacion', 'estimada', '1 plato grande',
  'pollo', array['para llevar'], 20, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 25, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-completa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato grande', 450, 26, true, 0
  from meals where slug = 'ensalada-completa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-completa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'salado', 'cena', 'preparar_noche_anterior')
  on conflict do nothing;

-- Pastel de papa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pastel-de-papa', 'Pastel de papa', 'Entero rinde cuatro. Se congela y se calienta sin perder nada.', 'almuerzo', 'estimado',
  44, 'estimacion', 'estimada', '1 porción',
  'papa', array['en casa', 'potente'], 25, 'potente',
  false, false, true, false, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 60, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pastel-de-papa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 380, 44, true, 0
  from meals where slug = 'pastel-de-papa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pastel-de-papa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena')
  on conflict do nothing;

-- Sándwich de milanesa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-milanesa', 'Sándwich de milanesa', 'Con la milanesa que sobró de ayer. De las mejores cosas que hay.', 'almuerzo', 'estimado',
  48, 'estimacion', 'estimada', '1 sándwich',
  'pan francés', array['para llevar', 'potente'], 5, 'potente',
  true, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-milanesa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', 300, 48, true, 0
  from meals where slug = 'sandwich-milanesa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-milanesa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'salado', 'cena')
  on conflict do nothing;

-- Tarta de verdura
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tarta-verdura', 'Tarta de verdura', 'De acelga o espinaca. Entera rinde cuatro y se lleva fría.', 'almuerzo', 'estimado',
  28, 'estimacion', 'estimada', '1 porción',
  'masa de tarta', array['para llevar', 'en casa'], 20, 'normal',
  true, true, false, true, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 50, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tarta-verdura' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 180, 28, true, 0
  from meals where slug = 'tarta-verdura' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 360, 56, false, 1
  from meals where slug = 'tarta-verdura' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tarta-verdura' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'para_llevar', 'casa', 'salado', 'cena', 'preparar_noche_anterior')
  on conflict do nothing;

-- Arroz con atún
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'arroz-atun', 'Arroz con atún', 'Se come frío, no necesita microondas en ningún lado.', 'almuerzo', 'estimado',
  48, 'estimacion', 'estimada', '1 tupper',
  'arroz', array['para llevar'], 10, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 25, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'arroz-atun' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tupper', 380, 48, true, 0
  from meals where slug = 'arroz-atun' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'arroz-atun' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'salado', 'cena', 'preparar_noche_anterior')
  on conflict do nothing;

-- Pollo al spiedo con ensalada
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pollo-spiedo-casa', 'Pollo al spiedo con ensalada', 'Comprado hecho y con ensalada al lado: doce gramos, casi todo de la ensalada.', 'almuerzo', 'estimado',
  12, 'estimacion', 'estimada', '1/4 de pollo',
  'pollo entero', array['en casa', 'potente', 'rápido'], 5, 'potente',
  false, false, true, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pollo-spiedo-casa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1/4 de pollo', 350, 12, true, 0
  from meals where slug = 'pollo-spiedo-casa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pollo-spiedo-casa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'rapido', 'salado', 'cena')
  on conflict do nothing;

-- Guiso de lentejas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'guiso-lentejas', 'Guiso de lentejas', 'Barato, rinde y se congela. De lo más práctico que hay.', 'almuerzo', 'estimado',
  48, 'estimacion', 'estimada', '1 plato hondo',
  'lentejas cocidas', array['en casa', 'potente'], 20, 'potente',
  false, false, true, false, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], 40, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'guiso-lentejas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato hondo', 400, 48, true, 0
  from meals where slug = 'guiso-lentejas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'guiso-lentejas' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena')
  on conflict do nothing;

-- Sándwich completo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-completo', 'Sándwich completo', 'Con huevo y palta aguanta como almuerzo, no como snack.', 'almuerzo', 'estimado',
  34, 'estimacion', 'estimada', '1 sándwich',
  'pan', array['para llevar', 'salado', 'potente'], 15, 'potente',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-completo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', 260, 34, true, 0
  from meals where slug = 'sandwich-completo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-completo' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'salado', 'cena')
  on conflict do nothing;

-- Wrap de pollo y vegetales
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'wrap-pollo', 'Wrap de pollo y vegetales', 'La tortilla de trigo aguanta el viaje mejor que el pan.', 'almuerzo', 'estimado',
  30, 'estimacion', 'estimada', '1 wrap',
  'pollo', array['para llevar', 'salado'], 12, 'normal',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'wrap-pollo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 wrap', 230, 30, true, 0
  from meals where slug = 'wrap-pollo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'wrap-pollo' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'para_llevar', 'salado', 'cena')
  on conflict do nothing;

-- Ensalada de lentejas con huevo y palta
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ensalada-lentejas', 'Ensalada de lentejas con huevo y palta', 'Fría, se hace de una vez y aguanta tres días en la heladera.', 'almuerzo', 'estimado',
  28, 'estimacion', 'estimada', '1 plato',
  'lentejas cocidas', array['en casa', 'salado', 'potente'], 15, 'potente',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-lentejas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 330, 28, true, 0
  from meals where slug = 'ensalada-lentejas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-lentejas' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'salado', 'cena', 'para_llevar')
  on conflict do nothing;

-- Mate con galletitas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'mate-galletitas', 'Mate con galletitas', 'La merienda de casi todo el mundo.', 'merienda', 'estimado',
  34, 'estimacion', 'estimada', '6 galletitas',
  'galletitas dulces', array['en casa', 'dulce', 'rápido'], 2, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mate-galletitas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '6 galletitas', 60, 34, true, 0
  from meals where slug = 'mate-galletitas' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 galletitas', 30, 17, false, 1
  from meals where slug = 'mate-galletitas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mate-galletitas' and m.profile_id is null and t.slug in ('merienda', 'normal', 'casa', 'dulce', 'rapido')
  on conflict do nothing;

-- Porción de budín
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'budin-merienda', 'Porción de budín', 'Con café o con mate: la bebida no cambia el número.', 'merienda', 'estimado',
  35, 'estimacion', 'estimada', '1 porción',
  'budín', array['dulce', 'rápido', 'antojo'], 2, 'normal',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'budin-merienda' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 80, 35, true, 0
  from meals where slug = 'budin-merienda' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Media porción', 40, 18, false, 1
  from meals where slug = 'budin-merienda' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'budin-merienda' and m.profile_id is null and t.slug in ('merienda', 'normal', 'dulce', 'rapido', 'para_llevar')
  on conflict do nothing;

-- Yogur con fruta
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'yogur-con-fruta', 'Yogur con fruta', 'Liviana y se prepara en un minuto.', 'merienda', 'estimado',
  26, 'estimacion', 'estimada', '1 pote con fruta',
  'yogur natural', array['rápido', 'dulce', 'para llevar'], 3, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-con-fruta' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote con fruta', 280, 26, true, 0
  from meals where slug = 'yogur-con-fruta' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-con-fruta' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'rapido', 'dulce', 'para_llevar', 'media_tarde')
  on conflict do nothing;

-- Tostadas con mermelada
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostadas-mermelada-merienda', 'Tostadas con mermelada', 'Liviana, para cuando la cena viene pesada.', 'merienda', 'estimado',
  30, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'dulce', 'rápido'], 4, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['merienda', 'desayuno']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-mermelada-merienda' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 60, 30, true, 0
  from meals where slug = 'tostadas-mermelada-merienda' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-mermelada-merienda' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'casa', 'dulce', 'rapido', 'desayuno')
  on conflict do nothing;

-- Panqueques con dulce de leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'panqueques-dulce', 'Panqueques con dulce de leche', 'Salen seis u ocho de una vez y fríos al otro día siguen buenos.', 'merienda', 'estimado',
  46, 'estimacion', 'estimada', '2 panqueques',
  'harina', array['en casa', 'dulce', 'antojo'], 20, 'normal',
  false, false, false, false, false,
  2, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['merienda']::meal_category[], 30, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'panqueques-dulce' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 panqueques', 180, 46, true, 0
  from meals where slug = 'panqueques-dulce' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 panqueque', 90, 23, false, 1
  from meals where slug = 'panqueques-dulce' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'panqueques-dulce' and m.profile_id is null and t.slug in ('merienda', 'normal', 'casa', 'dulce')
  on conflict do nothing;

-- Pan con queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pan-queso-merienda', 'Pan con queso', 'La merienda salada de los que no quieren algo dulce a las seis.', 'merienda', 'estimado',
  26, 'estimacion', 'estimada', '2 rebanadas',
  'pan', array['en casa', 'salado', 'rápido'], 3, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pan-queso-merienda' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 rebanadas', 90, 26, true, 0
  from meals where slug = 'pan-queso-merienda' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pan-queso-merienda' and m.profile_id is null and t.slug in ('merienda', 'normal', 'casa', 'salado', 'rapido', 'media_tarde')
  on conflict do nothing;

-- Licuado de banana
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'licuado-banana', 'Licuado de banana', 'Con leche. Se toma caminando si lo ponés en una botella.', 'merienda', 'estimado',
  36, 'estimacion', 'estimada', '1 vaso grande',
  'banana', array['rápido', 'dulce', 'para llevar'], 4, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['merienda', 'desayuno', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'licuado-banana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 vaso grande', 350, 36, true, 0
  from meals where slug = 'licuado-banana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'licuado-banana' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'rapido', 'dulce', 'para_llevar', 'desayuno', 'media_tarde')
  on conflict do nothing;

-- Sándwich de queso y tomate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-merienda-llevar', 'Sándwich de queso y tomate', 'Se arma la noche anterior y llega entero a la tarde.', 'merienda', 'estimado',
  30, 'estimacion', 'estimada', '1 sándwich',
  'pan', array['para llevar', 'salado'], 5, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['merienda', 'snack', 'almuerzo']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-merienda-llevar' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', 140, 30, true, 0
  from meals where slug = 'sandwich-merienda-llevar' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-merienda-llevar' and m.profile_id is null and t.slug in ('merienda', 'potente', 'para_llevar', 'salado', 'media_tarde', 'almuerzo', 'preparar_noche_anterior')
  on conflict do nothing;

-- Churros
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'churros-cafe', 'Churros', 'Dos, con el café de la tarde. Los rellenos suman bastante más.', 'merienda', 'estimado',
  34, 'estimacion', 'estimada', '2 churros',
  'harina', array['dulce', 'antojo', 'salida'], 0, 'liviana',
  false, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'dulce'::flavor, array['merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'churros-cafe' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 churros', null, 34, true, 0
  from meals where slug = 'churros-cafe' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'churros-cafe' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'dulce', 'calle', 'comprable', 'sin_cocinar')
  on conflict do nothing;

-- Bizcochos con mate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'bizcochos-mate', 'Bizcochos con mate', 'Los de grasa, con el mate de la tarde.', 'merienda', 'estimado',
  28, 'estimacion', 'estimada', '4 bizcochos',
  'pan', array['salado', 'salida', 'rápido'], 0, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'salado'::flavor, array['merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'bizcochos-mate' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '4 bizcochos', null, 28, true, 0
  from meals where slug = 'bizcochos-mate' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'bizcochos-mate' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'salado', 'calle', 'rapido', 'comprable', 'para_llevar', 'sin_cocinar')
  on conflict do nothing;

-- Queso con dulce de membrillo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'queso-dulce-membrillo', 'Queso con dulce de membrillo', 'Vigilante. Dulce y salado a la vez, que es justo lo que es.', 'merienda', 'estimado',
  24, 'estimacion', 'estimada', '1 porción',
  'queso', array['en casa', 'rápido'], 2, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'mixta'::flavor, array['merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'queso-dulce-membrillo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 100, 24, true, 0
  from meals where slug = 'queso-dulce-membrillo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'queso-dulce-membrillo' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'casa', 'rapido', 'media_tarde')
  on conflict do nothing;

-- Alfajor de maicena
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'alfajor-maicena', 'Alfajor de maicena', 'El de dulce de leche y coco, de panadería.', 'merienda', 'estimado',
  32, 'estimacion', 'estimada', '1 alfajor',
  'alfajor', array['dulce', 'antojo', 'salida'], 0, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'dulce'::flavor, array['merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'alfajor-maicena' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 alfajor', null, 32, true, 0
  from meals where slug = 'alfajor-maicena' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'alfajor-maicena' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'dulce', 'calle', 'comprable', 'media_tarde', 'para_llevar', 'sin_cocinar')
  on conflict do nothing;

-- Scon de queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'scon-queso', 'Scon de queso', 'De panadería, para la merienda salada.', 'merienda', 'estimado',
  22, 'estimacion', 'estimada', '1 scon',
  'harina', array['salado', 'salida'], 0, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'salado'::flavor, array['merienda', 'snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'scon-queso' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 scon', null, 22, true, 0
  from meals where slug = 'scon-queso' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'scon-queso' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'salado', 'calle', 'comprable', 'media_tarde', 'para_llevar', 'sin_cocinar')
  on conflict do nothing;

-- Pizza de muzzarella casera
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pizza-casera', 'Pizza de muzzarella casera', 'Treinta gramos por porción, sesenta por dos. De las de cada tanto.', 'cena', 'estimado',
  60, 'estimacion', 'estimada', '2 porciones',
  'masa de pizza', array['en casa', 'potente', 'antojo'], 10, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], 25, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pizza-casera' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 220, 60, true, 0
  from meals where slug = 'pizza-casera' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 110, 30, false, 1
  from meals where slug = 'pizza-casera' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 porciones', 330, 90, false, 2
  from meals where slug = 'pizza-casera' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pizza-casera' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'dulce', 'salado')
  on conflict do nothing;

-- Hamburguesa con papas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'hamburguesa-casera', 'Hamburguesa con papas', 'El pan y las papas son casi todo el número; la carne no aporta nada.', 'cena', 'estimado',
  75, 'estimacion', 'estimada', '1 hamburguesa con papas',
  'carne picada', array['en casa', 'potente', 'antojo'], 15, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], 25, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'hamburguesa-casera' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 hamburguesa con papas', 400, 75, true, 0
  from meals where slug = 'hamburguesa-casera' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin papas', 250, 30, false, 1
  from meals where slug = 'hamburguesa-casera' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'hamburguesa-casera' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'dulce', 'salado')
  on conflict do nothing;

-- Tarta de jamón y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tarta-jamon-queso', 'Tarta de jamón y queso', 'Entera rinde cuatro comidas y se lleva fría sin drama.', 'cena', 'estimado',
  30, 'estimacion', 'estimada', '1 porción',
  'masa de tarta', array['para llevar', 'en casa'], 15, 'normal',
  true, true, false, true, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'almuerzo']::meal_category[], 45, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tarta-jamon-queso' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 180, 30, true, 0
  from meals where slug = 'tarta-jamon-queso' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 360, 60, false, 1
  from meals where slug = 'tarta-jamon-queso' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tarta-jamon-queso' and m.profile_id is null and t.slug in ('cena', 'normal', 'para_llevar', 'casa', 'salado', 'almuerzo', 'preparar_noche_anterior')
  on conflict do nothing;

-- Bife con puré de calabaza
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'bife-pure-calabaza', 'Bife con puré de calabaza', 'La carne no tiene carbohidratos: el número es todo de la guarnición.', 'cena', 'estimado',
  24, 'estimacion', 'estimada', '1 plato',
  'vacío', array['en casa', 'potente'], 10, 'potente',
  false, false, true, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'almuerzo']::meal_category[], 25, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'bife-pure-calabaza' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 350, 24, true, 0
  from meals where slug = 'bife-pure-calabaza' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'bife-pure-calabaza' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'salado', 'almuerzo')
  on conflict do nothing;

-- Asado con ensalada
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'asado', 'Asado con ensalada', 'La carne no suma. Los catorce gramos son del pan y la ensalada.', 'cena', 'estimado',
  14, 'estimacion', 'estimada', '1 plato',
  'asado', array['en casa', 'potente'], 15, 'potente',
  false, false, false, false, false,
  2, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'almuerzo']::meal_category[], 120, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'asado' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 400, 14, true, 0
  from meals where slug = 'asado' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con dos rebanadas de pan', 460, 40, false, 1
  from meals where slug = 'asado' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'asado' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'salado', 'almuerzo')
  on conflict do nothing;

-- Revuelto de zapallitos
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'revuelto-zapallitos', 'Revuelto de zapallitos', 'Cena liviana para cuando se come tarde.', 'cena', 'estimado',
  18, 'estimacion', 'estimada', '1 plato',
  'zapallito', array['en casa', 'rápido'], 15, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'revuelto-zapallitos' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 300, 18, true, 0
  from meals where slug = 'revuelto-zapallitos' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'revuelto-zapallitos' and m.profile_id is null and t.slug in ('cena', 'normal', 'casa', 'rapido', 'salado')
  on conflict do nothing;

-- Sopa de calabaza con pan
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sopa-calabaza', 'Sopa de calabaza con pan', 'El pan es lo que la convierte en cena y no en entrada.', 'cena', 'estimado',
  34, 'estimacion', 'estimada', '1 plato hondo',
  'calabaza', array['en casa'], 10, 'normal',
  false, false, true, false, true,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], 30, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sopa-calabaza' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato hondo', 400, 34, true, 0
  from meals where slug = 'sopa-calabaza' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin pan', 350, 22, false, 1
  from meals where slug = 'sopa-calabaza' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sopa-calabaza' and m.profile_id is null and t.slug in ('cena', 'normal', 'casa', 'salado')
  on conflict do nothing;

-- Omelette de queso con pan
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'omelette-queso', 'Omelette de queso con pan', 'Diez minutos y no hay nada que planear.', 'cena', 'estimado',
  20, 'estimacion', 'estimada', '1 omelette',
  'huevo', array['en casa', 'rápido', 'potente'], 10, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'omelette-queso' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 omelette', 250, 20, true, 0
  from meals where slug = 'omelette-queso' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'omelette-queso' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'rapido', 'salado', 'merienda')
  on conflict do nothing;

-- Picada para cenar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'picada-cena', 'Picada para cenar', 'Queso, fiambre y pan. La cena de cuando no querés cocinar.', 'cena', 'estimado',
  30, 'estimacion', 'estimada', '1 tabla chica',
  'queso', array['en casa', 'salado', 'rápido'], 8, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'picada-cena' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tabla chica', 250, 30, true, 0
  from meals where slug = 'picada-cena' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'picada-cena' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'salado', 'rapido')
  on conflict do nothing;

-- Ensalada de atún, huevo y papa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ensalada-atun-cena', 'Ensalada de atún, huevo y papa', 'Sin cocinar nada más que el huevo. Se deja lista la noche anterior.', 'cena', 'estimado',
  22, 'estimacion', 'estimada', '1 plato',
  'atún', array['para llevar', 'en casa'], 12, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'almuerzo']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-atun-cena' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 380, 22, true, 0
  from meals where slug = 'ensalada-atun-cena' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-atun-cena' and m.profile_id is null and t.slug in ('cena', 'potente', 'para_llevar', 'casa', 'salado', 'almuerzo', 'preparar_noche_anterior')
  on conflict do nothing;

-- Sándwich caliente con huevo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-cena-rapido', 'Sándwich caliente con huevo', 'Diez minutos, una sartén y listo.', 'cena', 'estimado',
  36, 'estimacion', 'estimada', '1 sándwich',
  'pan', array['en casa', 'rápido', 'potente'], 10, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-cena-rapido' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', 220, 36, true, 0
  from meals where slug = 'sandwich-cena-rapido' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-cena-rapido' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'rapido', 'salado', 'merienda')
  on conflict do nothing;

-- Ravioles con manteca y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ravioles-cena-rapida', 'Ravioles con manteca y queso', 'Quince minutos de punta a punta, contando el agua.', 'cena', 'estimado',
  66, 'estimacion', 'estimada', '1 plato',
  'ravioles', array['en casa', 'rápido', 'potente'], 8, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], 15, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ravioles-cena-rapida' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 320, 66, true, 0
  from meals where slug = 'ravioles-cena-rapida' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ravioles-cena-rapida' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'rapido', 'salado')
  on conflict do nothing;

-- Tomate con muzzarella y pan
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ensalada-caprese-cena', 'Tomate con muzzarella y pan', 'Sin cocinar nada. Para las noches de calor.', 'cena', 'estimado',
  26, 'estimacion', 'estimada', '1 plato',
  'tomate', array['en casa', 'rápido'], 6, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'salado'::flavor, array['cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-caprese-cena' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 300, 26, true, 0
  from meals where slug = 'ensalada-caprese-cena' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-caprese-cena' and m.profile_id is null and t.slug in ('cena', 'normal', 'casa', 'rapido', 'salado')
  on conflict do nothing;

-- Choripán
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'choripan', 'Choripán', 'El pan es todo el número: el chorizo no aporta carbohidratos.', 'cena', 'estimado',
  32, 'estimacion', 'estimada', '1 choripán',
  'chorizo', array['en casa', 'potente', 'antojo'], 5, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'almuerzo']::meal_category[], 20, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'choripan' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 choripán', 200, 32, true, 0
  from meals where slug = 'choripan' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'choripan' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'dulce', 'salado', 'almuerzo')
  on conflict do nothing;

-- Budincitos de huevo, queso y espinaca
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'budincitos-huevo', 'Budincitos de huevo, queso y espinaca', 'Salen doce de una horneada y sirven de cena o de snack toda la semana.', 'cena', 'estimado',
  6, 'estimacion', 'estimada', '3 budincitos',
  'huevo', array['en casa', 'salado', 'potente'], 15, 'potente',
  true, true, false, false, true,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'casera'::food_origin, 'salado'::flavor, array['cena', 'snack', 'desayuno']::meal_category[], 35, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'budincitos-huevo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 budincitos', 180, 6, true, 0
  from meals where slug = 'budincitos-huevo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'budincitos-huevo' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'salado', 'media_tarde', 'desayuno', 'para_llevar')
  on conflict do nothing;

-- Flan con dulce de leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'flan-dulce-de-leche', 'Flan con dulce de leche', 'Cuarenta gramos con dulce de leche, veintiocho sin.', 'snack', 'estimado',
  40, 'estimacion', 'estimada', '1 porción',
  'huevo', array['dulce', 'antojo'], 10, 'normal',
  false, true, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], 60, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'flan-dulce-de-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 150, 40, true, 0
  from meals where slug = 'flan-dulce-de-leche' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin dulce de leche', 120, 28, false, 1
  from meals where slug = 'flan-dulce-de-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'flan-dulce-de-leche' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'dulce', 'merienda')
  on conflict do nothing;

-- Gelatina light
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'gelatina-light', 'Gelatina light', 'Casi sin carbohidratos. Sirve cuando el antojo es de algo dulce y frío.', 'snack', 'estimado',
  1, 'estimacion', 'estimada', '1 pote',
  'gelatina sin azúcar', array['dulce', 'envasado', 'supermercado'], 2, 'liviana',
  false, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'gelatina-light' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 120, 1, true, 0
  from meals where slug = 'gelatina-light' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'gelatina-light' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable', 'merienda')
  on conflict do nothing;

-- Chocolate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'chocolate-barra', 'Chocolate', 'Media barrita son catorce gramos. Sin azúcar agregada igual tiene carbohidratos.', 'snack', 'estimado',
  14, 'estimacion', 'estimada', '25 g (media barrita)',
  'chocolate', array['kiosco', 'dulce', 'antojo', 'envasado'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'chocolate-barra' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '25 g (media barrita)', 25, 14, true, 0
  from meals where slug = 'chocolate-barra' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 barrita (50 g)', 50, 28, false, 1
  from meals where slug = 'chocolate-barra' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'chocolate-barra' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'merienda', 'para_llevar')
  on conflict do nothing;

-- Helado de heladería
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'helado-heladeria', 'Helado de heladería', 'Una bocha, veintidós gramos. Dos bochas, cuarenta y cuatro.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 bocha',
  'helado', array['dulce', 'antojo', 'salida'], 0, 'liviana',
  false, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  true, array['restaurante']::venue[], 2, false, false,
  'heladeria'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'helado-heladeria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 bocha', null, 22, true, 0
  from meals where slug = 'helado-heladeria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 bochas', null, 44, false, 1
  from meals where slug = 'helado-heladeria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1/4 kg', null, 66, false, 2
  from meals where slug = 'helado-heladeria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'helado-heladeria' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'calle', 'comprable', 'merienda', 'sin_cocinar')
  on conflict do nothing;

-- Helado de pote
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'helado-pote', 'Helado de pote', 'El del freezer. Del pote es más fácil pasarse.', 'snack', 'estimado',
  20, 'estimacion', 'estimada', '2 cucharadas',
  'helado', array['dulce', 'antojo', 'envasado', 'supermercado'], 1, 'liviana',
  false, true, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'helado-pote' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 cucharadas', 80, 20, true, 0
  from meals where slug = 'helado-pote' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '4 cucharadas', 160, 40, false, 1
  from meals where slug = 'helado-pote' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'helado-pote' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable', 'merienda')
  on conflict do nothing;

-- Postre lácteo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'postre-lacteo', 'Postre lácteo', 'De los que vienen de a cuatro en el supermercado.', 'snack', 'estimado',
  20, 'estimacion', 'estimada', '1 pote',
  'postre lácteo', array['supermercado', 'envasado', 'dulce'], 1, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'postre-lacteo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 100, 20, true, 0
  from meals where slug = 'postre-lacteo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'postre-lacteo' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'merienda', 'para_llevar')
  on conflict do nothing;

-- Arroz con leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'arroz-con-leche', 'Arroz con leche', 'Se hace una olla y rinde cuatro.', 'snack', 'estimado',
  38, 'estimacion', 'estimada', '1 pote',
  'arroz', array['dulce', 'en casa'], 10, 'normal',
  false, true, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], 35, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'arroz-con-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 200, 38, true, 0
  from meals where slug = 'arroz-con-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'arroz-con-leche' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'dulce', 'casa', 'merienda')
  on conflict do nothing;

-- Budín sin azúcar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'budin-sin-azucar', 'Budín sin azúcar', 'Sin azúcar agregada, pero la harina sigue ahí: veintidós gramos.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 porción',
  'budín sin azúcar', array['dulce', 'envasado', 'supermercado', 'para llevar'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'budin-sin-azucar' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 60, 22, true, 0
  from meals where slug = 'budin-sin-azucar' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'budin-sin-azucar' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable', 'para_llevar', 'merienda')
  on conflict do nothing;

-- Flan sin azúcar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'flan-sin-azucar', 'Flan sin azúcar', 'Doce gramos. Menos que el casero, pero no cero.', 'snack', 'estimado',
  12, 'estimacion', 'estimada', '1 pote',
  'flan sin azúcar', array['dulce', 'envasado', 'supermercado'], 1, 'liviana',
  false, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'flan-sin-azucar' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 120, 12, true, 0
  from meals where slug = 'flan-sin-azucar' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'flan-sin-azucar' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable', 'merienda')
  on conflict do nothing;

-- Bocadito de chocolate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'bocadito-chocolate', 'Bocadito de chocolate', 'De kiosco, de los que se comen en un bocado.', 'snack', 'estimado',
  16, 'estimacion', 'estimada', '1 bocadito',
  'chocolate', array['kiosco', 'envasado', 'dulce', 'antojo'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'bocadito-chocolate' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 bocadito', 30, 16, true, 0
  from meals where slug = 'bocadito-chocolate' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'bocadito-chocolate' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Duraznos en almíbar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'fruta-almibar', 'Duraznos en almíbar', 'El almíbar es casi todo el número.', 'snack', 'estimado',
  30, 'estimacion', 'estimada', '2 mitades',
  'manzana', array['dulce', 'envasado', 'supermercado'], 2, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'fruta-almibar' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 mitades', 150, 30, true, 0
  from meals where slug = 'fruta-almibar' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'fruta-almibar' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable', 'merienda')
  on conflict do nothing;

-- Mousse de chocolate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'mousse-chocolate', 'Mousse de chocolate', 'De los del súper, en pote individual.', 'snack', 'estimado',
  26, 'estimacion', 'estimada', '1 pote',
  'chocolate', array['dulce', 'envasado', 'supermercado', 'antojo'], 1, 'liviana',
  false, true, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mousse-chocolate' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 100, 26, true, 0
  from meals where slug = 'mousse-chocolate' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mousse-chocolate' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable', 'merienda')
  on conflict do nothing;

-- Tostado de cafetería
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tostado-cafeteria', 'Tostado de cafetería', 'El de cualquier café, con pan de miga.', 'snack', 'estimado',
  28, 'estimacion', 'estimada', '1 tostado',
  'pan de miga', array['salida', 'salado', 'práctico'], 0, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['cafetería']::venue[], 1, true, false,
  'restaurante'::food_origin, 'salado'::flavor, array['snack', 'desayuno', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostado-cafeteria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tostado', null, 28, true, 0
  from meals where slug = 'tostado-cafeteria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostado-cafeteria' and m.profile_id is null and t.slug in ('media_tarde', 'potente', 'calle', 'salado', 'rapido', 'comprable', 'desayuno', 'merienda', 'sin_cocinar')
  on conflict do nothing;

-- Sándwich de miga
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-miga', 'Sándwich de miga', 'De panadería. Livianos de comer, no de carbohidratos.', 'snack', 'estimado',
  26, 'estimacion', 'estimada', '2 triples',
  'pan de miga', array['salida', 'salado'], 0, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['panadería']::venue[], 1, true, false,
  'panaderia'::food_origin, 'salado'::flavor, array['snack', 'almuerzo', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-miga' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 triples', null, 26, true, 0
  from meals where slug = 'sandwich-miga' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 triple', null, 13, false, 1
  from meals where slug = 'sandwich-miga' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-miga' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'calle', 'salado', 'comprable', 'almuerzo', 'merienda', 'sin_cocinar')
  on conflict do nothing;

-- Empanadas de rotisería
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'empanadas-rotiseria', 'Empanadas de rotisería', 'Más grandes que las caseras: veinticinco cada una, estimado sobre la porción del local.', 'almuerzo', 'estimado',
  75, 'estimacion', 'estimada', '3 empanadas',
  'harina', array['salida', 'potente'], 0, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['rotisería']::venue[], 2, true, false,
  'rotiseria'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'empanadas-rotiseria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 empanadas', null, 75, true, 0
  from meals where slug = 'empanadas-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 empanada', null, 25, false, 1
  from meals where slug = 'empanadas-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 empanadas', null, 50, false, 2
  from meals where slug = 'empanadas-rotiseria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'empanadas-rotiseria' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'comprable', 'salado', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Milanesa con papas fritas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'milanesa-completa-rotiseria', 'Milanesa con papas fritas', 'La de rotisería, con papas.', 'almuerzo', 'estimado',
  58, 'estimacion', 'estimada', '1 porción',
  'milanesa de carne', array['salida', 'potente', 'antojo'], 0, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  true, array['rotisería']::venue[], 2, false, false,
  'rotiseria'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'milanesa-completa-rotiseria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', null, 58, true, 0
  from meals where slug = 'milanesa-completa-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin papas', null, 14, false, 1
  from meals where slug = 'milanesa-completa-rotiseria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'milanesa-completa-rotiseria' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'dulce', 'comprable', 'salado', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Pollo al spiedo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pollo-spiedo-rotiseria', 'Pollo al spiedo', 'Casi cero carbohidratos. Lo que suma es la guarnición que le pongas.', 'almuerzo', 'estimado',
  2, 'estimacion', 'estimada', '1/4 de pollo',
  'pollo entero', array['salida', 'potente'], 0, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['rotisería']::venue[], 2, false, false,
  'rotiseria'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pollo-spiedo-rotiseria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1/4 de pollo', null, 2, true, 0
  from meals where slug = 'pollo-spiedo-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con papas', null, 36, false, 1
  from meals where slug = 'pollo-spiedo-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con ensalada', null, 10, false, 2
  from meals where slug = 'pollo-spiedo-rotiseria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pollo-spiedo-rotiseria' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'comprable', 'salado', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Porción de tarta de rotisería
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'tarta-rotiseria', 'Porción de tarta de rotisería', 'De jamón y queso o de verdura, andan parecido.', 'almuerzo', 'estimado',
  34, 'estimacion', 'estimada', '1 porción',
  'masa de tarta', array['salida', 'práctico'], 0, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['rotisería']::venue[], 1, true, false,
  'rotiseria'::food_origin, 'salado'::flavor, array['almuerzo', 'cena', 'merienda']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tarta-rotiseria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', null, 34, true, 0
  from meals where slug = 'tarta-rotiseria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tarta-rotiseria' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'calle', 'rapido', 'comprable', 'salado', 'cena', 'merienda', 'sin_cocinar')
  on conflict do nothing;

-- Combo de estación de servicio
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'combo-estacion', 'Combo de estación de servicio', 'Lo que hay a las once de la noche en una estación de servicio.', 'snack', 'estimado',
  40, 'estimacion', 'estimada', '1 sándwich con bebida sin azúcar',
  'pan de miga', array['salida', 'emergencia', 'envasado', 'práctico'], 0, 'potente',
  false, false, false, false, false,
  1, 'emergencia', null, true, false, null,
  true, array['estación de servicio']::venue[], 2, true, false,
  'supermercado'::food_origin, 'salado'::flavor, array['snack', 'cena', 'almuerzo']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'combo-estacion' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich con bebida sin azúcar', null, 40, true, 0
  from meals where slug = 'combo-estacion' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'combo-estacion' and m.profile_id is null and t.slug in ('media_tarde', 'potente', 'calle', 'emergencia', 'comprable', 'rapido', 'salado', 'cena', 'almuerzo', 'sin_cocinar')
  on conflict do nothing;

-- Ensalada de supermercado
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'ensalada-supermercado', 'Ensalada de supermercado', 'Cuando no trajiste nada y no querés otro sándwich.', 'almuerzo', 'estimado',
  20, 'estimacion', 'estimada', '1 bandeja',
  'lechuga', array['salida', 'supermercado', 'envasado', 'práctico'], 0, 'normal',
  false, true, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['supermercado']::venue[], 2, false, false,
  'supermercado'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-supermercado' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 bandeja', null, 20, true, 0
  from meals where slug = 'ensalada-supermercado' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-supermercado' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'calle', 'comprable', 'rapido', 'salado', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Sándwich envasado de supermercado
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'sandwich-supermercado', 'Sándwich envasado de supermercado', 'De góndola refrigerada. El número lo dice el envase, cuando lo tenga cargado.', 'snack', 'estimado',
  40, 'estimacion', 'estimada', '1 sándwich',
  'pan de miga', array['salida', 'supermercado', 'envasado', 'práctico'], 0, 'potente',
  false, true, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['supermercado']::venue[], 2, true, false,
  'supermercado'::food_origin, 'salado'::flavor, array['snack', 'almuerzo']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-supermercado' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 sándwich', null, 40, true, 0
  from meals where slug = 'sandwich-supermercado' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-supermercado' and m.profile_id is null and t.slug in ('media_tarde', 'potente', 'calle', 'comprable', 'rapido', 'salado', 'almuerzo', 'sin_cocinar')
  on conflict do nothing;

-- Pizza de restaurante
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pizza-restaurante', 'Pizza de restaurante', 'La de local es más grande que la casera: treinta y cinco por porción.', 'cena', 'estimado',
  70, 'estimacion', 'estimada', '2 porciones',
  'masa de pizza', array['salida', 'potente', 'antojo'], 0, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  true, array['restaurante']::venue[], 2, true, false,
  'restaurante'::food_origin, 'salado'::flavor, array['cena', 'almuerzo']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pizza-restaurante' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', null, 70, true, 0
  from meals where slug = 'pizza-restaurante' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', null, 35, false, 1
  from meals where slug = 'pizza-restaurante' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 porciones', null, 105, false, 2
  from meals where slug = 'pizza-restaurante' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pizza-restaurante' and m.profile_id is null and t.slug in ('cena', 'potente', 'calle', 'dulce', 'comprable', 'salado', 'almuerzo', 'sin_cocinar')
  on conflict do nothing;

-- Pasta de restaurante
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pasta-restaurante', 'Pasta de restaurante', 'Las porciones de restaurante son grandes: ochenta y cinco gramos.', 'almuerzo', 'estimado',
  85, 'estimacion', 'estimada', '1 plato',
  'fideos', array['salida', 'potente'], 0, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  true, array['restaurante']::venue[], 3, false, false,
  'restaurante'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pasta-restaurante' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', null, 85, true, 0
  from meals where slug = 'pasta-restaurante' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Medio plato', null, 43, false, 1
  from meals where slug = 'pasta-restaurante' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pasta-restaurante' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'comprable', 'salado', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Carne con guarnición
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'carne-guarnicion-restaurante', 'Carne con guarnición', 'La carne no suma. El número es de la guarnición: papas, puré o arroz.', 'almuerzo', 'estimado',
  38, 'estimacion', 'estimada', '1 plato',
  'vacío', array['salida', 'potente'], 0, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['restaurante']::venue[], 3, false, false,
  'restaurante'::food_origin, 'salado'::flavor, array['almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'carne-guarnicion-restaurante' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', null, 38, true, 0
  from meals where slug = 'carne-guarnicion-restaurante' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con ensalada en vez de papas', null, 10, false, 1
  from meals where slug = 'carne-guarnicion-restaurante' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'carne-guarnicion-restaurante' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'comprable', 'salado', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Empanada de kiosco
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'empanada-kiosco', 'Empanada de kiosco', 'La que te salva a las cuatro de la tarde.', 'snack', 'estimado',
  24, 'estimacion', 'estimada', '1 empanada',
  'harina', array['salida', 'kiosco', 'emergencia', 'práctico'], 0, 'normal',
  false, false, false, false, false,
  1, 'emergencia', null, true, false, null,
  true, array['kiosco']::venue[], 1, true, false,
  'kiosco'::food_origin, 'salado'::flavor, array['snack', 'almuerzo']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'empanada-kiosco' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 empanada', null, 24, true, 0
  from meals where slug = 'empanada-kiosco' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'empanada-kiosco' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'calle', 'comprable', 'emergencia', 'rapido', 'salado', 'almuerzo', 'sin_cocinar')
  on conflict do nothing;

-- Pancho
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pancho-kiosco', 'Pancho', 'El pan es todo el número.', 'snack', 'estimado',
  30, 'estimacion', 'estimada', '1 pancho',
  'pan de pancho', array['salida', 'kiosco', 'antojo', 'emergencia'], 0, 'normal',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  true, array['kiosco']::venue[], 1, true, false,
  'kiosco'::food_origin, 'salado'::flavor, array['snack', 'almuerzo', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pancho-kiosco' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pancho', null, 30, true, 0
  from meals where slug = 'pancho-kiosco' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pancho-kiosco' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'calle', 'comprable', 'dulce', 'emergencia', 'salado', 'almuerzo', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Papas fritas de paquete
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'papas-fritas-paquete', 'Papas fritas de paquete', 'El paquete chico. El grande es el triple.', 'snack', 'estimado',
  30, 'estimacion', 'estimada', '1 paquete chico',
  'papa', array['kiosco', 'envasado', 'salado', 'antojo'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'salado'::flavor, array['snack']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'papas-fritas-paquete' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 paquete chico', 60, 30, true, 0
  from meals where slug = 'papas-fritas-paquete' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Paquete grande', 180, 90, false, 1
  from meals where slug = 'papas-fritas-paquete' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'papas-fritas-paquete' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'salado', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Porción de pizza al paso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'pizza-porcion-kiosco', 'Porción de pizza al paso', 'La del mostrador, parado. Una porción sola.', 'almuerzo', 'estimado',
  35, 'estimacion', 'estimada', '1 porción',
  'masa de pizza', array['salida', 'antojo', 'práctico'], 0, 'normal',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  true, array['restaurante']::venue[], 1, true, false,
  'restaurante'::food_origin, 'salado'::flavor, array['almuerzo', 'snack', 'cena']::meal_category[], null, false,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pizza-porcion-kiosco' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', null, 35, true, 0
  from meals where slug = 'pizza-porcion-kiosco' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', null, 70, false, 1
  from meals where slug = 'pizza-porcion-kiosco' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pizza-porcion-kiosco' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'calle', 'dulce', 'rapido', 'comprable', 'salado', 'media_tarde', 'cena', 'sin_cocinar')
  on conflict do nothing;

-- Café
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'cafe-solo', 'Café', 'Sin azúcar, cero. Con azúcar son cinco gramos por cucharadita.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '1 taza',
  'café', array['rápido', 'práctico'], 2, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'cafe-solo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 taza', 200, 0, true, 0
  from meals where slug = 'cafe-solo' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con una cucharadita de azúcar', 200, 5, false, 1
  from meals where slug = 'cafe-solo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'cafe-solo' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido')
  on conflict do nothing;

-- Café con leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'cafe-con-leche', 'Café con leche', 'La leche sí suma: diez gramos por taza.', 'snack', 'estimado',
  10, 'estimacion', 'estimada', '1 taza',
  'leche', array['rápido', 'práctico'], 3, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'cafe-con-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 taza', 250, 10, true, 0
  from meals where slug = 'cafe-con-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'cafe-con-leche' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido')
  on conflict do nothing;

-- Mate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'mate', 'Mate', 'Cero carbohidratos. Con azúcar, cinco por cucharadita.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '1 mate',
  'yerba', array['rápido', 'práctico'], 2, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mate' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 mate', null, 0, true, 0
  from meals where slug = 'mate' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mate' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido')
  on conflict do nothing;

-- Mate cocido
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'mate-cocido', 'Mate cocido', 'Solo, cero. Con leche son diez.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '1 taza',
  'mate cocido', array['rápido', 'práctico'], 3, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mate-cocido' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 taza', 200, 0, true, 0
  from meals where slug = 'mate-cocido' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con leche', 250, 10, false, 1
  from meals where slug = 'mate-cocido' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mate-cocido' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido')
  on conflict do nothing;

-- Té
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'te', 'Té', 'Cero. Lo que suma es lo que le ponés.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '1 taza',
  'té', array['rápido', 'práctico'], 3, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'te' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 taza', 200, 0, true, 0
  from meals where slug = 'te' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'te' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido')
  on conflict do nothing;

-- Agua
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'agua', 'Agua', 'Cero, siempre.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '1 vaso',
  'agua', array['rápido', 'práctico'], 0, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'agua' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 vaso', 250, 0, true, 0
  from meals where slug = 'agua' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'agua' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido', 'sin_cocinar')
  on conflict do nothing;

-- Gaseosa común
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'gaseosa-comun', 'Gaseosa común', 'Medio litro son 53 gramos, y líquidos: entran más rápido que los de un plato.', 'snack', 'estimado',
  53, 'estimacion', 'estimada', '500 ml',
  'gaseosa', array['kiosco', 'envasado', 'dulce', 'salida'], 0, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'gaseosa-comun' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '500 ml', 500, 53, true, 0
  from meals where slug = 'gaseosa-comun' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 vaso (250 ml)', 250, 26, false, 1
  from meals where slug = 'gaseosa-comun' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'gaseosa-comun' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'calle', 'para_llevar', 'sin_cocinar')
  on conflict do nothing;

-- Gaseosa sin azúcar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'gaseosa-zero', 'Gaseosa sin azúcar', 'Cero carbohidratos. Sirve para acompañar sin sumar.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '500 ml',
  'gaseosa sin azúcar', array['kiosco', 'envasado', 'salida', 'práctico'], 0, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
  'envasada'::food_origin, 'neutral'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'gaseosa-zero' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '500 ml', 500, 0, true, 0
  from meals where slug = 'gaseosa-zero' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'gaseosa-zero' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'calle', 'rapido', 'para_llevar', 'sin_cocinar')
  on conflict do nothing;

-- Jugo de naranja exprimido
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  origin, flavor, moments, total_minutes, is_drink,
  source_name
) values (
  null, 'jugo-exprimido', 'Jugo de naranja exprimido', 'Natural, pero el azúcar de la fruta está igual: veintidós gramos.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 vaso',
  'limón', array['rápido', 'dulce'], 5, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
  'casera'::food_origin, 'dulce'::flavor, array['snack']::meal_category[], null, true,
  'porción estándar calculada'
)
on conflict (slug) where profile_id is null and slug is not null do update set
  name = excluded.name, description = excluded.description,
  category = excluded.category, carbs_total = excluded.carbs_total,
  portion = excluded.portion, main_ingredient = excluded.main_ingredient,
  subcategories = excluded.subcategories, prep_minutes = excluded.prep_minutes,
  satiety = excluded.satiety, portable = excluded.portable,
  needs_cold = excluded.needs_cold, needs_reheat = excluded.needs_reheat,
  make_night_before = excluded.make_night_before, freezable = excluded.freezable,
  difficulty = excluded.difficulty, freq = excluded.freq, drink = excluded.drink,
  everyday = excluded.everyday, added_sugar = excluded.added_sugar,
  notes = excluded.notes, buy_outside = excluded.buy_outside,
  venues = excluded.venues, price_level = excluded.price_level,
  handheld = excluded.handheld, origin = excluded.origin,
  flavor = excluded.flavor, moments = excluded.moments,
  total_minutes = excluded.total_minutes, is_drink = excluded.is_drink,
  updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'jugo-exprimido' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 vaso', 250, 22, true, 0
  from meals where slug = 'jugo-exprimido' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'jugo-exprimido' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido', 'dulce')
  on conflict do nothing;

