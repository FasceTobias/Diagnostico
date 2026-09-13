# Vianda — Fase 1

> Documento de arquitectura, UX y diseño.
> **Vianda** es un nombre temporal, no una marca definitiva.
>
> *Revisión 9 — las comidas que se preparan traen pasos. Tres a cinco líneas
> con el tiempo de cada una, y «Ver con detalle» abre la receta entera.
> Sólo en las comidas que lo necesitan.*

---

## A. Concepto general

**Vianda no es una app de recetas ni una app médica. Es un asistente de logística alimentaria personal.**

El problema real no es "qué comer". El problema es:

- llegar a las 12:30 sin nada preparado
- terminar comprando cualquier cosa en la calle
- no saber cuántos carbohidratos tiene lo que estás comiendo
- improvisar todos los días y gastar energía mental en decisiones repetidas

Entonces el producto no responde *"¿qué receta hago?"*, responde tres preguntas en orden:

1. **¿Qué llevo hoy?** (mañana, apurado, 5 segundos)
2. **¿Qué preparo esta noche?** (noche, tranquilo, 2 minutos)
3. **¿Qué compro esta semana?** (domingo, una vez)

Todo lo demás es soporte de esas tres preguntas.

### Promesa de producto

> "Abrís la app y ya sabés qué hacer. No pensás."

### Principios no negociables

| Principio | Consecuencia de diseño |
|---|---|
| No me hagas pensar | 1 acción principal visible por pantalla |
| La comida tiene que llenar | Saciedad es un atributo de primer nivel, no un detalle |
| La app organiza, no decide por vos | Carbohidratos se muestran, nunca se traduce a insulina |
| Nunca castigar | No existe el estado "fallaste". Existe "cambiado" |
| Menos es más rápido | Si una función no se usa a diario, va a segundo nivel |
| Datos honestos | Todo carbohidrato muestra su nivel de confianza, y el que no fue verificado se muestra como tal |
| Una sola convención | Los carbohidratos se escriben siempre igual: `34 g CHO`. La palabra completa sólo como etiqueta de sección |
| El día no es perfecto | Contexto por día, snacks opcionales y una salida rápida cuando no preparaste nada |
| No depende de tu disciplina | La pantalla avanza con el reloj. Si no marcás nada en tres días, funciona igual. Los estados son una anotación opcional, nunca el motor |
| Todo en español de acá | Nada de *oats*, *snack PM* ni nombres que no dirías en voz alta |
| La comida no es buena ni mala | No hay verde ni rojo, ni «permitido» ni «prohibido». Se clasifica por saciedad, practicidad, frecuencia, contexto y verificación |
| La necesidad antes que la variedad | Si el día pide algo que llene, primero se busca ahí; la repetición desempata, nunca veta |

### Identidad visual (resumen)

- **Tono:** cálido, sobrio, doméstico. Nada de blanco clínico ni azul hospital.
- **Paleta base:** hueso / tinta cálida / arcilla como acento único.
- **Tres voces:** *Space Grotesk* para el contenido —nombres de comidas y
  titulares—, *Inter* para datos y cifras, *Fraunces* como acento en los títulos
  de sección. Autoalojadas.
- **El separador es una regla, no una tarjeta.** La única superficie elevada de
  HOY es la zona de trabajo: la comida de ahora con sus dos acciones.
- **Rótulos en caja baja.** Las versalitas anchas se ven bien en una revista y
  cansan en algo que se abre seis veces por día.
- **Toda fila es un control:** 56px, fondo que responde al toque y flecha que
  dice que se abre. La línea de tiempo es la idea; la fila es la interfaz.
- **Una forma por pantalla:** HOY es una línea de tiempo, SEMANA un pliego,
  COMIDAS un índice, COMPRAS un ticket. Mismo lenguaje, distinta estructura.
- **Nada de:** gradientes exagerados, íconos por todos lados, cards repetidas sin jerarquía.
- **Nada de iniciales dentro de círculos:** una letra en un círculo se lee como el avatar de una
  persona, y esto es comida. Un solo ícono de línea por momento del día, sin caja. Cuando haya
  fotos reales, la foto ocupa ese lugar.
- **Motion:** rápido y corto (120–220ms). La animación confirma, no decora.

---

## B. Arquitectura

### Stack

```
React 19 + TypeScript + Vite
Tailwind CSS v4 (tokens propios, sin librería de componentes)
Supabase (Postgres + Auth + RLS)  — capa de datos
Netlify — hosting
PWA — manifest + service worker (offline-first de lectura)
```

Sin librería de UI, sin librería de estado, sin router pesado. Router propio de ~40 líneas
(4 pantallas, no hace falta más) y estado en React + un repositorio de datos intercambiable.

### Capas

```
┌─────────────────────────────────────────────┐
│  UI  (screens + componentes)                │  ← no sabe de dónde vienen los datos
├─────────────────────────────────────────────┤
│  Dominio                                    │
│   · rotación / reemplazos compatibles       │
│   · generador de tareas de preparación      │
│   · generador de mochila                    │
│   · agregador de lista de compras           │
│   · cálculo de carbohidratos + confianza    │
├─────────────────────────────────────────────┤
│  Repositorio  (interfaz)                    │
│   LocalRepo (demo, offline)  │  SupabaseRepo│
└─────────────────────────────────────────────┘
```

**Por qué esto importa:** el prototipo corre 100% local con datos demo, y cuando conectemos
Supabase cambia una sola línea. No hay que reescribir pantallas.

### Espacio reservado (no se implementa ahora)

- `assistant/` — el asistente IA consulta el **dominio**, no la UI. Hoy resuelve con reglas locales;
  mañana el mismo contrato lo puede resolver un modelo.
- `integrations/` — vacío. Lugar para sensores de glucosa el día que corresponda.

---

## C. Sitemap

```
Vianda
│
├── HOY  ★ pantalla principal
│   ├── Próxima comida (héroe)
│   ├── Cómo viene el día (en casa · mixto · en la calle)
│   ├── El día (6 momentos, los dos snacks opcionales)
│   ├── Mochila de hoy            → bottom sheet
│   ├── Preparar para mañana      → bottom sheet (aparece de tarde/noche)
│   ├── Detalle de comida         → bottom sheet (carbos, ingredientes, pasos, notas)
│   ├── Cambiar comida            → bottom sheet "Reemplazos compatibles"
│   └── Modo Foco                 → pantalla completa minimalista
│
├── SEMANA
│   ├── Tira de 7 días
│   ├── Día expandido
│   └── Cambiar comida → mismos reemplazos compatibles
│
├── COMIDAS  (biblioteca personal)
│   ├── Filtros mínimos: categoría · para llevar · saciedad
│   ├── Detalle de comida
│   └── Nueva comida (formulario progresivo, no un formulario gigante)
│
├── COMPRAS
│   ├── Lista agrupada por sector
│   └── "Para preparar esta semana" (modo Preparación Semanal)
│
└── ASISTENTE — no es una pestaña. Es un input flotante presente en todas las pantallas.
```

**Navegación inferior: 4 ítems.** Preparación y mochila viven dentro de HOY porque son
acciones del día, no secciones.

---

## D. Flujo diario ideal

### 🌙 Noche (21:30–23:00) — el momento clave

1. Abre la app. HOY muestra arriba **"Preparar para mañana"** (aparece sola después de las 19h).
2. Ve el menú de mañana en una línea por comida.
3. Toca "Preparar" → checklist generada automáticamente a partir del menú:
   `☐ overnight oats  ☐ cortar fruta  ☐ porcionar nueces  ☐ armar sándwich`
4. Marca. Cada check tiene una micro-animación corta y satisfactoria.
5. Cierra la app sabiendo que mañana está resuelto.

### ☀️ Mañana (07:40) — 5 segundos, una mano, apurado

1. Abre la app.
2. Lo primero y más grande: **PRÓXIMO — DESAYUNO 08:30 · Sándwich completo · 54 g CH · Preparado ✓**
3. Toca **Mochila de hoy** → checklist de lo que va al bolso.
4. Marca todo. Sale.

### 🏙️ Durante el día

- Abre, ve la próxima comida, marca "Comido" con un toque.
- Si come otra cosa: **Cambiar** → 3 reemplazos compatibles, no 300 recetas.
- Si está muy ocupado: **Modo Foco** → solo la próxima comida y la siguiente.

### 🛒 Domingo

1. COMPRAS → lista de la semana ya agrupada por sector.
2. Marca mientras compra.
3. **Preparación semanal**: tareas agrupadas (si tres comidas llevan pollo, dice "cocinar pollo" una vez).

**Regla del flujo:** la tarea principal de cada momento del día se resuelve en ≤2 toques desde el ícono.

---

## D bis. El día: seis momentos y un contexto

### Seis momentos, no cinco

**Snack y merienda no son lo mismo.** El snack sirve para aguantar entre comidas y es más chico;
la merienda es una comida hecha y derecha, y puede ser fuerte.

| # | Momento | Horario aproximado | ¿Obligatorio? |
|---|---|---|---|
| 1 | Desayuno | 08:00–09:00 | sí |
| 2 | Snack de mañana | 10:30–11:00 | **no** |
| 3 | Almuerzo | 12:00–13:00 | sí |
| 4 | Snack de tarde | entre almuerzo y merienda | **no** |
| 5 | Merienda | 18:00–19:00 | sí |
| 6 | Cena | 21:00–22:00 | sí |

Los horarios son valores por defecto **editables**, no reglas. Los dos snacks nacen opcionales:
se sacan con un toque y se vuelven a sumar con otro. Sacarlos no aparece como incumplimiento
en ningún lado — la fila se colapsa a una línea y listo.

### El contexto del día

Tres estados, siempre visibles arriba de todo, a un toque:

| Contexto | Qué tiene que poder llevarse | Saciedad exigida |
|---|---|---|
| **En casa** | nada | desayuno, almuerzo y merienda no pueden ser livianos |
| **Mixto** | desayuno, snacks y almuerzo | desayuno potente |
| **En la calle** | todo menos la cena | desayuno, almuerzo y merienda potentes; snacks al menos normales |

**No se deduce del día de la semana.** Un sábado también podés estar todo el día afuera.

Cambiar el contexto **rearma sólo lo pendiente**. Lo que ya marcaste como preparado o comido
no se toca: adaptarse al día no puede borrar lo que ya hiciste.

## D ter. Cómo elige la rotación

No es azar, y tampoco es una suma de puntos donde la variedad puede ganarle al hambre.
Son **dos etapas**:

**Etapa 1 — filtrar por lo que el día necesita.** En este orden:

1. momento del día (una cena no es un desayuno) — nunca se relaja
2. **saciedad necesaria** — si el día pide potente, se busca primero entre las potentes
3. transportabilidad, cuando el contexto la exige
4. tiempo disponible de preparación

Cada filtro se aplica sólo si no deja el pozo vacío: una comida imperfecta es mejor que ninguna.

**Etapa 2 — elegir dentro de lo que ya sirve.** Recién acá pesan la preferencia (favoritas,
puntuación) y la **variedad**: penalización por haberla comido en los últimos días y por repetir
el ingrediente principal dentro del mismo día.

> La repetición **penaliza, no invalida**. El algoritmo nunca va a elegir algo que te deja con
> hambre sólo para no repetir, porque cuando llega el turno de la variedad ya se descartó todo
> lo que no alcanza.

### Cuando el día se rompe

- **No preparaste nada** → desde el detalle de cualquier comida que dependiera de la preparación
  previa: *"No lo preparé — resolvelo ya"*. Ofrece lo que sale en minutos, y si no hay nada en
  ese momento del día, afloja: primero ≤8 min, después ≤15, y como última red algo de otro
  momento que llene y salga ya.
- **Comiste otra cosa** → cambiar cuesta lo mismo que marcar.
- **El día cambió** → un toque en el contexto y lo pendiente se rearma.
- **No tenés hambre** → los snacks se sacan sin consecuencias.

## D bis 1. La biblioteca es de una persona real

La app no está hecha para alguien que cocina perfecto todos los días. Una semana
de verdad tiene fideos, pizza, una barra en el bolsillo y un chocolate a las
cuatro de la tarde, y todo eso **entra en el día**, no se cuela.

**No hay comida buena ni mala.** No existe el verde ni el rojo, ni «permitido»
ni «prohibido», ni «premio» ni «cheat meal». Lo que sí existe es la información
que sirve para decidir:

| Se clasifica por | No se clasifica por |
|---|---|
| saciedad · practicidad · frecuencia | si es «sano» |
| contexto · transportabilidad | si es dulce o salado como juicio |
| preparación · verificación de carbohidratos | si «corresponde» o no |

### La pregunta del martes

Antes de que algo entre en el plan, la rotación se pregunta: **¿esto es algo que
una persona comería un martes cualquiera?**

Avena, frutos secos, bowls y meal prep de internet siguen en la biblioteca —y se
pueden elegir a mano— pero pierden prioridad frente a café con leche y tostadas,
un tostado, un sándwich o mate con galletitas. Es un peso en el puntaje
(`everyday`), no un filtro: nada desaparece.

### Las bebidas son parte de la comida

Una comida puede tener bebida (`drink`): café, café con leche, mate, té, agua,
bebida sin azúcar. No se muestran como dos cosas separadas — un tostado con café
es un tostado con café.

### Azúcar: se muestra, no se bloquea

Una comida con azúcar común no se bloquea, no se marca y no lleva ningún aviso.
Se muestra igual que todas: porción, carbohidratos, verificación y contexto.

Lo único que hace la preferencia `reduceAddedSugar` es **desempatar** cuando
existen dos opciones equivalentes —el budín sin azúcar y el budín— y es un ajuste
chico a propósito.

### `frequency`: rotación, no conducta

Cada opción dice cada cuánto tiene sentido que aparezca:

| | Qué significa | En la rotación |
|---|---|---|
| **habitual** | puede estar cualquier día | sin penalización |
| **de vez en cuando** | no todos los días | pesa un poco menos |
| **para salir del paso** | su lugar es «Resolver ahora», no el menú | casi nunca se planifica |

Una barra proteica es **habitual** porque es práctica. Un budín dulce es **de vez
en cuando** porque no todos los días. Ninguna de las dos está mal.

### Productos envasados

Para lo de góndola el carbohidrato no se estima: se lee. El modelo ya guarda
marca, producto, tamaño de porción, porciones por envase, carbohidratos por
porción y foto de la etiqueta. Mientras eso no esté cargado y validado, el dato
sigue mostrándose como **sin verificar**; cuando se carga, el DEMO se cae solo.

### Cómo se hace

Las comidas que se cocinan traen pasos: entre tres y cinco líneas, con los
minutos de cada una, dentro del detalle. No están en todas. Un tostado, unas
tostadas con queso untable o una fruta no llevan instrucciones, y ponerle
instrucciones a eso sería ruido.

Los minutos son los de ese paso y **se solapan**: el horno calienta mientras
cortás, así que no suman `prepMinutes`. `prepMinutes` sigue siendo el tiempo
real que te lleva la comida, y los pasos nunca pueden pedir más que eso.

**Dos niveles, y el segundo no se abre solo.** Lo que ves por defecto es la
versión corta: una línea por paso, que es lo que necesitás si ya sabés cocinar
eso. Abajo hay un botón, **«Ver con detalle»**, y ahí está la receta entera:
cantidades, temperaturas, cómo te das cuenta de que algo está listo, qué hacer
si va a viajar en la mochila. Se cierra con el mismo botón.

El orden importa. La app no puede asumir que no sabés hacer fideos, pero
tampoco puede esconder cómo se hace una tortilla. El default es corto porque
la mayoría de las veces alcanza; el detalle está a un toque porque las veces
que hace falta, hace falta entero.

Esto no convierte a Vianda en una app de recetas. No hay porciones escalables,
ni fotos de proceso, ni variantes, ni buscador de recetas. Es lo mínimo para
que una comida de la biblioteca se pueda hacer sin acordarse de nada.

## D bis 2. Lo que la app NO te pide

Tres decisiones de diseño que valen más que cualquier función agregada:

**No hay que marcar nada.** El día avanza por hora: a las 12:10 lo que toca es el
almuerzo, marques o no marques. «Preparado», «comido» y «hoy no» existen, pero son
una anotación para vos, no el motor. Tres días sin tocar la app y HOY sigue
mostrando exactamente lo correcto.

**La mochila no es una checklist.** Dice **«Hoy llevate»** y abajo lista lo que va
en el bolso. Nada para tildar. Si querés ir marcando mientras cargás, hay un link
discreto que enciende las casillas — apagado por defecto.

**El contexto no se configura todos los días.** Salió de la pantalla principal.
Vive en Configuración y en «Resolver ahora → Cambió mi día», que es cuando
realmente aporta.

La pantalla principal quedó en tres cosas: **ahora**, **después** y **el día**.
Debajo, una sola acción según la hora (la mochila de mañana, la preparación de
noche) y el resto en renglones apagados al final.

## D quater. Resolver ahora

El plan del día falla seguido, y falla lejos de casa. Saliste pensando que
volvías, no volviste, son las 12:30 y no tenés nada.

**«Resolver ahora» no planifica: busca qué comer ya.** Está en HOY, debajo del
héroe, y también se llega desde el asistente y desde el detalle de una comida.

Máximo tres toques hasta ver opciones:

```
¿Qué pasó?                    →   ¿Qué comida?        →   Opciones + filtros
  No traje comida                   los 6 momentos,         para comprar afuera
  Tengo hambre ahora                con "Ahora" marcado     de tu biblioteca
  Quiero algo dulce ──────────────────────────────────→  directo a opciones
  Evento o tarde larga ───────────────────────────────→  combinaciones
  Cambió mi día ──────────────→  contexto (termina acá)
  No preparé nada
  Quiero reemplazar una comida
```

**Algo dulce** no responde «comé fruta»: busca lo que realmente se come cuando
hay ganas de algo dulce —café con budín, mate con galletitas, una barra, un
alfajor— en casa y afuera. Ignora el momento del día a propósito.

**Evento o tarde larga** no devuelve un alimento suelto: devuelve
**combinaciones**, algo que llene más algo dulce, con la suma de carbohidratos
hecha. Prioriza lo que se compra afuera, porque en un evento estás afuera.

Los filtros son tres —**que llene**, **rápido**, **barato**— y van **arriba de los
resultados, no antes**: se ajustan mirando lo que salió. Si un filtro deja la
lista vacía, se afloja el último en vez de mostrar una pantalla en blanco.

### Lugares concretos, no categorías

«Estás en la calle» es demasiado abstracto. Lo concreto es **a qué lugar entrás y
qué pedís ahí adentro**, así que los resultados vienen agrupados por lugar con
platos de verdad:

```
ESTÁS EN LA CALLE Y TENÉS QUE ALMORZAR

ROTISERÍA       pollo con guarnición · milanesa con ensalada · empanadas …
PANADERÍA       sándwich de jamón y queso · porción de tarta
SUPERMERCADO    sándwich preparado · ensalada con pollo
CAFETERÍA       tostado de jamón y queso
RESTAURANTE     milanesa con guarnición · pastas con salsa
KIOSCO          …
```

El orden de los lugares es el de utilidad real con hambre: primero donde hay
comida hecha, último donde hay un paquete.

### Comidas que se compran afuera

La biblioteca ya no es sólo lo que cocinás. Una comida puede tener
`buy_outside`, una lista de tipos de lugar (kiosco, rotisería, panadería…), un
nivel de precio y si se come caminando.

> **Quedan fuera de la rotación normal.** El plan del martes no puede decirte
> "comprá empanadas". Aparecen únicamente cuando las pedís desde «Resolver ahora».

Sus carbohidratos son órdenes de magnitud, no datos: dependen del lugar, del
tamaño y de quién la hizo. Van todas sin verificar y la pantalla lo dice.

## D quinquies. Insulina: aritmética, no medicina

La app guarda **una relación** que el usuario configura y ofrece **una división**
que el usuario pide. Nada más.

**Está apagada por defecto.** Se activa en Configuración, y mientras esté apagada
no aparece nada de insulina en ninguna pantalla.

Cuatro cosas separadas y rotuladas, nunca mezcladas:

| | |
|---|---|
| 1. Carbohidratos de la comida | dato de la comida, editable en la calculadora |
| 2. Tu relación configurada | `1 u por 15 g CHO`, guardada en un solo lugar |
| 3. Resultado matemático | la división, con la cuenta a la vista |
| 4. La decisión | **tuya**, con lo que te indicó tu médico |

Lo que la app **no** hace, por diseño: calcular sola, mostrar dosis en tarjetas o
listas, corregir por glucemia, mirar actividad, ni sugerir nada.

El modelo soporta desde ya relaciones por momento del día o por franja horaria
(`scope`, `from_time`, `to_time`); la interfaz expone una sola, general.

Si los carbohidratos de la comida **no están verificados**, la calculadora lo dice
antes del resultado: es aritmética sobre un número que todavía no es real.

## E. Estructura de datos

Un solo usuario hoy, pero todo cuelga de `profile_id` desde el día uno. Migrar después es imposible.

```
profiles
  id · display_name · wake_time · meal_times(jsonb) · created_at

foods                         ← ingrediente/producto atómico (para compras y etiquetas)
  id · profile_id · name · unit · carbs_per_100 · carb_source · shopping_aisle
  is_packaged · brand · notes

meals                         ← la biblioteca personal
  id · profile_id · name · photo_url · category · subcategories[]
  carbs_total · carbs_source · carbs_confidence · protein_total
  portion · prep_minutes · satiety(liviana|normal|potente)
  portable · needs_cold · needs_reheat · make_night_before · freezable
  difficulty · favorite · tested · rating · notes · is_demo

meal_items                    ← ingredientes de una comida
  id · meal_id · food_id · quantity · unit · carbs_contrib

weekly_plans
  id · profile_id · week_start · generated_by · notes

daily_plans
  id · weekly_plan_id · date
  context       día en casa / en la calle / mixto
  slots(jsonb)  →  [{slot, meal_id, time, status, optional, replaced_from, note}]

  slot   = breakfast | snack_am | lunch | snack_pm | merienda | dinner
  status = pending | prepared | eaten | skipped | replaced

prep_tasks
  id · profile_id · date · kind(night_before|weekly) · label
  source_meal_ids[] · done · sort_order

packing_items                 ← mochila
  id · profile_id · date · label · kind(meal|gear) · meal_id · done

shopping_lists
  id · profile_id · week_start · status

shopping_items
  id · list_id · food_id · label · quantity · unit · aisle · checked · from_meals[]

meal_history                  ← aprendizaje futuro
  id · profile_id · date · slot · planned_meal_id · actual_meal_id
  status · reason · rating

preferences
  id · profile_id · key · value(jsonb)
```

### Decisiones que vale la pena explicar

- **`slots` como jsonb dentro de `daily_plans`** en vez de tabla `plan_slots`. Un día siempre
  se lee y escribe entero; una tabla aparte implicaría 5 queries por día. Si algún día hace falta
  consultar por slot individual, `meal_history` ya guarda ese grano.
- **`carbs_confidence` separado de `carbs_source`**: la fuente es un hecho (etiqueta / receta /
  estimación / pendiente); la confianza es cómo se muestra (ALTA / MEDIA / ESTIMADA). Se deriva
  de la fuente pero puede bajarse a mano ("la etiqueta es de otra marca parecida").
- **`is_demo` en `meals`**: los registros de ejemplo quedan marcados y se pueden borrar todos
  juntos cuando entren los datos reales.
- **`carbs_verified` separado de todo lo demás**: mientras sea `false`, la app muestra el carbo
  como sin confirmar e ignora `carbs_confidence`. Un número inventado no puede verse igual que
  uno leído de una etiqueta.
- **`context` en `daily_plans`, no derivado del día de la semana**: un sábado también podés estar
  todo el día en la calle. Es un dato del día, no una suposición del calendario.
- **`satiety` como enum de 3, no un número**: un número invita a optimizar. Tres niveles se
  entienden de un vistazo y bastan para el algoritmo de rotación.
- **`optional` por slot**: los dos snacks nacen opcionales. Sacarlos no es incumplir nada y
  volverlos a sumar cuesta un toque.

### Nivel de confianza de carbohidratos

| Fuente | Confianza | Se ve como |
|---|---|---|
| Etiqueta nutricional real | ALTA | `54 g CH` + punto lleno |
| Receta calculada desde ingredientes | ALTA / MEDIA | `54 g CH` + punto lleno / medio |
| Estimación manual | ESTIMADA | `~54 g CH` + punto vacío |
| Pendiente de confirmar | ESTIMADA | `? g CH` + borde punteado |

La tilde `~` y la forma del punto comunican confianza **sin depender del color** (accesibilidad).

---

## F. Los tres conceptos visuales para HOY

Los tres tienen exactamente la misma información. Cambia la forma, no el contenido.

### Concepto A — Ambient Health

Calma y aire. Inspirado en interfaces premium de wellness.

- Fondo hueso cálido, sin bordes duros. Las tarjetas se separan por **espacio**, no por líneas.
- La próxima comida ocupa media pantalla. Tipografía grande, peso ligero, mucho interlineado.
- Un anillo de progreso muy fino marca el avance del día.
- Casi no hay botones visibles: se toca la tarjeta.
- **Fuerte:** se siente premium y tranquilo. Cero ruido visual.
- **Débil:** requiere scroll para ver el día completo. Con una mano y apurado, la acción principal
  queda alta en pantalla. Poco aire para densidad real cuando la biblioteca crezca.

### Concepto B — One UI Personal

Ergonomía primero. Pensado para un S23 Ultra usado con una mano.

- Encabezado alto y aireado ("Buen día · viernes 12") que **empuja el contenido accionable al
  tercio inferior**, en zona de pulgar.
- Tarjetas grandes, radios generosos, jerarquía por tamaño y peso.
- Navegación inferior de 4 ítems + input del asistente flotante sobre ella.
- Bottom sheets para todo lo secundario (mochila, preparar, detalle, cambiar).
- **Fuerte:** es el más usable de verdad en el caso "apurado, parado, una mano". Escala bien
  cuando hay más datos.
- **Débil:** el encabezado grande gasta pantalla. Si se diseña sin cuidado queda genérico de Android.

### Concepto C — Invisible Glass

El más experimental. Dark premium.

- Negro profundo, capas semitransparentes, bordes de 1px apenas visibles, luz suave detrás de
  la comida activa.
- Los controles no existen hasta que tocás o deslizás. Swipe lateral = cambiar comida.
- **Fuerte:** es el que más "wow" produce. Excelente de noche.
- **Débil:** riesgo alto de fallar el test de los 5 segundos. Controles ocultos = el usuario tiene
  que aprender gestos. Con sol, en la calle, el contraste de glass sobre negro es peor. Choca
  directo con "no me hagas pensar".

---

## G. Cuál recomiendo

**Concepto B como estructura, con el lenguaje visual del Concepto A y un toque muy medido de C.**

La estructura es de B porque la app se usa **parado, apurado, con una mano, mirando 5 segundos**.
Ese caso lo gana la ergonomía, no la estética. Pero B puro se ve genérico, así que la piel es de A:
aire, tipografía cuidada, paleta cálida, tarjetas sin bordes duros, motion corto.

De C tomo **solo dos cosas**, y solo porque mejoran el uso:

1. **Dark mode real** (no un invert) — la app se usa mucho de noche al preparar y de madrugada.
2. **Progressive disclosure agresivo** — las acciones secundarias viven en sheets, no en la pantalla.

**Lo que descarto de C:** los controles invisibles. Un gesto sin affordance visible falla el test de
los 5 segundos. El swipe para cambiar comida se implementa como **atajo**, nunca como única vía:
siempre hay un botón visible que hace lo mismo.

### Por qué no A puro

Porque el aire de A pone la acción principal arriba y obliga a scrollear. Se ve hermoso en una
captura y es peor en la mano a las 7:40.

---

## H. Qué construiría primero

En este orden, sin adelantar nada:

1. **Sistema de diseño** — tokens, tipografía, spacing, radios, motion, estados. Sin esto todo lo
   demás sale inconsistente.
2. **Los tres conceptos de HOY**, navegables y comparables en el dispositivo real. Decisión con la
   app en la mano, no en una captura.
3. **HOY completo del concepto elegido**: próxima comida, día, estados, detalle, cambiar,
   mochila, preparar para mañana, modo foco, entrada del asistente.
4. **Biblioteca (COMIDAS)** en modo lectura + detalle.
5. Recién después: SEMANA, COMPRAS, alta de comidas, Supabase.

La regla es la del brief: **una pantalla excelente antes que veinte mediocres.**

---

## I. Riesgos de UX que veo

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | **La biblioteca vacía mata la app.** Sin comidas cargadas no hay plan, y cargar comidas es trabajo. Es el punto donde la app se abandona. | Comidas demo desde el primer segundo, marcadas como tales. Alta de comida progresiva (nombre + categoría + carbos y listo; el resto después). "Duplicar y editar" antes que "crear de cero". |
| 2 | **Marcar estados se vuelve tarea.** Si hay que marcar seis comidas × tres estados por día, en dos semanas nadie marca nada. | Un solo toque por comida en el caso normal. Estados opcionales: la app funciona igual si nunca marcás. Nada se rompe ni se pone rojo. |
| 3 | **Los carbohidratos pueden volverla médica.** Es la línea más fina del producto. | El carbo es un dato tipográfico discreto, no un semáforo ni un gauge. Sin colores de alarma. Sin totales diarios con "objetivo". |
| 4 | **El plan se desincroniza de la vida real.** Comiste otra cosa tres días seguidos y el plan ya no representa nada. | Cambiar es tan barato como marcar. `meal_history` guarda lo real, no lo planificado. Cero lenguaje de incumplimiento. |
| 5 | **Sobrecarga en la pantalla HOY.** Es la pantalla que todo quiere habitar: mochila, preparar, asistente, foco, semana. | Presupuesto duro: máximo 1 acción primaria + 2 secundarias visibles. Lo demás vive en sheets y aparece por contexto horario. |
| 6 | **Gestos sin affordance.** Swipe y long-press son lindos y son invisibles. | Todo gesto tiene un equivalente visible. El gesto es atajo para el experto, nunca el único camino. |
| 7 | **La rotación genera combinaciones raras** y se pierde la confianza en el generador. | El generador propone, nunca impone, y siempre se puede cambiar. Restricciones duras (transportable, tiempo) antes que preferencia. |
| 8 | **El asistente promete más de lo que puede.** Un input tipo chat genera expectativa de ChatGPT. | Sugerencias concretas como chips en vez de un cursor vacío. Responde lo que sabe resolver y lo dice cuando no. |

---

## J. Qué simplificaría del alcance inicial

No para hacer menos, sino para que lo que se use todos los días esté impecable.

**Fuera de la primera entrega** (el espacio arquitectónico queda hecho):

| Se pospone | Por qué |
|---|---|
| Login / multiusuario | Un solo usuario. `profile_id` existe desde el día uno, pero no hay pantalla de login. |
| Alta y edición completa de comidas | Primero hay que querer usar la app. La carga real la hacemos juntos y puede empezar por un seed. |
| Fotos de comidas | Subida de imágenes es un módulo entero. Mientras tanto, una marca visual generada por categoría — y se ve bien. |
| Stock / alacena | Mucha carga manual, poco retorno diario. Es la típica función que se abandona en una semana. |
| Asistente con API paga | Se construye la experiencia y el contrato de datos; la primera versión resuelve con reglas locales. |
| Notificaciones push | Requiere permisos, service worker con push y backend. La app todavía no se ganó el derecho a interrumpir. |
| Proteínas, calorías, micros | Carbohidratos y saciedad resuelven el 95% de las decisiones. Lo demás es ruido. |
| Sincronización offline con conflictos | Lectura offline sí (service worker). Escritura offline con merge, no. |

**Ya no está pospuesta:** la lista de compras. Los ingredientes tienen cantidad,
así que la semana se suma y se redondea a cómo se compra de verdad — «12 huevos»,
«1,5 kg de pollo», «1 paquete de pan». Lo que se come afuera no entra, y lo que
siempre hay en casa (sal, aceite, caldo) tampoco.

**Lo que sí entra completo, porque es el corazón:** HOY, próxima comida, estados, cambiar con
reemplazos compatibles, mochila, preparar para mañana, modo foco y la entrada del asistente.

---

*Documento vivo. Se actualiza cuando una decisión cambia.*
