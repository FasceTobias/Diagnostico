-- ==================================================================
-- Catálogo v1 — generado por scripts/catalogo-sql.mjs. No editar.
--
-- 44 entradas, todas ESTIMADAS: la porción está
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
  source_name
) values (
  null, 'tostadas-queso-untable-cafe', 'Tostadas con queso untable', 'El desayuno de todos los días. Con café con leche, que también suma.', 'desayuno', 'estimado',
  26, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'rápido', 'salado'], 5, 'normal',
  false, false, false, false, false,
  1, 'habitual', 'café con leche', true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostadas-queso-untable-cafe' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 60, 26, true, 0
  from meals where slug = 'tostadas-queso-untable-cafe' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostadas-queso-untable-cafe' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'salado')
  on conflict do nothing;

-- Tostadas con manteca y mermelada
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'mate-tostadas-manteca', 'Tostadas con manteca y mermelada', 'Con mate, que no suma carbohidratos.', 'desayuno', 'estimado',
  32, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'rápido', 'dulce'], 5, 'normal',
  false, false, false, false, false,
  1, 'habitual', 'mate', true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mate-tostadas-manteca' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 60, 32, true, 0
  from meals where slug = 'mate-tostadas-manteca' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mate-tostadas-manteca' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'casa', 'rapido', 'dulce')
  on conflict do nothing;

-- Tostado de jamón y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'tostado-jamon-queso-desayuno', 'Tostado de jamón y queso', 'Cae bien a cualquier hora. Con café, es un desayuno que aguanta.', 'desayuno', 'estimado',
  30, 'estimacion', 'estimada', '1 tostado',
  'pan', array['en casa', 'rápido', 'salado', 'potente'], 7, 'potente',
  false, false, false, false, false,
  1, 'habitual', 'café con leche', true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostado-jamon-queso-desayuno' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tostado', 110, 30, true, 0
  from meals where slug = 'tostado-jamon-queso-desayuno' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostado-jamon-queso-desayuno' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'casa', 'rapido', 'salado')
  on conflict do nothing;

-- Huevos revueltos con tostadas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'huevos-revueltos-tostadas', 'Huevos revueltos con tostadas', 'Con dos huevos aguanta hasta el mediodía sin problema.', 'desayuno', 'estimado',
  28, 'estimacion', 'estimada', '1 plato',
  'huevo', array['en casa', 'salado', 'potente'], 10, 'potente',
  false, false, false, false, false,
  1, 'habitual', 'café', true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'huevos-revueltos-tostadas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 200, 28, true, 0
  from meals where slug = 'huevos-revueltos-tostadas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'huevos-revueltos-tostadas' and m.profile_id is null and t.slug in ('desayuno', 'potente', 'casa', 'salado')
  on conflict do nothing;

-- Yogur con granola y fruta
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'yogur-granola-fruta', 'Yogur con granola y fruta', 'Rápido y se puede llevar. La granola es lo que más carbohidratos aporta.', 'desayuno', 'estimado',
  38, 'estimacion', 'estimada', '1 pote',
  'yogur', array['para llevar', 'rápido', 'dulce'], 3, 'normal',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-granola-fruta' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 250, 38, true, 0
  from meals where slug = 'yogur-granola-fruta' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-granola-fruta' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'para_llevar', 'rapido', 'dulce')
  on conflict do nothing;

-- Medialunas con café con leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'medialunas-cafe', 'Medialunas con café con leche', 'Veinticuatro gramos cada una, y de los que entran rápido. Para un domingo.', 'desayuno', 'estimado',
  48, 'estimacion', 'estimada', '2 medialunas',
  'medialuna', array['dulce', 'rápido', 'antojo'], 3, 'normal',
  false, false, false, false, false,
  1, 'ocasional', 'café con leche', true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'medialunas-cafe' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 medialunas', 100, 48, true, 0
  from meals where slug = 'medialunas-cafe' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 medialuna', 50, 24, false, 1
  from meals where slug = 'medialunas-cafe' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 medialunas', 150, 72, false, 2
  from meals where slug = 'medialunas-cafe' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'medialunas-cafe' and m.profile_id is null and t.slug in ('desayuno', 'normal', 'dulce', 'rapido')
  on conflict do nothing;

-- Banana
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'banana', 'Banana', 'La fruta más práctica que hay: viene con envase.', 'snack', 'estimado',
  25, 'estimacion', 'estimada', '1 banana',
  'banana', array['para llevar', 'rápido', 'dulce'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'banana' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 banana', 120, 25, true, 0
  from meals where slug = 'banana' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'banana' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'rapido', 'dulce')
  on conflict do nothing;

-- Barra de cereal
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'barra-cereal', 'Barra de cereal', 'Aguanta en la mochila y se come caminando.', 'snack', 'estimado',
  17, 'estimacion', 'estimada', '1 barra',
  'barra de cereal', array['para llevar', 'kiosco', 'envasado', 'dulce', 'práctico'], 1, 'liviana',
  true, false, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'barra-cereal' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 barra', 25, 17, true, 0
  from meals where slug = 'barra-cereal' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'barra-cereal' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'para_llevar', 'comprable', 'dulce', 'rapido')
  on conflict do nothing;

-- Galletitas de agua con queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'galletitas-agua-queso', 'Galletitas de agua con queso', 'Salado y práctico. Las galletitas son casi todo el carbohidrato.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '6 galletitas',
  'galletitas sin azúcar', array['para llevar', 'salado', 'práctico'], 3, 'normal',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

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

-- Alfajor simple
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'alfajor-simple', 'Alfajor simple', 'Treinta gramos en algo que se come en dos minutos. Mejor saberlo antes.', 'snack', 'estimado',
  30, 'estimacion', 'estimada', '1 alfajor',
  'alfajor', array['kiosco', 'envasado', 'dulce', 'antojo'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'alfajor-simple' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 alfajor', 45, 30, true, 0
  from meals where slug = 'alfajor-simple' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'alfajor-simple' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Puñado de maní
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'puñado-mani', 'Puñado de maní', 'Casi sin carbohidratos y aguanta bastante.', 'snack', 'estimado',
  6, 'estimacion', 'estimada', '30 g',
  'nuez', array['para llevar', 'salado', 'práctico'], 1, 'normal',
  true, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'puñado-mani' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '30 g', 30, 6, true, 0
  from meals where slug = 'puñado-mani' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'puñado-mani' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'para_llevar', 'salado', 'rapido')
  on conflict do nothing;

-- Yogur bebible
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'yogur-bebible', 'Yogur bebible', 'De supermercado o kiosco. Se toma caminando.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 botellita',
  'yogur entero', array['supermercado', 'envasado', 'dulce', 'para llevar'], 1, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-bebible' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 botellita', 200, 22, true, 0
  from meals where slug = 'yogur-bebible' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-bebible' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Milanesa con puré
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'milanesa-pure', 'Milanesa con puré', 'De las comidas más normales que hay. El puré es la mitad del número.', 'almuerzo', 'estimado',
  42, 'estimacion', 'estimada', '1 plato',
  'milanesa de pollo', array['en casa', 'potente'], 35, 'potente',
  false, false, true, false, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'milanesa-pure' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 400, 42, true, 0
  from meals where slug = 'milanesa-pure' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Con medio puré', 300, 27, false, 1
  from meals where slug = 'milanesa-pure' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'milanesa-pure' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa')
  on conflict do nothing;

-- Pollo al horno con papas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'pollo-horno-papas', 'Pollo al horno con papas', 'Se hace una vez y rinde dos comidas.', 'almuerzo', 'estimado',
  40, 'estimacion', 'estimada', '1 plato',
  'pollo', array['en casa', 'potente'], 45, 'potente',
  false, false, true, true, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pollo-horno-papas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 450, 40, true, 0
  from meals where slug = 'pollo-horno-papas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pollo-horno-papas' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa', 'preparar_noche_anterior')
  on conflict do nothing;

-- Fideos con tuco
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'fideos-tuco', 'Fideos con tuco', 'De lo que más carbohidratos tiene del día. Conviene mirarlo bien.', 'almuerzo', 'estimado',
  62, 'estimacion', 'estimada', '1 plato',
  'fideos', array['en casa', 'potente'], 20, 'potente',
  false, false, true, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'fideos-tuco' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 350, 62, true, 0
  from meals where slug = 'fideos-tuco' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Medio plato', 175, 31, false, 1
  from meals where slug = 'fideos-tuco' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'fideos-tuco' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'casa')
  on conflict do nothing;

-- Arroz con pollo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'arroz-con-pollo', 'Arroz con pollo', 'Se come frío o caliente y viaja bien en tupper.', 'almuerzo', 'estimado',
  50, 'estimacion', 'estimada', '1 plato',
  'arroz', array['para llevar', 'potente'], 30, 'potente',
  true, true, false, true, true,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'arroz-con-pollo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 400, 50, true, 0
  from meals where slug = 'arroz-con-pollo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'arroz-con-pollo' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'preparar_noche_anterior')
  on conflict do nothing;

-- Tortilla de papa
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'tortilla-papa', 'Tortilla de papa', 'Fría al día siguiente está mejor que recién hecha.', 'almuerzo', 'estimado',
  30, 'estimacion', 'estimada', '2 porciones',
  'papa', array['para llevar', 'en casa'], 30, 'normal',
  true, true, false, true, false,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tortilla-papa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 250, 30, true, 0
  from meals where slug = 'tortilla-papa' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 125, 15, false, 1
  from meals where slug = 'tortilla-papa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tortilla-papa' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'para_llevar', 'casa', 'preparar_noche_anterior')
  on conflict do nothing;

-- Empanadas de carne
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'empanadas-carne', 'Empanadas de carne', 'Veintidós gramos cada una, más o menos según la masa.', 'almuerzo', 'estimado',
  66, 'estimacion', 'estimada', '3 empanadas',
  'harina', array['potente', 'antojo'], 15, 'potente',
  true, false, true, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'empanadas-carne' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 empanadas', 300, 66, true, 0
  from meals where slug = 'empanadas-carne' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 empanada', 100, 22, false, 1
  from meals where slug = 'empanadas-carne' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 empanadas', 200, 44, false, 2
  from meals where slug = 'empanadas-carne' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'empanadas-carne' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Pizza de muzzarella
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'pizza-muzzarella', 'Pizza de muzzarella', 'Treinta gramos por porción, sesenta por dos. De las de cada tanto.', 'cena', 'estimado',
  60, 'estimacion', 'estimada', '2 porciones',
  'masa de pizza', array['en casa', 'potente', 'antojo'], 25, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'pizza-muzzarella' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 220, 60, true, 0
  from meals where slug = 'pizza-muzzarella' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 110, 30, false, 1
  from meals where slug = 'pizza-muzzarella' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 porciones', 330, 90, false, 2
  from meals where slug = 'pizza-muzzarella' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'pizza-muzzarella' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'dulce')
  on conflict do nothing;

-- Hamburguesa con papas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'hamburguesa-casera', 'Hamburguesa con papas', 'El pan y las papas son casi todo el número; la carne no aporta nada.', 'cena', 'estimado',
  75, 'estimacion', 'estimada', '1 hamburguesa con papas',
  'carne picada', array['en casa', 'potente', 'antojo'], 25, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'hamburguesa-casera' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 hamburguesa con papas', 400, 75, true, 0
  from meals where slug = 'hamburguesa-casera' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin papas', 250, 30, false, 1
  from meals where slug = 'hamburguesa-casera' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'hamburguesa-casera' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa', 'dulce')
  on conflict do nothing;

-- Ensalada completa con pollo y huevo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'ensalada-completa', 'Ensalada completa con pollo y huevo', 'Completa de verdad: con papa, huevo y pollo llena igual que un plato caliente.', 'almuerzo', 'estimado',
  26, 'estimacion', 'estimada', '1 plato grande',
  'pollo', array['para llevar'], 20, 'potente',
  true, true, false, true, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-completa' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato grande', 450, 26, true, 0
  from meals where slug = 'ensalada-completa' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-completa' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'para_llevar', 'preparar_noche_anterior')
  on conflict do nothing;

-- Tarta de jamón y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'tarta-jamon-queso', 'Tarta de jamón y queso', 'Entera rinde cuatro comidas y se lleva fría sin drama.', 'cena', 'estimado',
  30, 'estimacion', 'estimada', '1 porción',
  'masa de tarta', array['para llevar', 'en casa'], 35, 'normal',
  true, true, false, true, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tarta-jamon-queso' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 180, 30, true, 0
  from meals where slug = 'tarta-jamon-queso' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 porciones', 360, 60, false, 1
  from meals where slug = 'tarta-jamon-queso' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tarta-jamon-queso' and m.profile_id is null and t.slug in ('cena', 'normal', 'para_llevar', 'casa', 'preparar_noche_anterior')
  on conflict do nothing;

-- Guiso de lentejas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'guiso-lentejas', 'Guiso de lentejas', 'Barato, rinde y se congela. De lo más práctico que hay.', 'cena', 'estimado',
  48, 'estimacion', 'estimada', '1 plato hondo',
  'lentejas cocidas', array['en casa', 'potente'], 40, 'potente',
  false, false, true, false, true,
  2, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'guiso-lentejas' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato hondo', 400, 48, true, 0
  from meals where slug = 'guiso-lentejas' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'guiso-lentejas' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa')
  on conflict do nothing;

-- Bife con puré de calabaza
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'bife-pure-calabaza', 'Bife con puré de calabaza', 'La carne no tiene carbohidratos: el número es todo de la guarnición.', 'cena', 'estimado',
  24, 'estimacion', 'estimada', '1 plato',
  'carne picada', array['en casa', 'potente'], 25, 'potente',
  false, false, true, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'bife-pure-calabaza' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 plato', 350, 24, true, 0
  from meals where slug = 'bife-pure-calabaza' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'bife-pure-calabaza' and m.profile_id is null and t.slug in ('cena', 'potente', 'casa')
  on conflict do nothing;

-- Mate con galletitas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'mate-galletitas-dulces', 'Mate con galletitas', 'La merienda de casi todo el mundo.', 'merienda', 'estimado',
  34, 'estimacion', 'estimada', '6 galletitas',
  'galletitas sin azúcar', array['en casa', 'dulce', 'rápido'], 2, 'normal',
  false, false, false, false, false,
  1, 'habitual', 'mate', true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'mate-galletitas-dulces' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '6 galletitas', 60, 34, true, 0
  from meals where slug = 'mate-galletitas-dulces' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 galletitas', 30, 17, false, 1
  from meals where slug = 'mate-galletitas-dulces' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'mate-galletitas-dulces' and m.profile_id is null and t.slug in ('merienda', 'normal', 'casa', 'dulce', 'rapido')
  on conflict do nothing;

-- Café con budín
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'cafe-budin', 'Café con budín', 'Con el número a la vista, una porción de budín es una porción de budín.', 'merienda', 'estimado',
  38, 'estimacion', 'estimada', '1 porción de budín',
  'budín', array['dulce', 'rápido', 'antojo'], 2, 'normal',
  false, false, false, false, false,
  1, 'ocasional', 'café', true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'cafe-budin' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción de budín', 80, 38, true, 0
  from meals where slug = 'cafe-budin' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Media porción', 40, 19, false, 1
  from meals where slug = 'cafe-budin' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'cafe-budin' and m.profile_id is null and t.slug in ('merienda', 'normal', 'dulce', 'rapido')
  on conflict do nothing;

-- Tostado con café con leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'tostado-merienda', 'Tostado con café con leche', 'Cuando la cena va a ser tarde, esto la aguanta.', 'merienda', 'estimado',
  30, 'estimacion', 'estimada', '1 tostado',
  'pan', array['en casa', 'salado', 'potente'], 7, 'potente',
  false, false, false, false, false,
  1, 'habitual', 'café con leche', true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostado-merienda' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tostado', 110, 30, true, 0
  from meals where slug = 'tostado-merienda' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostado-merienda' and m.profile_id is null and t.slug in ('merienda', 'potente', 'casa', 'salado')
  on conflict do nothing;

-- Yogur con fruta
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'yogur-con-fruta', 'Yogur con fruta', 'Liviana y se prepara en un minuto.', 'merienda', 'estimado',
  26, 'estimacion', 'estimada', '1 pote con fruta',
  'yogur natural', array['rápido', 'dulce', 'para llevar'], 3, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'yogur-con-fruta' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote con fruta', 280, 26, true, 0
  from meals where slug = 'yogur-con-fruta' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'yogur-con-fruta' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'rapido', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Té con tostadas y mermelada
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'te-tostadas-mermelada', 'Té con tostadas y mermelada', 'Liviana, para cuando la cena viene pesada.', 'merienda', 'estimado',
  30, 'estimacion', 'estimada', '2 tostadas',
  'pan', array['en casa', 'dulce', 'rápido'], 4, 'liviana',
  false, false, false, false, false,
  1, 'habitual', 'té', true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'te-tostadas-mermelada' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 tostadas', 60, 30, true, 0
  from meals where slug = 'te-tostadas-mermelada' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'te-tostadas-mermelada' and m.profile_id is null and t.slug in ('merienda', 'liviana', 'casa', 'dulce', 'rapido')
  on conflict do nothing;

-- Flan con dulce de leche
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'flan-dulce-de-leche', 'Flan con dulce de leche', 'Cuarenta gramos con dulce de leche, veintiocho sin.', 'snack', 'estimado',
  40, 'estimacion', 'estimada', '1 porción',
  'huevo', array['dulce', 'antojo'], 5, 'liviana',
  false, true, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'flan-dulce-de-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', 150, 40, true, 0
  from meals where slug = 'flan-dulce-de-leche' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin dulce de leche', 120, 28, false, 1
  from meals where slug = 'flan-dulce-de-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'flan-dulce-de-leche' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce')
  on conflict do nothing;

-- Gelatina light
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'gelatina-light', 'Gelatina light', 'Casi sin carbohidratos. Sirve cuando el antojo es de algo dulce y frío.', 'snack', 'estimado',
  1, 'estimacion', 'estimada', '1 pote',
  'gelatina sin azúcar', array['dulce', 'envasado', 'supermercado'], 2, 'liviana',
  false, true, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'gelatina-light' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 120, 1, true, 0
  from meals where slug = 'gelatina-light' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'gelatina-light' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'comprable')
  on conflict do nothing;

-- Chocolate
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'chocolate-barra', 'Chocolate', 'Media barrita son catorce gramos. Sin azúcar agregada igual tiene carbohidratos.', 'snack', 'estimado',
  14, 'estimacion', 'estimada', '25 g (media barrita)',
  'chocolate', array['kiosco', 'dulce', 'antojo', 'envasado'], 1, 'liviana',
  true, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, true, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'chocolate-barra' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '25 g (media barrita)', 25, 14, true, 0
  from meals where slug = 'chocolate-barra' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 barrita (50 g)', 50, 28, false, 1
  from meals where slug = 'chocolate-barra' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'chocolate-barra' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Helado
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'helado-bocha', 'Helado', 'Una bocha, veintidós gramos. Dos bochas, cuarenta y cuatro.', 'snack', 'estimado',
  22, 'estimacion', 'estimada', '1 bocha',
  'leche', array['dulce', 'antojo', 'salida'], 1, 'liviana',
  false, true, false, false, false,
  1, 'ocasional', null, true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'helado-bocha' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 bocha', 90, 22, true, 0
  from meals where slug = 'helado-bocha' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 bochas', 180, 44, false, 1
  from meals where slug = 'helado-bocha' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'helado-bocha' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'dulce', 'calle')
  on conflict do nothing;

-- Postre lácteo
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'postre-lacteo', 'Postre lácteo', 'De los que vienen de a cuatro en el supermercado.', 'snack', 'estimado',
  20, 'estimacion', 'estimada', '1 pote',
  'yogur entero', array['supermercado', 'envasado', 'dulce'], 1, 'liviana',
  true, true, false, false, false,
  1, 'habitual', null, true, true, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'postre-lacteo' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 pote', 100, 20, true, 0
  from meals where slug = 'postre-lacteo' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'postre-lacteo' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'para_llevar')
  on conflict do nothing;

-- Tostado de jamón y queso
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'tostado-cafeteria', 'Tostado de jamón y queso', 'El de cualquier café. Pan de miga, así que un poco menos que el de casa.', 'snack', 'estimado',
  28, 'estimacion', 'estimada', '1 tostado',
  'pan', array['salida', 'salado', 'práctico'], 0, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['cafetería']::venue[], 1, true, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'tostado-cafeteria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 tostado', null, 28, true, 0
  from meals where slug = 'tostado-cafeteria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'tostado-cafeteria' and m.profile_id is null and t.slug in ('media_tarde', 'potente', 'calle', 'salado', 'rapido', 'comprable', 'sin_cocinar')
  on conflict do nothing;

-- Sándwich de miga
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'sandwich-miga', 'Sándwich de miga', 'De panadería. Livianos de comer, no de carbohidratos.', 'snack', 'estimado',
  26, 'estimacion', 'estimada', '2 triples',
  'pan', array['salida', 'salado'], 0, 'normal',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['panadería']::venue[], 1, true, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'sandwich-miga' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 triples', null, 26, true, 0
  from meals where slug = 'sandwich-miga' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 triple', null, 13, false, 1
  from meals where slug = 'sandwich-miga' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'sandwich-miga' and m.profile_id is null and t.slug in ('media_tarde', 'normal', 'calle', 'salado', 'comprable', 'sin_cocinar')
  on conflict do nothing;

-- Empanadas de rotisería
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'empanadas-rotiseria', 'Empanadas de rotisería', 'Veintidós gramos cada una, más o menos, según la masa.', 'almuerzo', 'estimado',
  66, 'estimacion', 'estimada', '3 empanadas',
  'harina', array['salida', 'potente'], 0, 'potente',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['rotisería']::venue[], 2, true, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'empanadas-rotiseria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '3 empanadas', null, 66, true, 0
  from meals where slug = 'empanadas-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 empanada', null, 22, false, 1
  from meals where slug = 'empanadas-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '2 empanadas', null, 44, false, 2
  from meals where slug = 'empanadas-rotiseria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'empanadas-rotiseria' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'comprable', 'sin_cocinar')
  on conflict do nothing;

-- Milanesa con papas fritas
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'milanesa-completa-rotiseria', 'Milanesa con papas fritas', 'La de rotisería, con papas. Cincuenta y ocho gramos; sin papas, catorce.', 'almuerzo', 'estimado',
  58, 'estimacion', 'estimada', '1 porción',
  'milanesa de pollo', array['salida', 'potente', 'antojo'], 0, 'potente',
  false, false, false, false, false,
  1, 'ocasional', null, true, false, null,
  true, array['rotisería']::venue[], 2, false, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'milanesa-completa-rotiseria' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 porción', null, 58, true, 0
  from meals where slug = 'milanesa-completa-rotiseria' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, 'Sin papas', null, 14, false, 1
  from meals where slug = 'milanesa-completa-rotiseria' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'milanesa-completa-rotiseria' and m.profile_id is null and t.slug in ('almuerzo', 'potente', 'calle', 'dulce', 'comprable', 'sin_cocinar')
  on conflict do nothing;

-- Sándwich con bebida sin azúcar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'combo-estacion', 'Sándwich con bebida sin azúcar', 'Lo que hay a las once de la noche en una estación de servicio.', 'snack', 'estimado',
  40, 'estimacion', 'estimada', '1 combo',
  'pan', array['salida', 'emergencia', 'envasado', 'práctico'], 0, 'potente',
  false, false, false, false, false,
  1, 'emergencia', null, true, false, null,
  true, array['estación de servicio']::venue[], 2, true, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'combo-estacion' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 combo', null, 40, true, 0
  from meals where slug = 'combo-estacion' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'combo-estacion' and m.profile_id is null and t.slug in ('media_tarde', 'potente', 'calle', 'emergencia', 'comprable', 'rapido', 'sin_cocinar')
  on conflict do nothing;

-- Ensalada armada de supermercado
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'ensalada-supermercado', 'Ensalada armada de supermercado', 'Cuando no trajiste nada y no querés otro sándwich.', 'almuerzo', 'estimado',
  20, 'estimacion', 'estimada', '1 bandeja',
  'lechuga', array['salida', 'supermercado', 'envasado', 'práctico'], 0, 'normal',
  false, true, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['supermercado']::venue[], 2, false, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'ensalada-supermercado' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 bandeja', null, 20, true, 0
  from meals where slug = 'ensalada-supermercado' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'ensalada-supermercado' and m.profile_id is null and t.slug in ('almuerzo', 'normal', 'calle', 'comprable', 'rapido', 'sin_cocinar')
  on conflict do nothing;

-- Café
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'cafe-solo', 'Café', 'Sin azúcar, cero. Con azúcar son cinco gramos por cucharadita.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '1 taza',
  'café', array['rápido', 'práctico'], 2, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

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
  source_name
) values (
  null, 'cafe-con-leche', 'Café con leche', 'La leche sí suma: diez gramos por taza.', 'snack', 'estimado',
  10, 'estimacion', 'estimada', '1 taza',
  'leche', array['rápido', 'práctico'], 3, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  false, '{}', null, false, true,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'cafe-con-leche' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 taza', 250, 10, true, 0
  from meals where slug = 'cafe-con-leche' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'cafe-con-leche' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'rapido')
  on conflict do nothing;

-- Gaseosa común
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'gaseosa-comun', 'Gaseosa común', 'Medio litro son 53 gramos, y líquidos: entran más rápido que los de un plato.', 'snack', 'estimado',
  53, 'estimacion', 'estimada', '500 ml',
  'chocolate', array['kiosco', 'envasado', 'dulce', 'salida'], 0, 'liviana',
  false, false, false, false, false,
  1, 'ocasional', null, true, true, null,
  true, array['kiosco', 'supermercado']::venue[], 1, true, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'gaseosa-comun' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '500 ml', null, 53, true, 0
  from meals where slug = 'gaseosa-comun' and profile_id is null;
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '1 vaso (250 ml)', null, 26, false, 1
  from meals where slug = 'gaseosa-comun' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'gaseosa-comun' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'dulce', 'calle', 'sin_cocinar')
  on conflict do nothing;

-- Gaseosa sin azúcar
insert into meals (
  profile_id, slug, name, description, category, data_state,
  carbs_total, carbs_source, carbs_confidence, portion,
  main_ingredient, subcategories, prep_minutes, satiety,
  portable, needs_cold, needs_reheat, make_night_before, freezable,
  difficulty, freq, drink, everyday, added_sugar, notes,
  buy_outside, venues, price_level, handheld, carbs_from_items,
  source_name
) values (
  null, 'gaseosa-zero', 'Gaseosa sin azúcar', 'Cero carbohidratos. Sirve para acompañar sin sumar.', 'snack', 'estimado',
  0, 'estimacion', 'estimada', '500 ml',
  'chocolate', array['kiosco', 'envasado', 'salida', 'práctico'], 0, 'liviana',
  false, false, false, false, false,
  1, 'habitual', null, true, false, null,
  true, array['kiosco', 'supermercado']::venue[], 1, true, false,
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
  handheld = excluded.handheld, updated_at = now();

delete from meal_portions where meal_id = (select id from meals where slug = 'gaseosa-zero' and profile_id is null);
insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order)
  select id, '500 ml', null, 0, true, 0
  from meals where slug = 'gaseosa-zero' and profile_id is null;
insert into meal_tags (meal_id, tag_slug)
  select m.id, t.slug from meals m, tags t
  where m.slug = 'gaseosa-zero' and m.profile_id is null and t.slug in ('media_tarde', 'liviana', 'comprable', 'calle', 'rapido', 'sin_cocinar')
  on conflict do nothing;

