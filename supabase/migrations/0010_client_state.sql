-- ==================================================================
-- 0010 — Estado auxiliar de sincronización
--
-- El dominio importante sigue normalizado (perfil, preferencias, semana,
-- ratios, compras, etc.). Acá vive solamente lo que es pequeño, propio del
-- dispositivo y no merece una tabla por cada checkbox: checks derivados y
-- extras agregados a compras. También marca si ya importamos el estado local
-- de una persona al crear/iniciar su cuenta por primera vez.
-- ==================================================================

create table client_state (
  profile_id        uuid primary key references profiles (id) on delete cascade,
  checks            jsonb not null default '{}'::jsonb,
  extras            text[] not null default '{}',
  imported_local_at timestamptz,
  updated_at        timestamptz not null default now()
);

alter table client_state enable row level security;

create policy "estado auxiliar propio" on client_state
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

comment on table client_state is
  'Estado auxiliar sincronizable. La UI efímera (por ejemplo modo foco) no se guarda acá.';
comment on column client_state.checks is
  'Checks derivados de mochila, preparación y compras, indexados por id estable.';
comment on column client_state.extras is
  'Ids/slugs del catálogo agregados a compras fuera del plan semanal.';
comment on column client_state.imported_local_at is
  'Evita importar dos veces el estado guest/local al vincular una cuenta.';
