import { DEFAULT_PERFIL, type DiabetesType, type Perfil } from './types'

const tipos = new Set<DiabetesType>([
  'tipo-1', 'tipo-2', 'gestacional', 'lada', 'mody-otro', 'otro',
  'no-seguro', 'prefiero-no-decir', 'prediabetes', 'sin-diabetes',
])

/** Conserva respuestas antiguas sin deducir un tratamiento a partir del tipo. */
export function normalizarPerfil(raw: Partial<Perfil> & { diabetes?: unknown }, insulinEnabled?: boolean): Perfil {
  const legacy = typeof raw.diabetes === 'string' ? raw.diabetes : ''
  const combinado = /^(?:tipo[-_ ]?2)[-_ ](?:con[-_ ]?)?insulina$/i.test(legacy)
  const tipo = combinado ? 'tipo-2' : legacy
  const diabetes = tipos.has(tipo as DiabetesType) ? tipo as DiabetesType : null
  const usaInsulina = raw.usaInsulina === 'si' || raw.usaInsulina === 'no' || raw.usaInsulina === 'prefiero'
    ? raw.usaInsulina : combinado ? 'si' : insulinEnabled === true ? 'si' : null
  return {
    ...DEFAULT_PERFIL,
    ...raw,
    diabetes,
    usaInsulina,
    esquemaInsulina: usaInsulina === 'si' ? raw.esquemaInsulina ?? null : null,
    medicacionAdicional: raw.medicacionAdicional ?? null,
    // Un onboarding anterior tenía seis pantallas con otro orden. Retomar
    // su índice como si fuera el nuevo saltearía preguntas de tratamiento.
    paso: !raw.listo && raw.usaInsulina === undefined && (raw.paso ?? 0) >= 2
      ? 2 : raw.paso ?? 0,
  }
}
