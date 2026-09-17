-- ==================================================================
-- 0011 — Endurecimiento de funciones internas
--
-- Estas funciones existen para triggers de la base. No son RPC públicas:
-- nadie desde el cliente necesita poder llamarlas directamente.
-- ==================================================================

-- search_path fijo: evita que un objeto con el mismo nombre en otro schema
-- cambie qué ejecuta la función.
alter function public.meals_completar_total() set search_path = '';

-- Las funciones SECURITY DEFINER de triggers no deben quedar expuestas por
-- /rest/v1/rpc. El trigger puede ejecutarlas aunque el usuario no tenga
-- permiso EXECUTE directo sobre la función.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.sync_porcion_default() from public, anon, authenticated;
revoke execute on function public.meals_completar_total() from public, anon, authenticated;
