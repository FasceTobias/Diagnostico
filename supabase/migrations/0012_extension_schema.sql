-- Supabase recomienda mantener extensiones fuera de public para que sus
-- objetos no queden mezclados con la API expuesta por PostgREST.
alter extension btree_gist set schema extensions;
