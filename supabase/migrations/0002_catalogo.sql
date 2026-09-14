-- ==================================================================
-- 0002 — Catálogo compartido, productos envasados y onboarding
--
-- El 0001 dejó todo privado: meals.profile_id y foods.profile_id eran
-- `not null`. Con eso cada usuario nuevo arranca con la biblioteca vacía y
-- una etiqueta de un producto se verificaría una vez por persona.
--
-- Acá se abre un segundo nivel: el catálogo compartido. Una fila con
-- profile_id nulo es del catálogo —la lee cualquier usuario autenticado y
-- sólo la escribe administración—; una fila con profile_id es tuya.
--
-- Cuando editás algo del catálogo, la app copia la fila a tu cuenta con
-- forked_from apuntando al original. Vos tocás tu copia y el catálogo se
-- puede seguir corrigiendo sin pisarle los cambios a nadie.
--
-- Se aplica con la base vacía: todavía no hay usuarios ni datos reales.
-- ==================================================================

-- ------------------------------------------------------------------
-- 1. Quién es administración
--
-- Vive en app_metadata del JWT, que sólo se puede escribir con la clave
-- de servicio. Si fuera una columna de profiles, cualquiera podría
-- ascenderse a sí mismo con un update.
-- ------------------------------------------------------------------
create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'vianda_admin')::boolean, false)
$$;

-- ------------------------------------------------------------------
-- 2. Catálogo compartido en meals y foods
-- ------------------------------------------------------------------
alter table meals alter column profile_id drop not null;
alter table foods alter column profile_id drop not null;

alter table meals add column forked_from uuid references meals (id) on delete set null;
alter table foods add column forked_from uuid references foods (id) on delete set null;

comment on column meals.profile_id is
  'null = comida del catálogo compartido. Con valor = comida de esa persona.';
comment on column meals.forked_from is
  'Si nació como copia de una del catálogo, de cuál.';

create index on meals (category) where profile_id is null;
create index on foods (name)      where profile_id is null;

-- Lectura del catálogo: cualquiera autenticado.
create policy "catalogo visible" on meals
  for select to authenticated using (profile_id is null);
create policy "catalogo visible" on foods
  for select to authenticated using (profile_id is null);

-- Escritura del catálogo: sólo administración. Las políticas de 0001
-- («datos propios») siguen cubriendo lo personal y no alcanzan a estas
-- filas: profile_id = auth.uid() da NULL, que no es true, así que un
-- usuario común no puede insertar ni tocar una fila sin dueño.
create policy "catalogo lo escribe administracion" on meals
  for all to authenticated
  using (profile_id is null and public.is_admin())
  with check (profile_id is null and public.is_admin());
create policy "catalogo lo escribe administracion" on foods
  for all to authenticated
  using (profile_id is null and public.is_admin())
  with check (profile_id is null and public.is_admin());

-- ------------------------------------------------------------------
-- 3. Productos envasados
--
-- En 0001 eran doce columnas dentro de meals. Pero una barrita no es una
-- comida: es un producto con marca, porción y etiqueta, que aparece en la
-- biblioteca de todos. Como tabla propia se verifica una vez y sirve para
-- cualquiera, y «verificado» pasa a tener fecha y responsable.
-- ------------------------------------------------------------------
create table products (
  id            uuid primary key default gen_random_uuid(),
  -- null = producto del catálogo, igual que en meals
  profile_id    uuid references profiles (id) on delete cascade,
  brand         text not null,
  name          text not null,
  pack_size     text,                    -- "paquete de 150 g"
  serving_size  text,                    -- "1 barra (40 g)"
  servings_per_pack       numeric,
  carbs_per_serving       numeric,
  carbs_per_pack          numeric,
  sugar_per_serving       numeric,
  added_sugar_per_serving numeric,
  calories_per_serving    numeric,
  barcode       text,

  -- De dónde salió el número y cuándo se miró. Sin esto, «verificado» es
  -- una palabra. Con esto es un dato que se puede auditar y que vence.
  source        text,                    -- 'etiqueta' | 'web del fabricante'
  source_url    text,
  -- Ruta dentro del bucket privado, nunca una URL pública.
  label_photo_path text,
  verified_at   timestamptz,
  verified_by   uuid references auth.users (id) on delete set null,

  created_at    timestamptz not null default now()
);

-- En el catálogo, un producto por marca + nombre + tamaño.
create unique index on products (lower(brand), lower(name), coalesce(pack_size, ''))
  where profile_id is null;
create index on products (profile_id);

alter table products enable row level security;
create policy "productos propios" on products
  for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "catalogo visible" on products
  for select to authenticated using (profile_id is null);
create policy "catalogo lo escribe administracion" on products
  for all to authenticated
  using (profile_id is null and public.is_admin())
  with check (profile_id is null and public.is_admin());

-- La comida apunta al producto; los números dejan de estar duplicados.
alter table meals add column product_id uuid references products (id) on delete set null;
create index on meals (product_id);

alter table meals
  drop column brand,
  drop column product_name,
  drop column pack_size,
  drop column serving_size,
  drop column servings_per_pack,
  drop column carbs_per_serving,
  drop column carbs_per_pack,
  drop column sugar_per_serving,
  drop column added_sugar_per_serving,
  drop column calories_per_serving,
  drop column label_source,
  drop column label_photo_url;

-- ------------------------------------------------------------------
-- 4. Lo que no comés
--
-- «Qué cosas no comés» no tenía dónde guardarse. El motivo es texto libre
-- y opcional a propósito: la app no clasifica comida, y tampoco pregunta
-- por qué.
-- ------------------------------------------------------------------
create type exclusion_kind as enum ('ingrediente', 'etiqueta', 'comida');

create table exclusions (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  kind       exclusion_kind not null default 'ingrediente',
  value      text not null,
  reason     text,
  created_at timestamptz not null default now(),
  unique (profile_id, kind, value)
);
create index on exclusions (profile_id);

alter table exclusions enable row level security;
create policy "datos propios" on exclusions
  for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ------------------------------------------------------------------
-- 5. Onboarding y capa de diabetes
-- ------------------------------------------------------------------
alter table profiles
  -- La app razona con horas locales. El día que algo corra en el
  -- servidor, sin esto el plan se corre de hora.
  add column timezone text not null default 'America/Argentina/Buenos_Aires',
  -- La capa de diabetes es opcional y tiene dos niveles: ver los
  -- carbohidratos, y las herramientas de insulina (insulin_enabled, 0001).
  -- Con esto apagado, la app no nombra ni carbohidratos ni insulina.
  add column carb_counting_enabled boolean not null default true,
  -- El onboarding se contesta de a poco y se puede retomar.
  add column onboarding_step smallint not null default 0,
  add column onboarding_completed_at timestamptz;

alter table preferences
  add column sweet_or_salty text
    check (sweet_or_salty in ('dulce', 'salado', 'los dos'));

-- ------------------------------------------------------------------
-- 6. Alta de usuario
--
-- El perfil y las preferencias se crean solos al registrarse. Sin esto,
-- la app tendría que crear su propia fila en el primer arranque, que es
-- el momento en el que más cosas pueden fallar.
--
-- security definer para poder escribir en public desde el trigger de
-- auth, con search_path vacío para que nadie pueda secuestrar los nombres.
-- ------------------------------------------------------------------
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
    values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  insert into public.preferences (profile_id) values (new.id);
  return new;
end
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
