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
> lo dice en todas las pantallas. No hay totales diarios: el carbo es por comida,
> no una meta a cumplir.

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
día de la semana. Cambiarlo rearma sólo lo pendiente.

### Construido

- **HOY** — próxima comida, contexto del día, los seis momentos, estados,
  cambiar comida con reemplazos compatibles, la salida rápida para cuando no
  preparaste nada, horarios editables, mochila y preparar para mañana.
- **Modo foco** — sólo lo que viene ahora.
- **Asistente** — entrada integrada, resuelta con reglas locales sobre la biblioteca.
- **SEMANA** — los 7 días, con reemplazo desde cualquier día.
- **COMIDAS** — biblioteca personal con 21 comidas de demostración, marcadas
  como tales y con los carbohidratos sin verificar.
- **COMPRAS** — preparación semanal agrupada. La lista automática espera a que
  estén cargadas las cantidades reales (ver `docs/FASE-1.md`, sección J).
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
    demo.ts        21 comidas de demostración (isDemo, carbsVerified: false)
    domain.ts      necesidades del día, rotación, reemplazos, rescate,
                   tareas de preparación, mochila
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

Dos reglas que se respetan en toda la app:

1. **Ningún estado se comunica sólo con color.** Siempre hay además forma,
   texto o posición.
2. **Una acción primaria visible por pantalla.** El resto vive en bottom sheets.
3. **El día no se asume perfecto.** Toda ruta tiene salida: sacar un snack,
   cambiar el contexto, resolver sin preparación, comer otra cosa.

## PWA

`public/manifest.webmanifest` + `public/sw.js` (cachea el shell, sin push).
Instalable desde el navegador; en standalone se comporta como app.

## Deploy

Netlify, configurado en `netlify.toml`. `npm run build` → `dist/`.
