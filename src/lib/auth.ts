import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { hasBackend, supabase } from './supabase'

/* ------------------------------------------------------------------
   LA CUENTA

   Opcional a propósito. La app abre y sirve para algo sin registrarse:
   alguien que la prueba por primera vez no tiene por qué toparse con un
   formulario antes de ver de qué se trata. La cuenta aparece cuando sirve
   para algo —que tu semana sobreviva al teléfono— y no antes.

   Sin proyecto configurado, el estado es 'sin-backend' y la app no
   menciona cuentas en ninguna pantalla.
   ------------------------------------------------------------------ */

export type EstadoCuenta = 'sin-backend' | 'cargando' | 'fuera' | 'dentro'

/* Qué formas de entrar están habilitadas.

   Cada una hay que configurarla del lado de Supabase antes de que sirva:
   Google necesita un cliente OAuth, Apple una cuenta de desarrollador y
   un Service ID, y el teléfono un proveedor de SMS que se cobra por
   mensaje. Un botón que falla es peor que un botón que no está, así que
   se declaran a mano y sólo se muestran las que existen de verdad.

       VITE_AUTH_PROVIDERS=google,apple,telefono
*/
export type Proveedor = 'google' | 'apple' | 'telefono'

export const PROVEEDORES: Proveedor[] = (import.meta.env.VITE_AUTH_PROVIDERS ?? '')
  .split(',')
  .map((p: string) => p.trim().toLowerCase())
  .filter((p: string): p is Proveedor => p === 'google' || p === 'apple' || p === 'telefono')

export interface Resultado {
  /** Texto para mostrar, ya en castellano. */
  error?: string
  /** Para los flujos que no terminan en la app: el mail que sale. */
  aviso?: string
}

/* Los mensajes de Supabase vienen en inglés y algunos son crípticos.
   Se traducen los que una persona puede provocar sin hacer nada raro; el
   resto cae en un mensaje honesto en lugar de inventar una causa. */
const traducir = (msg: string): string => {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials')) return 'El mail o la contraseña no coinciden.'
  if (m.includes('email not confirmed')) return 'Falta confirmar el mail. Fijate en tu casilla.'
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Ya hay una cuenta con ese mail. Probá entrar.'
  if (m.includes('password should be at least'))
    return 'La contraseña tiene que tener al menos 8 caracteres.'
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'Ese mail no parece un mail.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Demasiados intentos seguidos. Esperá un minuto.'
  if (m.includes('token has expired') || m.includes('otp_expired'))
    return 'Ese código ya venció. Pedí uno nuevo.'
  if (m.includes('invalid token') || m.includes('otp') )
    return 'El código no coincide. Fijate que esté completo.'
  if (m.includes('provider is not enabled') || m.includes('unsupported provider'))
    return 'Esa forma de entrar todavía no está habilitada.'
  if (m.includes('phone') && m.includes('invalid'))
    return 'Ese número no parece un número. Va con código de país: +598…'
  if (m.includes('failed to fetch') || m.includes('network'))
    return 'No hay conexión con el servidor. Probá de nuevo en un rato.'
  return msg
}

const fallo = (e: unknown): Resultado => ({
  error: traducir(e instanceof Error ? e.message : String(e)),
})

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [estado, setEstado] = useState<EstadoCuenta>(
    hasBackend ? 'cargando' : 'sin-backend',
  )
  /* El link de recuperación devuelve una sesión que sirve para una sola
     cosa: elegir una contraseña nueva. Hasta que eso pase, la app tiene
     que pedirla en vez de comportarse como si hubieras entrado normal. */
  const [recuperando, setRecuperando] = useState(false)

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setEstado(data.session ? 'dentro' : 'fuera')
    })

    const { data: sub } = supabase.auth.onAuthStateChange((evento, s) => {
      setSession(s)
      setEstado(s ? 'dentro' : 'fuera')
      if (evento === 'PASSWORD_RECOVERY') setRecuperando(true)
      if (evento === 'SIGNED_OUT') setRecuperando(false)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const crear = useCallback(
    async (email: string, clave: string, nombre: string): Promise<Resultado> => {
      if (!supabase) return { error: 'No hay servidor configurado.' }
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: clave,
          // Lo lee el trigger de la base y queda como nombre del perfil.
          options: { data: { display_name: nombre.trim() } },
        })
        if (error) return { error: traducir(error.message) }
        // Con confirmación de mail activada no hay sesión todavía.
        if (!data.session) {
          return { aviso: 'Te mandamos un mail para confirmar la cuenta.' }
        }
        return {}
      } catch (e) {
        return fallo(e)
      }
    },
    [],
  )

  const entrar = useCallback(async (email: string, clave: string): Promise<Resultado> => {
    if (!supabase) return { error: 'No hay servidor configurado.' }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: clave })
      return error ? { error: traducir(error.message) } : {}
    } catch (e) {
      return fallo(e)
    }
  }, [])

  /* OAuth se va del navegador y vuelve con la sesión en la URL, que
     `detectSessionInUrl` consume sola. Por eso acá no hay nada que
     esperar: si todo va bien, esta página ya no existe. */
  const conProveedor = useCallback(async (quien: 'google' | 'apple'): Promise<Resultado> => {
    if (!supabase) return { error: 'No hay servidor configurado.' }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: quien,
        options: { redirectTo: window.location.origin },
      })
      return error ? { error: traducir(error.message) } : {}
    } catch (e) {
      return fallo(e)
    }
  }, [])

  /* Teléfono: se manda un código de seis dígitos y se vuelve con él. Dos
     pasos, dos funciones. */
  const pedirCodigo = useCallback(async (telefono: string): Promise<Resultado> => {
    if (!supabase) return { error: 'No hay servidor configurado.' }
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: telefono })
      return error
        ? { error: traducir(error.message) }
        : { aviso: 'Te mandamos un código por mensaje.' }
    } catch (e) {
      return fallo(e)
    }
  }, [])

  const verificarCodigo = useCallback(
    async (telefono: string, codigo: string): Promise<Resultado> => {
      if (!supabase) return { error: 'No hay servidor configurado.' }
      try {
        const { error } = await supabase.auth.verifyOtp({
          phone: telefono,
          token: codigo,
          type: 'sms',
        })
        return error ? { error: traducir(error.message) } : {}
      } catch (e) {
        return fallo(e)
      }
    },
    [],
  )

  const salir = useCallback(async (): Promise<Resultado> => {
    if (!supabase) return {}
    try {
      const { error } = await supabase.auth.signOut()
      return error ? { error: traducir(error.message) } : {}
    } catch (e) {
      return fallo(e)
    }
  }, [])

  const recuperar = useCallback(async (email: string): Promise<Resultado> => {
    if (!supabase) return { error: 'No hay servidor configurado.' }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Vuelve a la app, no a una pantalla de Supabase. La URL tiene que
        // estar declarada en el proyecto o el link no lleva a ningún lado.
        redirectTo: window.location.origin,
      })
      return error
        ? { error: traducir(error.message) }
        : { aviso: 'Si esa dirección tiene cuenta, te llega un mail con el link.' }
    } catch (e) {
      return fallo(e)
    }
  }, [])

  const cambiarClave = useCallback(async (clave: string): Promise<Resultado> => {
    if (!supabase) return { error: 'No hay servidor configurado.' }
    try {
      const { error } = await supabase.auth.updateUser({ password: clave })
      if (error) return { error: traducir(error.message) }
      setRecuperando(false)
      return {}
    } catch (e) {
      return fallo(e)
    }
  }, [])

  return {
    estado,
    email: session?.user.email ?? null,
    nombre: (session?.user.user_metadata?.display_name as string | undefined) ?? null,
    recuperando,
    crear,
    entrar,
    conProveedor,
    pedirCodigo,
    verificarCodigo,
    salir,
    recuperar,
    cambiarClave,
  }
}

export type Cuenta = ReturnType<typeof useSession>
