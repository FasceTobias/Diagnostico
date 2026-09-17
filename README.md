# Vianda

> **Vianda** es un nombre temporal de trabajo, no una marca definitiva.
> El repositorio se llama `Diagnostico` por razones históricas y no tiene
> relación con este proyecto.

Aplicación web personal (PWA) para organizar la comida del día: qué llevar,
qué preparar la noche anterior y cuántos carbohidratos tiene cada cosa.

No es una app médica ni un recetario. Es logística alimentaria personal.

> **Sobre la diabetes:** la app **organiza información**. Muestra los carbohidratos
> de cada comida y de dónde sale ese número. **No calcula insulina ni reemplaza
> ninguna indicación médica.**
>
> Los carbohidratos **no están verificados contra etiquetas** y la app lo dice
> en todas las pantallas: la porción está documentada y el número calculado
> sobre ella, pero nadie tuvo el envase en la mano. Se escriben siempre igual,
> con la tilde adelante: `~34 g CH`. No hay totales diarios: el carbo es por
> comida, no una meta a cumplir.
>
> La relación insulina/carbohidratos se guarda si vos la configurás, y la
> calculadora hace **una división** cuando se la pedís. La app no calcula dosis
> por su cuenta, no las muestra en tarjetas ni en listas, y no reemplaza lo que
> te indicó tu médico.

---

## Empezar

**¿Venís a esto desde otra computadora?** Está todo acá adentro:
[`docs/TRABAJAR.md`](docs/TRABAJAR.md) explica cómo arrancar en una máquina
nueva, cómo no pisarte entre dos, y qué hace cada comando.

```bash
npm install && npm run dev
```

Node 22 (fijado en `.nvmrc`). La app funciona entera sin base de datos y sin
cuenta: los datos se guardan en el navegador.

## Estado

**El catálogo está terminado y limpio:** 199 comidas reales, ningún dato de
relleno. Cada una dice de dónde viene, cuánto trabajo pide, cuánto tarda de
verdad, qué lleva y cuánto rinde. El modelo entero está explicado en
[`docs/MODELO.md`](docs/MODELO.md), y dos comandos lo vigilan:
`npm run catalogo:check` y `npm run catalogo:carbs`.

**Las recetas van por la mitad:** 60 escritas. De las que se cocinan quedan 14
sin escribir; de las que se arman, 53. Las que no necesitan ninguna —fruta,
kiosco, rotisería— están cerradas y la ficha ya no se disculpa por no tener
pasos.

**Dos pantallas construidas** sobre el sistema visual actual, INICIO y HOY.
COMIDAS, COMPRAS y PERFIL siguen en obra: la pantalla existe y dice
honestamente qué va a haber ahí.

**Supabase preparado, no conectado.** El esquema, las políticas de RLS y el
seed del catálogo están versionados y se prueban contra un Postgres de verdad
(88 pruebas, `npm run db:test`). Falta enchufar las credenciales.

El registro de cómo se llegó hasta acá está en
[`docs/FASE-1.md`](docs/FASE-1.md) —concepto, sitemap, modelo de datos— y
[`docs/FASE-2.md`](docs/FASE-2.md) —Supabase, seguridad, plan de migración—.
Los dos describen decisiones que siguen en pie; las pantallas y el sistema
visual que muestran quedaron atrás.

### El día

Seis momentos: desayuno · **snack de mañana** · almuerzo · **snack de tarde** ·
merienda · cena. Snack y merienda no son lo mismo — el snack aguanta entre
comidas, la merienda es una comida y puede ser fuerte. Los dos snacks son
**opcionales**: se sacan y se vuelven a sumar de un toque.

Cada día tiene un **contexto** — en casa, mixto o en la calle — que decide qué
tiene que poder llevarse y cuánto tiene que llenar cada comida. No se deduce del
día de la semana, y no se configura a diario: vive en Configuración y en
«Resolver ahora». Cambiarlo rearma sólo lo pendiente.

### Construido

- **INICIO** — la pantalla que contesta «¿qué me queda por comer hoy?» sin que
  tengas que pensar. Arriba, tu día: cómo viene, qué comés ahora, qué sigue.
  Abajo, cómo cambiarlo: dónde vas a comer, seis atajos y una caja de texto.
  La línea que separa las dos mitades es el orden de la pantalla.
- **HOY** — el día entero, leído de arriba abajo: lo que toca ahora, lo que
  viene, y lo que ya pasó en gris. **No es una checklist**: el estado de cada
  comida sale del reloj, no de lo que hayas marcado. Registrar qué comiste
  existe, abajo y en voz baja, para el día que comiste otra cosa.
- **La ficha de una comida** — qué es, qué lleva, cómo se hace y con qué se
  reemplaza lo que falta. Dos cosas que no hace: no inventa —si falta la
  preparación, lo dice— y no presenta una estimación como un dato.
- **El asistente** — una caja de texto que entiende una frase escrita como la
  dirías y contesta con comidas de la biblioteca. Hoy son reglas locales, no un
  modelo, y la app se entiende entera con el asistente apagado.
- **La biblioteca** — 199 comidas con la porción documentada, el carbohidrato
  calculado sobre esa porción y **variantes**: una pizza son 30 g por porción,
  60 por dos, 90 por tres. Pizza, empanadas, medialunas, alfajor, helado y
  gaseosa común están con su número y marcadas **de vez en cuando**. Ni
  prohibir ni festejar.

### En obra

COMIDAS, COMPRAS y PERFIL. La pantalla existe y dice qué va a haber ahí en vez
de fingir que funciona. La lógica de la lista de compras —cantidades reales
agrupadas por sector— ya está escrita en `domain.ts`; falta la pantalla.

SEMANA, modo foco y los tres conceptos visuales del principio siguen en el
repositorio como registro del proceso, sobre el sistema visual viejo.

## Correr

Todo el detalle —máquina nueva, dos máquinas, cada comando, cómo levantar el
Postgres de las pruebas— está en [`docs/TRABAJAR.md`](docs/TRABAJAR.md).

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build && npm run preview
```

Antes de pushear:

```bash
npm run typecheck && npm run lint
npm run catalogo:check     # si tocaste el catálogo
```

## Cómo está armado

```
src/
  lib/
    types.ts       modelo de dominio (espeja supabase/migrations/)
    catalogo.ts    el JSON convertido a lo que usa la app, y las fusiones
    recetas.ts     cómo se hace cada comida. Va aparte del JSON porque es
                   prosa, no data
    foods.ts       los ingredientes: sector, cómo se compran, carbohidratos
                   de referencia, básicos de alacena y reemplazos
    carbos.ts      derivar el carbohidrato de un plato desde lo que lleva
    dia.ts         en qué momento del día estás, según el reloj
    busquedas.ts   las preguntas que contestan los atajos de INICIO
    asistente.ts   entender una frase y buscar, con reglas locales
    domain.ts      rotación, reemplazos, lista de compras, tareas
    insulin.ts     la relación configurada y la división. Nada más.
    store.ts       el estado en memoria y las funciones que lo cambian
    repo/          dónde se guarda: interfaz + implementación local
    supabase.ts    el cliente, sólo si están las variables de entorno
    format.ts      fechas, carbohidratos, tintes
  components/      primitivas, hojas y la ficha de una comida
  screens/         Inicio y Hoy construidas; el resto en obra
data/
  catalogo/        la biblioteca en JSON. Fuente única: de acá salen la app
                   y el seed SQL (npm run catalogo:sql). Al lado, las
                   revisiones: duplicados y carbohidratos a mirar
supabase/
  migrations/      el esquema, versionado y con RLS
  seed/            el catálogo para la base, generado
  tests/           88 pruebas de RLS, catálogo y fusiones (npm run db:test)
scripts/           generadores y chequeos del catálogo
docs/              TRABAJAR.md (dos máquinas), MODELO.md (el catálogo),
                   FASE-1 y FASE-2 (el registro del proceso)
```

La UI no sabe de dónde vienen los datos, y `store.ts` tampoco sabe dónde se
guardan: eso es de `repo/`. Hoy la única implementación escribe en el
navegador. Cuando exista la de Supabase, cambia qué implementación devuelve
`getRepo()` y ninguna pantalla se entera.

Sin `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` la app corre entera contra
el repositorio local y el cliente de Supabase ni siquiera entra al bundle.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · PWA · Supabase (preparado) · Netlify

Sin librería de componentes, sin router, sin librería de estado.
Bundle: ~150 kB gzip.

## Sistema de diseño

Todo vive en `src/index.css` como tokens. Fondo crema, tarjetas blancas,
bordes suaves, sombras mínimas y radios grandes. **Lavanda** es el color
principal —lo que se toca— y menta, mantequilla, coral, rosa y azul son
acentos secundarios, uno por tarjeta: seis pasteles juntos no son un sistema
de color, son un arcoíris.

**Una sola tipografía**: Plus Jakarta Sans, autoalojada
(`scripts/fetch-fonts.mjs`), así que la app abre sin red y sin pedirle nada a
un tercero. La escala es corta y con roles fijos —display, título, cuerpo,
meta, rótulo, versalita, número tabular— y no se inventan tamaños sueltos.

**El ritmo vertical es siempre el mismo**: 32 entre secciones, 16 del título a
su contenido, 12 entre tarjetas hermanas. El problema que tenía la pantalla no
era de contenido: era que cada bloque respiraba distinto y se sentía armada de
a pedazos.

**Tres piezas y nada más**: la tarjeta hero, la tarjeta normal y el chip. Un
solo radio. Si algo necesita una cuarta pieza, casi siempre es que está de más.

Diez reglas que se respetan en toda la app:

1. **Ningún estado se comunica sólo con color.** Siempre hay además forma,
   texto o posición.
2. **Una acción primaria visible por pantalla.** El resto vive en bottom sheets.
3. **El día no se asume perfecto.** Toda ruta tiene salida: sacar un snack,
   cambiar el contexto, resolver sin preparación, comer otra cosa, o resolver
   desde la calle sin nada encima.
4. **Nada de insulina sin que lo pidas.** Apagado por defecto; encendido, sólo
   detrás de un botón explícito.
5. **No depende de tu disciplina.** La app avanza con el reloj. Marcar es
   opcional en todas las pantallas salvo la lista de compras, donde tachar
   es el punto.
6. **Ninguna comida es buena ni mala.** No hay verde ni rojo, ni «permitido»
   ni «prohibido». Se clasifica por saciedad, practicidad, frecuencia,
   contexto y verificación de carbohidratos — nunca por si es «sana».
7. **Comer mejor no es comer fit.** Antes de sugerir algo, la pregunta es si
   una persona lo comería un martes cualquiera. Lo de gimnasio y lo de receta
   de internet pierde prioridad; no desaparece.
8. **La bebida es parte de la comida.** Un tostado con café es un tostado con
   café, no un tostado.
9. **La lavanda es de lo que se toca.** Nunca decorativa. Todo lo que es
   dato, etiqueta o metadata se queda en gris.
10. **Las recetas se escriben para alguien que nunca las hizo.** Entre tres y
    seis pasos, una acción por paso, la cantidad adentro y sin jerga de
    cocina. La aclaración gris aparece sólo donde hay una trampa concreta.
    Si la receta lleva más tiempo del que decía la comida, se corrige el
    tiempo de la comida — no al revés.
11. **Nada se inventa en silencio.** Si falta una receta, la ficha lo dice.
    Si un número es estimado, dice «estimado». Una duda se marca y se
    reporta; no se tapa con un dato plausible.

## PWA

`public/manifest.webmanifest` + `public/sw.js` (cachea el shell, sin push).
Instalable desde el navegador; en standalone se comporta como app.

## Deploy

Netlify, configurado en `netlify.toml`. `npm run build` → `dist/`.
