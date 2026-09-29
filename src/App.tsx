import { Suspense, lazy, useEffect, useState } from 'react'
import { useVianda } from './lib/store'
import { Inicio } from './screens/Inicio'
import { Hoy } from './screens/Hoy'
import { Comidas } from './screens/Comidas'
import { Compras } from './screens/Compras'
import { Onboarding } from './screens/Onboarding'
import { Perfil } from './screens/Perfil'
import { Semana } from './screens/Semana'
import { Guia } from './screens/Guia'
import { Nav, type Tab } from './components/Nav'
import { isoDate } from './lib/format'

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
  const [selectedDate, setSelectedDate] = useState(() => isoDate(new Date()))
  const [hash, setHash] = useHash()
  /* Para que salir de la presentación se sienta inmediato, sin esperar a
     que el guardado vuelva. */
  const [saltado, setSaltado] = useState(false)
  const [introVista, setIntroVista] = useState(false)

  if (Direcciones && (hash === '#/direcciones' || hash === '#/conceptos')) {
    return (
      <Suspense fallback={null}>
        <Direcciones app={app} onBack={() => setHash('')} />
      </Suspense>
    )
  }

  if (!app.perfil.listo && !saltado && app.perfil.paso === 0 && !introVista) {
    return <Guia intro onTerminar={() => setIntroVista(true)} onIr={setTab} />
  }

  /* La configuración sigue a la explicación inicial. Una configuración
     empezada se retoma en el paso guardado, sin repetir la guía. */
  if (!app.perfil.listo && !saltado) {
    return <Onboarding app={app} onSalir={() => setSaltado(true)} />
  }

  return (
    <div className="min-h-dvh bg-bg">
      {tab === 'inicio' && <Inicio app={app} onIr={setTab} onDiaSemana={(date) => { setSelectedDate(date); setTab('semana') }} />}
      {tab === 'hoy' && <Hoy app={app} />}
      {tab === 'semana' && <Semana app={app} initialDate={selectedDate} onVolver={() => setTab('inicio')} />}
      {tab === 'guia' && <Guia onIr={setTab} />}
      {tab === 'comidas' && <Comidas app={app} />}
      {tab === 'compras' && <Compras app={app} />}
      {tab === 'perfil' && <Perfil app={app} onGuia={() => setTab('guia')} />}
      <Nav tab={tab} onTab={setTab} />
    </div>
  )
}
