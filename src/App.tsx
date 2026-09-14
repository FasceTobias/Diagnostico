import { Suspense, lazy, useEffect, useState } from 'react'
import { useVianda } from './lib/store'
import { Hoy } from './screens/Hoy'
import { Semana } from './screens/Semana'
import { Comidas } from './screens/Comidas'
import { Compras } from './screens/Compras'
import { Focus } from './screens/Focus'
import { BottomNav, type Tab } from './components/BottomNav'
import { AssistantBar } from './components/Assistant'
import { ResolveSheet, type ResolveStart } from './components/ResolveSheet'

/* Router propio: cuatro pantallas no justifican una dependencia.

   Las tres direcciones visuales que exploramos quedan como registro del
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
  const [tab, setTab] = useState<Tab>('hoy')
  const [resolve, setResolve] = useState<ResolveStart | null>(null)
  const [hash, setHash] = useHash()

  if (Direcciones && (hash === '#/direcciones' || hash === '#/conceptos')) {
    return (
      <Suspense fallback={null}>
        <Direcciones app={app} onBack={() => setHash('')} />
      </Suspense>
    )
  }

  if (app.focus) {
    return <Focus app={app} onExit={() => app.setFocus(false)} />
  }

  return (
    <div className="min-h-dvh bg-bg">
      {tab === 'hoy' && (
        <Hoy app={app} onFocus={() => app.setFocus(true)} onResolve={setResolve} />
      )}
      {tab === 'semana' && <Semana app={app} />}
      {tab === 'comidas' && <Comidas app={app} />}
      {tab === 'compras' && <Compras app={app} />}

      <AssistantBar app={app} bottom={68} onResolve={setResolve} />
      <BottomNav tab={tab} onTab={setTab} />

      <ResolveSheet
        open={resolve !== null}
        onClose={() => setResolve(null)}
        app={app}
        start={resolve ?? undefined}
      />
    </div>
  )
}
