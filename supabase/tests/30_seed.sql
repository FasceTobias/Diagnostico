-- ==================================================================
-- El catálogo cargado: que el seed haya entrado entero y bien.
-- ==================================================================

select public.ok(
  (select count(*) from meals where profile_id is null and slug is not null) >= 44,
  'las 44 entradas del catalogo entraron');

select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada' and data_state <> 'estimado') = 0,
  'ninguna entra como verificada: eso es la fase D');

select public.ok(
  (select carbs_total from meals where slug = 'pizza-muzzarella') = 60,
  'la pizza queda en 2 porciones, que es como se come');

select public.ok(
  (select count(*) from meal_portions p join meals m on m.id = p.meal_id
     where m.slug = 'pizza-muzzarella') = 3,
  'y con sus tres porciones, para elegir cuanto');

select public.ok(
  (select carbs from meal_portions p join meals m on m.id = p.meal_id
     where m.slug = 'pizza-muzzarella' and p.label = '1 porción') = 30,
  'una porcion sola son 30');

-- Las prohibidas están, y no como excepción.
select public.ok(
  (select count(*) from meals where profile_id is null and slug in (
     'pizza-muzzarella', 'empanadas-carne', 'hamburguesa-casera', 'medialunas-cafe',
     'alfajor-simple', 'chocolate-barra', 'helado-bocha', 'flan-dulce-de-leche',
     'gaseosa-comun', 'milanesa-completa-rotiseria')) = 10,
  'las diez llamadas prohibidas estan en el catalogo');

-- Sin azúcar no quiere decir sin carbohidratos.
select public.ok(
  (select carbs_total from meals where slug = 'gelatina-light') is not null,
  'lo light igual declara sus carbohidratos');

select public.ok(
  (select count(*) from meal_tags t join meals m on m.id = t.meal_id
     where m.slug = 'medialunas-cafe') >= 3,
  'las entradas quedan etiquetadas');

select public.ok(
  (select count(distinct category) from meals
     where source_name = 'porción estándar calculada') = 5,
  'hay entradas de los cinco momentos del dia');

select public.ok(
  (select count(*) from meals where profile_id is null and buy_outside) >= 6,
  'y opciones de calle de varios lugares');
