import { useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import type { Vianda } from '../lib/store'
import type { DiabetesType, InsulinSettings, Perfil, Rol, Slot } from '../lib/types'
import { DIABETES_LABEL, DIABETES_NOTE, SLOT_LABEL } from '../lib/types'

/* ------------------------------------------------------------------
   LA PRESENTACIÓN

   Seis pasos, todos salteables, ninguno obligatorio. Se puede cortar en
   cualquier momento y la app queda usable igual: lo que no contestaste
   toma un valor razonable y se puede cambiar después en Configuración.

   La regla que ordena todo esto: **nada de lo que se contesta acá saca
   comida de la app**. No hay lista negra por tipo de diabetes, no hay
   modo dieta, no hay alimentos prohibidos. Lo que cambia es qué
   información aparece al lado de la comida y qué herramientas se
   encienden. Y eso se dice en voz alta, en la pantalla, porque es lo
   primero que alguien con diabetes espera que una app le haga.
   ------------------------------------------------------------------ */

const PASOS = 6

export function Onboarding({ app, onSalir }: { app: Vianda; onSalir: () => void }) {
  const [paso, setPaso] = useState(app.perfil.paso || 0)
  const [perfil, setPerfilLocal] = useState<Perfil>(app.perfil)
  const [insulina, setInsulina] = useState<InsulinSettings>(app.insulin)

  const guardar = (p: Perfil) => {
    setPerfilLocal(p)
    app.setPerfil(p)
  }

  /* Cada paso guarda al pasar al siguiente, no al final. Si cerrás la app
     en el paso 4, mañana seguís en el 4 y lo contestado sigue ahí. */
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

  /* Saltear no es abandonar a medias: deja la app lista para usar y no
     vuelve a preguntar. Lo que falte se completa desde Configuración. */
  const saltear = () => {
    guardar({ ...perfil, listo: true })
    onSalir()
  }

  const usaInsulina =
    perfil.diabetes === 'tipo-1' || perfil.diabetes === 'tipo-2' || perfil.diabetes === 'gestacional'

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

              {paso === 1 && (
                <Nombre
                  perfil={perfil}
                  onChange={(p) => setPerfilLocal(p)}
                />
              )}

              {paso === 2 && (
                <Diabetes
                  perfil={perfil}
                  onChange={(p) => setPerfilLocal(p)}
                />
              )}

              {paso === 3 && (
                <Carbos
                  perfil={perfil}
                  insulina={insulina}
                  usaInsulina={usaInsulina}
                  onPerfil={(p) => setPerfilLocal(p)}
                  onInsulina={(i) => {
                    setInsulina(i)
                    app.setInsulin(i)
                  }}
                />
              )}

              {paso === 4 && <Rutina app={app} />}

              {paso === 5 && <Final perfil={perfil} app={app} />}
            </m.div>
          </AnimatePresence>
        </div>

        <footer className="mx-auto w-full max-w-md shrink-0 px-5 pb-8 v-safe-bottom">
          <button
            onClick={avanzar}
            className="v-label min-h-[52px] w-full rounded-xl bg-accent text-[15px] font-semibold text-accent-ink transition-transform duration-150 active:scale-[0.98]"
          >
            {paso === 0 ? 'Empezar' : paso === PASOS - 1 ? 'Listo' : 'Seguir'}
          </button>
          {paso > 0 && (
            <button
              onClick={volver}
              className="v-label mt-3 min-h-[44px] w-full text-ink-faint"
            >
              Volver
            </button>
          )}
        </footer>
      </div>
    </LazyMotion>
  )
}

/* ---------- piezas ---------- */

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <h1 className="v-head text-[27px] leading-[1.15] text-ink">{children}</h1>
)

const Bajada = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{children}</p>
)

function Opcion({
  activa,
  titulo,
  detalle,
  onClick,
}: {
  activa: boolean
  titulo: string
  detalle?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activa}
      className={`mt-2.5 flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
        activa ? 'border-accent bg-accent-soft' : 'border-line active:bg-surface-2'
      }`}
    >
      <span
        aria-hidden
        className={`mt-1 size-[15px] shrink-0 rounded-full border-2 transition-colors ${
          activa ? 'border-accent bg-accent' : 'border-line-strong'
        }`}
      />
      <span className="min-w-0">
        <span className={`block text-[16px] ${activa ? 'font-semibold text-ink' : 'text-ink'}`}>
          {titulo}
        </span>
        {detalle && (
          <span className="mt-0.5 block text-[13.5px] leading-relaxed text-ink-faint">
            {detalle}
          </span>
        )}
      </span>
    </button>
  )
}

/* ---------- 0. bienvenida ---------- */

function Bienvenida() {
  return (
    <>
      <Titulo>Tu comida del día, resuelta desde la noche anterior.</Titulo>
      <Bajada>
        Vianda organiza qué comés, qué llevás y qué preparás. No es una dieta ni una
        app médica: es logística.
      </Bajada>

      <div className="mt-8 border-t border-line">
        {[
          ['No hay comida prohibida.', 'Pizza, milanesa, asado, helado. Todo entra. Lo que la app suma es saber cuántos carbohidratos tiene cada cosa.'],
          ['No depende de tu disciplina.', 'Avanza sola con el reloj. Si no marcás nada en tres días, sigue funcionando igual.'],
          ['Todo lo que viene ahora es opcional.', 'Son seis pantallas y se pueden saltear. La app funciona sin contestar nada.'],
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

/* ---------- 1. nombre ---------- */

function Nombre({ perfil, onChange }: { perfil: Perfil; onChange: (p: Perfil) => void }) {
  const roles: { id: Rol; titulo: string; detalle: string }[] = [
    { id: 'para-mi', titulo: 'Para mí', detalle: 'Organizo mi propia comida.' },
    {
      id: 'acompanio',
      titulo: 'Acompaño a alguien',
      detalle: 'Un hijo, una pareja, alguien de la familia.',
    },
  ]

  return (
    <>
      <Titulo>¿Cómo querés que te llamemos?</Titulo>
      <Bajada>Se usa para hablarte, nada más. Dejalo vacío si preferís.</Bajada>

      <input
        value={perfil.nombre}
        onChange={(e) => onChange({ ...perfil, nombre: e.target.value })}
        placeholder="Tu nombre"
        autoComplete="given-name"
        className="mt-6 w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[18px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
      />

      <p className="v-label mt-8 font-semibold text-ink-soft">¿La usás para vos?</p>
      {roles.map((r) => (
        <Opcion
          key={r.id}
          activa={perfil.rol === r.id}
          titulo={r.titulo}
          detalle={r.detalle}
          onClick={() => onChange({ ...perfil, rol: r.id })}
        />
      ))}
    </>
  )
}

/* ---------- 2. diabetes ---------- */

const TIPOS: DiabetesType[] = [
  'tipo-1',
  'tipo-2',
  'gestacional',
  'prediabetes',
  'sin-diabetes',
  'prefiero-no-decir',
]

function Diabetes({ perfil, onChange }: { perfil: Perfil; onChange: (p: Perfil) => void }) {
  return (
    <>
      <Titulo>{perfil.rol === 'acompanio' ? '¿Qué tiene esa persona?' : '¿Tenés diabetes?'}</Titulo>
      <Bajada>
        Esto <span className="text-ink">no cambia qué comida te muestra la app</span>. Cambia
        qué información aparece al lado, y qué herramientas se encienden.
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

      <p className="mt-6 text-[13px] leading-relaxed text-ink-faint">
        Se guarda en tu cuenta y no se comparte con nadie. Podés cambiarlo o borrarlo
        cuando quieras.
      </p>
    </>
  )
}

/* ---------- 3. carbohidratos e insulina ---------- */

function Carbos({
  perfil,
  insulina,
  usaInsulina,
  onPerfil,
  onInsulina,
}: {
  perfil: Perfil
  insulina: InsulinSettings
  usaInsulina: boolean
  onPerfil: (p: Perfil) => void
  onInsulina: (i: InsulinSettings) => void
}) {
  const general = insulina.ratios.find((r) => r.scope === 'general')

  return (
    <>
      <Titulo>¿Contás carbohidratos?</Titulo>
      <Bajada>
        Si los contás, la app te muestra cuántos tiene cada comida. Si no, no los nombra
        en ningún lado.
      </Bajada>

      <div className="mt-6">
        <Opcion
          activa={perfil.contarCarbos}
          titulo="Sí, mostrámelos"
          detalle="Al lado de cada comida, siempre con de dónde sale el número."
          onClick={() => onPerfil({ ...perfil, contarCarbos: true })}
        />
        <Opcion
          activa={!perfil.contarCarbos}
          titulo="No, por ahora no"
          detalle="La app queda como organizador de comida y nada más."
          onClick={() => onPerfil({ ...perfil, contarCarbos: false })}
        />
      </div>

      {usaInsulina && perfil.contarCarbos && (
        <div className="v-rise mt-9 border-t border-line pt-6">
          <p className="v-head text-[18px] text-ink">¿Usás insulina en las comidas?</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            Si la usás, la app puede guardar tu relación y hacer la división cuando se la
            pidas. <span className="text-ink">No calcula dosis por su cuenta</span>, no
            corrige por glucemia y no reemplaza lo que te indicó tu médico.
          </p>

          <div className="mt-4">
            <Opcion
              activa={insulina.enabled}
              titulo="Sí, guardala"
              onClick={() => onInsulina({ ...insulina, enabled: true })}
            />
            <Opcion
              activa={!insulina.enabled}
              titulo="Ahora no"
              detalle="Se puede encender después, en Configuración."
              onClick={() => onInsulina({ ...insulina, enabled: false })}
            />
          </div>

          {insulina.enabled && general && (
            <label className="v-rise mt-5 flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3.5">
              <span className="min-w-0">
                <span className="block text-[15px] text-ink">1 unidad cubre</span>
                <span className="v-label-sm mt-0.5 block text-ink-faint">
                  Si no la sabés de memoria, dejala y cargala después.
                </span>
              </span>
              <span className="flex shrink-0 items-baseline gap-1.5">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={50}
                  value={general.gramsPerUnit}
                  onChange={(e) =>
                    onInsulina({
                      ...insulina,
                      ratios: insulina.ratios.map((r) =>
                        r.scope === 'general'
                          ? { ...r, gramsPerUnit: Number(e.target.value) || 0 }
                          : r,
                      ),
                    })
                  }
                  className="w-16 rounded-xl border border-line bg-bg px-3 py-2 text-right text-[17px] font-semibold text-ink v-tnum outline-none focus:border-accent"
                />
                <span className="v-label-sm text-ink-faint">g</span>
              </span>
            </label>
          )}
        </div>
      )}
    </>
  )
}

/* ---------- 4. rutina ---------- */

const CLAVES: Slot[] = ['breakfast', 'lunch', 'dinner']

function Rutina({ app }: { app: Vianda }) {
  const contextos = [
    { id: 'casa' as const, titulo: 'Casi siempre en casa', detalle: 'Cocinás y comés ahí.' },
    { id: 'mixto' as const, titulo: 'Un poco y un poco', detalle: 'Algunas comidas se llevan.' },
    { id: 'calle' as const, titulo: 'Casi todo el día afuera', detalle: 'Casi todo tiene que ser portátil.' },
  ]
  const actual = app.today?.context ?? 'mixto'

  return (
    <>
      <Titulo>¿Cómo son tus días?</Titulo>
      <Bajada>
        Sirve para saber qué tiene que poder llevarse. No se asume que un sábado estás en
        casa: lo podés cambiar cualquier día.
      </Bajada>

      <div className="mt-6">
        {contextos.map((c) => (
          <Opcion
            key={c.id}
            activa={actual === c.id}
            titulo={c.titulo}
            detalle={c.detalle}
            onClick={() => app.today && app.setContext(app.today.date, c.id)}
          />
        ))}
      </div>

      <p className="v-label mt-9 font-semibold text-ink-soft">¿A qué hora comés?</p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
        Aproximado. La app los usa para saber qué viene ahora, no para apurarte.
      </p>
      <div className="mt-3 border-t border-line">
        {CLAVES.map((slot) => (
          <label
            key={slot}
            className="flex items-center justify-between gap-4 border-b border-line py-3"
          >
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
      <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
        Los snacks y la merienda quedan con horarios por defecto. Están todos en
        Configuración.
      </p>
    </>
  )
}

/* ---------- 5. final ---------- */

function Final({ perfil, app }: { perfil: Perfil; app: Vianda }) {
  const nombre = perfil.nombre.trim()

  return (
    <>
      <Titulo>{nombre ? `Listo, ${nombre}.` : 'Listo.'}</Titulo>
      <Bajada>
        Ya hay una semana armada. Es de ejemplo: la biblioteca de verdad la vamos a ir
        construyendo con lo que comés.
      </Bajada>

      <div className="mt-8 border-t border-line">
        {[
          ['HOY', 'Qué toca ahora, qué viene después y el resto del día. Avanza sola.'],
          ['Resolver ahora', 'Cuando el día se rompe: no trajiste comida, tenés hambre, se te hizo tarde.'],
          ['Compras', 'La lista de la semana con cantidades de verdad: 12 huevos, 1,5 kg de pollo.'],
        ].map(([t, d]) => (
          <div key={t} className="border-b border-line py-4">
            <p className="text-[16px] font-semibold text-ink">{t}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line px-4 py-4">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          {perfil.contarCarbos && app.insulin.enabled
            ? 'Los carbohidratos están a la vista y la calculadora se abre cuando vos se lo pidas. La app no sugiere dosis.'
            : perfil.contarCarbos
              ? 'Los carbohidratos están a la vista, siempre con de dónde sale el número.'
              : 'Los carbohidratos quedan apagados. Se encienden en Configuración cuando quieras.'}
        </p>
      </div>
    </>
  )
}
