-- ==================================================================
-- El catálogo cargado: que el seed haya entrado entero y bien.
-- ==================================================================

select public.ok(
  (select count(*) from meals where profile_id is null and slug is not null) >= 200,
  'las entradas del catalogo entraron');

select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada' and data_state <> 'estimado') = 0,
  'ninguna entra como verificada: eso es la fase D');

select public.ok(
  (select carbs_total from meals where slug = 'pizza-casera') = 60,
  'la pizza queda en 2 porciones, que es como se come');

select public.ok(
  (select count(*) from meal_portions p join meals m on m.id = p.meal_id
     where m.slug = 'pizza-casera') = 3,
  'y con sus tres porciones, para elegir cuanto');

select public.ok(
  (select carbs from meal_portions p join meals m on m.id = p.meal_id
     where m.slug = 'pizza-casera' and p.label = '1 porción') = 30,
  'una porcion sola son 30');

-- Las prohibidas están, y no como excepción.
select public.ok(
  (select count(*) from meals where profile_id is null and slug in (
     'pizza-casera', 'empanadas-caseras', 'hamburguesa-casera', 'medialunas-panaderia',
     'alfajor-simple', 'chocolate-barra', 'helado-heladeria', 'flan-dulce-de-leche',
     'gaseosa-comun', 'milanesa-completa-rotiseria')) = 10,
  'las diez llamadas prohibidas estan en el catalogo');

-- Sin azúcar no quiere decir sin carbohidratos.
select public.ok(
  (select carbs_total from meals where slug = 'gelatina-light') is not null,
  'lo light igual declara sus carbohidratos');

select public.ok(
  (select count(*) from meal_tags t join meals m on m.id = t.meal_id
     where m.slug = 'medialunas-panaderia') >= 3,
  'las entradas quedan etiquetadas');

select public.ok(
  (select count(distinct category) from meals
     where source_name = 'porción estándar calculada') = 5,
  'hay entradas de los cinco momentos del dia');

select public.ok(
  (select count(*) from meals where profile_id is null and buy_outside) >= 6,
  'y opciones de calle de varios lugares');

-- ---------- de dónde viene ----------
-- La misma comida hecha en casa y comprada hecha son dos entradas, y no
-- dicen lo mismo: la de rotisería es un número estimado sobre la de
-- afuera, no una copia de la de casa.
select public.ok(
  (select origin from meals where slug = 'empanadas-caseras') = 'casera'
  and (select origin from meals where slug = 'empanadas-rotiseria') = 'rotiseria',
  'la empanada de casa y la de rotiseria tienen origen distinto');

select public.ok(
  (select carbs_total from meals where slug = 'empanadas-caseras')
  <> (select carbs_total from meals where slug = 'empanadas-rotiseria'),
  'y numero distinto: la de rotiseria no copia a la de casa');

-- Lo que se compra hecho no genera compra doméstica.
select public.ok(
  (select count(*) from meal_items it join meals m on m.id = it.meal_id
     where m.profile_id is null
       and m.origin not in ('casera', 'envasada')) = 0,
  'nada comprado afuera arrastra ingredientes de super');

-- ---------- dulce y salado ----------
select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada' and flavor is null) = 0,
  'ninguna entrada quedo sin dulce/salado');

select public.ok(
  (select count(*) from meals where profile_id is null and flavor = 'salado'
     and slug in ('milanesa-pure', 'fideos-tuco', 'sandwich-chico', 'pizza-casera')) = 4,
  '"algo salado" encuentra la milanesa y los fideos, no solo el sandwich');

-- ---------- un tostado sirve para tres momentos ----------
select public.ok(
  (select moments from meals where slug = 'tostado-jamon-queso') @> array['desayuno', 'merienda', 'snack']::meal_category[],
  'el tostado es desayuno, merienda y snack sin repetirse tres veces');

select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada'
       and not (moments @> array[category])) = 0,
  'toda entrada aparece en su propio momento');

-- ---------- el tiempo activo no es el total ----------
select public.ok(
  (select prep_minutes from meals where slug = 'empanadas-caseras') = 30
  and (select total_minutes from meals where slug = 'empanadas-caseras') = 90,
  'las empanadas son 30 minutos de trabajo y 90 de punta a punta');

select public.ok(
  public.rechazado($q$
    update meals set total_minutes = 1 where slug = 'empanadas-caseras'
  $q$),
  'la base no acepta un total menor que el tiempo activo');

-- ---------- las bebidas no son una merienda ----------
select public.ok(
  (select count(*) from meals where profile_id is null and is_drink) >= 5,
  'el mate, el te, el cafe y el agua estan como bebidas');

select public.ok(
  (select is_drink from meals where slug = 'cafe-solo'),
  'un cafe solo es una bebida, no una merienda');

-- ---------- qué clase de preparación pide cada comida ----------
select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada' and prep_type is null) = 0,
  'ninguna entrada del catalogo quedo sin prep_type');

select public.ok(
  (select prep_type from meals where slug = 'pastel-de-papa') = 'cook'
  and (select prep_type from meals where slug = 'tostadas-palta') = 'assemble'
  and (select prep_type from meals where slug = 'banana') = 'ready',
  'el pastel se cocina, la tostada se arma y la banana esta lista');

-- Lo comprado hecho no puede pedir cocina: es el error que hacia que la
-- ficha de un pollo al spiedo dijera "todavia no tiene la preparacion".
select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada'
       and origin in ('rotiseria', 'panaderia', 'kiosco', 'heladeria', 'restaurante')
       and prep_type = 'cook') = 0,
  'nada que se compra hecho quedo marcado como que se cocina');

select public.ok(
  (select prep_type from meals where slug = 'pollo-spiedo-casa') = 'assemble',
  'el pollo al spiedo de casa se arma, no se cocina');

-- ---------- ningún tiempo total vacío ----------
select public.ok(
  (select count(*) from meals
     where source_name = 'porción estándar calculada'
       and total_minutes is null) = 0,
  'ninguna entrada muestra el tiempo activo como si fuera el total');

select public.ok(
  (select total_minutes from meals where slug = 'merluza-pure') = 35
  and (select prep_minutes from meals where slug = 'merluza-pure') = 20,
  'la merluza son 20 minutos de trabajo y 35 hasta el plato');

-- ---------- cuánto rinde la receta ----------
select public.ok(
  (select yields from meals where slug = 'empanadas-caseras') = '6 empanadas',
  'las empanadas dicen que rinden 6');

select public.ok(
  (select carbs from meal_portions p join meals m on m.id = p.meal_id
     where m.slug = 'empanadas-caseras' and p.label = '1 empanada') = 20,
  'y cada una es 20 g, calculado sobre la receta');
