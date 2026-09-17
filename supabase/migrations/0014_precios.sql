-- ==================================================================
-- 0014 — Precios estimados por región
--
-- Referencias públicas para estimar cuánto cuesta una compra o una comida.
-- No son precios de caja: guardamos rango, mediana, unidad, fecha y fuente.
-- El catálogo local usa claves estables de FOODS (food_key), por eso no
-- depende de que exista una fila equivalente en foods.
-- ==================================================================

create table public.price_references (
  id              uuid primary key default gen_random_uuid(),
  food_key        text,
  product_id      uuid references public.products (id) on delete cascade,
  region_code     text not null default 'AR-BA-AMBA',
  locality        text,
  currency        text not null default 'ARS' check (currency ~ '^[A-Z]{3}$'),

  -- Precio del formato de compra declarado abajo.
  min_price       numeric(14,2) not null check (min_price >= 0),
  median_price    numeric(14,2) not null check (median_price >= 0),
  max_price       numeric(14,2) not null check (max_price >= 0),
  purchase_unit   text not null,              -- kg | g | ml | u | paquete | pote...
  purchase_qty    numeric(14,3) not null default 1 check (purchase_qty > 0),

  source_name     text not null,
  source_url      text,
  observed_on     date not null,
  valid_until     date,
  sample_size     integer check (sample_size is null or sample_size > 0),
  confidence      text not null default 'media'
                  check (confidence in ('alta','media','estimada')),
  notes           text,
  created_at      timestamptz not null default now(),

  check ((food_key is not null)::int + (product_id is not null)::int = 1),
  check (min_price <= median_price and median_price <= max_price),
  check (valid_until is null or valid_until >= observed_on)
);

create index price_references_food_region_date_idx
  on public.price_references (food_key, region_code, observed_on desc)
  where food_key is not null;
create index price_references_product_region_date_idx
  on public.price_references (product_id, region_code, observed_on desc)
  where product_id is not null;

comment on table public.price_references is
  'Rangos de precios observados. La mediana es la referencia principal; min/max comunican variación real.';
comment on column public.price_references.food_key is
  'Clave estable del catálogo local FOODS, por ejemplo papa, huevo, leche.';

alter table public.price_references enable row level security;

-- Son datos públicos y no personales: sirven incluso en modo invitado.
create policy "precios publicos visibles"
  on public.price_references for select
  to anon, authenticated
  using (true);

-- Sólo administración actualiza la referencia global.
create policy "precios los escribe administracion"
  on public.price_references for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Auditoría de cada refresco mensual. No guarda secretos ni payloads crudos.
create table public.price_refresh_runs (
  id              uuid primary key default gen_random_uuid(),
  region_code     text not null default 'AR-BA-AMBA',
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  status          text not null default 'running'
                  check (status in ('running','success','partial','failed')),
  source_name     text,
  rows_written    integer not null default 0 check (rows_written >= 0),
  notes           text,
  created_by      uuid references auth.users (id) on delete set null
);

create index price_refresh_runs_region_date_idx
  on public.price_refresh_runs (region_code, started_at desc);

alter table public.price_refresh_runs enable row level security;

create policy "estado de precios visible"
  on public.price_refresh_runs for select
  to anon, authenticated
  using (status in ('success','partial'));

create policy "refrescos los escribe administracion"
  on public.price_refresh_runs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
