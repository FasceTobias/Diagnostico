import { useState, type FormEvent } from 'react'
import type { Cuenta } from '../lib/auth'
import { Sheet } from './Sheet'
import { SectionLabel } from './ui'

/* La cuenta, en un sheet. No hay pantalla de login al abrir la app: la
   app funciona sin cuenta, y la cuenta se ofrece por lo que hace —que la
   comida sobreviva al teléfono—, no como peaje de entrada. */

type Modo = 'entrar' | 'crear' | 'olvide'

const Campo = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="mt-4 block">
    <span className="v-label-sm text-ink-faint">{label}</span>
    <input
      {...props}
      className="mt-1.5 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
    />
  </label>
)

const Principal = ({
  children,
  pendiente,
}: {
  children: React.ReactNode
  pendiente: boolean
}) => (
  <button
    type="submit"
    disabled={pendiente}
    className="v-label mt-6 min-h-[48px] w-full rounded-xl bg-accent font-semibold text-accent-ink transition-transform duration-150 active:scale-[0.98] disabled:opacity-55"
  >
    {pendiente ? 'Un segundo…' : children}
  </button>
)

const Aviso = ({ error, aviso }: { error?: string; aviso?: string }) => {
  if (!error && !aviso) return null
  return (
    <p
      role="status"
      className={`mt-4 text-[14px] leading-relaxed ${error ? 'text-alert' : 'text-ok'}`}
    >
      {error ?? aviso}
    </p>
  )
}

export function CuentaSheet({
  open,
  onClose,
  cuenta,
}: {
  open: boolean
  onClose: () => void
  cuenta: Cuenta
}) {
  const [modo, setModo] = useState<Modo>('entrar')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [nombre, setNombre] = useState('')
  const [pendiente, setPendiente] = useState(false)
  const [error, setError] = useState<string>()
  const [aviso, setAviso] = useState<string>()

  /* Cambiar de formulario limpia lo que decía el anterior: un error de
     login colgado arriba del registro no significa nada. */
  const ir = (m: Modo) => {
    setModo(m)
    setError(undefined)
    setAviso(undefined)
  }

  const enviar = (fn: () => Promise<{ error?: string; aviso?: string }>) =>
    async (e: FormEvent) => {
      e.preventDefault()
      setPendiente(true)
      setError(undefined)
      setAviso(undefined)
      const r = await fn()
      setPendiente(false)
      setError(r.error)
      setAviso(r.aviso)
      if (!r.error && !r.aviso) setClave('')
    }

  /* Volvés del mail de recuperación: lo único que corresponde acá es
     elegir una contraseña nueva. */
  if (cuenta.recuperando) {
    return (
      <Sheet open={open} onClose={onClose} title="Contraseña nueva">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Elegí una contraseña nueva para {cuenta.email ?? 'tu cuenta'}.
        </p>
        <form onSubmit={enviar(() => cuenta.cambiarClave(clave))}>
          <Campo
            label="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Al menos 8 caracteres"
          />
          <Aviso error={error} aviso={aviso} />
          <Principal pendiente={pendiente}>Guardar</Principal>
        </form>
      </Sheet>
    )
  }

  if (cuenta.estado === 'dentro') {
    return (
      <Sheet open={open} onClose={onClose} title="Tu cuenta">
        <SectionLabel className="mb-1">Sesión</SectionLabel>
        <p className="border-b border-line py-3 text-[16px] text-ink">{cuenta.email}</p>

        <p className="mt-5 text-[14px] leading-relaxed text-ink-soft">
          Todavía estamos conectando la app a la cuenta: por ahora tu semana, tus
          horarios y lo que marcás siguen guardándose en este teléfono. Cuando
          esté, te lo vas a encontrar hecho.
        </p>

        <button
          onClick={() => void cuenta.salir()}
          className="v-label mt-6 min-h-[48px] w-full rounded-xl border border-line font-semibold text-ink transition-colors active:bg-surface-2"
        >
          Cerrar sesión
        </button>
      </Sheet>
    )
  }

  const titulo =
    modo === 'entrar' ? 'Entrar' : modo === 'crear' ? 'Crear una cuenta' : 'Recuperar el acceso'

  return (
    <Sheet open={open} onClose={onClose} title={titulo}>
      {modo === 'entrar' && (
        <>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Con una cuenta, tu comida deja de vivir sólo en este teléfono: sobrevive a
            cambiarlo, a borrar los datos del navegador y a entrar desde otro lado.
          </p>
          <form onSubmit={enviar(() => cuenta.entrar(email, clave))}>
            <Campo
              label="Mail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@ejemplo.com"
            />
            <Campo
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
            <Aviso error={error} aviso={aviso} />
            <Principal pendiente={pendiente}>Entrar</Principal>
          </form>
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => ir('crear')}
              className="v-label font-semibold text-accent"
            >
              Crear una cuenta
            </button>
            <button onClick={() => ir('olvide')} className="v-label text-ink-soft">
              Me olvidé la contraseña
            </button>
          </div>
        </>
      )}

      {modo === 'crear' && (
        <>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Mail y contraseña, nada más. Lo demás lo vamos armando con el uso.
          </p>
          <form onSubmit={enviar(() => cuenta.crear(email, clave, nombre))}>
            <Campo
              label="Cómo querés que te llamemos"
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />
            <Campo
              label="Mail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@ejemplo.com"
            />
            <Campo
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Al menos 8 caracteres"
            />
            <Aviso error={error} aviso={aviso} />
            <Principal pendiente={pendiente}>Crear la cuenta</Principal>
          </form>
          <button
            onClick={() => ir('entrar')}
            className="v-label mt-5 font-semibold text-accent"
          >
            Ya tengo una
          </button>
        </>
      )}

      {modo === 'olvide' && (
        <>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Te mandamos un link para elegir una contraseña nueva. Se abre acá mismo.
          </p>
          <form onSubmit={enviar(() => cuenta.recuperar(email))}>
            <Campo
              label="Mail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@ejemplo.com"
            />
            <Aviso error={error} aviso={aviso} />
            <Principal pendiente={pendiente}>Mandarme el link</Principal>
          </form>
          <button
            onClick={() => ir('entrar')}
            className="v-label mt-5 font-semibold text-accent"
          >
            Volver
          </button>
        </>
      )}
    </Sheet>
  )
}
