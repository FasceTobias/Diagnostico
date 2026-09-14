# Vianda — Fase 2

> De demo linda a producto real: persistente, seguro y usable por otra gente.
>
> El sistema visual queda **aprobado para MVP**. De acá en adelante sólo se
> toca diseño si hay un bug, un problema de contraste, algo que no se
> entiende o una inconsistencia real.

---

## A. Dónde estamos parados

La app funciona de punta a punta, pero **nada sobrevive a borrar los datos
del navegador**. Todo lo que parece guardado vive en `localStorage`.

| Qué | Hoy | Dónde |
| --- | --- | --- |
| Biblioteca de comidas | 99 registros escritos a mano, `isDemo: true` | `src/lib/demo.ts` |
| Catálogo de alimentos | ~70 entradas (sector, cómo se compra) | `src/lib/foods.ts` |
| Plan de la semana | Se genera en el teléfono cada vez | `buildWeek()` → `localStorage` |
| Horarios, contexto, preferencias | Guardados en el navegador | `vianda.state.v4` |
| Relación insulina/CHO | Guardada en el navegador | `vianda.state.v4` |
| Marcado (mochila, preparación, compras) | Guardado en el navegador | `vianda.state.v4` |
| Historial | **No existe.** La semana se regenera sola el lunes | — |
| Usuarios | No existen. No hay login ni cliente de Supabase | — |
| Fotos de etiqueta | Campo previsto, sin almacenamiento | — |

Dos cosas que conviene decir en voz alta:

1. **No hay historial.** Cuando cambia la semana, el plan viejo se pierde.
   Toda la personalización futura —qué comés de verdad, qué salteás, qué
   repetís— depende de datos que hoy se tiran.
2. **La biblioteca no se puede editar.** No hay pantalla para cargar una
   comida. Mientras los datos vivan en un `.ts`, cargar tu comida real es
   escribir código.

Lo único que está bien donde está: `vianda.receta.detalle` (si preferís ver
las recetas con detalle). Eso es interfaz, no dato; puede quedarse en el
navegador para siempre.

---

## B. La decisión que condiciona todo el modelo

En el esquema actual **todo es privado**: `meals.profile_id` y
`foods.profile_id` son `not null`. Eso significa que:

- cada usuario nuevo arranca con la biblioteca **vacía**;
- la biblioteca real que vamos a construir habría que copiarla a cada cuenta;
- un producto envasado —una marca, una etiqueta, un número leído del
  paquete— se verificaría una vez por usuario.

Eso no escala ni a quince personas en la beta.

**Propuesta: dos niveles.**

- **Catálogo** (`profile_id is null`): las comidas base, los alimentos y los
  productos envasados verificados. Lectura para cualquier usuario
  autenticado; escritura sólo para administración.
- **Personal** (`profile_id = auth.uid()`): tus comidas, tus opiniones, tus
  planes, tus compras.

Cuando editás una comida del catálogo, se **copia a tu cuenta** con
`forked_from` apuntando al original. Vos tocás tu copia; el catálogo sigue
siendo el catálogo. Es el mismo patrón de las recetas de cualquier app que
funcione, y evita el problema de "actualicé el catálogo y le pisé los
cambios a todo el mundo".

Cambio concreto: `profile_id` pasa a nullable en `meals` y `foods`, se suma
`forked_from uuid`, y la policy de lectura pasa a ser
`profile_id is null or profile_id = auth.uid()`, con la de escritura
exigiendo `profile_id = auth.uid()`.

---

## C. El modelo: qué ya está y qué falta

### Ya existe (14 tablas, con RLS)

`profiles` · `foods` · `meals` · `meal_items` · `weekly_plans` ·
`daily_plans` · `prep_tasks` · `packing_items` · `shopping_lists` ·
`shopping_items` · `meal_history` · `insulin_ratios` · `preferences` ·
`meal_opinions`

El esquema cubre casi todo lo que pediste y está mejor de lo que esperaba:
las cantidades de compra ya están modeladas (`buy_unit`, `buy_step`,
`buy_per`, `buy_label`), el día se guarda entero en `jsonb` para no hacer
cinco consultas, y la insulina ya nace apagada (`insulin_enabled` en
`profiles`). **No hay que crear tablas redundantes.**

### Falta

| # | Qué | Por qué |
| --- | --- | --- |
| 1 | `products` como tabla propia y global | Hoy son 12 columnas dentro de `meals`. Una barrita es un producto con marca, porción y etiqueta: se verifica **una vez** y sirve para todos. Con `meals.product_id` la verificación deja de repetirse. |
| 2 | Catálogo compartido | `profile_id` nullable + `forked_from` (sección B). |
| 3 | `exclusions` | «Qué cosas no comés» no tiene dónde guardarse. Un ingrediente o una etiqueta que no querés ver, con un motivo opcional. |
| 4 | Onboarding en `profiles` | `onboarding_step`, `onboarding_completed_at`. Sin esto no se puede retomar donde lo dejaste. |
| 5 | `profiles.timezone` | Toda la app razona con horas locales. Si el plan se genera en el servidor alguna vez, sin esto se corre. |
| 6 | `profiles.carb_counting_enabled` | La capa de diabetes es opcional. Hoy sólo está el interruptor de insulina; falta el de arriba. |
| 7 | `preferences.sweet_or_salty` | Lo pediste para el onboarding; `cooks` y `hours_outside` ya están. |
| 8 | Verificación con dueño y fecha | `meals.carbs_verified_at` existe; a `products` le faltan `verified_at`, `verified_by`, `source_url`. Sin eso «verificado» no se puede auditar. |
| 9 | Bucket de Storage para etiquetas | Privado, con URL firmada. Hoy `label_photo_url` no tiene dónde apuntar. |
| 10 | Rol de administración | Alguien tiene que poder escribir el catálogo. Un claim en el JWT, no una columna que el usuario pueda tocar. |

---

## D. Seguridad

### Lo que ya está bien

- RLS activada en las 14 tablas **desde el principio**, no como parche.
- Políticas por `auth.uid()`, y las tablas hijas heredan el dueño por la
  relación padre (`meal_items`, `daily_plans`, `shopping_items`).
- Borrado en cascada desde `auth.users`: si alguien se quiere ir, se va
  entero.
- No hay ningún secreto versionado. `.env.example` ya declara las dos
  variables correctas y `.gitignore` cubre `.env*`.

### Lo que hay que resolver antes de la beta

1. **El catálogo necesita su propia política.** Las de hoy son `for all`
   contra `auth.uid()`; una fila con `profile_id is null` no la ve nadie.
   Hace falta una policy de sólo lectura aparte, y que la de escritura
   nunca acepte `profile_id is null` desde el cliente.
2. **`service_role` jamás en el frontend.** Ni siquiera como variable de
   Netlify: todo lo que empieza con `VITE_` termina en el bundle. La carga
   del catálogo se hace desde un script local o una función de Netlify.
3. **Redirect URLs del recovery.** Hay que declararlas explícitamente en
   Supabase. Un allowlist mal configurado convierte el link de recuperación
   en un problema.
4. **Confirmación de mail y rate limit** de login: son configuración del
   proyecto, no código. Hay que decidirlos y dejarlos escritos.
5. **La sesión vive en `localStorage`** (es como funciona `supabase-js` sin
   backend propio). Es el token de sesión, no datos: aceptable para el MVP,
   pero queda anotado como decisión consciente, no como olvido.
6. **Storage privado.** El bucket de etiquetas nunca público: URL firmada,
   con la policy mirando el `profile_id` de la ruta.
7. **Probar el acceso cruzado de verdad.** Dos cuentas, y que la segunda no
   pueda leer nada de la primera ni forzando `id` en la URL. Es una prueba
   de QA, no una lectura del esquema.

---

## E. Plan por etapas

Cada etapa termina con la app **funcionando y publicable**. Ninguna deja el
producto a medio camino.

### Etapa 0 — Andamio (riesgo nulo)
Instalar `@supabase/supabase-js`, crear el proyecto, pasar `schema.sql` a
migraciones versionadas, aplicar los cambios de la sección C. La app sigue
100 % local: todavía nada la usa.

### Etapa 1 — La costura ← *el cambio delicado*
Extraer una interfaz `ViandaRepo` de `useVianda()` e implementar
`LocalRepo` con exactamente el código de hoy. Las pantallas no cambian ni
una línea. **Esta es la etapa que protege a todas las demás**: después,
cambiar de local a Supabase es cambiar qué implementación se inyecta.

### Etapa 2 — Usuarios
Registro, login, logout, recuperación de contraseña, sesión persistente.
Pantallas nuevas; las cuatro actuales no se tocan. Sin sesión, la app corre
en modo local igual que hoy — así nunca existe una versión rota.

### Etapa 3 — Lectura desde Supabase
`SupabaseRepo` para perfil, preferencias, horarios y biblioteca. La
escritura sigue siendo local. Acá se ve si el modelo aguanta.

### Etapa 4 — Escritura y persistencia real
Plan semanal, marcado, compras, historial. Escritura optimista: la interfaz
no espera al servidor. Al terminar esta etapa se cumple el punto 12: todo
sobrevive al refresh, al navegador cerrado y al cambio de dispositivo.

### Etapa 5 — Onboarding
Corto, humano, progresivo, salteable. Cinco pasos, no un formulario médico.
Guarda en cada paso (por eso `onboarding_step`).

### Etapa 6 — Biblioteca real
Reemplazar el demo comida por comida, con pantalla de carga. Productos
envasados con etiqueta, fuente y fecha. El cartel DEMO desaparece solo
cuando el dato está verificado: esa lógica ya existe.

### Etapa 7 — QA y beta cerrada
La matriz completa: Android, iPhone, desktop, PWA instalada, Chrome,
Safari, refresh en rutas internas, sesión vencida, conexión lenta, errores
de Supabase, usuario nuevo, usuario sin datos, usuario con muchos datos,
claro y oscuro. Después, 5 a 15 personas.

---

## F. Riesgos, y cómo no romper lo que funciona

| Riesgo | Mitigación |
| --- | --- |
| **Todo pasa de síncrono a asíncrono.** Hoy tocar un interruptor es instantáneo porque no hay red. | El repositorio sigue exponiendo estado, no promesas. Escritura optimista con cola de reintentos. Si falla, se avisa una vez; no se pierde lo que hiciste. |
| **El plan se genera en el cliente.** Si además se guarda, hay dos fuentes de verdad. | El plan guardado manda. `regenerate()` pasa a ser una acción explícita del usuario, no algo que ocurre solo al cambiar de semana. |
| **Migrar datos existentes.** | No hay nada que migrar: lo que tenés es demo. Es la mejor ventana posible para cambiar el modelo, y se cierra en cuanto haya un usuario real. |
| **Romper la versión publicada.** | Con `VITE_SUPABASE_URL` vacío la app corre en modo local, igual que hoy. La rama principal sigue funcionando sin backend hasta la etapa 4. |
| **Zona horaria.** | Fechas como `date` sin zona y horas como texto `"08:30"` —el esquema ya es así—, más `profiles.timezone` para cuando algo corra en el servidor. |
| **La capa de diabetes se filtra.** | `carb_counting_enabled` e `insulin_enabled` se leen en un solo lugar y apagan las palabras, no sólo las pantallas. |

---

## G. Lo que **no** entra en Fase 2

Pagos, nombre definitivo, dominio, landing pública, pricing, términos,
privacidad y soporte. Todo eso es Fase 3 y no se toca hasta que el núcleo
funcione con gente de verdad usándolo.

---

## H. Lo que ya se hizo de esta fase

### `#/direcciones` queda fuera del producto

La ruta sólo existe corriendo en desarrollo; en el build publicado la
condición es una constante falsa, así que ni la pantalla ni su tipografía
entran en el bundle. No hay URL que un usuario pueda pisar de casualidad, y
el trabajo queda como registro de la exploración.

### Etapa 0 — Andamio ✅

- `@supabase/supabase-js` instalado.
- El esquema pasa a estar versionado en `supabase/migrations/`:
  `0001_base.sql` es lo que había, `0002_catalogo.sql` aplica los cambios
  de la sección C y `0003_etiquetas.sql` crea el bucket privado.
- `src/lib/supabase.ts`: el cliente existe **sólo si están las dos
  variables de entorno**. Sin ellas es `null` y no pasa nada.
- `supabase/README.md`: cómo se aplican las migraciones y las dos reglas
  que no se rompen (la clave de servicio no entra al frontend; la
  seguridad vive en la base, no en el filtro de una consulta).

Dato que salió de medirlo: **con las variables vacías, `supabase-js`
desaparece entero del bundle**. Vite reemplaza `import.meta.env.*` por
`undefined` al compilar, la rama queda muerta y Rollup la borra. Verificado
en los dos sentidos: 0 menciones sin variables, 7 con variables. O sea que
tener el cliente instalado no le cuesta un byte a la versión publicada de
hoy.

### Etapa 1 — La costura ✅

`src/lib/repo/` con la interfaz `ViandaRepo`, `localRepo` como única
implementación por ahora, y `getRepo()` decidiendo cuál se usa. `store.ts`
quedó con lo que siempre fue suyo —el estado en memoria y las funciones
que lo cambian— y perdió lo que no: dónde se guarda.

Tres decisiones que valen la pena:

1. **Los métodos son granulares** (`saveDay`, `saveTimes`, `setCheck`…),
   aunque el repositorio local los resuelva todos escribiendo el mismo
   blob. Guardar todo de una alcanza para localStorage y no alcanza para
   una red: sería mandar la semana entera cada vez que tachás un tomate.
   Lo que importa es que las pantallas ya hablen en granular.
2. **`cached()` es sincrónico y `bootstrap()` puede tardar.** La app abre
   con lo que ya está en el dispositivo y se actualiza después. Así nunca
   hay pantalla en blanco esperando a la red, ni siquiera en el subte.
3. **Primero el estado, después el guardado.** La interfaz no espera a que
   termine de escribir, y si escribir falla no se cae lo que el usuario
   acaba de hacer. La cola de reintentos y el aviso son de la etapa 4.

Además se arreglaron dos cosas que estaban latentes en el código viejo: la
semana se regeneraba en cada lectura (ahora se arma una vez y se deja
escrita, así el plan no puede cambiar entre el primer cuadro y el segundo)
y cualquier escritura podía dispararla de nuevo (ahora escribir no
regenera nada).

**Verificación:** siete pruebas en el navegador —abre con datos, el plan no
cambia solo, lo tachado sobrevive al refresh, el horario editado sobrevive,
el contexto rearma y sobrevive, el modo foco entra— más `tsc`, lint, build
y una captura comparada con la anterior. Ninguna pantalla cambió.

### Las migraciones, corridas de verdad ✅

El SQL estaba escrito pero nunca se había ejecutado, que es la peor forma
de tener seguridad: sobre el papel. `npm run db:test` levanta un Postgres
limpio, reconstruye lo que aporta Supabase (`supabase/tests/00_stub.sql`),
aplica las tres migraciones en orden y corre **34 pruebas de aislamiento**.

Las pruebas no leen las políticas: crean dos cuentas y desde una intentan
hacerle cosas a la otra. Ana no ve la comida de Beto, ni sus ingredientes,
ni sus exclusiones, ni su relación de insulina; pedir la fila por id no
devuelve nada; no puede editarla, borrarla, ni crear algo a nombre de él.
El catálogo se lee desde las dos cuentas y no se escribe desde ninguna;
administración sí, y aun así no ve los datos personales de nadie. Un
usuario común no puede ascenderse a administración. Las etiquetas: cada
quien en su carpeta, el bucket privado.

Esto cubre el punto 7 de la sección D antes de tiempo, y de la única
manera que vale: intentándolo.

### Etapa 2 — Usuarios ✅ (a falta de probarla contra el proyecto real)

`src/lib/auth.ts` y `src/components/Cuenta.tsx`: registro, login, cierre
de sesión, recuperación de contraseña y sesión persistente.

- **No hay pantalla de login al abrir.** La cuenta vive en Configuración y
  se ofrece por lo que hace —que la comida sobreviva al teléfono—, no como
  peaje de entrada. Sin proyecto configurado, la app **no nombra cuentas en
  ningún lado**: prometer algo que no existe es peor que no tenerlo.
- **Los errores están traducidos.** Los de Supabase vienen en inglés y
  algunos son crípticos. Se traducen los que una persona puede provocar
  sin hacer nada raro; el resto cae en un mensaje honesto en vez de
  inventar una causa.
- **La recuperación no confirma si el mail existe.** «Si esa dirección
  tiene cuenta, te llega un mail» — lo contrario es un buscador de cuentas.
- **Volver del mail abre solo la pantalla de contraseña nueva**, porque es
  lo único que corresponde hacer en ese momento.
- **La pantalla dice la verdad sobre dónde están los datos.** Con sesión
  iniciada avisa que todavía se guardan en el teléfono. Recién en la etapa
  4 eso deja de ser cierto, y ahí cambia el texto.

**Verificación:** `scripts/fake-auth.mjs`, un GoTrue de juguete, permite
correr los flujos completos sin credenciales. Siete pruebas en el
navegador: el error de login traducido, crear cuenta, la sesión
sobreviviendo al refresh, cerrar sesión, volver a entrar, el aviso de
recuperación, y que sin servidor Configuración no nombre cuentas.

Falta lo que sólo se puede hacer con el proyecto creado: que el mail de
recuperación llegue, que la redirect URL esté declarada, que la
confirmación de mail esté como la queramos y que el trigger de alta corra
en Supabase y no sólo en el Postgres de prueba.
