-- ==================================================================
-- 0007 — Qué clase de preparación pide cada comida
--
-- El catálogo trataba a todas las comidas como si fueran la misma cosa
-- con distinto tiempo, y no lo son. Una banana, una tostada y un pastel
-- de papa no se diferencian en minutos: se diferencian en si hay algo
-- que hacer. Sin ese dato, la ficha de la banana decía «todavía no
-- tiene la preparación escrita», como si le faltara algo, y el hueco de
-- recetas se contaba mal: entraban al conteo comidas que no necesitan
-- ninguna.
--
--   cook     → se cocina. Le corresponde una receta.
--   assemble → se arma. Dos o tres líneas alcanzan.
--   ready    → se compra hecho y se sirve. No hay nada que escribir.
--
-- De paso se cierran dos cosas que quedaban a medias:
--
--   · `total_minutes` deja de poder ser null. Null quería decir «igual
--     que el activo», y la app lo leía así, pero en veintiún comidas el
--     total era de verdad mayor y nadie lo había cargado: la ficha
--     mostraba veinte minutos para algo que tarda treinta y cinco. Si
--     no hay espera, ahora los dos números son iguales y lo dicen.
--   · `yields` guarda cuánto rinde la receta cuando no coincide con la
--     porción. Ciento cincuenta gramos de harina son seis empanadas,
--     comas tres o comas una.
-- ==================================================================

create type prep_type as enum ('cook', 'assemble', 'ready');

alter table meals
  add column prep_type prep_type not null default 'assemble',
  -- Cuánto sale de la receta, en palabras: «6 empanadas», «2 platos».
  -- Null = la receta hace exactamente una porción.
  add column yields text;

-- Lo que ya estaba: sin el dato real, lo que no se compra hecho se
-- asume armado y lo comprado se asume listo. El seed del catálogo lo
-- pisa enseguida con el valor verdadero de cada entrada.
update meals set prep_type = 'ready' where buy_outside;

-- total_minutes deja de ser opcional. Lo que ya estaba en null quería
-- decir «igual que el activo», así que eso mismo se escribe.
update meals set total_minutes = prep_minutes where total_minutes is null;

-- Quien inserta una comida puede seguir sin pasarlo —el 90% de las
-- comidas no esperan nada— y la base lo completa. Lo que no puede es
-- quedar en null y que la ficha muestre el activo haciéndolo pasar por
-- total, que es el error que estamos sacando.
create function meals_completar_total() returns trigger
language plpgsql as $$
begin
  if new.total_minutes is null then
    new.total_minutes := new.prep_minutes;
  end if;
  return new;
end;
$$;

create trigger meals_completar_total_trg
  before insert or update on meals
  for each row execute function meals_completar_total();

alter table meals
  drop constraint if exists meals_total_minutes_check,
  alter column total_minutes set not null,
  add constraint meals_total_minutes_check check (total_minutes >= prep_minutes);

comment on column meals.prep_type is
  'cook = se cocina, assemble = se arma, ready = se sirve. Decide qué muestra la ficha cuando no hay pasos escritos.';
comment on column meals.yields is
  'Cuánto rinde la receta cuando no es una porción. Null = rinde una.';
