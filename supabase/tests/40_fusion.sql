-- ==================================================================
-- Fusionar dos entradas repetidas sin romperle la semana a nadie.
--
-- La migración 0009 se aplica sobre una base recién creada, donde no
-- hay nada que mover, así que ahí no prueba nada. Acá se arma el caso
-- de verdad: la entrada vieja existe, alguien la tiene en el plan de
-- esta semana, la comió el martes y la marcó como favorita. Después se
-- corre la misma migración —el archivo, no una copia— y se mira que no
-- se haya perdido nada.
-- ==================================================================

begin;

\set FULANO '''00000000-0000-0000-0000-0000000000f1'''

create or replace function public.ok(cond boolean, label text)
  returns void language plpgsql as $$
begin
  if cond then raise notice 'OK     %', label;
  else raise exception 'FALLA  %', label;
  end if;
end $$;

insert into auth.users (id, email, raw_user_meta_data)
  values (:FULANO::uuid, 'fulano@ejemplo.com', '{}');

-- La entrada vieja vuelve a existir, con dos momentos que la que se
-- queda no tiene.
insert into meals (id, profile_id, slug, name, category, moments, prep_type, prep_minutes, total_minutes)
  values ('00000000-0000-0000-0000-00000000fff1', null, 'mate-solo-manana', 'Sólo mate',
          'desayuno', array['desayuno']::meal_category[], 'assemble', 2, 2);

-- Y alguien la está usando.
insert into meal_prefs (profile_id, meal_id, favorite)
  values (:FULANO::uuid, '00000000-0000-0000-0000-00000000fff1', true);

insert into meal_history (profile_id, date, slot, planned_meal_id, actual_meal_id, status)
  values (:FULANO::uuid, '2026-09-08', 'breakfast',
          '00000000-0000-0000-0000-00000000fff1',
          '00000000-0000-0000-0000-00000000fff1', 'eaten');

insert into weekly_plans (id, profile_id, week_start)
  values ('00000000-0000-0000-0000-00000000aaaa', :FULANO::uuid, '2026-09-07');

insert into daily_plans (weekly_plan_id, date, slots)
  values ('00000000-0000-0000-0000-00000000aaaa', '2026-09-08',
          jsonb_build_array(
            jsonb_build_object('slot', 'breakfast', 'meal_id', '00000000-0000-0000-0000-00000000fff1', 'time', '08:00'),
            jsonb_build_object('slot', 'lunch', 'meal_id', (select id from meals where slug = 'pizza-casera' and profile_id is null)::text, 'time', '13:00')));

\i supabase/migrations/0009_fusion_mate.sql

select public.ok(
  (select count(*) from meals where slug = 'mate-solo-manana') = 0,
  'la entrada repetida ya no esta');

select public.ok(
  (select moments from meals where slug = 'mate' and profile_id is null)
    @> array['desayuno', 'snack']::meal_category[],
  'el mate se quedo con los dos momentos, no con uno');

select public.ok(
  (select meal_id from meal_prefs where profile_id = :FULANO::uuid)
    = (select id from meals where slug = 'mate' and profile_id is null),
  'la favorita apunta ahora a la entrada que quedo');

select public.ok(
  (select count(*) from meal_history
     where profile_id = :FULANO::uuid
       and planned_meal_id = (select id from meals where slug = 'mate' and profile_id is null)
       and actual_meal_id  = (select id from meals where slug = 'mate' and profile_id is null)) = 1,
  'lo que comio el martes sigue apuntando a algo que existe');

select public.ok(
  (select slots->0->>'meal_id' from daily_plans where date = '2026-09-08')
    = (select id from meals where slug = 'mate' and profile_id is null)::text,
  'el plan del dia quedo migrado adentro del jsonb');

select public.ok(
  (select jsonb_array_length(slots) from daily_plans where date = '2026-09-08') = 2,
  'y sin perder el otro slot del dia');

rollback;
