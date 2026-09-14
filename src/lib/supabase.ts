import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* El cliente existe sólo si el proyecto está configurado.

   Sin las dos variables, `supabase` es null y la app corre entera contra
   el repositorio local, igual que hasta ahora. Es lo que deja publicar
   cualquier commit de esta etapa sin que exista todavía un backend.

   Las dos claves son públicas por diseño: la anon key no sirve de nada
   sin RLS. La clave de servicio no entra acá ni en ninguna variable
   `VITE_`, porque todo eso termina dentro del bundle. */

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // La sesión vuelve del link de recuperación por el hash de la
          // URL, que es el mismo lugar donde vive el router de la app.
          detectSessionInUrl: true,
        },
      })
    : null

export const hasBackend = supabase !== null
