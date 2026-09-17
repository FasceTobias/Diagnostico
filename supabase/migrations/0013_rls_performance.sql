-- ==================================================================
-- 0013 — RLS más barato y catálogo legible completo
--
-- 1. auth.uid() se evalúa una vez por consulta, no una vez por fila.
-- 2. Cada acción tiene una sola política permisiva por tabla.
-- 3. Los items de las comidas del catálogo también se pueden leer.
-- 4. Índices para las FK que más se recorren al borrar/consultar.
-- ==================================================================

-- ---------- índices de FK ----------
create index if not exists foods_forked_from_idx on foods (forked_from);
create index if not exists meal_history_actual_meal_idx on meal_history (actual_meal_id);
create index if not exists meal_history_planned_meal_idx on meal_history (planned_meal_id);
create index if not exists meal_items_food_idx on meal_items (food_id);
create index if not exists meal_opinions_meal_idx on meal_opinions (meal_id);
create index if not exists meal_prefs_meal_idx on meal_prefs (meal_id);
create index if not exists meal_prefs_usual_portion_idx on meal_prefs (usual_portion_id);
create index if not exists meals_forked_from_idx on meals (forked_from);
create index if not exists packing_items_meal_idx on packing_items (meal_id);
create index if not exists products_verified_by_idx on products (verified_by);
create index if not exists shopping_items_food_idx on shopping_items (food_id);

-- ---------- perfil ----------
drop policy if exists "perfil propio" on profiles;
create policy "perfil propio" on profiles for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------- tablas privadas con profile_id directo ----------
do $$
declare t text;
begin
  foreach t in array array[
    'weekly_plans','prep_tasks','packing_items','shopping_lists',
    'meal_history','preferences','insulin_ratios'
  ] loop
    execute format('drop policy if exists "datos propios" on %I', t);
    execute format(
      'create policy "datos propios" on %I for all to authenticated
       using (profile_id = (select auth.uid()))
       with check (profile_id = (select auth.uid()))', t);
  end loop;
end $$;

-- ---------- exclusiones / preferencias por comida / opiniones ----------
drop policy if exists "datos propios" on exclusions;
create policy "datos propios" on exclusions for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

drop policy if exists "datos propios" on meal_prefs;
create policy "datos propios" on meal_prefs for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

drop policy if exists "opiniones propias" on meal_opinions;
create policy "opiniones propias" on meal_opinions for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

drop policy if exists "estado auxiliar propio" on client_state;
create policy "estado auxiliar propio" on client_state for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

-- ---------- meals: personal + catálogo ----------
drop policy if exists "datos propios" on meals;
drop policy if exists "catalogo visible" on meals;
drop policy if exists "catalogo lo escribe administracion" on meals;

create policy "meals leer" on meals for select to authenticated
  using (profile_id is null or profile_id = (select auth.uid()));
create policy "meals insertar" on meals for insert to authenticated
  with check (
    profile_id = (select auth.uid())
    or (profile_id is null and public.is_admin())
  );
create policy "meals actualizar" on meals for update to authenticated
  using (
    profile_id = (select auth.uid())
    or (profile_id is null and public.is_admin())
  )
  with check (
    profile_id = (select auth.uid())
    or (profile_id is null and public.is_admin())
  );
create policy "meals borrar" on meals for delete to authenticated
  using (
    profile_id = (select auth.uid())
    or (profile_id is null and public.is_admin())
  );

-- ---------- foods: personal + catálogo ----------
drop policy if exists "datos propios" on foods;
drop policy if exists "catalogo visible" on foods;
drop policy if exists "catalogo lo escribe administracion" on foods;

create policy "foods leer" on foods for select to authenticated
  using (profile_id is null or profile_id = (select auth.uid()));
create policy "foods insertar" on foods for insert to authenticated
  with check (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()));
create policy "foods actualizar" on foods for update to authenticated
  using (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()))
  with check (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()));
create policy "foods borrar" on foods for delete to authenticated
  using (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()));

-- ---------- products: personal + catálogo ----------
drop policy if exists "productos propios" on products;
drop policy if exists "catalogo visible" on products;
drop policy if exists "catalogo lo escribe administracion" on products;

create policy "products leer" on products for select to authenticated
  using (profile_id is null or profile_id = (select auth.uid()));
create policy "products insertar" on products for insert to authenticated
  with check (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()));
create policy "products actualizar" on products for update to authenticated
  using (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()))
  with check (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()));
create policy "products borrar" on products for delete to authenticated
  using (profile_id = (select auth.uid()) or (profile_id is null and public.is_admin()));

-- ---------- items de comidas ----------
drop policy if exists "items de comidas propias" on meal_items;

create policy "meal_items leer" on meal_items for select to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id is null or m.profile_id = (select auth.uid()))
  ));
create policy "meal_items insertar" on meal_items for insert to authenticated
  with check (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));
create policy "meal_items actualizar" on meal_items for update to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ))
  with check (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));
create policy "meal_items borrar" on meal_items for delete to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));

-- ---------- porciones ----------
drop policy if exists "porciones de comidas visibles" on meal_portions;
drop policy if exists "porciones de comidas propias" on meal_portions;
drop policy if exists "catalogo lo escribe administracion" on meal_portions;

create policy "meal_portions leer" on meal_portions for select to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id is null or m.profile_id = (select auth.uid()))
  ));
create policy "meal_portions insertar" on meal_portions for insert to authenticated
  with check (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));
create policy "meal_portions actualizar" on meal_portions for update to authenticated
  using (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ))
  with check (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));
create policy "meal_portions borrar" on meal_portions for delete to authenticated
  using (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));

-- ---------- tags de comida ----------
drop policy if exists "etiquetas de comidas visibles" on meal_tags;
drop policy if exists "etiquetas de comidas propias" on meal_tags;
drop policy if exists "catalogo lo escribe administracion" on meal_tags;

create policy "meal_tags leer" on meal_tags for select to authenticated
  using (exists (
    select 1 from meals m
    where m.id = meal_id
      and (m.profile_id is null or m.profile_id = (select auth.uid()))
  ));
create policy "meal_tags insertar" on meal_tags for insert to authenticated
  with check (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));
create policy "meal_tags actualizar" on meal_tags for update to authenticated
  using (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ))
  with check (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));
create policy "meal_tags borrar" on meal_tags for delete to authenticated
  using (exists (
    select 1 from meals m where m.id = meal_id
      and (m.profile_id = (select auth.uid()) or (m.profile_id is null and public.is_admin()))
  ));

-- ---------- vocabulario ----------
drop policy if exists "vocabulario visible" on tags;
drop policy if exists "vocabulario lo escribe administracion" on tags;
create policy "tags leer" on tags for select to authenticated using (true);
create policy "tags insertar" on tags for insert to authenticated with check (public.is_admin());
create policy "tags actualizar" on tags for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "tags borrar" on tags for delete to authenticated using (public.is_admin());

-- ---------- tablas que heredan dueño ----------
drop policy if exists "dias de planes propios" on daily_plans;
create policy "dias de planes propios" on daily_plans for all to authenticated
  using (exists (
    select 1 from weekly_plans w
    where w.id = weekly_plan_id and w.profile_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from weekly_plans w
    where w.id = weekly_plan_id and w.profile_id = (select auth.uid())
  ));

drop policy if exists "items de listas propias" on shopping_items;
create policy "items de listas propias" on shopping_items for all to authenticated
  using (exists (
    select 1 from shopping_lists l
    where l.id = list_id and l.profile_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from shopping_lists l
    where l.id = list_id and l.profile_id = (select auth.uid())
  ));
