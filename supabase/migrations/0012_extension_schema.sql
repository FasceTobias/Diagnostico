-- Supabase recomienda mantener extensiones fuera de public para que sus
-- objetos no queden mezclados con la API expuesta por PostgREST.
-- En Postgres local de CI puede no estar instalada: en ese caso no hay
-- nada que mover y la migración debe seguir siendo portable.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'btree_gist') then
    execute 'create schema if not exists extensions';
    execute 'alter extension btree_gist set schema extensions';
  end if;
end
$$;
