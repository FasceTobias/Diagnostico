-- ==================================================================
-- El catálogo: que sea de todos sin que lo de cada uno se mezcle.
--
-- Corre después de 10_rls.sql y reusa las cuentas que quedaron creadas
-- ahí: Ana, Beto y administración.
-- ==================================================================

\set ANA    '''00000000-0000-0000-0000-0000000000a1'''
\set BETO   '''00000000-0000-0000-0000-0000000000b2'''
\set ADMIN  '''00000000-0000-0000-0000-0000000000ad'''

-- ---------- una entrada del catálogo con dos porciones ----------
insert into meals (id, profile_id, slug, name, category, data_state, description)
values (
  '00000000-0000-0000-0000-00000000a1b2', null, 'pizza-de-prueba',
  'Pizza de prueba', 'cena', 'estimado',
  'De las que llaman prohibidas. Entra igual: lo que la app suma es el número.'
);

insert into meal_portions (meal_id, label, grams, carbs, is_default, sort_order) values
  ('00000000-0000-0000-0000-00000000a1b2', '1 porción',   110, 30, false, 1),
  ('00000000-0000-0000-0000-00000000a1b2', '2 porciones', 220, 60, true,  2),
  ('00000000-0000-0000-0000-00000000a1b2', '3 porciones', 330, 90, false, 3);

select public.ok(
  (select carbs_total from meals where id = '00000000-0000-0000-0000-00000000a1b2') = 60,
  'la porcion por defecto se copia al total que lee la app');
select public.ok(
  (select portion from meals where id = '00000000-0000-0000-0000-00000000a1b2') = '2 porciones',
  'y tambien el texto de la porcion');

-- Cambiar cuál es la porción por defecto arrastra el total.
update meal_portions set is_default = false
  where meal_id = '00000000-0000-0000-0000-00000000a1b2' and label = '2 porciones';
update meal_portions set is_default = true
  where meal_id = '00000000-0000-0000-0000-00000000a1b2' and label = '1 porción';
select public.ok(
  (select carbs_total from meals where id = '00000000-0000-0000-0000-00000000a1b2') = 30,
  'cambiar la porcion por defecto cambia el total');

select public.ok(
  (select count(*) from meal_portions where meal_id = '00000000-0000-0000-0000-00000000a1b2') = 3,
  'las tres porciones conviven: media, una, tres');

-- ---------- verificado / estimado / demo ----------
select public.ok(
  (select carbs_verified from meals where id = '00000000-0000-0000-0000-00000000a1b2') = false
  and (select is_demo from meals where id = '00000000-0000-0000-0000-00000000a1b2') = false,
  'estimado no es ni verificado ni demo');

update meals set data_state = 'verificado' where id = '00000000-0000-0000-0000-00000000a1b2';
select public.ok(
  (select carbs_verified from meals where id = '00000000-0000-0000-0000-00000000a1b2'),
  'marcar verificado enciende carbs_verified solo');
update meals set data_state = 'estimado' where id = '00000000-0000-0000-0000-00000000a1b2';

-- ---------- duplicados ----------
select public.ok(
  public.rechazado($q$
    insert into meals (profile_id, slug, name, category)
    values (null, 'pizza-de-prueba', 'Otra pizza', 'almuerzo')
  $q$) or not exists (
    select 1 from meals where slug = 'pizza-de-prueba' and name = 'Otra pizza'
  ),
  'dos entradas del catalogo con el mismo slug no entran');

-- ---------- comida compuesta ----------
insert into foods (id, profile_id, name, carbs_per_100) values
  ('00000000-0000-0000-0000-00000000f00d', null, 'pan lactal', 50),
  ('00000000-0000-0000-0000-00000000f00e', null, 'leche', 5);
insert into meals (id, profile_id, slug, name, category, carbs_from_items)
values ('00000000-0000-0000-0000-00000000c0d0', null, 'tostadas-cafe',
        'Tostadas con café con leche', 'desayuno', true);
insert into meal_items (meal_id, food_id, quantity, unit) values
  ('00000000-0000-0000-0000-00000000c0d0', '00000000-0000-0000-0000-00000000f00d', 60, 'g'),
  ('00000000-0000-0000-0000-00000000c0d0', '00000000-0000-0000-0000-00000000f00e', 200, 'ml');

select public.ok(
  public.carbos_de_items('00000000-0000-0000-0000-00000000c0d0') = 40,
  'una comida compuesta suma los carbohidratos de sus ingredientes');

begin;
set local role authenticated;

-- ---------- el catálogo se ve desde las dos cuentas ----------
select public.como(:ANA::uuid);
select public.ok(
  (select count(*) from meals where slug = 'pizza-de-prueba') = 1,
  'Ana ve la pizza de prueba del catalogo');
select public.ok(
  (select count(*) from meal_portions
     where meal_id = '00000000-0000-0000-0000-00000000a1b2') = 3,
  'Ana ve las tres porciones');

select public.ok(
  public.rechazado($q$
    update meal_portions set carbs = 5
    where meal_id = '00000000-0000-0000-0000-00000000a1b2'
  $q$) or (select carbs from meal_portions
             where meal_id = '00000000-0000-0000-0000-00000000a1b2' and is_default) <> 5,
  'Ana no puede cambiarle los carbohidratos al catalogo');

-- ---------- lo suyo es suyo ----------
insert into meal_prefs (profile_id, meal_id, favorite, rating, times_eaten)
values (:ANA::uuid, '00000000-0000-0000-0000-00000000a1b2', true, 5, 3);
select public.ok(
  (select favorite from meal_prefs where profile_id = :ANA::uuid) = true,
  'Ana marca la pizza como favorita');

select public.como(:BETO::uuid);
select public.ok((select count(*) from meal_prefs) = 0,
  'a Beto la pizza NO le quedo marcada como favorita');
select public.ok(
  (select count(*) from meals where slug = 'pizza-de-prueba') = 1,
  'y la pizza le sigue apareciendo igual');

select public.ok(
  public.rechazado($q$
    insert into meal_prefs (profile_id, meal_id, favorite)
    values ('00000000-0000-0000-0000-0000000000a1',
            '00000000-0000-0000-0000-00000000a1b2', false)
  $q$),
  'Beto no puede escribir las preferencias de Ana');

-- ---------- administración ----------
select public.como(:ADMIN::uuid, true);
with u as (
  update meal_portions set carbs = 31
  where meal_id = '00000000-0000-0000-0000-00000000a1b2' and is_default
  returning 1
)
select public.ok((select count(*) from u) = 1,
  'administracion si puede corregir una porcion del catalogo');

-- ---------- buscar ----------
select public.como(:ANA::uuid);
select public.ok(
  (select count(*) from meals
     where search @@ plainto_tsquery('spanish', 'pizza')) >= 1,
  'buscar "pizza" la encuentra');
select public.ok(
  (select count(*) from meals
     where search @@ plainto_tsquery('spanish', 'prohibidas')) >= 1,
  'y la descripcion tambien entra en la busqueda');

rollback;
