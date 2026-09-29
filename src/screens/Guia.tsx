import { useState } from 'react'
import type { Tab } from '../components/Nav'

const pasos: { titulo: string; texto: string; ejemplo: string; destino: Tab; accion: string }[] = [
  { titulo: 'Mirá qué toca comer', texto: 'En Inicio ves la comida de ahora, la próxima y su horario. Tocá la comida para ver qué hacer.', ejemplo: 'Si el plan dice “almuerzo 12:30”, tocá esa comida para ver la receta o cambiarla.', destino: 'inicio', accion: 'Ir a Inicio' },
  { titulo: 'Marcá lo que comiste', texto: 'En Hoy tocá una comida. Elegí “Comí lo planeado”, “Cambié la comida” o “La salteé”. Queda guardado aunque cierres la app.', ejemplo: 'No hace falta seguir el plan perfecto: registrá lo que pasó de verdad.', destino: 'hoy', accion: 'Ir a Hoy' },
  { titulo: 'Prepará los días afuera', texto: 'En Inicio marcá cómo será mañana. En “Ver y marcar los días de la semana” podés elegir cada fecha. “Qué me llevo” te muestra las viandas y lo que conviene preparar.', ejemplo: 'Si mañana vas a estar afuera, elegí “En la calle” para ese día.', destino: 'semana', accion: 'Ver mi semana' },
  { titulo: 'Buscá otra comida', texto: 'En Comidas buscá por nombre o ingrediente. Tocá una opción para ver cantidades y pasos, y agregala a un día del plan.', ejemplo: 'Escribí “papa” para encontrar recetas que llevan papa, aunque no figure en el nombre.', destino: 'comidas', accion: 'Ver Comidas' },
  { titulo: 'Usá la lista de compras', texto: 'Compras reúne los ingredientes del plan semanal. Marcá lo que ya tenés o compraste; la marca queda guardada.', ejemplo: 'Si cambiás el plan, la lista se actualiza con los nuevos ingredientes.', destino: 'compras', accion: 'Ver Compras' },
]

export function Guia({ onIr }: { onIr: (tab: Tab) => void }) {
  const [actual, setActual] = useState(0)
  const paso = pasos[actual]
  return <main className="mx-auto max-w-md px-5 pb-32 v-safe-top pt-6">
    <button onClick={() => onIr('inicio')} className="min-h-[48px] text-[16px] font-semibold text-accent">‹ Cerrar guía</button>
    <p className="mt-5 text-[16px] font-semibold text-accent">GUÍA PARA EMPEZAR · {actual + 1} DE {pasos.length}</p>
    <h1 className="mt-3 text-[30px] font-bold leading-tight text-ink">{paso.titulo}</h1>
    <p className="mt-5 text-[19px] leading-relaxed text-ink">{paso.texto}</p>
    <div className="mt-7 rounded-2xl border border-line bg-surface p-5">
      <p className="text-[16px] font-semibold text-ink">Por ejemplo</p>
      <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">{paso.ejemplo}</p>
    </div>
    <button onClick={() => onIr(paso.destino)} className="mt-7 min-h-[52px] w-full rounded-xl border border-accent px-4 text-[17px] font-semibold text-accent">{paso.accion}</button>
    <div className="mt-8 flex gap-3">
      {actual > 0 && <button onClick={() => setActual(actual - 1)} className="min-h-[52px] flex-1 rounded-xl border border-line px-3 text-[17px] font-semibold">Anterior</button>}
      <button onClick={() => actual === pasos.length - 1 ? onIr('inicio') : setActual(actual + 1)} className="min-h-[52px] flex-1 rounded-xl bg-accent px-3 text-[17px] font-semibold text-white">{actual === pasos.length - 1 ? 'Terminar' : 'Siguiente'}</button>
    </div>
    <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">Podés volver a abrir esta guía desde Perfil, en cualquier momento.</p>
  </main>
}
