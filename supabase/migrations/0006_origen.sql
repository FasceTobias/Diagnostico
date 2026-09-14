-- ==================================================================
-- 0006 — De dónde viene la comida, y a qué sabe
--
-- Tres cosas que hasta acá estaban mezcladas o no estaban:
--
--   1. `buy_outside` decía si algo se compraba afuera, pero no de dónde:
--      una milanesa de rotisería, una congelada del súper y una hecha en
--      casa no tienen el mismo tiempo, ni el mismo número, ni generan la
--      misma compra. Ahora el origen es explícito y es él quien decide
--      qué entra en la lista: los ingredientes, el producto, o nada.
--
--   2. Dulce o salado no estaba como dato, sólo como etiqueta suelta y a
--      medio completar. Sin esto, «quiero algo salado» encuentra el
--      sándwich y se pierde la milanesa y los fideos.
--
--   3. Una comida servía para un solo momento. El tostado de jamón y
--      queso es desayuno, merienda y snack: era una entrada repetida
--      tres veces, o dos momentos perdidos.
--
-- Qué se toca: sólo la tabla `meals`, y sólo agregando columnas. Nada se
-- borra ni se renombra, así que la app actual —que no las lee— sigue
-- funcionando igual mientras se despliega.
--
-- Qué pasa con lo que ya está cargado: los defaults lo dejan donde
-- estaba. `origin` se deduce de buy_outside y venues, que es de donde
-- salía la información hasta hoy, y `moments` arranca con la categoría
-- que la fila ya tenía. `flavor` queda en 'salado' por defecto y el seed
-- del catálogo lo pisa con el valor real de cada entrada.
-- ==================================================================

create type food_origin as enum (
  'casera', 'envasada', 'panaderia', 'rotiseria',
  'restaurante', 'kiosco', 'supermercado', 'heladeria');

create type flavor as enum ('dulce', 'salado', 'neutral', 'mixta');

alter table meals
  add column origin food_origin not null default 'casera',
  add column flavor flavor not null default 'salado',
  -- En qué momentos sirve. `category` sigue siendo el principal —el que
  -- ordena y filtra—; esto es dónde más puede aparecer.
  add column moments meal_category[] not null default '{}',
  -- Minutos de punta a punta, contando lo que espera solo. Las empanadas
  -- son diez minutos de armado y cuarenta de horno: guardar uno solo es
  -- mentir en el otro. Null = igual que prep_minutes.
  add column total_minutes int,
  -- Café, mate, té, agua. Acompañan o se piden a mano: el plan no decide
  -- que tu merienda es un café.
  add column is_drink boolean not null default false;

alter table meals
  add constraint meals_total_minutes_check
  check (total_minutes is null or total_minutes >= prep_minutes);

-- Lo que ya estaba: el origen se deduce de donde salía antes.
update meals set origin = case
  when not buy_outside then 'casera'
  when 'rotisería'  = any (venues) then 'rotiseria'
  when 'panadería'  = any (venues) then 'panaderia'
  when 'kiosco'     = any (venues) then 'kiosco'
  when 'supermercado' = any (venues) then 'supermercado'
  else 'restaurante'
end::food_origin;

update meals set moments = array[category] where moments = '{}';

-- Buscar por momento sin escanear la tabla entera.
create index meals_moments_idx on meals using gin (moments);

comment on column meals.origin is
  'De dónde sale. Decide la compra: casera suma ingredientes, envasada suma el producto, el resto no genera nada doméstico.';
comment on column meals.moments is
  'Momentos en los que sirve. Incluye siempre a category.';
comment on column meals.total_minutes is
  'Minutos de punta a punta. Null = igual que prep_minutes.';
