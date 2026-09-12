# Vianda

Aplicación web personal (PWA) para organizar la comida del día: qué llevar,
qué preparar la noche anterior y cuántos carbohidratos tiene cada cosa.

No es una app médica ni un recetario. Es logística alimentaria personal.

> **Sobre la diabetes:** la app **organiza información**. Muestra los carbohidratos
> estimados de cada comida y de dónde sale ese número. **No calcula insulina ni
> reemplaza ninguna indicación médica.**

---

## Estado

**Fase 1 completa.** El documento de arquitectura, UX y diseño está en
[`docs/FASE-1.md`](docs/FASE-1.md): concepto, sitemap, modelo de datos,
los tres conceptos visuales, la recomendación y el recorte de alcance.

Construido:

- **HOY** — próxima comida, el día completo, estados, cambiar comida con
  reemplazos compatibles, mochila y preparar para mañana.
- **Modo foco** — sólo lo que viene ahora.
- **Asistente** — entrada integrada, resuelta con reglas locales sobre la biblioteca.
- **SEMANA** — los 7 días, con reemplazo desde cualquier día.
- **COMIDAS** — biblioteca personal con 15 comidas de ejemplo.
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
    demo.ts        15 comidas de ejemplo, marcadas isDemo
    domain.ts      rotación, reemplazos, tareas de preparación, mochila
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

## PWA

`public/manifest.webmanifest` + `public/sw.js` (cachea el shell, sin push).
Instalable desde el navegador; en standalone se comporta como app.

## Deploy

Netlify, configurado en `netlify.toml`. `npm run build` → `dist/`.
