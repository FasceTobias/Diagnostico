-- ==================================================================
-- 0005 — La biblioteca real
--
-- Tres cosas que el modelo no sabía hacer:
--
--   1. La porción era una descripción suelta al lado de un número. Pero
--      la porción ES el dato: una pizza no tiene 60 g de carbohidratos,
--      tiene 30 por porción y comés dos.
--   2. `favorite`, `tested` y `rating` estaban en `meals`. En una
--      biblioteca compartida eso significa que si marcás favorita la
--      pizza, le queda marcada a todo el mundo.
--   3. `is_demo` y `carbs_verified` eran dos booleanos que podían
--      contradecirse. Ahora hay un solo campo con tres valores.
--
-- Nada de esto cambia una pantalla: la app sigue leyendo `meals.carbs_total`
-- y `meals.portion`, que ahora los mantiene un trigger.
-- ==================================================================

-- ------------------------------------------------------------------
-- 1. Verificado, estimado, demo
--
-- Un solo lugar donde está la verdad. Los dos booleanos de antes pasan a
-- ser columnas generadas, así todo lo que ya los lee sigue andando.
-- ------------------------------------------------------------------
create type data_state as enum ('verificado', 'estimado', 'demo');

alter table meals add column data_state data_state not null default 'demo';

-- Se rellena desde lo que había antes de volverlas generadas.
update meals set data_state = (case
  when carbs_verified then 'verificado'
  when is_demo        then 'demo'
  else 'estimado'
end)::data_state;

alter table meals drop column carbs_verified;
alter table meals drop column is_demo;

alter table meals
  add column carbs_verified boolean generated always as (data_state = 'verificado') stored,
  add column is_demo        boolean generated always as (data_state = 'demo') stored;

comment on column meals.data_state is
  'verificado = etiqueta o receta calculada. estimado = porción estándar. demo = a reemplazar.';

-- ------------------------------------------------------------------
-- 2. La identidad y la procedencia
-- ------------------------------------------------------------------
alter table meals
  -- La identidad estable del catálogo: el seed hace on conflict (slug).
  add column slug        text,
  add column description text,
  -- De dónde salió el número, y cuándo se miró. Sin la fecha,
  -- «verificado» no vence nunca, y las etiquetas cambian.
  add column source_name       text,
  add column source_url        text,
  add column source_checked_at date,
  -- El total sale de sumar los ingredientes, no de estimar el plato.
  add column carbs_from_items  boolean not null default false,
  add column active            boolean not null default true,
  add column updated_at        timestamptz not null default now();

-- El número del registro nacional: permite volver a la fuente oficial
-- dentro de un año y ver si la etiqueta cambió.
alter table products add column rnpa text;

-- ------------------------------------------------------------------
-- 3. Duplicados
-- ------------------------------------------------------------------
create unique index meals_slug_catalogo on meals (slug)
  where profile_id is null and slug is not null;

create unique index meals_nombre_catalogo on meals (lower(name), category)
  where profile_id is null and active;

create unique index products_barcode on products (barcode)
  where barcode is not null;
create unique index products_rnpa on products (rnpa)
  where rnpa is not null;

-- ------------------------------------------------------------------
-- 4. Las porciones
--
-- Cada entrada tiene al menos una, marcada por defecto. Las demás son
-- variantes de lo mismo: media pizza, una pizza entera, tres empanadas.
-- ------------------------------------------------------------------
create table meal_portions (
  id          uuid primary key default gen_random_uuid(),
  meal_id     uuid not null references meals (id) on delete cascade,
  -- Cómo se dice: '1 porción', '2 porciones', '1 empanada', '1 taza'.
  label       text not null,
  grams       numeric,

  carbs       numeric not null,
  sugar       numeric,
  -- Azúcar agregada. Sólo cuando la etiqueta la declara: en Argentina no
  -- siempre figura, e inventarla sería peor que no tenerla.
  added_sugar numeric,
  protein     numeric,
  fat         numeric,
  fiber       numeric,
  kcal        numeric,

  -- La que se muestra cuando no elegís otra.
  is_default  boolean not null default false,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now()
);
create index on meal_portions (meal_id);
create unique index meal_portions_una_default on meal_portions (meal_id)
  where is_default;

/* La app lee `meals.carbs_total` y `meals.portion`. Con las porciones
   como fuente de verdad, esos dos campos pasan a ser un reflejo de la
   porción por defecto, mantenido acá. Así el modelo se arregla sin que
   ninguna pantalla se entere. */
create or replace function public.sync_porcion_default()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  objetivo uuid := coalesce(new.meal_id, old.meal_id);
  p record;
begin
  select * into p from public.meal_portions
    where meal_id = objetivo and is_default limit 1;
  if found then
    update public.meals
      set carbs_total = p.carbs, portion = p.label, updated_at = now()
      where id = objetivo;
  end if;
  return null;
end
$$;

create trigger meal_portions_sync
  after insert or update or delete on meal_portions
  for each row execute function public.sync_porcion_default();

-- ------------------------------------------------------------------
-- 5. Las etiquetas
--
-- Vocabulario cerrado: una etiqueta que no está en `tags` no se puede
-- poner. Lo que el motor filtra duro —categoría, saciedad, portable,
-- tiempo— sigue en columnas; acá va lo demás, y lo que sirve para buscar.
-- ------------------------------------------------------------------
create type tag_kind as enum ('momento', 'contexto', 'tipo', 'practicidad', 'saciedad', 'dato');

create table tags (
  slug  text primary key,
  kind  tag_kind not null,
  label text not null
);

create table meal_tags (
  meal_id  uuid not null references meals (id) on delete cascade,
  tag_slug text not null references tags (slug) on delete cascade,
  primary key (meal_id, tag_slug)
);
create index on meal_tags (tag_slug);

insert into tags (slug, kind, label) values
  ('desayuno',      'momento', 'Desayuno'),
  ('media_manana',  'momento', 'Media mañana'),
  ('almuerzo',      'momento', 'Almuerzo'),
  ('media_tarde',   'momento', 'Media tarde'),
  ('merienda',      'momento', 'Merienda'),
  ('cena',          'momento', 'Cena'),

  ('casa',          'contexto', 'En casa'),
  ('trabajo',       'contexto', 'En el trabajo'),
  ('calle',         'contexto', 'En la calle'),
  ('emergencia',    'contexto', 'Para salir del paso'),
  ('evento',        'contexto', 'Evento o tarde larga'),

  ('dulce',           'tipo', 'Dulce'),
  ('salado',          'tipo', 'Salado'),
  ('bebida',          'tipo', 'Bebida'),
  ('postre',          'tipo', 'Postre'),
  ('snack',           'tipo', 'Snack'),
  ('comida_completa', 'tipo', 'Comida completa'),

  ('rapido',                  'practicidad', 'Rápido'),
  ('para_llevar',             'practicidad', 'Para llevar'),
  ('comprable',               'practicidad', 'Se compra hecho'),
  ('sin_cocinar',             'practicidad', 'Sin cocinar'),
  ('preparar_noche_anterior', 'practicidad', 'Se deja listo la noche anterior'),

  ('liviana', 'saciedad', 'Liviana'),
  ('normal',  'saciedad', 'Normal'),
  ('potente', 'saciedad', 'Potente'),

  -- Datos, no juicios. «Sin azúcar agregada» no quiere decir sin
  -- carbohidratos, y la app no deja que se confunda: el total se muestra
  -- igual, siempre.
  ('sin_azucar_agregada', 'dato', 'Sin azúcar agregada'),
  ('light',               'dato', 'Light'),
  ('zero',                'dato', 'Zero'),
  ('etiqueta_verificada', 'dato', 'Con etiqueta verificada');

-- ------------------------------------------------------------------
-- 6. Lo tuyo sobre una comida del catálogo
--
-- El catálogo es de todos y no se duplica por persona. Lo que es tuyo
-- —que te guste, que la hayas probado, cuánto comés— vive acá.
-- ------------------------------------------------------------------
alter table meals drop column favorite;
alter table meals drop column tested;
alter table meals drop column rating;

create table meal_prefs (
  profile_id  uuid not null references profiles (id) on delete cascade,
  meal_id     uuid not null references meals (id) on delete cascade,
  favorite    boolean not null default false,
  tested      boolean not null default false,
  rating      smallint check (rating between 1 and 5),
  -- Pisa la frecuencia del catálogo: para vos la pizza puede ser habitual.
  frequency   frequency,
  -- Cuánto comés vos de esto, cuando no es la porción por defecto.
  usual_portion_id uuid references meal_portions (id) on delete set null,
  notes       text,
  -- La base de la personalización: qué comés de verdad y cada cuánto.
  last_eaten_at date,
  times_eaten   int not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (profile_id, meal_id)
);
create index on meal_prefs (profile_id);

-- ------------------------------------------------------------------
-- 7. Comidas compuestas
--
-- Un desayuno de tostadas con queso y café no es un alimento nuevo: es
-- una entrada con tres items. Cambiar el queso por manteca es cambiar un
-- item, no crear otra entrada.
-- ------------------------------------------------------------------
create or replace function public.carbos_de_items(objetivo uuid)
  returns numeric
  language sql
  stable
  set search_path = ''
as $$
  select coalesce(sum(
    case
      when f.carbs_per_100 is null then 0
      -- g y ml se tratan igual: para leche y yogur la diferencia no
      -- cambia el número a la escala que importa acá.
      when i.unit in ('g', 'ml') then f.carbs_per_100 * i.quantity / 100
      -- Unidades: carbs_per_100 se interpreta por unidad.
      else f.carbs_per_100 * i.quantity
    end
  ), 0)
  from public.meal_items i
  join public.foods f on f.id = i.food_id
  where i.meal_id = objetivo
$$;

-- ------------------------------------------------------------------
-- 8. Buscar
--
-- «budín», «tostado», «algo dulce». No hace falta búsqueda semántica
-- todavía, pero el índice tiene que existir desde ahora: agregarlo con la
-- tabla llena es una migración pesada.
-- ------------------------------------------------------------------
-- Dos detalles que Postgres no perdona en una columna generada: el cast a
-- regconfig (sin él, `to_tsvector` resuelve a la versión que depende de la
-- configuración de la sesión, que no es inmutable) y que `array_to_string`
-- tampoco lo es, así que las subcategorías quedan afuera de este índice y
-- se buscan por el join de etiquetas.
alter table meals add column search tsvector
  generated always as (
    setweight(to_tsvector('spanish'::regconfig, coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish'::regconfig, coalesce(description, '')), 'B')
  ) stored;
create index meals_search on meals using gin (search);

-- ------------------------------------------------------------------
-- 9. RLS de lo nuevo
--
-- Las porciones y las etiquetas siguen a su comida. Las preferencias son
-- tuyas y de nadie más.
-- ------------------------------------------------------------------
alter table meal_portions enable row level security;
alter table meal_tags     enable row level security;
alter table meal_prefs    enable row level security;
alter table tags          enable row level security;

-- El vocabulario lo lee cualquiera y lo escribe administración.
create policy "vocabulario visible" on tags
  for select to authenticated using (true);
create policy "vocabulario lo escribe administracion" on tags
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Porciones y etiquetas: se ven si se ve la comida.
create policy "porciones de comidas visibles" on meal_portions
  for select to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id and (m.profile_id is null or m.profile_id = auth.uid())
  ));
create policy "porciones de comidas propias" on meal_portions
  for all to authenticated
  using (exists (select 1 from meals m where m.id = meal_id and m.profile_id = auth.uid()))
  with check (exists (select 1 from meals m where m.id = meal_id and m.profile_id = auth.uid()));

create policy "etiquetas de comidas visibles" on meal_tags
  for select to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id and (m.profile_id is null or m.profile_id = auth.uid())
  ));
create policy "etiquetas de comidas propias" on meal_tags
  for all to authenticated
  using (exists (select 1 from meals m where m.id = meal_id and m.profile_id = auth.uid()))
  with check (exists (select 1 from meals m where m.id = meal_id and m.profile_id = auth.uid()));

create policy "datos propios" on meal_prefs
  for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Administración también escribe las porciones y etiquetas del catálogo.
create policy "catalogo lo escribe administracion" on meal_portions
  for all to authenticated
  using (exists (select 1 from meals m where m.id = meal_id and m.profile_id is null) and public.is_admin())
  with check (exists (select 1 from meals m where m.id = meal_id and m.profile_id is null) and public.is_admin());
create policy "catalogo lo escribe administracion" on meal_tags
  for all to authenticated
  using (exists (select 1 from meals m where m.id = meal_id and m.profile_id is null) and public.is_admin())
  with check (exists (select 1 from meals m where m.id = meal_id and m.profile_id is null) and public.is_admin());
