import { supabase } from './supabase'

/* Una cuenta cerrada no puede dejar datos personales visibles a la próxima
   persona que use el mismo teléfono. Sólo reaccionamos a SIGNED_OUT: el
   evento inicial sin sesión no debe borrar el estado de una persona que usa
   Vianda sin cuenta. */
if (supabase) {
  supabase.auth.onAuthStateChange((event) => {
    if (event !== 'SIGNED_OUT') return
    try {
      localStorage.removeItem('vianda.state.v4')
      localStorage.removeItem('vianda.remote.pending.v1')
    } catch {
      // En modo privado puede no haber storage; la sesión igual se cerró.
    }
    window.location.reload()
  })
}
