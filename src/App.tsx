import { Suspense, lazy, useEffect, useState } from 'react'
import { useVianda } from './lib/store'
import { Inicio } from './screens/Inicio'
import { Hoy } from './screens/Hoy'
import { Comidas } from './screens/Comidas'
import { Compras } from './screens/Compras'
import { Onboarding } from './screens/Onboarding'
import { Perfil } from './screens/Perfil'
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
      {tab === 'comidas' && <Comidas app={app} />}
      {tab === 'compras' && <Compras app={app} />}
      {tab === 'perfil' && <Perfil app={app} />}
      <Nav tab={tab} onTab={setTab} />
    </div>
  )
}
