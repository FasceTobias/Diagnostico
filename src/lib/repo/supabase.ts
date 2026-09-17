import { CATALOGO } from '../catalogo'
import { buildWeek, DEFAULT_TIMES } from '../domain'
import { addDays, isoDate } from '../format'
import { supabase } from '../supabase'
import type {
  DayPlan,
  DiabetesType,
  InsulinSettings,
  Perfil,
  PlannedMeal,
  Preferences,
  Rol,
  Slot,
} from '../types'
import { DEFAULT_INSULIN, DEFAULT_PERFIL, DEFAULT_PREFERENCES } from '../types'
import { localRepo } from './local'
import type { Snapshot, ViandaRepo } from './types'

/* ------------------------------------------------------------------
   REPOSITORIO CLOUD

   La app sigue siendo local-first:
   - abre con la copia del dispositivo, sin esperar la red;
   - si hay sesión, bootstrap trae la verdad de Supabase;
   - cada escritura se guarda primero local y después remoto;
   - si la red falla, la operación queda en una cola y se reintenta en el
     próximo bootstrap.

   El catálogo sigue bundled desde data/catalogo/. Supabase tiene el mismo
   catálogo para administración/futuro, pero no hacemos bajar ~200 comidas
   en cada arranque para mostrar exactamente los mismos datos.
   ------------------------------------------------------------------ */

const PENDING_KEY = 'vianda.remote.pending.v1'

type PendingOp =
  | { kind: 'week'; week: DayPlan[]; weekStart: string }
  | { kind: 'day'; day: DayPlan }
  | { kind: 'times'; times: Record<Slot, string> }
  | { kind: 'prefs'; prefs: Preferences }
  | { kind: 'perfil'; perfil: Perfil }
  | { kind: 'insulin'; insulin: InsulinSettings }
  | { kind: 'check'; id: string; done: boolean }
  | { kind: 'extras'; extras: string[] }

let activeUserId: string | null = null
let auxChecks: Record<string, boolean> = {}
let auxExtras: string[] = []
let importedLocalAt: string | null = null

const client = () => {
  if (!supabase) throw new Error('Supabase no está configurado')
  return supabase
}

const readPending = (): PendingOp[] => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) ?? '[]') as PendingOp[]
  } catch {
    return []
  }
}

const writePending = (ops: PendingOp[]) => {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(ops))
  } catch {
    // Si el navegador no deja persistir, la app igual sigue local.
  }
}

const enqueue = (op: PendingOp) => {
  const ops = readPending()

  // Quedarse con la última versión de estados completos y de cada día/check.
  const keep = ops.filter((x) => {
    if (x.kind === op.kind && ['week', 'times', 'prefs', 'perfil', 'insulin', 'extras'].includes(op.kind)) {
      return false
    }
    if (x.kind === 'day' && op.kind === 'day' && x.day.date === op.day.date) return false
    if (x.kind === 'check' && op.kind === 'check' && x.id === op.id) return false
    // Una semana completa hace innecesarios los días pendientes anteriores.
    if (op.kind === 'week' && x.kind === 'day') return false
    return true
  })

  writePending([...keep, op])
}

const startOfWeek = (d: Date) => {
  const x = new Date(d)
  const dow = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - dow)
  return x
}

const weekStartForDate = (iso: string) =>
  isoDate(startOfWeek(new Date(`${iso}T12:00:00`)))

const currentWeekStart = () => isoDate(startOfWeek(new Date()))

const sessionUserId = async (): Promise<string | null> => {
  if (!supabase) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session?.user.id ?? null
}

const ensureProfile = async (uid: string) => {
  const c = client()
  const { data, error } = await c.from('profiles').select('id').eq('id', uid).maybeSingle()
  if (error) throw error
  if (data) return

  // Normalmente lo crea on_auth_user_created. Esto cubre cuentas viejas o
  // una migración aplicada después de que la cuenta ya existía.
  const { error: insertError } = await c.from('profiles').insert({ id: uid })
  if (insertError) throw insertError
  const { error: prefsError } = await c
    .from('preferences')
    .upsert({ profile_id: uid }, { onConflict: 'profile_id' })
  if (prefsError) throw prefsError
}

const slotsToDb = (meals: PlannedMeal[]) =>
  meals.map((m) => ({
    slot: m.slot,
    meal_id: m.mealId,
    time: m.time,
    status: m.status,
    optional: m.optional,
    replaced_from: m.replacedFrom ?? null,
    note: m.note ?? null,
  }))

const slotsFromDb = (raw: unknown): PlannedMeal[] => {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((value) => {
    if (!value || typeof value !== 'object') return []
    const x = value as Record<string, unknown>
    if (typeof x.slot !== 'string' || typeof x.meal_id !== 'string' || typeof x.time !== 'string') {
      return []
    }
    return [{
      slot: x.slot as Slot,
      mealId: x.meal_id,
      time: x.time,
      status: (typeof x.status === 'string' ? x.status : 'pending') as PlannedMeal['status'],
      optional: !!x.optional,
      replacedFrom: typeof x.replaced_from === 'string' ? x.replaced_from : undefined,
      note: typeof x.note === 'string' ? x.note : undefined,
    }]
  })
}

const ensureWeek = async (uid: string, weekStart: string): Promise<string> => {
  const c = client()
  const { data, error } = await c
    .from('weekly_plans')
    .upsert(
      { profile_id: uid, week_start: weekStart, generated_by: 'client' },
      { onConflict: 'profile_id,week_start' },
    )
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

const saveWeekRemote = async (uid: string, week: DayPlan[], weekStart: string) => {
  const c = client()
  const weeklyId = await ensureWeek(uid, weekStart)
  const rows = week.map((day) => ({
    weekly_plan_id: weeklyId,
    date: day.date,
    context: day.context,
    slots: slotsToDb(day.meals),
  }))
  const { error } = await c
    .from('daily_plans')
    .upsert(rows, { onConflict: 'weekly_plan_id,date' })
  if (error) throw error
}

const saveDayRemote = async (uid: string, day: DayPlan) => {
  const c = client()
  const weeklyId = await ensureWeek(uid, weekStartForDate(day.date))
  const { error } = await c.from('daily_plans').upsert(
    {
      weekly_plan_id: weeklyId,
      date: day.date,
      context: day.context,
      slots: slotsToDb(day.meals),
    },
    { onConflict: 'weekly_plan_id,date' },
  )
  if (error) throw error
}

const saveTimesRemote = async (uid: string, times: Record<Slot, string>) => {
  const { error } = await client().from('profiles').update({ meal_times: times }).eq('id', uid)
  if (error) throw error
}

const savePerfilRemote = async (uid: string, perfil: Perfil) => {
  const { error } = await client().from('profiles').update({
    display_name: perfil.nombre || null,
    rol: perfil.rol,
    diabetes: perfil.diabetes,
    carb_counting_enabled: perfil.contarCarbos,
    onboarding_step: perfil.paso,
    onboarding_completed_at: perfil.listo ? new Date().toISOString() : null,
  }).eq('id', uid)
  if (error) throw error
}

const savePrefsRemote = async (uid: string, prefs: Preferences) => {
  const c = client()
  const { data, error: readError } = await c
    .from('preferences')
    .select('extra')
    .eq('profile_id', uid)
    .maybeSingle()
  if (readError) throw readError

  const previous = data?.extra && typeof data.extra === 'object'
    ? data.extra as Record<string, unknown>
    : {}

  const { error } = await c.from('preferences').upsert({
    profile_id: uid,
    goal: prefs.goal,
    reduce_added_sugar: prefs.reduceAddedSugar,
    cooks: prefs.cooks ?? null,
    hours_outside: prefs.hoursOutside ?? null,
    sweet_or_salty: prefs.dulceOSalado ?? null,
    extra: { ...previous, likes: prefs.likes, dislikes: prefs.dislikes },
  }, { onConflict: 'profile_id' })
  if (error) throw error
}

const saveInsulinRemote = async (uid: string, insulin: InsulinSettings) => {
  const c = client()
  const { error: profileError } = await c
    .from('profiles')
    .update({ insulin_enabled: insulin.enabled })
    .eq('id', uid)
  if (profileError) throw profileError

  const { error: deleteError } = await c.from('insulin_ratios').delete().eq('profile_id', uid)
  if (deleteError) throw deleteError

  if (insulin.ratios.length) {
    const { error: insertError } = await c.from('insulin_ratios').insert(
      insulin.ratios.map((r) => ({
        profile_id: uid,
        scope: r.scope,
        grams_per_unit: r.gramsPerUnit,
        from_time: r.fromTime ?? null,
        to_time: r.toTime ?? null,
      })),
    )
    if (insertError) throw insertError
  }
}

const saveAuxRemote = async (uid: string, patch?: { imported?: boolean }) => {
  const c = client()
  if (patch?.imported && !importedLocalAt) importedLocalAt = new Date().toISOString()
  const { error } = await c.from('client_state').upsert({
    profile_id: uid,
    checks: auxChecks,
    extras: auxExtras,
    imported_local_at: importedLocalAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'profile_id' })
  if (error) throw error
}

const loadRemote = async (uid: string): Promise<Snapshot> => {
  const c = client()
  const ws = currentWeekStart()

  const [profileResult, prefsResult, insulinResult, stateResult, weekResult] = await Promise.all([
    c.from('profiles').select('*').eq('id', uid).single(),
    c.from('preferences').select('*').eq('profile_id', uid).maybeSingle(),
    c.from('insulin_ratios').select('*').eq('profile_id', uid).order('created_at'),
    c.from('client_state').select('*').eq('profile_id', uid).maybeSingle(),
    c.from('weekly_plans').select('id,week_start').eq('profile_id', uid).eq('week_start', ws).maybeSingle(),
  ])

  if (profileResult.error) throw profileResult.error
  if (prefsResult.error) throw prefsResult.error
  if (insulinResult.error) throw insulinResult.error
  if (stateResult.error) throw stateResult.error
  if (weekResult.error) throw weekResult.error

  const profile = profileResult.data as Record<string, unknown>
  const prefRow = (prefsResult.data ?? {}) as Record<string, unknown>
  const extra = prefRow.extra && typeof prefRow.extra === 'object'
    ? prefRow.extra as Record<string, unknown>
    : {}

  const stringArray = (x: unknown) => Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string') : []

  const times = profile.meal_times && typeof profile.meal_times === 'object'
    ? { ...DEFAULT_TIMES, ...(profile.meal_times as Partial<Record<Slot, string>>) }
    : DEFAULT_TIMES

  const prefs: Preferences = {
    ...DEFAULT_PREFERENCES,
    goal: (prefRow.goal as Preferences['goal']) ?? DEFAULT_PREFERENCES.goal,
    reduceAddedSugar: typeof prefRow.reduce_added_sugar === 'boolean'
      ? prefRow.reduce_added_sugar
      : DEFAULT_PREFERENCES.reduceAddedSugar,
    likes: stringArray(extra.likes),
    dislikes: stringArray(extra.dislikes),
    cooks: typeof prefRow.cooks === 'number' ? prefRow.cooks : undefined,
    hoursOutside: typeof prefRow.hours_outside === 'number' ? prefRow.hours_outside : undefined,
    dulceOSalado: typeof prefRow.sweet_or_salty === 'string'
      ? prefRow.sweet_or_salty as Preferences['dulceOSalado']
      : undefined,
  }

  const perfil: Perfil = {
    ...DEFAULT_PERFIL,
    nombre: typeof profile.display_name === 'string' ? profile.display_name : '',
    rol: (profile.rol as Rol | undefined) ?? DEFAULT_PERFIL.rol,
    diabetes: (profile.diabetes as DiabetesType | null | undefined) ?? null,
    contarCarbos: typeof profile.carb_counting_enabled === 'boolean'
      ? profile.carb_counting_enabled
      : true,
    paso: typeof profile.onboarding_step === 'number' ? profile.onboarding_step : 0,
    listo: !!profile.onboarding_completed_at || profile.onboarding_skipped === true,
  }

  const ratios = (insulinResult.data ?? []).map((row) => ({
    id: row.id as string,
    scope: row.scope as InsulinSettings['ratios'][number]['scope'],
    gramsPerUnit: Number(row.grams_per_unit),
    fromTime: row.from_time ?? undefined,
    toTime: row.to_time ?? undefined,
  }))
  const insulin: InsulinSettings = {
    enabled: profile.insulin_enabled === true,
    ratios: ratios.length ? ratios : DEFAULT_INSULIN.ratios,
  }

  auxChecks = stateResult.data?.checks && typeof stateResult.data.checks === 'object'
    ? stateResult.data.checks as Record<string, boolean>
    : {}
  auxExtras = stringArray(stateResult.data?.extras)
  importedLocalAt = stateResult.data?.imported_local_at ?? null

  let week: DayPlan[] = []
  if (weekResult.data?.id) {
    const { data: days, error: daysError } = await c
      .from('daily_plans')
      .select('date,context,slots')
      .eq('weekly_plan_id', weekResult.data.id)
      .order('date')
    if (daysError) throw daysError
    week = (days ?? []).map((d) => ({
      date: d.date as string,
      context: d.context as DayPlan['context'],
      meals: slotsFromDb(d.slots),
    }))
  }

  if (week.length !== 7) {
    week = buildWeek(
      startOfWeek(new Date()),
      CATALOGO,
      (profile.default_context as DayPlan['context'] | undefined) ?? 'mixto',
      times,
      prefs,
    )
    await saveWeekRemote(uid, week, ws)
  }

  return {
    meals: CATALOGO,
    week,
    weekStart: ws,
    times,
    insulin,
    prefs,
    perfil,
    checks: auxChecks,
    extras: auxExtras,
    // Es estado de UI local, no de cuenta.
    ui: localRepo.cached()?.ui ?? { focus: false },
  }
}

const importLocalIfNeeded = async (uid: string) => {
  const c = client()
  const ws = currentWeekStart()
  const [state, plan] = await Promise.all([
    c.from('client_state').select('imported_local_at').eq('profile_id', uid).maybeSingle(),
    c.from('weekly_plans').select('id').eq('profile_id', uid).eq('week_start', ws).maybeSingle(),
  ])
  if (state.error) throw state.error
  if (plan.error) throw plan.error

  importedLocalAt = state.data?.imported_local_at ?? null
  if (importedLocalAt || plan.data) {
    if (!state.data) await saveAuxRemote(uid, { imported: true })
    return
  }

  const local = localRepo.cached()
  if (!local) {
    await saveAuxRemote(uid, { imported: true })
    return
  }

  auxChecks = local.checks
  auxExtras = local.extras
  await savePerfilRemote(uid, local.perfil)
  await savePrefsRemote(uid, local.prefs)
  await saveInsulinRemote(uid, local.insulin)
  await saveTimesRemote(uid, local.times)
  await saveWeekRemote(uid, local.week, local.weekStart)
  await saveAuxRemote(uid, { imported: true })
}

const executePending = async (uid: string, op: PendingOp) => {
  switch (op.kind) {
    case 'week': return saveWeekRemote(uid, op.week, op.weekStart)
    case 'day': return saveDayRemote(uid, op.day)
    case 'times': return saveTimesRemote(uid, op.times)
    case 'prefs': return savePrefsRemote(uid, op.prefs)
    case 'perfil': return savePerfilRemote(uid, op.perfil)
    case 'insulin': return saveInsulinRemote(uid, op.insulin)
    case 'check': {
      auxChecks = { ...auxChecks, [op.id]: op.done }
      return saveAuxRemote(uid)
    }
    case 'extras': {
      auxExtras = op.extras
      return saveAuxRemote(uid)
    }
  }
}

const replayPending = async (uid: string) => {
  const ops = readPending()
  if (!ops.length) return

  const remaining: PendingOp[] = []
  let blocked = false
  for (const op of ops) {
    if (blocked) {
      remaining.push(op)
      continue
    }
    try {
      await executePending(uid, op)
    } catch {
      // Conservamos esta y las siguientes en orden. La próxima apertura
      // vuelve a intentarlo; no borramos cambios sólo porque faltó señal.
      blocked = true
      remaining.push(op)
    }
  }
  writePending(remaining)
}

const withRemote = async (op: PendingOp, fn: (uid: string) => Promise<void>) => {
  try {
    const uid = activeUserId ?? await sessionUserId()
    if (!uid) return
    activeUserId = uid
    await fn(uid)
  } catch {
    enqueue(op)
  }
}

export const supabaseRepo: ViandaRepo = {
  kind: 'supabase',

  // Siempre hay arranque instantáneo. bootstrap reemplaza esto por cloud
  // cuando hay una sesión válida y red.
  cached: () => localRepo.cached(),

  bootstrap: async () => {
    if (!supabase) return localRepo.bootstrap()
    try {
      const uid = await sessionUserId()
      if (!uid) {
        activeUserId = null
        return localRepo.bootstrap()
      }
      activeUserId = uid
      await ensureProfile(uid)
      await importLocalIfNeeded(uid)
      await replayPending(uid)
      return await loadRemote(uid)
    } catch {
      // Sin señal o backend temporalmente caído: no pantalla blanca.
      return localRepo.bootstrap()
    }
  },

  saveWeek: async (week, weekStart) => {
    await localRepo.saveWeek(week, weekStart)
    await withRemote({ kind: 'week', week, weekStart }, (uid) => saveWeekRemote(uid, week, weekStart))
  },

  saveDay: async (day) => {
    await localRepo.saveDay(day)
    await withRemote({ kind: 'day', day }, (uid) => saveDayRemote(uid, day))
  },

  saveTimes: async (times) => {
    await localRepo.saveTimes(times)
    await withRemote({ kind: 'times', times }, (uid) => saveTimesRemote(uid, times))
  },

  savePrefs: async (prefs) => {
    await localRepo.savePrefs(prefs)
    await withRemote({ kind: 'prefs', prefs }, (uid) => savePrefsRemote(uid, prefs))
  },

  savePerfil: async (perfil) => {
    await localRepo.savePerfil(perfil)
    await withRemote({ kind: 'perfil', perfil }, (uid) => savePerfilRemote(uid, perfil))
  },

  saveInsulin: async (insulin) => {
    await localRepo.saveInsulin(insulin)
    await withRemote({ kind: 'insulin', insulin }, (uid) => saveInsulinRemote(uid, insulin))
  },

  setCheck: async (id, done) => {
    await localRepo.setCheck(id, done)
    auxChecks = { ...auxChecks, [id]: done }
    await withRemote({ kind: 'check', id, done }, (uid) => saveAuxRemote(uid))
  },

  // El foco es deliberadamente sólo del dispositivo.
  saveUi: (ui) => localRepo.saveUi(ui),

  saveExtras: async (extras) => {
    await localRepo.saveExtras(extras)
    auxExtras = extras
    await withRemote({ kind: 'extras', extras }, (uid) => saveAuxRemote(uid))
  },
}
