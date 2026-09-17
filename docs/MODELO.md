# El modelo del catálogo

Qué sabe la app de cada comida, y por qué cada campo existe. Todo esto vive en
`data/catalogo/v1.json` —199 entradas, fuente única— y se refleja en
`src/lib/types.ts` y en `supabase/migrations/`.

La regla de fondo, para cualquier campo que se agregue después:

> **El dato dice lo que pasa, no lo que conviene.** Si hay que mentir en un
> campo para que otra cosa funcione, el problema es el modelo.

---

## Las tres preguntas que no son la misma

Durante un tiempo estuvieron mezcladas y cada una tapaba a las otras dos.

### `origen` — de dónde viene

`casera` · `mixta` · `envasada` · `panadería` · `rotisería` · `restaurante` ·
`kiosco` · `supermercado` · `heladería`

`mixta` es para lo que trae algo hecho y se completa en casa: el pollo al
spiedo con ensalada es pollo de rotisería y una ensalada tuya.

**No decide la compra.** Antes sí, y eso obligaba a declarar «casera» una
comida que traía el pollo hecho, sólo para que la lechuga entrara en la lista.

### `prepType` — cuánto trabajo pide

| | Qué muestra «Ver preparación» |
| --- | --- |
| `cook` | La receta completa. |
| `assemble` | Dos o tres líneas. Una tostada no necesita una receta, pero sí decir qué lleva encima. |
| `ready` | «Listo para comer». No hay nada que escribir. |

Sin esto, la ficha de una banana decía «todavía no tiene la preparación
escrita», como si le faltara algo. No le falta nada: una banana se pela.

### La lista de compras — sale de los ingredientes

De `items`, y de nada más. Lo que se come afuera no tiene ingredientes
cargados, así que no suma, sin preguntarle a ninguna etiqueta.

---

## Tiempo: activo y total

- `activeMinutes` — minutos con las manos en la masa.
- `totalMinutes` — de punta a punta, contando lo que espera solo.

**Nunca vacío y nunca menor que el activo.** La base lo rechaza, y un trigger
lo completa con el activo si quien inserta no lo pasa. Cuando estaba vacío, la
ficha mostraba el tiempo de trabajo como si fuera el total: la merluza decía
veinte minutos para algo que tarda treinta y cinco.

---

## Porción y `rinde`

- `portions` — lo que comés, con su carbohidrato. Puede haber varias.
- `rinde` — cuánto sale de la receta, cuando no es lo mismo: «6 empanadas»,
  «2 platos». Vacío quiere decir que la receta hace exactamente una porción.

Los `items` son los de **toda la receta**. Ciento cincuenta gramos de harina
son seis empanadas, comas tres o comas una. Sin `rinde`, los ingredientes y el
carbohidrato de la porción se contradicen sin que se note.

---

## Ingredientes

En `src/lib/foods.ts`. Cada uno dice en qué sector se compra, **cómo** se
compra de verdad (huevos de a seis, pollo por kilo) y cuánto carbohidrato
tiene.

- `carbsPer100g` / `carbsPerUnit` — de tablas de composición estándar. Son una
  **referencia**, no una etiqueta: sirven para derivar y para discutir, nunca
  para declarar algo verificado.
- `pantryBasic: true` — sal, aceite, agua, especias. Existen dentro de una
  receta y se pueden contar, pero **no entran en la lista semanal**. Nadie
  compra sal todas las semanas.
- `unidad` — cómo se cuenta una unidad cuando el nombre no se puede contar:
  «2 rebanadas de pan», no «2 pan».
- `SUSTITUTOS` — con qué se reemplaza. Un reemplazo entra sólo si funciona en
  el plato, si existe en el catálogo y si puede ocupar esa función. El huevo
  de un revuelto no se reemplaza: es el plato.

**Si falta un ingrediente, se crea.** Usar uno parecido para que la compra
«funcione» es lo que hacía comprar harina para hacer pochoclo.

---

## Carbohidratos: declarado y derivado

Conviven a propósito.

- El **declarado** (`portions[].carbs`) es el que la app muestra, y dice
  «estimado» mientras nadie lo haya medido contra una etiqueta.
- El **derivado** sale de los ingredientes (`src/lib/carbos.ts`), dividido por
  lo que rinde.

`npm run catalogo:carbs` los compara y marca las diferencias importantes —ocho
gramos o más, y al menos un quinto del número—. **No pisa nada.** El resultado
queda en `data/catalogo/revision-carbos.json` para revisar a mano.

Una diferencia grande casi siempre significa una de tres cosas, en este orden
de probabilidad: falta `rinde`, los ingredientes están mal cargados, o el
número estimado está mal.

---

## Fusionar dos entradas

Cuando dos entradas eran la misma comida cargada dos veces, una se queda y la
otra desaparece. Borrar la fila y listo no alcanza:

1. En la app, `FUSIONES` en `src/lib/catalogo.ts` redirige el id viejo. Lo
   guardado en el teléfono —el plan de esta semana, tus favoritas— sigue
   nombrando al que se fue, y una comida que no existe se dibuja como un
   renglón vacío.
2. En la base, una migración mueve **todas** las referencias antes de borrar:
   preferencias, opiniones, historial, mochila, tareas y los slots que viven
   adentro del `jsonb` del plan diario. `0009_fusion_mate.sql` es el ejemplo, y
   `supabase/tests/40_fusion.sql` arma el caso completo para probarla.

Los pares parecidos ya revisados están en `data/catalogo/duplicados.json`, con
tres veredictos: `duplicado`, `variante` y `dudoso`. Nada se borra por estar
en esa lista.

---

## Las reglas que no se pueden romper

`npm run catalogo:check` las corre todas. Cada una corresponde a un error que
ya pasó:

- Todo ingrediente de una comida existe en el catálogo de ingredientes.
- Lo que se compra hecho no se cocina y no arrastra ingredientes.
- `totalMinutes` existe y nunca es menor que `activeMinutes`.
- Una comida con receta escrita no puede estar marcada como lista para comer.
- Una sola porción por defecto, y ningún ingrediente repetido.
- Slugs ASCII, sin repetir.
