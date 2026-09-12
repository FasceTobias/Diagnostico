import { useEffect, useState } from 'react'
import { useVianda } from './lib/store'
import { Hoy } from './screens/Hoy'
import { Semana } from './screens/Semana'
import { Comidas } from './screens/Comidas'
import { Compras } from './screens/Compras'
import { Focus } from './screens/Focus'
import { Direcciones } from './screens/Direcciones'
import { BottomNav, type Tab } from './components/BottomNav'
import { AssistantBar } from './components/Assistant'
import { ResolveSheet, type ResolveStart } from './components/ResolveSheet'

/* Router propio: cuatro pantallas no justifican una dependencia.
   #/conceptos queda disponible para comparar las tres propuestas visuales. */

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

  if (hash === '#/direcciones' || hash === '#/conceptos') {
    return <Direcciones app={app} onBack={() => setHash('')} />
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
