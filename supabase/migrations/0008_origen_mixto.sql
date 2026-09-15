-- ==================================================================
-- 0008 — El origen deja de decidir la compra
--
-- Había un nudo: el origen servía para dos cosas a la vez —de dónde
-- viene la comida y qué entra en la lista del súper— y eso obligaba a
-- mentir en una para que la otra funcionara.
--
-- El caso concreto es el pollo al spiedo con ensalada. El pollo se
-- compra hecho; la lechuga y el tomate los comprás vos. Si para que la
-- lechuga aparezca en la lista hay que declarar la comida «casera», el
-- origen pasa a ser una etiqueta que dice lo que conviene, no lo que
-- pasa.
--
-- Entonces: el origen dice sólo de dónde viene, con un valor nuevo para
-- las que son las dos cosas, y la compra sale de los ingredientes que
-- la comida tiene cargados. Lo que se come afuera no tiene ninguno, y
-- por eso no genera compra: no hace falta preguntarle a nadie.
-- ==================================================================

alter type food_origin add value if not exists 'mixta' after 'casera';

comment on column meals.origin is
  'De dónde viene la comida: casera, mixta (parte hecha, parte comprada), envasada, o el lugar donde se compra. No decide la compra: eso sale de meal_items.';
