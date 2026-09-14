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
> Los carbohidratos de las comidas de ejemplo **no están verificados** y la app
> lo dice en todas las pantallas. Se escriben siempre igual: `34 g CHO`. No hay
> totales diarios: el carbo es por comida, no una meta a cumplir.
>
> La relación insulina/carbohidratos se guarda si vos la configurás, y la
> calculadora hace **una división** cuando se la pedís. La app no calcula dosis
> por su cuenta, no las muestra en tarjetas ni en listas, y no reemplaza lo que
> te indicó tu médico.

---

## Estado

**Fase 1 completa.** El documento de arquitectura, UX y diseño está en
[`docs/FASE-1.md`](docs/FASE-1.md): concepto, sitemap, modelo de datos,
los tres conceptos visuales, la recomendación y el recorte de alcance.

**El sistema visual queda aprobado para MVP.** Sólo se toca por un bug, un
problema de contraste o algo que no se entiende — no por gusto.

**Fase 2 en marcha:** dejar de ser una demo local y pasar a producto real.
La auditoría del estado actual, el modelo de Supabase, la revisión de
seguridad y el plan de migración por etapas están en
[`docs/FASE-2.md`](docs/FASE-2.md).

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

- **HOY** — qué toca ahora, qué viene después y el resto del día. Avanza sola
  con el reloj: **no hace falta marcar nada**. Debajo, una acción según la hora
  (la mochila de mañana, la preparación de noche).
- **HOY LLEVATE** — lo que va en el bolso, como lectura. Las casillas existen
  pero están apagadas.
- **Modo foco** — sólo lo que viene ahora.
- **Asistente** — entrada integrada, resuelta con reglas locales sobre la biblioteca.
- **SEMANA** — los 7 días, con reemplazo desde cualquier día.
- **COMIDAS** — 143 opciones: **44 del catálogo real** (`data/catalogo/`) y 99 de
  demostración todavía por reemplazar. Las del catálogo tienen la porción
  documentada, el carbohidrato calculado sobre esa porción y **variantes**: una
  pizza son 30 g por porción, 60 por dos, 90 por tres. Pizza, empanadas,
  hamburguesa, medialunas, alfajor, helado y gaseosa común están con su número,
  y marcadas **de vez en cuando**: el plan de una semana propone una sola comida
  de ésas en 42. Ni prohibir ni festejar.

  El detalle de las comidas que se cocinan
  trae **cómo se hace**, escrito para alguien que nunca lo hizo: un paso por
  acción, sin jerga de cocina, con la cantidad y la señal de que está listo.
  «Ver con detalle» abre la explicación entera de cada paso y queda abierto.
  Sólo donde hace falta: un tostado no lleva instrucciones.
- **RESOLVER AHORA** — la salida cuando el plan falla: no traje comida, tengo
  hambre, cambió mi día, no preparé nada, quiero reemplazar. Tres toques hasta
  ver opciones, agrupadas por lugar concreto (rotisería, panadería,
  supermercado…) con platos de verdad.
- **CONFIGURACIÓN** — cómo viene el día, horarios editables y relación
  insulina/carbohidratos con una calculadora que se abre a mano. Apagada por
  defecto.
- **COMPRAS** — la compra de la semana con cantidades reales, agrupada por
  sector: «12 huevos», «1,5 kg de pollo», «1 paquete de pan». Más la
  preparación semanal agrupada.
- **Los tres conceptos visuales** quedan como registro del proceso en
  `src/screens/Direcciones.tsx`. La ruta sólo existe corriendo `npm run dev`:
  en el build publicado no entra al bundle.

## Correr

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build && npm run preview
```

## Cómo está armado

```
src/
  lib/
    types.ts       modelo de dominio (espeja supabase/migrations/)
    catalogo.ts    el catálogo real, desde data/catalogo/*.json
    recetas.ts     cómo se hace cada una, paso a paso y sin jerga, con la
                   explicación entera detrás de «Ver con detalle». Va
                   aparte del JSON porque es prosa, no data
    foods.ts       catálogo: en qué sector está cada cosa y cómo se compra
    domain.ts      necesidades del día, rotación, reemplazos, rescate,
                   resolver ahora, tareas de preparación, mochila
    insulin.ts     la relación configurada y la división. Nada más.
    assistant.ts   contrato del asistente (hoy reglas, mañana un modelo)
    store.ts       el estado en memoria y las funciones que lo cambian
    repo/          dónde se guarda: interfaz + implementación local
    supabase.ts    el cliente, sólo si están las variables de entorno
    format.ts      fechas, carbohidratos, tintes
  components/      primitivas y sheets
  screens/         HOY, SEMANA, COMIDAS, COMPRAS, FOCO
data/
  catalogo/        la biblioteca, en JSON. Fuente única: de acá sale lo que
                   usa la app y el seed SQL (npm run catalogo:sql)
supabase/
  migrations/      el esquema, versionado y con RLS
  seed/            el catálogo para la base, generado
  tests/           63 pruebas de RLS y catálogo (npm run db:test)
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
Bundle: ~84 kB gzip.

## Sistema de diseño

Todo vive en `src/index.css` como tokens. Calmo y limpio: casi negro, texto
blanco y gris, y **azul claro como único acento**. Modo oscuro automático según
el sistema.

El azul es `#72C7FF` sobre el fondo oscuro y `#0A6299` sobre el claro —el mismo
azul con otra luz—, y marca **sólo lo que se toca**: navegación activa, acción
principal, selección, foco, indicadores. La metadata queda neutra. Encima de un
relleno celeste el texto va casi negro (`accent-ink`), porque blanco sobre
`#72C7FF` no se lee. Hay un solo gradiente —azul hielo a azul cielo, en el orb
del asistente— y un solo glow, el halo del punto de «Ahora».

**Tres voces tipográficas** con roles claros, todas autoalojadas
(`scripts/fetch-fonts.mjs`), así que la app abre sin red y sin pedirle nada a un
tercero:

- **Space Grotesk** — la voz principal: nombres de comidas y titulares. Tiene
  carácter y se lee bien chica en un teléfono.
- **Inter** — datos, rótulos y cifras tabulares. No compite.
- **Fraunces** — acento. Sólo los títulos de sección.

**Es una app, no una revista.** Rótulos en caja baja, no versalitas anchas. Cada
fila es una superficie táctil con su flecha. Las acciones importantes —ver,
cambiar, resolver— están a la vista, no escondidas en un gesto.

**Menos cajas, más lista.** El separador de la casa es una regla de 1px. La
única superficie elevada de HOY es la zona de trabajo: la comida que toca ahora
con sus dos acciones. El día se lee como una línea de tiempo, la biblioteca como
un índice y la compra como un ticket.

Dos reglas que se respetan en toda la app:

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
9. **El azul es de lo que se toca.** Nunca decorativo. Todo lo que es dato,
   etiqueta o metadata se queda en gris.
10. **Las recetas se escriben para alguien que nunca las hizo.** Sin jerga de
    cocina, con la cantidad en cada paso y con la señal de que está listo. Si
    la receta lleva más tiempo del que decía la comida, se corrige el tiempo
    de la comida.

## PWA

`public/manifest.webmanifest` + `public/sw.js` (cachea el shell, sin push).
Instalable desde el navegador; en standalone se comporta como app.

## Deploy

Netlify, configurado en `netlify.toml`. `npm run build` → `dist/`.
