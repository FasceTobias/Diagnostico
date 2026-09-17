-- ==================================================================
-- 0015 — Zona de compra
--
-- La ubicación comercial se guarda aparte del perfil nutricional. No se
-- usa GPS ni se infiere domicilio: la persona elige dónde suele comprar.
-- Sirve para buscar referencias de precios de lo más específico a lo más
-- amplio: localidad -> provincia -> región -> nacional.
-- ==================================================================

create table public.purchase_locations (
  profile_id     uuid primary key references public.profiles (id) on delete cascade,
  province_code text not null,
  province_name text not null,
  locality      text,
  updated_at    timestamptz not null default now()
);

comment on table public.purchase_locations is
  'Zona elegida por la persona para estimar precios. No representa domicilio ni ubicación GPS.';

alter table public.purchase_locations enable row level security;

create policy "zona propia visible"
  on public.purchase_locations for select
  to authenticated
  using (profile_id = (select auth.uid()));

create policy "zona propia insertable"
  on public.purchase_locations for insert
  to authenticated
  with check (profile_id = (select auth.uid()));

create policy "zona propia editable"
  on public.purchase_locations for update
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy "zona propia borrable"
  on public.purchase_locations for delete
  to authenticated
  using (profile_id = (select auth.uid()));
