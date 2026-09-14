import { hasBackend } from '../supabase'
import { localRepo } from './local'
import type { ViandaRepo } from './types'

export type { Snapshot, ViandaRepo, RepoKind } from './types'

/* Quién guarda los datos.

   Hoy siempre el dispositivo. Cuando exista el repositorio de Supabase
   (etapa 3), la regla va a ser: hay backend configurado Y hay sesión
   iniciada → Supabase; si no, el local.

   Ese "si no" no es un plan B provisorio. La app tiene que abrir y servir
   para algo sin cuenta y sin señal: alguien que la prueba por primera vez
   no debería toparse con un formulario de registro antes de ver de qué se
   trata. */

export const getRepo = (): ViandaRepo => localRepo

/** Para la pantalla de configuración, cuando cuente de dónde salen los
    datos. Hoy alcanza para saber si el proyecto está conectado. */
export const backendConfigured = hasBackend
