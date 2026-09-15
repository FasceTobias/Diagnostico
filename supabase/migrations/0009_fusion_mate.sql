-- ==================================================================
-- 0009 — Se fusiona una entrada repetida: «Sólo mate» dentro de «Mate»
--
-- Eran la misma comida cargada dos veces: misma yerba, misma porción,
-- cero carbohidratos, dos minutos. Lo único distinto era el momento del
-- día, y para eso ya existe `moments`.
--
-- Borrar la fila y listo no alcanza: puede estar referenciada desde el
-- plan de alguien, desde lo que comió, desde sus favoritas. Así que
-- primero se mueven todas las referencias y recién después se borra.
-- Las tablas donde la referencia es parte de la clave se limpian antes,
-- para que mover no choque contra una fila que ya existe.
--
-- Es idempotente: si la entrada vieja ya no está, no hace nada.
-- ==================================================================

do $$
declare
  viejo uuid;
  nuevo uuid;
begin
  select id into viejo from meals where slug = 'mate-solo-manana' and profile_id is null;
  select id into nuevo from meals where slug = 'mate' and profile_id is null;
  if viejo is null or nuevo is null then
    return;
  end if;

  -- Los momentos de la que se va pasan a la que se queda.
  update meals m
     set moments = (select array(select distinct unnest(m.moments || v.moments)))
    from meals v
   where m.id = nuevo and v.id = viejo;

  -- Preferencias y opiniones: la clave es (perfil, comida), así que si
  -- alguien tenía las dos, la del viejo sobra.
  delete from meal_prefs p where p.meal_id = viejo
     and exists (select 1 from meal_prefs q where q.profile_id = p.profile_id and q.meal_id = nuevo);
  update meal_prefs set meal_id = nuevo where meal_id = viejo;

  delete from meal_opinions o where o.meal_id = viejo
     and exists (select 1 from meal_opinions q where q.profile_id = o.profile_id and q.meal_id = nuevo);
  update meal_opinions set meal_id = nuevo where meal_id = viejo;

  -- Lo que pasó y lo que estaba planeado.
  update meal_history set planned_meal_id = nuevo where planned_meal_id = viejo;
  update meal_history set actual_meal_id  = nuevo where actual_meal_id  = viejo;
  update packing_items set meal_id = nuevo where meal_id = viejo;
  update meals set forked_from = nuevo where forked_from = viejo;
  update prep_tasks set source_meal_ids = array_replace(source_meal_ids, viejo, nuevo)
   where viejo = any (source_meal_ids);

  -- Los días guardan sus slots en jsonb, así que hay que entrar adentro.
  update daily_plans d
     set slots = coalesce((
       select jsonb_agg(
         case when s->>'meal_id' = viejo::text
              then jsonb_set(s, '{meal_id}', to_jsonb(nuevo::text))
              else s end
         order by i)
       from jsonb_array_elements(d.slots) with ordinality as t(s, i)
     ), '[]'::jsonb)
   where d.slots::text like '%' || viejo::text || '%';

  -- Recién ahora. Lo que cuelga de la fila —items, porciones,
  -- etiquetas— se va con ella por cascada.
  delete from meals where id = viejo;
end $$;
