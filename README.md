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
- **COMIDAS** — biblioteca personal con 99 opciones de demostración, marcadas
  como tales y con los carbohidratos sin verificar. La base es comida de un
  martes cualquiera: café con leche y tostadas, tostado, sándwich, mate con
  galletitas, fideos, pizza, milanesa. Avena, frutos secos y bowls siguen
  existiendo, pero no son el default. El detalle de las comidas que se cocinan
  trae **cómo se hace**: tres a cinco pasos con los minutos de cada uno, y un
  «Ver con detalle» que abre la receta entera —cantidades, temperaturas, cómo
  te das cuenta de que está—. Sólo donde hace falta: un tostado no lleva
  instrucciones.
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
- **Los tres conceptos visuales** en `#/conceptos`, para compararlos en el teléfono.

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
    types.ts       modelo de dominio (espeja supabase/schema.sql)
    demo.ts        99 opciones de demostración (isDemo, carbsVerified: false),
                   57 caseras y 42 para comprar afuera. Las que se cocinan
                   traen pasos cortos con tiempos, y la receta entera detrás
                   de «Ver con detalle»
    foods.ts       catálogo: en qué sector está cada cosa y cómo se compra
    domain.ts      necesidades del día, rotación, reemplazos, rescate,
                   resolver ahora, tareas de preparación, mochila
    insulin.ts     la relación configurada y la división. Nada más.
    assistant.ts   contrato del asistente (hoy reglas, mañana un modelo)
    store.ts       estado + persistencia local
    format.ts      fechas, carbohidratos, tintes
  components/      primitivas y sheets
  screens/         HOY, SEMANA, COMIDAS, COMPRAS, FOCO, CONCEPTOS
supabase/
  schema.sql       esquema completo con RLS
```

La UI no sabe de dónde vienen los datos. Hoy `store.ts` resuelve todo local con
los datos de ejemplo; conectar Supabase no toca ninguna pantalla.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · PWA · Supabase (preparado) · Netlify

Sin librería de componentes, sin router, sin librería de estado.
Bundle: ~84 kB gzip.

## Sistema de diseño

Todo vive en `src/index.css` como tokens. Cálido y sobrio: hueso, tinta cálida
y arcilla como único acento. Modo oscuro automático según el sistema.

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

## PWA

`public/manifest.webmanifest` + `public/sw.js` (cachea el shell, sin push).
Instalable desde el navegador; en standalone se comporta como app.

## Deploy

Netlify, configurado en `netlify.toml`. `npm run build` → `dist/`.
