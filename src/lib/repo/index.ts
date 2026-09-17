import { hasBackend } from '../supabase'
import { localRepo } from './local'
import { supabaseRepo } from './supabase'
import type { ViandaRepo } from './types'

export type { Snapshot, ViandaRepo, RepoKind } from './types'

/* Quién guarda los datos.

   Sin variables de Supabase: dispositivo, exactamente como antes.

   Con backend configurado: repositorio cloud local-first. Ese repositorio
   abre desde la copia del dispositivo, comprueba la sesión en bootstrap y,
   sólo si hay una cuenta iniciada, sincroniza con Supabase. Sin sesión sigue
   siendo una app útil y no obliga a registrarse antes de probarla. */

export const getRepo = (): ViandaRepo => hasBackend ? supabaseRepo : localRepo

/** Para Perfil/diagnóstico: dice si el build conoce un proyecto Supabase,
    no si existe una sesión iniciada. */
export const backendConfigured = hasBackend
