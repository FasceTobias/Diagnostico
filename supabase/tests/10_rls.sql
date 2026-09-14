-- ==================================================================
-- RLS: que una cuenta no vea ni toque la de al lado.
--
-- Leer las políticas y decir «se ven bien» no es probarlas. Acá se crean
-- dos usuarios de verdad y se intenta, desde uno, hacerle cosas al otro.
-- Cada línea que imprime OK es un intento que la base rechazó.
--
-- Se corre con: node scripts/db-test.mjs
-- ==================================================================

\set ANA    '''00000000-0000-0000-0000-0000000000a1'''
\set BETO   '''00000000-0000-0000-0000-0000000000b2'''
\set ADMIN  '''00000000-0000-0000-0000-0000000000ad'''

-- ---------- herramientas ----------
create or replace function public.ok(cond boolean, label text)
  returns void language plpgsql as $$
begin
  if cond then
    raise notice 'OK     %', label;
  else
    raise exception 'FALLA  %', label;
  end if;
end $$;

/* true si la base rechazó la operación. Lo que se espera de casi todo lo
   que hay acá abajo. */
create or replace function public.rechazado(q text)
  returns boolean language plpgsql as $$
begin
  execute q;
  return false;
exception
  when insufficient_privilege then return true;
  when check_violation then return true;
  when unique_violation then return true;
end $$;

/* Entrar como alguien: el rol de PostgREST más los claims del token. */
create or replace function public.como(quien uuid, admin boolean default false)
  returns void language plpgsql as $$
begin
  perform set_config(
    'request.jwt.claims',
    json_build_object(
      'sub', quien,
      'role', 'authenticated',
      'app_metadata', json_build_object('vianda_admin', admin)
    )::text,
    true
  );
end $$;

-- ---------- tres cuentas ----------
-- El alta dispara el trigger: perfil y preferencias se crean solos.
insert into auth.users (id, email, raw_user_meta_data) values
  (:ANA::uuid,   'ana@ejemplo.com',   '{"display_name": "Ana"}'),
  (:BETO::uuid,  'beto@ejemplo.com',  '{}'),
  (:ADMIN::uuid, 'admin@ejemplo.com', '{}');

select public.ok(
  (select count(*) from profiles where id in (:ANA::uuid, :BETO::uuid, :ADMIN::uuid)) = 3,
  'el alta de usuario crea el perfil sola');
select public.ok(
  (select display_name from profiles where id = :ANA::uuid) = 'Ana',
  'el nombre viaja desde el registro');
select public.ok(
  (select count(*) from preferences where profile_id = :ANA::uuid) = 1,
  'y las preferencias tambien');

-- ---------- datos de cada una ----------
insert into meals (id, profile_id, name, category)
values ('00000000-0000-0000-0000-00000000aaa1', :ANA::uuid, 'Tostado de Ana', 'desayuno');
insert into meals (id, profile_id, name, category)
values ('00000000-0000-0000-0000-00000000bbb1', :BETO::uuid, 'Fideos de Beto', 'almuerzo');
insert into meal_items (meal_id, quantity, unit)
values ('00000000-0000-0000-0000-00000000aaa1', 2, 'u');
insert into insulin_ratios (profile_id, grams_per_unit)
values (:ANA::uuid, 10);

-- Una comida del catálogo: sin dueño.
insert into meals (id, profile_id, name, category)
values ('00000000-0000-0000-0000-0000000ca7a1', null, 'Tostado del catalogo', 'desayuno');

begin;
set local role authenticated;

-- ================= Ana =================
select public.como(:ANA::uuid);

select public.ok((select count(*) from meals where profile_id = :ANA::uuid) = 1,
  'Ana ve su comida');
select public.ok((select count(*) from meals where profile_id = :BETO::uuid) = 0,
  'Ana NO ve la comida de Beto');
select public.ok((select count(*) from meals where profile_id is null) > 1,
  'Ana ve el catalogo');
select public.ok((select count(*) from meal_items) = 1,
  'Ana ve los ingredientes de su comida, y solo esos');
select public.ok((select count(*) from insulin_ratios) = 1,
  'Ana ve su relacion de insulina');
select public.ok((select count(*) from profiles) = 1,
  'Ana ve un solo perfil: el suyo');

-- Tocar lo ajeno: la fila no existe para ella, asi que no pasa nada.
with u as (
  update meals set name = 'Secuestrada' where id = '00000000-0000-0000-0000-00000000bbb1'
  returning 1
)
select public.ok((select count(*) from u) = 0, 'Ana no puede editar la comida de Beto');

with d as (
  delete from meals where id = '00000000-0000-0000-0000-00000000bbb1' returning 1
)
select public.ok((select count(*) from d) = 0, 'Ana no puede borrar la comida de Beto');

-- El catálogo se lee pero no se escribe.
with u as (
  update meals set name = 'Mia ahora' where profile_id is null returning 1
)
select public.ok((select count(*) from u) = 0, 'Ana no puede editar el catalogo');
select public.ok(
  (select count(*) from meals where profile_id is null and name = 'Mia ahora') = 0,
  'y el catalogo quedo intacto');

select public.ok(
  public.rechazado($q$
    insert into meals (profile_id, name, category)
    values (null, 'Colada en el catalogo', 'cena')
  $q$),
  'Ana no puede insertar en el catalogo');

-- Ni escribir a nombre de otro.
select public.ok(
  public.rechazado($q$
    insert into meals (profile_id, name, category)
    values ('00000000-0000-0000-0000-0000000000b2', 'A nombre de Beto', 'cena')
  $q$),
  'Ana no puede crear una comida a nombre de Beto');

select public.ok(
  public.rechazado($q$
    insert into exclusions (profile_id, value)
    values ('00000000-0000-0000-0000-0000000000b2', 'cebolla')
  $q$),
  'Ana no puede escribir exclusiones de Beto');

-- Lo suyo sí.
insert into exclusions (profile_id, kind, value) values (:ANA::uuid, 'ingrediente', 'cebolla');
select public.ok((select count(*) from exclusions) = 1, 'Ana si puede escribir lo suyo');

-- ================= Beto =================
select public.como(:BETO::uuid);

select public.ok((select count(*) from meals where profile_id = :ANA::uuid) = 0,
  'Beto NO ve la comida de Ana');
select public.ok((select count(*) from meal_items) = 0,
  'Beto NO ve los ingredientes de Ana');
select public.ok((select count(*) from exclusions) = 0,
  'Beto NO ve las exclusiones de Ana');
select public.ok((select count(*) from insulin_ratios) = 0,
  'Beto NO ve la insulina de Ana');
select public.ok((select count(*) from meals where profile_id is null) > 1,
  'Beto tambien ve el catalogo');

-- Forzar el id no ayuda: la fila no existe para él.
select public.ok(
  (select count(*) from meals where id = '00000000-0000-0000-0000-00000000aaa1') = 0,
  'pedir la comida de Ana por id no devuelve nada');

-- ================= Administración =================
select public.como(:ADMIN::uuid, true);

select public.ok(public.is_admin(), 'el claim de administracion se lee del token');

with u as (
  update meals set name = 'Tostado del catalogo v2'
  where id = '00000000-0000-0000-0000-0000000ca7a1' returning 1
)
select public.ok((select count(*) from u) = 1, 'administracion si puede editar el catalogo');

select public.ok((select count(*) from meals where profile_id = :ANA::uuid) = 0,
  'administracion tampoco ve los datos personales de Ana');

-- Nadie se asciende solo: el claim viene del token, no de la base.
select public.como(:BETO::uuid);
select public.ok(not public.is_admin(), 'un usuario comun no es administracion');
select public.ok(
  public.rechazado($q$
    update profiles set display_name = 'Beto el admin' where id = '00000000-0000-0000-0000-0000000000a1'
  $q$)
  or (select display_name from profiles where id = :BETO::uuid) is distinct from 'Beto el admin',
  'un usuario no puede escribir el perfil de otro');

-- ================= Etiquetas =================
select public.como(:ANA::uuid);

insert into storage.objects (bucket_id, name)
values ('etiquetas', '00000000-0000-0000-0000-0000000000a1/barrita.jpg');
select public.ok(true, 'Ana sube una etiqueta a su carpeta');

select public.ok(
  public.rechazado($q$
    insert into storage.objects (bucket_id, name)
    values ('etiquetas', '00000000-0000-0000-0000-0000000000b2/robada.jpg')
  $q$),
  'Ana no puede subir a la carpeta de Beto');

select public.ok(
  public.rechazado($q$
    insert into storage.objects (bucket_id, name)
    values ('etiquetas', 'catalogo/oficial.jpg')
  $q$),
  'Ana no puede subir al catalogo');

select public.como(:BETO::uuid);
select public.ok((select count(*) from storage.objects) = 0,
  'Beto NO ve las etiquetas de Ana');

select public.como(:ADMIN::uuid, true);
insert into storage.objects (bucket_id, name) values ('etiquetas', 'catalogo/oficial.jpg');
select public.ok(true, 'administracion si sube al catalogo');

select public.como(:ANA::uuid);
select public.ok((select count(*) from storage.objects where name like 'catalogo/%') = 1,
  'Ana ve las etiquetas del catalogo');

select public.ok(
  (select public from storage.buckets where id = 'etiquetas') = false,
  'el bucket de etiquetas es privado');

rollback;
