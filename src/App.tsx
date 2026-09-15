import { Suspense, lazy, useEffect, useState } from 'react'
import { useVianda } from './lib/store'
import { Inicio } from './screens/Inicio'
import { Hoy } from './screens/Hoy'
import { EnObra } from './screens/EnObra'
import { Onboarding } from './screens/Onboarding'
import { Nav, type Tab } from './components/Nav'

/* Router propio: cinco pantallas no justifican una dependencia.

   Las direcciones visuales que exploramos quedan como registro del
   proceso, pero fuera del producto: la ruta sólo existe corriendo en
   desarrollo. En el build publicado la condición es una constante falsa,
   así que ni la pantalla ni sus tipografías entran en el bundle, y no hay
   URL que un usuario pueda pisar de casualidad. */

const Direcciones = import.meta.env.DEV
  ? lazy(() => import('./screens/Direcciones').then((m) => ({ default: m.Direcciones })))
  : null

const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return [hash, (h: string) => { window.location.hash = h }] as const
}

export default function App() {
  const app = useVianda()
  const [tab, setTab] = useState<Tab>('inicio')
  const [hash, setHash] = useHash()
  /* Para que salir de la presentación se sienta inmediato, sin esperar a
     que el guardado vuelva. */
  const [saltado, setSaltado] = useState(false)

  if (Direcciones && (hash === '#/direcciones' || hash === '#/conceptos')) {
    return (
      <Suspense fallback={null}>
        <Direcciones app={app} onBack={() => setHash('')} />
      </Suspense>
    )
  }

  /* La presentación aparece una sola vez y se puede saltear entera. Va
     antes que cualquier otra cosa: no tiene sentido explicar la app por
     encima de la app. */
  if (!app.perfil.listo && !saltado) {
    return <Onboarding app={app} onSalir={() => setSaltado(true)} />
  }

  return (
    <div className="min-h-dvh bg-bg">
      {tab === 'inicio' && <Inicio app={app} onIr={setTab} />}

      {tab === 'hoy' && <Hoy app={app} />}

      {tab === 'comidas' && (
        <EnObra
          titulo="Comidas"
          icono="comidas"
          detalle="La biblioteca entera: 200 comidas reales, con su porción y su número."
          piezas={[
            'Por momento: desayunos, almuerzos, meriendas, cenas y snacks',
            'Por situación: rápidas, para llevar, para comer afuera, sin cocinar',
            'Por sabor: dulces y saladas',
            'Cada comida con ingredientes, porción, tiempo y cómo se hace',
          ]}
        />
      )}

      {tab === 'compras' && (
        <EnObra
          titulo="Compras"
          icono="compras"
          detalle="La lista de la semana, armada con lo que decidiste comer."
          piezas={[
            'Agrupada por sector: verdulería, carnicería, lácteos, almacén, freezer',
            'Con cantidades de verdad: «12 huevos», no «huevo»',
            'Los ingredientes que se repiten se suman en una sola línea',
            'Lo que comprás hecho afuera no genera compra',
          ]}
        />
      )}

      {tab === 'perfil' && (
        <EnObra
          titulo="Perfil"
          icono="perfil"
          detalle="Cómo comés vos, y de dónde sale cada número de la app."
          piezas={[
            'Tus horarios y cuántas comidas hacés por día',
            'Lo que no comés y lo que te gusta',
            'Diabetes: si contás carbohidratos y cómo querés verlos',
            'Cuenta, datos y de dónde sale cada estimación',
          ]}
        />
      )}

      <Nav tab={tab} onTab={setTab} />
    </div>
  )
}
