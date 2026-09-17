import { useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { DiabetesType, Perfil, Rol, Slot } from '../lib/types'
import { DIABETES_LABEL, DIABETES_NOTE, SLOT_LABEL } from '../lib/types'

const PASOS = 6

export function Onboarding({ app, onSalir }: { app: Vianda; onSalir: () => void }) {
  const [paso, setPaso] = useState(app.perfil.paso || 0)
  const [perfil, setPerfilLocal] = useState<Perfil>(app.perfil)

  const guardar = (p: Perfil) => {
    setPerfilLocal(p)
    app.setPerfil(p)
  }

  const avanzar = () => {
    const siguiente = paso + 1
    if (siguiente >= PASOS) return terminar()
    setPaso(siguiente)
    guardar({ ...perfil, paso: siguiente })
  }

  const volver = () => {
    const anterior = Math.max(0, paso - 1)
    setPaso(anterior)
    guardar({ ...perfil, paso: anterior })
  }

  const terminar = () => {
    guardar({ ...perfil, paso: PASOS, listo: true })
    onSalir()
  }

  const saltear = () => {
    guardar({ ...perfil, listo: true })
    onSalir()
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex min-h-dvh flex-col bg-bg">
        <header className="mx-auto w-full max-w-md shrink-0 v-safe-top px-5 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1.5" aria-label={`Paso ${paso + 1} de ${PASOS}`}>
              {Array.from({ length: PASOS }, (_, i) => (
                <span
                  key={i}
                  className={`h-[3px] w-6 rounded-full transition-colors duration-300 ${
                    i <= paso ? 'bg-accent' : 'bg-line-strong'
                  }`}
                />
              ))}
            </div>
            <button onClick={saltear} className="v-label -mr-2 px-2 py-2 text-ink-faint">
              Saltear
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-md flex-1 px-5 pt-8 pb-6">
          <AnimatePresence mode="wait">
            <m.div
              key={paso}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              {paso === 0 && <Bienvenida />}
              {paso === 1 && <Nombre perfil={perfil} onChange={setPerfilLocal} />}
              {paso === 2 && <Diabetes perfil={perfil} onChange={setPerfilLocal} />}
              {paso === 3 && <Carbos perfil={perfil} onChange={setPerfilLocal} />}
              {paso === 4 && <Rutina app={app} />}
              {paso === 5 && <Final perfil={perfil} />}
            </m.div>
          </AnimatePresence>
        </div>

        <footer className="mx-auto w-full max-w-md shrink-0 px-5 pb-8 v-safe-bottom">
          <button
            onClick={avanzar}
            className="v-label min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-accent-ink transition-transform duration-150 active:scale-[0.98]"
          >
            {paso === 0 ? 'Empezar' : paso === PASOS - 1 ? 'Ver mi semana' : 'Seguir'}
          </button>
          {paso > 0 && (
            <button onClick={volver} className="v-label mt-3 min-h-[44px] w-full text-ink-faint">
              Volver
            </button>
          )}
        </footer>
      </div>
    </LazyMotion>
  )
}

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <h1 className="v-head text-[27px] leading-[1.15] text-ink">{children}</h1>
)

const Bajada = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{children}</p>
)

function Opcion({ activa, titulo, detalle, onClick }: { activa: boolean; titulo: string; detalle?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activa}
      className={`mt-2.5 flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
        activa ? 'border-accent bg-accent-soft' : 'border-line active:bg-surface-2'
      }`}
    >
      <span aria-hidden className={`mt-1 size-[15px] shrink-0 rounded-full border-2 ${activa ? 'border-accent bg-accent' : 'border-line-strong'}`} />
      <span className="min-w-0">
        <span className={`block text-[16px] ${activa ? 'font-semibold text-ink' : 'text-ink'}`}>{titulo}</span>
        {detalle && <span className="mt-0.5 block text-[13.5px] leading-relaxed text-ink-faint">{detalle}</span>}
      </span>
    </button>
  )
}

function Bienvenida() {
  return (
    <>
      <p className="v-label mb-3 font-semibold text-accent">VIANDA</p>
      <Titulo>Cociná fácil. Comé rico.</Titulo>
      <Bajada>
        Te armamos una semana realista con porciones, hidratos si los necesitás, qué llevar y qué comprar. Menos tiempo pensando la comida; más tiempo viviendo tu día.
      </Bajada>

      <div className="mt-8 border-t border-line">
        {[
          ['Tu semana ya arranca armada.', 'Podés cambiar cualquier comida sin rehacer todo.'],
          ['Comida normal, no menú de dieta.', 'Milanesas, pastas, tostados, arroz, fruta, cosas de kiosco y opciones para cuando no cocinaste.'],
          ['La información se adapta a vos.', 'Si contás hidratos, los ves. Si no, la app sigue siendo un organizador de comida simple.'],
        ].map(([t, d]) => (
          <div key={t} className="border-b border-line py-4">
            <p className="text-[16px] font-semibold text-ink">{t}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{d}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function Nombre({ perfil, onChange }: { perfil: Perfil; onChange: (p: Perfil) => void }) {
  const roles: { id: Rol; titulo: string; detalle: string }[] = [
    { id: 'para-mi', titulo: 'Para mí', detalle: 'Quiero resolver mi propia comida.' },
    { id: 'acompanio', titulo: 'Acompaño a alguien', detalle: 'Un hijo, una pareja o alguien de la familia.' },
  ]

  return (
    <>
      <Titulo>Primero, ¿para quién organizamos?</Titulo>
      <Bajada>Esto cambia cómo te hablamos, no qué comidas aparecen.</Bajada>
      <input
        value={perfil.nombre}
        onChange={(e) => onChange({ ...perfil, nombre: e.target.value })}
        placeholder="Tu nombre"
        autoComplete="given-name"
        className="mt-6 w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[18px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
      />
      <div className="mt-6">
        {roles.map((r) => (
          <Opcion key={r.id} activa={perfil.rol === r.id} titulo={r.titulo} detalle={r.detalle} onClick={() => onChange({ ...perfil, rol: r.id })} />
        ))}
      </div>
    </>
  )
}

const TIPOS: DiabetesType[] = ['tipo-1', 'tipo-2', 'gestacional', 'prediabetes', 'sin-diabetes', 'prefiero-no-decir']

function Diabetes({ perfil, onChange }: { perfil: Perfil; onChange: (p: Perfil) => void }) {
  return (
    <>
      <Titulo>{perfil.rol === 'acompanio' ? '¿Qué necesita esa persona?' : '¿Vivís con diabetes?'}</Titulo>
      <Bajada>
        No usamos esto para prohibirte comida. Nos sirve para mostrar mejor porciones e hidratos cuando corresponde.
      </Bajada>
      <div className="mt-6">
        {TIPOS.map((t) => (
          <Opcion
            key={t}
            activa={perfil.diabetes === t}
            titulo={DIABETES_LABEL[t]}
            detalle={perfil.diabetes === t ? DIABETES_NOTE[t] : undefined}
            onClick={() => onChange({ ...perfil, diabetes: t })}
          />
        ))}
      </div>
    </>
  )
}

function Carbos({ perfil, onChange }: { perfil: Perfil; onChange: (p: Perfil) => void }) {
  return (
    <>
      <Titulo>¿Querés ver los hidratos de cada comida?</Titulo>
      <Bajada>
        Si te sirven para decidir, quedan siempre a la vista junto a la porción. Vianda no calcula ni sugiere dosis de insulina.
      </Bajada>
      <div className="mt-6">
        <Opcion
          activa={perfil.contarCarbos}
          titulo="Sí, mostrámelos"
          detalle="Vas a ver los gramos de CHO y la porción a la que corresponden."
          onClick={() => onChange({ ...perfil, contarCarbos: true })}
        />
        <Opcion
          activa={!perfil.contarCarbos}
          titulo="No, por ahora no"
          detalle="Podés activarlos después desde Perfil."
          onClick={() => onChange({ ...perfil, contarCarbos: false })}
        />
      </div>
    </>
  )
}

const CLAVES: Slot[] = ['breakfast', 'lunch', 'dinner']

function Rutina({ app }: { app: Vianda }) {
  const contextos = [
    { id: 'casa' as const, titulo: 'Casi siempre en casa', detalle: 'Podemos priorizar comidas para cocinar y servir.' },
    { id: 'mixto' as const, titulo: 'Un poco y un poco', detalle: 'Algunas comidas tienen que viajar bien.' },
    { id: 'calle' as const, titulo: 'Casi todo el día afuera', detalle: 'Priorizamos opciones portátiles y fáciles de resolver.' },
  ]
  const actual = app.today?.context ?? 'mixto'

  return (
    <>
      <Titulo>¿Cómo son tus días?</Titulo>
      <Bajada>Esto ayuda a que el plan te sirva de verdad, especialmente cuando tenés que llevarte comida.</Bajada>
      <div className="mt-6">
        {contextos.map((c) => (
          <Opcion key={c.id} activa={actual === c.id} titulo={c.titulo} detalle={c.detalle} onClick={() => app.today && app.setContext(app.today.date, c.id)} />
        ))}
      </div>
      <p className="v-label mt-9 font-semibold text-ink-soft">Horarios aproximados</p>
      <div className="mt-3 border-t border-line">
        {CLAVES.map((slot) => (
          <label key={slot} className="flex items-center justify-between gap-4 border-b border-line py-3">
            <span className="text-[16px] text-ink">{SLOT_LABEL[slot]}</span>
            <input
              type="time"
              value={app.times[slot]}
              onChange={(e) => app.setTime(slot, e.target.value)}
              className="rounded-[8px] border border-line bg-transparent px-3 py-2 text-[15px] text-ink v-tnum outline-none focus:border-accent"
            />
          </label>
        ))}
      </div>
    </>
  )
}

function Final({ perfil }: { perfil: Perfil }) {
  const nombre = perfil.nombre.trim()
  return (
    <>
      <Titulo>{nombre ? `Listo, ${nombre}.` : 'Listo.'}</Titulo>
      <Bajada>Tu semana ya está armada. Entrá, mirá qué toca y cambiá sólo lo que no te cierre.</Bajada>
      <div className="mt-8 border-t border-line">
        {[
          ['HOY', 'Qué toca ahora, qué sigue y qué conviene dejar listo para después.'],
          ['SEMANA', 'Siete días de comidas que podés cambiar de a una.'],
          ['COMPRAS', 'La lista sale del menú, con cantidades agrupadas por rubro.'],
        ].map(([t, d]) => (
          <div key={t} className="border-b border-line py-4">
            <p className="text-[16px] font-semibold text-ink">{t}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[13px] leading-relaxed text-ink-faint">
        Las cantidades y los hidratos sirven como referencia para organizarte. Cuando un dato no está verificado, Vianda lo marca.
      </p>
    </>
  )
}
