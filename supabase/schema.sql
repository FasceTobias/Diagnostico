-- ------------------------------------------------------------------
-- VIANDA — esquema inicial
--
-- Un solo usuario hoy, pero todo cuelga de profile_id desde el día uno:
-- migrar después es imposible. RLS activa en todas las tablas.
-- ------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------- enums ----------
create type meal_category as enum ('desayuno', 'snack', 'almuerzo', 'merienda', 'cena');
create type satiety_level as enum ('liviana', 'normal', 'potente');
create type carb_source   as enum ('etiqueta', 'receta', 'estimacion', 'pendiente');
create type confidence    as enum ('alta', 'media', 'estimada');
create type meal_status   as enum ('pending', 'prepared', 'eaten', 'skipped', 'replaced');
-- Seis momentos. Snack y merienda NO son lo mismo: el snack aguanta entre
-- comidas, la merienda es una comida y puede ser fuerte.
create type plan_slot     as enum (
  'breakfast', 'snack_am', 'lunch', 'snack_pm', 'merienda', 'dinner');
-- Dónde transcurre el día. No se deduce del día de la semana.
create type day_context   as enum ('casa', 'calle', 'mixto');
-- Dónde se consigue una opción que no cocinás vos.
create type venue         as enum (
  'kiosco', 'supermercado', 'cafetería', 'panadería',
  'rotisería', 'restaurante', 'estación de servicio', 'casa de comidas');
create type prep_kind     as enum ('night_before', 'weekly');
create type pack_kind     as enum ('meal', 'gear');

-- ---------- perfil ----------
create table profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  -- horarios de la rutina, editables: {"breakfast":"08:30", ...}
  meal_times   jsonb not null default '{
    "breakfast":"08:30","snack_am":"10:30","lunch":"12:30",
    "snack_pm":"16:00","merienda":"18:30","dinner":"21:30"}'::jsonb,
  -- contexto por defecto cuando se arma una semana nueva
  default_context day_context not null default 'mixto',
  -- La configuración de insulina está apagada hasta que el usuario la active.
  insulin_enabled boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ---------- ingredientes / productos ----------
create table foods (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references profiles (id) on delete cascade,
  name           text not null,
  unit           text not null default 'g',
  carbs_per_100  numeric,
  carb_src       carb_source not null default 'estimacion',
  shopping_aisle text,                  -- verduleria, carniceria, lacteos, almacen, congelados, panaderia, otros
  is_packaged    boolean not null default false,
  brand          text,
  notes          text,
  created_at     timestamptz not null default now()
);
create index on foods (profile_id, name);

-- ---------- biblioteca de comidas ----------
create table meals (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references profiles (id) on delete cascade,
  name              text not null,
  photo_url         text,
  category          meal_category not null,
  subcategories     text[] not null default '{}',     -- para llevar, en casa, rapido, emergencia...
  main_ingredient   text,                             -- lo usa la rotación para no repetir

  carbs_total       numeric not null default 0,
  carbs_source      carb_source not null default 'estimacion',
  carbs_confidence  confidence not null default 'estimada',
  -- El dato fue revisado contra una fuente real. Mientras sea false, la app
  -- muestra el carbo como sin confirmar e ignora carbs_confidence.
  carbs_verified    boolean not null default false,
  protein_total     numeric,

  portion           text,
  prep_minutes      int not null default 10,
  satiety           satiety_level not null default 'normal',

  portable          boolean not null default false,
  needs_cold        boolean not null default false,
  needs_reheat      boolean not null default false,
  make_night_before boolean not null default false,
  freezable         boolean not null default false,

  difficulty        smallint not null default 1 check (difficulty between 1 and 3),
  favorite          boolean not null default false,
  tested            boolean not null default false,
  rating            smallint check (rating between 1 and 5),
  notes             text,
  prep_steps        text[] not null default '{}',     -- tareas que genera la noche anterior

  -- Opciones que se compran afuera. Quedan FUERA de la rotación del plan:
  -- el martes no puede decirte "comprá empanadas". Aparecen sólo desde
  -- «Resolver ahora».
  buy_outside       boolean not null default false,
  venues            venue[] not null default '{}',
  price_level       smallint check (price_level between 1 and 3),
  handheld          boolean not null default false,  -- se come caminando

  is_demo           boolean not null default false,   -- para borrar los ejemplos de una
  carbs_verified_at timestamptz,                      -- cuándo se revisó el carbo
  created_at        timestamptz not null default now()
);
create index on meals (profile_id, category);

create table meal_items (
  id            uuid primary key default gen_random_uuid(),
  meal_id       uuid not null references meals (id) on delete cascade,
  food_id       uuid references foods (id) on delete set null,
  label         text,                 -- por si el ingrediente todavía no está en foods
  quantity      numeric,
  unit          text,
  carbs_contrib numeric
);
create index on meal_items (meal_id);

-- ---------- planificación ----------
create table weekly_plans (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles (id) on delete cascade,
  week_start   date not null,
  generated_by text not null default 'rotation',
  notes        text,
  created_at   timestamptz not null default now(),
  unique (profile_id, week_start)
);

-- Un día se lee y se escribe entero: los slots van en jsonb en vez de
-- una tabla aparte, que implicaría cinco queries por día.
-- El grano por slot ya queda guardado en meal_history.
-- slots: [{slot, meal_id, time, status, optional, replaced_from, note}]
-- Los snacks van con optional = true: se sacan y se vuelven a sumar según
-- cómo venga el día, sin que eso cuente como incumplir nada.
create table daily_plans (
  id             uuid primary key default gen_random_uuid(),
  weekly_plan_id uuid not null references weekly_plans (id) on delete cascade,
  date           date not null,
  context        day_context not null default 'mixto',
  slots          jsonb not null default '[]'::jsonb,
  unique (weekly_plan_id, date)
);

-- ---------- tareas y mochila ----------
create table prep_tasks (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles (id) on delete cascade,
  date            date not null,
  kind            prep_kind not null default 'night_before',
  label           text not null,
  source_meal_ids uuid[] not null default '{}',
  done            boolean not null default false,
  sort_order      int not null default 0
);
create index on prep_tasks (profile_id, date);

create table packing_items (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  date       date not null,
  label      text not null,
  kind       pack_kind not null default 'gear',
  meal_id    uuid references meals (id) on delete set null,
  done       boolean not null default false
);
create index on packing_items (profile_id, date);

-- ---------- compras ----------
create table shopping_lists (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  week_start date not null,
  status     text not null default 'open',
  unique (profile_id, week_start)
);

create table shopping_items (
  id         uuid primary key default gen_random_uuid(),
  list_id    uuid not null references shopping_lists (id) on delete cascade,
  food_id    uuid references foods (id) on delete set null,
  label      text not null,
  quantity   numeric,
  unit       text,
  aisle      text,
  checked    boolean not null default false,
  from_meals uuid[] not null default '{}'
);
create index on shopping_items (list_id);

-- ---------- historial y preferencias ----------
-- Guarda lo que realmente pasó, no lo planificado. Base para aprender gustos.
create table meal_history (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles (id) on delete cascade,
  date            date not null,
  slot            plan_slot not null,
  planned_meal_id uuid references meals (id) on delete set null,
  actual_meal_id  uuid references meals (id) on delete set null,
  status          meal_status not null default 'pending',
  reason          text,
  rating          smallint check (rating between 1 and 5),
  created_at      timestamptz not null default now()
);
create index on meal_history (profile_id, date);

-- ------------------------------------------------------------------
-- INSULINA
--
-- La app guarda la relación y hace una división cuando el usuario se la
-- pide. No decide dosis, no corrige por glucemia y no sugiere nada por su
-- cuenta. Es una preferencia personal, no un dato clínico.
--
-- El scope permite, a futuro, relaciones distintas por momento del día o
-- por franja horaria. Hoy se usa solamente la general.
-- ------------------------------------------------------------------
create table insulin_ratios (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references profiles (id) on delete cascade,
  -- 'general' o el nombre de un plan_slot
  scope          text not null default 'general',
  grams_per_unit numeric not null check (grams_per_unit > 0),
  from_time      time,
  to_time        time,
  created_at     timestamptz not null default now()
);
create index on insulin_ratios (profile_id);

create table preferences (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  key        text not null,
  value      jsonb not null default '{}'::jsonb,
  unique (profile_id, key)
);

-- ------------------------------------------------------------------
-- RLS: cada quien ve lo suyo. Se activa desde el principio aunque hoy
-- haya un solo usuario, porque agregarla después siempre duele más.
-- ------------------------------------------------------------------
alter table profiles       enable row level security;
alter table foods          enable row level security;
alter table meals          enable row level security;
alter table meal_items     enable row level security;
alter table weekly_plans   enable row level security;
alter table daily_plans    enable row level security;
alter table prep_tasks     enable row level security;
alter table packing_items  enable row level security;
alter table shopping_lists enable row level security;
alter table shopping_items enable row level security;
alter table meal_history   enable row level security;
alter table insulin_ratios enable row level security;
alter table preferences    enable row level security;

create policy "perfil propio" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- Tablas con profile_id directo
do $$
declare t text;
begin
  foreach t in array array[
    'foods','meals','weekly_plans','prep_tasks','packing_items',
    'shopping_lists','meal_history','preferences','insulin_ratios'
  ] loop
    execute format(
      'create policy "datos propios" on %I for all
         using (profile_id = auth.uid()) with check (profile_id = auth.uid())', t);
  end loop;
end $$;

-- Tablas que heredan el dueño por la relación padre
create policy "items de comidas propias" on meal_items for all
  using (exists (select 1 from meals m where m.id = meal_id and m.profile_id = auth.uid()))
  with check (exists (select 1 from meals m where m.id = meal_id and m.profile_id = auth.uid()));

create policy "dias de planes propios" on daily_plans for all
  using (exists (select 1 from weekly_plans w where w.id = weekly_plan_id and w.profile_id = auth.uid()))
  with check (exists (select 1 from weekly_plans w where w.id = weekly_plan_id and w.profile_id = auth.uid()));

create policy "items de listas propias" on shopping_items for all
  using (exists (select 1 from shopping_lists l where l.id = list_id and l.profile_id = auth.uid()))
  with check (exists (select 1 from shopping_lists l where l.id = list_id and l.profile_id = auth.uid()));
