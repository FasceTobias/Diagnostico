-- Estado auxiliar: aislamiento por usuario.
\set USERA '''00000000-0000-0000-0000-0000000000c1'''
\set USERB '''00000000-0000-0000-0000-0000000000d2'''

insert into auth.users (id, email, raw_user_meta_data) values
  (:USERA::uuid, 'usera-sync@example.com', '{}'),
  (:USERB::uuid, 'userb-sync@example.com', '{}');

begin;
set local role authenticated;
select public.como(:USERA::uuid);

insert into client_state (profile_id, checks, extras, imported_local_at)
values (:USERA::uuid, '{"shop:item": true}'::jsonb, array['extra-item'], now());

select public.ok((select count(*) from client_state) = 1,
  'usuario A ve su estado auxiliar');

select public.ok(
  public.rechazado($q$
    insert into client_state (profile_id, checks)
    values ('00000000-0000-0000-0000-0000000000d2', '{}')
  $q$),
  'usuario A no crea estado para usuario B');

select public.como(:USERB::uuid);
select public.ok((select count(*) from client_state) = 0,
  'usuario B no ve el estado auxiliar de usuario A');

rollback;
