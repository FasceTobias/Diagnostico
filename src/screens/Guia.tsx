import { useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import type { Tab } from '../components/Nav'

const pasos: { titulo: string; texto: string; ejemplo: string; destino: Tab; accion: string; vista: string[] }[] = [
  { titulo: 'Mirá qué toca comer', texto: 'En Inicio ves la comida de ahora, la próxima y su horario. Tocá una comida para ver qué hacer.', ejemplo: 'Almuerzo · 12:30 → abrí la receta o cambiala.', destino: 'inicio', accion: 'Ir a Inicio', vista: ['Ahora · Almuerzo', '12:30  Pollo con batatas', 'Ver receta  ·  Registrar'] },
  { titulo: 'Marcá lo que comiste', texto: 'En Hoy tocá una comida y elegí lo que pasó de verdad. Se guarda aunque cierres la app.', ejemplo: 'Comí lo que estaba · Comí otra cosa · Me la salteé.', destino: 'hoy', accion: 'Ir a Hoy', vista: ['Hoy · Almuerzo', 'Comí lo que estaba ✓', 'Comí otra cosa  ·  Me la salteé'] },
  { titulo: 'Organizá tu semana', texto: 'Semana está siempre abajo. Tocá un día, marcá si vas a estar afuera y mirá qué comida te conviene llevar.', ejemplo: 'Si mañana salís todo el día, elegí “En la calle”.', destino: 'semana', accion: 'Abrir Semana', vista: ['Lun  Mar  Mié  Jue  Vie', 'Mañana · En la calle', 'Vianda lista para llevar'] },
  { titulo: 'Elegí otras comidas', texto: 'En Comidas buscá por nombre o ingrediente. Cada receta tiene cantidades y pasos para prepararla.', ejemplo: 'Buscá “papa” aunque no esté en el nombre de la receta.', destino: 'comidas', accion: 'Ver Comidas', vista: ['Buscar: papa', 'Tortilla de papa', 'Ingredientes  ·  Preparación'] },
  { titulo: 'Hacé las compras', texto: 'Compras reúne los ingredientes de tu semana. Marcá lo que ya tenés o compraste; queda guardado.', ejemplo: 'Si cambiás una comida, la lista se actualiza.', destino: 'compras', accion: 'Ver Compras', vista: ['Verdulería', '□ Tomate · 2 unidades', '☑ Papa · ya tengo'] },
]

export function Guia({ onIr, intro = false, onTerminar }: { onIr: (tab: Tab) => void; intro?: boolean; onTerminar?: () => void }) {
  const [actual, setActual] = useState(0)
  const reducir = useReducedMotion()
  const paso = pasos[actual]
  const cerrar = () => intro ? onTerminar?.() : onIr('inicio')
  return <LazyMotion features={domAnimation}>
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-8 v-safe-top pt-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[16px] font-semibold text-accent">VIANDA · GUÍA {actual + 1} DE {pasos.length}</p>
        <button onClick={cerrar} className="min-h-[48px] px-2 text-[16px] font-semibold text-ink-soft">{intro ? 'Saltar guía' : 'Cerrar'}</button>
      </div>
      <div className="mt-5 flex gap-2" aria-label={`Paso ${actual + 1} de ${pasos.length}`}>
        {pasos.map((p, i) => <span key={p.titulo} className={`h-2 flex-1 rounded-full ${i <= actual ? 'bg-accent' : 'bg-line-strong'}`} />)}
      </div>
      <AnimatePresence mode="wait">
        <m.div key={actual} initial={reducir ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={reducir ? undefined : { opacity: 0, x: -28 }} transition={{ duration: 0.24 }} className="flex-1" aria-live="polite">
          <div className="mt-8 rounded-[28px] bg-accent-soft p-5">
            <p className="text-[15px] font-semibold text-accent">Así se ve en Vianda</p>
            <div className="mt-4 space-y-3 rounded-2xl border border-line bg-surface p-5 shadow-sm">
              {paso.vista.map((linea, i) => <m.div key={linea} initial={reducir ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducir ? 0 : 0.13 + i * 0.11 }} className={`rounded-xl px-3 py-3 text-[16px] leading-relaxed ${i === 0 ? 'bg-accent-soft font-semibold text-ink' : 'bg-bg text-ink-soft'}`}>{linea}</m.div>)}
            </div>
          </div>
          <h1 className="mt-8 text-[30px] font-bold leading-tight text-ink">{paso.titulo}</h1>
          <p className="mt-4 text-[19px] leading-relaxed text-ink">{paso.texto}</p>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">Por ejemplo: {paso.ejemplo}</p>
        </m.div>
      </AnimatePresence>
      {!intro && <button onClick={() => onIr(paso.destino)} className="mt-6 min-h-[52px] w-full rounded-xl border border-accent px-4 text-[17px] font-semibold text-accent">{paso.accion}</button>}
      <div className="mt-4 flex gap-3">
        {actual > 0 && <button onClick={() => setActual(actual - 1)} className="min-h-[52px] flex-1 rounded-xl border border-line px-3 text-[17px] font-semibold">Anterior</button>}
        <button onClick={() => actual === pasos.length - 1 ? cerrar() : setActual(actual + 1)} className="min-h-[52px] flex-1 rounded-xl bg-accent px-3 text-[17px] font-semibold text-white">{actual === pasos.length - 1 ? intro ? 'Configurar Vianda' : 'Terminar' : 'Siguiente'}</button>
      </div>
      <p className="mt-5 text-center text-[15px] text-ink-soft">La guía se puede volver a abrir desde Inicio y Perfil.</p>
    </main>
  </LazyMotion>
}
