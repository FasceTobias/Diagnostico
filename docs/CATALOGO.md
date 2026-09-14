# La biblioteca real

> El esquema del catálogo, antes de cargarle datos.
>
> Regla de fondo: **la biblioteca informa, no decide**. No hay lista de
> alimentos prohibidos ni «apto diabético». Pero tampoco da lo mismo todo:
> lo que separa una comida de otra es `frequency` —de todos los días o de
> cada tanto—, y el plan lo respeta. Medido sobre la semana generada: una
> sola de las 42 comidas es «de vez en cuando».

---

## 0. Qué NO se crea, y por qué

Pediste ocho tablas: `foods`, `food_variants`, `food_portions`,
`food_nutrition`, `food_tags`, `food_sources`, `food_places`,
`ingredients`. Cuatro de esas ya existen con otro nombre y dos no hacen
falta:

| Pedido | Dónde vive | Por qué |
| --- | --- | --- |
| `foods` + `ingredients` | `foods` + `meal_items` | Ya está: `foods` es el ingrediente (con cómo se compra) y `meal_items` lo conecta con la preparación. |
| `food_nutrition` | Columnas de `meal_portions` | La nutrición **es de la porción**, no del alimento. Separarla en otra tabla agrega un join a cada consulta para no ganar nada. |
| `food_places` | Enum `venue` + `meals.venues` | Los ocho lugares ya son un enum cerrado (kiosco, supermercado, cafetería, panadería, rotisería, restaurante, estación de servicio, casa de comidas). Una tabla se justifica cuando hay lugares concretos con dirección; hoy son categorías. |
| `food_variants` | `products`, una fila por envase | Otro envase es otra etiqueta con otros números. Tratarlo como «variante» invita a heredar datos que no corresponden. |

Y tres sí se crean: **`meal_portions`**, **`tags` + `meal_tags`** y
**`meal_prefs`**.

---

## 1. El esquema final

```
                      ┌──────────────┐
                      │   products   │  el envase: marca, RNPA, etiqueta
                      └──────┬───────┘
                             │ product_id (opcional)
┌──────────┐  meal_items  ┌──┴───────────┐  meal_portions  ┌──────────┐
│  foods   ├─────────────►│    meals     │◄────────────────┤ porciones│
│(ingred.) │  qty + unit  │  la entrada  │  1..n           │ + nutrí. │
└──────────┘              └──┬────────┬──┘                 └──────────┘
                             │        │
                    meal_tags│        │meal_prefs
                    ┌────────┴──┐  ┌──┴──────────────┐
                    │   tags    │  │  lo tuyo:       │
                    │vocabulario│  │  favorita, nota,│
                    └───────────┘  │  puntuación…    │
                                   └─────────────────┘
```

Una fila de `meals` es **una entrada de la biblioteca**: una preparación,
un producto envasado o una opción de calle. Los tres son lo mismo para la
app —algo que podés comer, con un número de carbohidratos al lado— y se
diferencian por cómo llegaron a ese número.

---

## 2. Tablas nuevas y modificadas

### Nuevas

**`meal_portions`** — la porción como entidad de primera clase.

Es el cambio más importante. Hasta ahora una comida tenía un número y una
descripción de porción, las dos sueltas. Pero *la porción es el dato*: una
pizza no tiene 60 g de carbohidratos, tiene 30 por porción y comés dos.

```sql
meal_id, label ('1 porción', '2 porciones', '1 empanada'),
grams, carbs, sugar, added_sugar, protein, fat, fiber, kcal,
is_default, sort_order
```

Cada comida tiene al menos una porción, marcada `is_default`. Un trigger
copia esa porción a `meals.carbs` y `meals.portion`, que es lo que la app
lee hoy: el modelo se arregla y **ninguna pantalla cambia**.

**`tags` + `meal_tags`** — vocabulario controlado.

`tags` tiene `slug`, `kind` (momento, contexto, tipo, practicidad,
saciedad, dato) y `label`. Nada de texto libre: una etiqueta que no está
en la tabla no se puede poner.

Lo que el motor ya filtra con columnas —categoría, saciedad, portable,
tiempo— **sigue en columnas**, porque un filtro duro sobre un join es más
lento y más frágil. Las etiquetas son para lo demás: dulce, salado,
kiosco, evento, sin azúcar agregada, light, zero, etiqueta verificada.

**`meal_prefs`** — lo tuyo sobre una comida del catálogo.

Esto arregla un error real del modelo actual: `favorite`, `tested` y
`rating` están hoy como columnas de `meals`. En una biblioteca compartida
eso significa que si vos marcás favorita la pizza, **le queda marcada a
todo el mundo**. Se mudan acá:

```sql
profile_id, meal_id, favorite, tested, rating, frequency,
usual_portion_id, notes, last_eaten_at, times_eaten
```

El catálogo global no se duplica por usuario, que es el punto 13. Y como
guarda `last_eaten_at` y `times_eaten`, el punto 14 —aprender que alguien
desayuna tostadas y nunca elige avena— es leer esta tabla, sin tocar el
catálogo.

### Modificadas

`meals` suma: `slug` (identidad estable del catálogo), `description`,
`data_state`, `source_name`, `source_url`, `source_checked_at`,
`carbs_from_items`, `active`, `updated_at` y `search` (tsvector).

Pierde: `favorite`, `tested`, `rating` — se van a `meal_prefs`.

`products` suma `rnpa` (el registro nacional del producto) con índice
único.

---

## 3. Los campos que pediste, y dónde quedan

| Pedido | Dónde |
| --- | --- |
| id, nombre, descripción, tipo, categoría, subcategoría | `meals`: `id`, `name`, `description`, `data_state`, `category`, `subcategories` + tags |
| marca, código de barras | `products.brand`, `products.barcode` |
| porción, unidad, peso en gramos | `meal_portions`: `label`, `grams` |
| carbohidratos, azúcar, azúcar agregada | `meal_portions`: `carbs`, `sugar`, `added_sugar` |
| proteína, grasa, fibra, kcal | `meal_portions`, todas opcionales |
| fuente, url / id externo | `meals.source_name`, `source_url`; `products.source`, `source_url`, `rnpa` |
| verified, confidence | `data_state` + `carbs_confidence` |
| transportable, frío, calentar, prep_time, saciedad | ya son columnas de `meals` |
| dulce / salado | tags `dulce`, `salado` |
| purchasable_outside, place_type | `meals.buy_outside`, `meals.venues` |
| frequency | `meals.freq` (del catálogo) y `meal_prefs.frequency` (tuya) |
| image_url, active, created_at, updated_at | `meals.photo_url`, `active`, `created_at`, `updated_at` |

---

## 4. Una comida compuesta

Un desayuno de tostadas con queso untable y café con leche **no es un
alimento nuevo**. Es una entrada con tres items:

```
meals: slug='tostadas-queso-untable-cafe'
       name='Tostadas con queso untable'
       drink='café con leche'
       carbs_from_items = true

meal_items → foods: pan lactal     2 rebanadas
             foods: queso untable  30 g
             foods: leche          100 ml
```

La función `carbos_de_items(meal_id)` suma usando `foods.carbs_per_100`.
Con `carbs_from_items = true`, el número sale de ahí y la fuente pasa a
ser `receta`: es un cálculo, no una estimación a ojo.

Cambiar el queso untable por manteca es cambiar **un item**, no crear una
entrada nueva. Es lo que pedís en el punto 10: plantilla más items, sin
cien registros para cada combinación.

---

## 5. Un producto envasado

Dos filas, no una:

```
products: brand='—', name='Alfajor simple de chocolate',
          serving_size='1 alfajor (45 g)', carbs_per_serving=…,
          rnpa=…, source='etiqueta', source_url=…, verified_at=…

meals:    slug='alfajor-simple', product_id=→, data_state='verificado'
```

El producto es el envase y se verifica **una vez para todos**. La entrada
de biblioteca es cómo aparece en la app. Un mismo producto puede estar en
varias entradas (el alfajor solo, y el alfajor como parte de una merienda)
sin repetir la etiqueta.

Mientras no haya etiqueta cargada, la entrada vive sin `product_id` y
queda `estimado`.

---

## 6. Una opción de calle

Una entrada normal con `buy_outside = true` y `venues` cargado:

```
meals: slug='tostado-cafeteria', name='Tostado de jamón y queso',
       buy_outside=true, venues={cafetería}, price_level=1,
       data_state='estimado',
       source_name='porción estándar calculada'
```

Quedan **fuera de la rotación del plan** —el martes no puede decirte
«comprá empanadas»— y aparecen sólo desde «Resolver ahora». Eso ya
funciona así y no cambia.

---

## 7. La fuente

Tres campos en la entrada y tres en el producto:

- `source_name` — de dónde salió: «etiqueta», «porción estándar
  calculada», «receta calculada», «web del fabricante».
- `source_url` — el link, cuando existe.
- `source_checked_at` — **cuándo se miró**. Sin esto, «verificado» no
  vence nunca, y las etiquetas cambian.

Para productos argentinos, `products.rnpa` guarda el número del registro
nacional. Es lo que permite volver a buscar el producto en la fuente
oficial dentro de un año y ver si cambió.

**Open Food Facts queda afuera por ahora.** Su licencia (ODbL) pide
atribución y tiene condiciones de share-alike sobre bases derivadas, así
que importarla en bloque comprometería la base propia. Si más adelante se
integra, va como fuente externa consultada aparte —nunca mezclada en
silencio— y con la licencia documentada. El modelo ya lo permite:
`source_name = 'Open Food Facts'` y `source_url` al producto.

---

## 8. Verificado, estimado, demo

Un solo campo, `data_state`, con tres valores:

| | Cuándo | Cómo se ve |
| --- | --- | --- |
| `verificado` | Etiqueta real, fuente oficial del fabricante, o receta con cantidades y porción calculadas | `42 g CHO` |
| `estimado` | Restaurante, panadería, rotisería, preparación genérica, producto sin etiqueta confirmada | **`~42 g CHO`** |
| `demo` | Contenido de desarrollo, a reemplazar | `~42 g CHO` + cartel DEMO |

Hasta ahora esto eran dos booleanos (`is_demo`, `carbs_verified`) que
podían contradecirse. Pasan a ser **columnas generadas** a partir de
`data_state`: un solo lugar donde está la verdad, y todo lo que ya las lee
sigue funcionando.

---

## 9. Duplicados

Cuatro reglas, todas en la base:

1. `slug` único en el catálogo. Es la identidad: el seed hace
   `on conflict (slug) do update`, así correrlo dos veces no duplica nada.
2. `lower(name) + category` único entre las entradas activas del
   catálogo. Dos «Tostado de jamón y queso» en desayuno no tienen sentido.
3. `barcode` único en productos.
4. `rnpa` único en productos.

Lo que **no** es duplicado: el mismo plato casero y comprado afuera
(«Tostado» y «Tostado de cafetería») son dos entradas, porque tienen otro
tiempo, otro lugar y otro número. Y una entrada del catálogo y tu copia
personal tampoco, para eso está `forked_from`.

---

## 10. El plan de seed

Una sola fuente, dos salidas. Los datos se escriben en
`data/catalogo/*.json` y de ahí salen:

- `supabase/seed/*.sql` para la base, con `on conflict` por slug;
- la biblioteca que usa la app hoy, que lee el mismo JSON.

Así la biblioteca deja de vivir en un `.ts` de demo y empieza a ser el
catálogo de verdad, **sin esperar a que Supabase esté conectado**.

### Fases B y C (hechas): 200 entradas

La primera tanda fueron 44. La devolución sobre esas 44 dejó cinco cosas
para arreglar, y arreglarlas cambió el modelo, no sólo los datos. Recién
después creció la biblioteca, y lo que se agregó salió de los huecos que
marcó el checkpoint, no de hacer más de lo que ya sobraba.

1. **El origen se separó de la comida.** Antes había un `buy_outside`
   que decía sí o no. Ahora cada entrada dice de dónde sale —casera,
   envasada, panadería, rotisería, restaurante, kiosco, supermercado,
   heladería— y eso es lo que decide la compra: la casera suma sus
   ingredientes, la envasada suma el producto, y lo que comprás hecho no
   genera nada. Nadie compra harina porque el martes come empanadas de
   la rotisería.
2. **Ningún ingrediente se reusa para que la compra funcione.** Cuatro
   entradas tenían ingredientes que no eran los suyos, y la lista de la
   semana llegaba a pedir un litro de leche por una bocha de helado. Si
   falta un alimento en `foods.ts`, se crea.
3. **Dulce y salado son un dato, no una etiqueta suelta**, con `neutral`
   y `mixta` para lo que no cae de ningún lado. Ahora «algo salado»
   encuentra la milanesa y los fideos, no sólo el sándwich.
4. **Una entrada sirve para varios momentos.** El tostado de jamón y
   queso es desayuno, merienda y snack: una entrada con tres momentos,
   no tres entradas repetidas.
5. **El tiempo activo y el total son dos números.** Las empanadas son
   media hora de trabajo y hora y media de reloj. Guardar uno solo
   miente en el otro.

Y las bebidas —café, mate, té, agua— quedaron marcadas como tales: el
plan no decide que tu merienda es un café.

| Momento | Cuántas |
| --- | --- |
| Desayunos | 25 |
| Snacks | 60 |
| Almuerzos | 46 |
| Meriendas | 34 |
| Cenas | 35 |

| De dónde sale | Cuántas |
| --- | --- |
| Casera | 137 |
| Envasada | 24 |
| Restaurante | 11 |
| Panadería | 8 |
| Kiosco | 8 |
| Rotisería | 7 |
| Supermercado | 4 |
| Heladería | 1 |

Dulce 68 · salado 122 · ni una cosa ni la otra
9 · las dos 1.

Todas entran como **`estimado`**, con `source_name = 'porción estándar
calculada'`. Ninguna se marca verificada: para eso hace falta una etiqueta
o una receta medida, y eso es Fase D.

Pizza, empanadas, hamburguesa, medialunas, alfajor, chocolate, helado,
flan con dulce de leche y gaseosa común están adentro con su número. No
porque dé lo mismo comerlas todos los días, sino porque el día que las
comas vas a necesitar el número, y si la app no lo tiene, estimás a ojo.

Las que están marcadas **de vez en cuando** bajan de prioridad en la
rotación, y el resultado medido es que el plan semanal propone una sola
comida de ésas en 42. El detalle además lo dice. Ni prohibir ni festejar:
que el plan se parezca a una semana normal.

Las recetas no están en el JSON. Viven en `src/lib/recetas.ts`, con el
slug del catálogo como clave, porque son prosa y no data: una comida sin
receta simplemente no aparece ahí.

### Después

- **Fase C**: hecha. 200 entradas. El checkpoint de distribución se
  corrió a las 119 y volvió a correrse al cerrar: los grupos que estaban
  flacos —meriendas, cenas sin cocinar, desayunos para llevar, opciones
  por lugar— son los que más crecieron.

  Un detalle que apareció recién con la biblioteca grande: la rotación
  desempataba por orden alfabético, y con doscientas entradas el plan
  salía en fila —arroz con atún, arroz con pollo, arroz primavera— y lo
  que empieza con eme no aparecía nunca. Ahora el desempate mezcla el id
  con el día: sigue siendo determinista, pero deja de depender del
  abecedario.
- **Fase D**: reemplazar los estimados que más pesan por etiqueta real,
  empezando por los envasados de kiosco y supermercado.
