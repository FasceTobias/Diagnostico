-- ==================================================================
-- Lo que Supabase ya trae, reconstruido a mano.
--
-- Sirve para correr las migraciones en un Postgres limpio y comprobar
-- que hacen lo que dicen: que el SQL compila, que el orden es correcto y
-- —sobre todo— que las políticas de RLS dejan afuera lo que tienen que
-- dejar afuera.
--
-- No es un reemplazo de Supabase ni pretende serlo. Es la parte de la que
-- dependen las migraciones: los roles, auth.users, auth.uid(), auth.jwt()
-- y el esqueleto de storage.
-- ==================================================================

create extension if not exists pgcrypto;

-- ---------- roles ----------
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin noinherit bypassrls;
  end if;
end $$;

-- ---------- auth ----------
create schema if not exists auth;

create table auth.users (
  id                 uuid primary key default gen_random_uuid(),
  email              text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  raw_app_meta_data  jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now()
);

/* En Supabase, auth.uid() y auth.jwt() leen los claims que PostgREST deja
   en la configuración de la sesión. Acá se hace igual: las pruebas setean
   request.jwt.claims y el resto del SQL no se entera de la diferencia. */
create or replace function auth.jwt()
  returns jsonb
  language sql
  stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb,
    '{}'::jsonb
  )
$$;

create or replace function auth.uid()
  returns uuid
  language sql
  stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')::uuid
$$;

create or replace function auth.role()
  returns text
  language sql
  stable
as $$
  select auth.jwt() ->> 'role'
$$;

-- ---------- storage ----------
create schema if not exists storage;

create table storage.buckets (
  id     text primary key,
  name   text not null,
  public boolean not null default false
);

create table storage.objects (
  id         uuid primary key default gen_random_uuid(),
  bucket_id  text references storage.buckets (id),
  name       text not null,
  owner      uuid,
  created_at timestamptz not null default now()
);
alter table storage.objects enable row level security;

/* 'abc-123/etiqueta.jpg' → {abc-123}. Igual que la de Supabase: devuelve
   las carpetas, sin el nombre del archivo. */
create or replace function storage.foldername(name text)
  returns text[]
  language plpgsql
  immutable
as $$
declare
  partes text[];
begin
  partes := string_to_array(name, '/');
  return partes[1:array_length(partes, 1) - 1];
end
$$;

-- ---------- permisos ----------
grant usage on schema public, auth, storage to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
grant all on all tables in schema storage to anon, authenticated, service_role;
