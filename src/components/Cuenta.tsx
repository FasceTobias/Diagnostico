import { useState, type FormEvent } from 'react'
import { PROVEEDORES, type Cuenta } from '../lib/auth'
import { Sheet } from './Sheet'
import { SectionLabel } from './ui'

/* La cuenta, en un sheet. No hay pantalla de login al abrir la app: la
   app funciona sin cuenta, y la cuenta se ofrece por lo que hace —que la
   comida sobreviva al teléfono—, no como peaje de entrada. */

type Modo = 'entrar' | 'crear' | 'olvide' | 'telefono'

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

/* Los logos van como marca de línea, no como el botón de cada empresa:
   la app tiene su propio lenguaje y no se convierte en un collage. */
const MARCAS: Record<string, { texto: string; path: string }> = {
  google: {
    texto: 'Seguir con Google',
    path: 'M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.7 3-4.3 3-7.3 0-.7-.1-1.4-.2-2zM12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 1-3.5 1a6 6 0 0 1-5.7-4.2l-3.3 2.6A10 10 0 0 0 12 22M6.3 13.9a6 6 0 0 1 0-3.8L3 7.5a10 10 0 0 0 0 9zM12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3 7.5l3.3 2.6A6 6 0 0 1 12 5.9',
  },
  apple: {
    texto: 'Seguir con Apple',
    path: 'M16.3 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1 2.6-2a9 9 0 0 0 1.2-2.4c-.1 0-2.2-.9-2.2-3.4M14.1 6.2c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-1 2.6 1 .1 2-.5 2.7-1.2',
  },
}

const Proveedores = ({
  onElegir,
  onTelefono,
}: {
  onElegir: (p: 'google' | 'apple') => void
  onTelefono: () => void
}) => {
  if (PROVEEDORES.length === 0) return null
  return (
    <>
      <div className="mt-6 space-y-2.5">
        {PROVEEDORES.filter((p) => p !== 'telefono').map((p) => (
          <button
            key={p}
            onClick={() => onElegir(p as 'google' | 'apple')}
            className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-line text-[15px] font-medium text-ink transition-colors active:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" className="size-[17px] text-ink-soft" aria-hidden>
              <path d={MARCAS[p].path} fill="currentColor" />
            </svg>
            {MARCAS[p].texto}
          </button>
        ))}
        {PROVEEDORES.includes('telefono') && (
          <button
            onClick={onTelefono}
            className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-line text-[15px] font-medium text-ink transition-colors active:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" className="size-[17px] text-ink-soft" fill="none" aria-hidden>
              <path
                d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5ZM10.5 17.5h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Entrar con mi teléfono
          </button>
        )}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="v-label-sm text-ink-faint">o con mail</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </>
  )
}

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
  const [telefono, setTelefono] = useState('')
  const [codigo, setCodigo] = useState('')
  const [codigoPedido, setCodigoPedido] = useState(false)
  const [pendiente, setPendiente] = useState(false)
  const [error, setError] = useState<string>()
  const [aviso, setAviso] = useState<string>()

  /* Cambiar de formulario limpia lo que decía el anterior: un error de
     login colgado arriba del registro no significa nada. */
  const ir = (m: Modo) => {
    setModo(m)
    setError(undefined)
    setAviso(undefined)
    if (m !== 'telefono') setCodigoPedido(false)
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
          <Proveedores
            onElegir={(p) => void cuenta.conProveedor(p)}
            onTelefono={() => ir('telefono')}
          />
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
          <Proveedores
            onElegir={(p) => void cuenta.conProveedor(p)}
            onTelefono={() => ir('telefono')}
          />
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

      {modo === 'telefono' && (
        <>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            {codigoPedido
              ? `Te mandamos un código de seis dígitos al ${telefono}.`
              : 'Te mandamos un código por mensaje. No hace falta contraseña.'}
          </p>

          {!codigoPedido ? (
            <form
              onSubmit={enviar(async () => {
                const r = await cuenta.pedirCodigo(telefono)
                if (!r.error) setCodigoPedido(true)
                return r
              })}
            >
              <Campo
                label="Teléfono"
                type="tel"
                autoComplete="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+598 99 123 456"
              />
              <p className="v-label-sm mt-2 text-ink-faint">Con código de país.</p>
              <Aviso error={error} aviso={aviso} />
              <Principal pendiente={pendiente}>Mandarme el código</Principal>
            </form>
          ) : (
            <form onSubmit={enviar(() => cuenta.verificarCodigo(telefono, codigo))}>
              <Campo
                label="Código"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="123456"
              />
              <Aviso error={error} aviso={aviso} />
              <Principal pendiente={pendiente}>Entrar</Principal>
              <button
                onClick={() => {
                  setCodigoPedido(false)
                  setCodigo('')
                }}
                className="v-label mt-4 w-full text-ink-soft"
              >
                Cambiar el número
              </button>
            </form>
          )}

          <button onClick={() => ir('entrar')} className="v-label mt-5 font-semibold text-accent">
            Volver
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
