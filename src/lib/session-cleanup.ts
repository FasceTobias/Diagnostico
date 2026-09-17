import { supabase } from './supabase'

/* Cambiar de invitado a cuenta necesita un bootstrap nuevo para importar y
   leer la nube. Cerrar sesión además borra la copia local de esa cuenta, para
   que otra persona en el mismo teléfono no vea sus datos. INITIAL_SESSION no
   toca nada: una persona puede usar Vianda sin cuenta. */
if (supabase) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      try {
        localStorage.removeItem('vianda.state.v4')
        localStorage.removeItem('vianda.remote.pending.v1')
      } catch {
        // En modo privado puede no haber storage; la sesión igual se cerró.
      }
      window.location.reload()
      return
    }

    if (event === 'SIGNED_IN') {
      window.location.reload()
    }
  })
}
