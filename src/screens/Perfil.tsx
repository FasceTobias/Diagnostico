import { useState } from 'react'
import { Card, TituloSeccion } from '../components/base'
import { CuentaSheet } from '../components/Cuenta'
import { PrivacySheet } from '../components/PrivacySheet'
import { useSession } from '../lib/auth'
import { exportLocalData, deleteLocalData } from '../lib/privacy'
import { DIABETES_LABEL, type DiabetesType } from '../lib/types'
import type { Vianda } from '../lib/store'

const diabetesOpciones: DiabetesType[] = [
  'tipo-1',
  'tipo-2',
  'gestacional',
  'lada',
  'mody-otro',
  'otro',
  'no-seguro',
  'prefiero-no-decir',
]

const esquemas = [
  ['basal', 'Basal / acción prolongada'],
  ['comidas', 'Rápida o ultrarrápida para comidas'],
  ['ambas', 'Basal y rápida para comidas'],
  ['bomba', 'Bomba de insulina'],
  ['otro', 'Otro esquema'],
  ['no-seguro', 'No estoy seguro/a'],
] as const

export function Perfil({ app }: { app: Vianda }) {
  const cuenta = useSession()
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const [privacidadAbierta, setPrivacidadAbierta] = useState(false)
  const [avisoDatos, setAvisoDatos] = useState('')

  const borrarDatos = () => {
    if (cuenta.estado !== 'sin-backend') return
    if (!window.confirm('¿Borrar tu perfil, semana, registros y compras de este dispositivo? Esta acción no se puede deshacer. Podés descargarlos antes.')) return
    try {
      deleteLocalData()
      window.location.reload()
    } catch {
      setAvisoDatos('No se pudieron borrar los datos. Revisá los permisos del navegador.')
    }
  }

  const cambiarNombre = (nombre: string) => app.setPerfil({ ...app.perfil, nombre })
  const cambiarCarbos = () => app.setPerfil({ ...app.perfil, contarCarbos: !app.perfil.contarCarbos })
  const cambiarDiabetes = (diabetes: DiabetesType | null) =>
    app.setPerfil({ ...app.perfil, diabetes })

  return (
    <div className="mx-auto max-w-md px-5 pb-28">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="t-title text-ink">Perfil</h1>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
          Tus datos, tus horarios y cómo cuidarlos.
        </p>
      </header>

      <section>
        <TituloSeccion>Cuenta</TituloSeccion>
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-ink">
                {cuenta.estado === 'dentro' ? 'Cuenta conectada' : 'Usar una cuenta'}
              </p>
              <p className="mt-1 truncate text-[14px] text-ink-soft">
                {cuenta.estado === 'dentro'
                  ? cuenta.email
                  : cuenta.estado === 'sin-backend'
                    ? 'La app sigue funcionando en este dispositivo.'
                    : 'Guardá tu semana y tus preferencias en la nube.'}
              </p>
            </div>
            {cuenta.estado !== 'sin-backend' && (
              <button
                onClick={() => setCuentaAbierta(true)}
                className="v-label shrink-0 rounded-xl border border-line px-3.5 py-2.5 font-semibold text-ink active:bg-surface-2"
              >
                {cuenta.estado === 'dentro' ? 'Ver' : 'Entrar'}
              </button>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <TituloSeccion>Preferencias de comida</TituloSeccion>
        <Card>
          <label className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
            <input type="checkbox" checked={app.prefs.reduceAddedSugar}
              onChange={(e) => app.setPrefs({ ...app.prefs, reduceAddedSugar: e.target.checked })}
              className="mt-1 size-5 shrink-0 accent-accent" />
            Preferir opciones con menos azúcar agregada al armar la semana
          </label>
          <p className="mt-2 text-[13px] text-ink-faint">No excluye alimentos. Podés cambiar cualquier comida del plan.</p>
        </Card>
      </section>

      <section className="mt-8">
        <TituloSeccion>Sobre vos</TituloSeccion>
        <Card>
          <label className="block">
            <span className="v-label-sm text-ink-faint">Cómo querés que te llamemos</span>
            <input
              value={app.perfil.nombre}
              onChange={(e) => cambiarNombre(e.target.value)}
              placeholder="Tu nombre"
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink outline-none focus:border-accent"
            />
          </label>

          <div className="mt-5 border-t border-line pt-5">
            <p className="v-label-sm text-ink-faint">Tipo de diabetes</p>
            <select
              value={app.perfil.diabetes ?? ''}
              onChange={(e) => cambiarDiabetes((e.target.value || null) as DiabetesType | null)}
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink outline-none focus:border-accent"
            >
              <option value="">Prefiero dejarlo vacío</option>
              {diabetesOpciones.map((d) => (
                <option key={d} value={d}>{DIABETES_LABEL[d]}</option>
              ))}
            </select>
          </div>

          <label className="mt-5 block border-t border-line pt-5">
            <span className="v-label-sm text-ink-faint">¿Usás insulina actualmente?</span>
            <select value={app.perfil.usaInsulina ?? ''}
              onChange={(e) => app.setPerfil({ ...app.perfil,
                usaInsulina: (e.target.value || null) as typeof app.perfil.usaInsulina,
                esquemaInsulina: e.target.value === 'si' ? app.perfil.esquemaInsulina : null,
              })}
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink">
              <option value="">Sin responder</option><option value="si">Sí</option>
              <option value="no">No</option><option value="prefiero">Prefiero no indicarlo</option>
            </select>
          </label>
          {app.perfil.usaInsulina === 'si' && <label className="mt-5 block">
            <span className="v-label-sm text-ink-faint">Esquema de insulina</span>
            <select value={app.perfil.esquemaInsulina ?? ''}
              onChange={(e) => app.setPerfil({ ...app.perfil, esquemaInsulina: (e.target.value || null) as typeof app.perfil.esquemaInsulina })}
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink">
              <option value="">Sin responder</option>
              {esquemas.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>}
          <label className="mt-5 block">
            <span className="v-label-sm text-ink-faint">¿Usás otra medicación para la diabetes?</span>
            <select value={app.perfil.medicacionAdicional ?? ''}
              onChange={(e) => app.setPerfil({ ...app.perfil, medicacionAdicional: (e.target.value || null) as typeof app.perfil.medicacionAdicional })}
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink">
              <option value="">Sin responder</option><option value="si">Sí</option>
              <option value="no">No</option><option value="prefiero">Prefiero no indicarlo</option>
            </select>
          </label>

          <button
            onClick={cambiarCarbos}
            className="mt-5 flex w-full items-center justify-between gap-4 border-t border-line pt-5 text-left"
          >
            <span>
              <span className="block text-[16px] font-medium text-ink">Mostrar carbohidratos</span>
              <span className="mt-1 block text-[14px] leading-relaxed text-ink-soft">
                Muestra los gramos de CHO junto a cada comida.
              </span>
            </span>
            <span
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${app.perfil.contarCarbos ? 'bg-accent' : 'bg-line'}`}
              aria-hidden
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${app.perfil.contarCarbos ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </span>
          </button>
        </Card>
      </section>

      <section className="mt-8">
        <TituloSeccion>Configuración inicial</TituloSeccion>
        <Card>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Podés volver a recorrer la presentación para cambiar datos básicos sin borrar tu semana.
          </p>
          <button
            onClick={() => app.setPerfil({ ...app.perfil, listo: false, paso: 0 })}
            className="v-label mt-4 min-h-[44px] w-full rounded-xl border border-line font-semibold text-ink active:bg-surface-2"
          >
            Volver al onboarding
          </button>
        </Card>
      </section>

      <section className="mt-8">
        <TituloSeccion>Privacidad y tus datos</TituloSeccion>
        <Card>
          <p className="text-[14px] leading-relaxed text-ink-soft">Tu planificación y los datos de salud que elegiste indicar se guardan en este navegador.</p>
          <button onClick={() => setPrivacidadAbierta(true)} className="mt-4 min-h-[44px] w-full rounded-xl border border-line px-4 text-left font-semibold text-ink">Cómo usa Vianda tus datos</button>
          <button onClick={() => { try { exportLocalData(); setAvisoDatos('Descarga iniciada. Guardá el archivo en un lugar privado.') } catch (error) { setAvisoDatos(error instanceof Error ? error.message : 'No se pudo descargar el archivo.') } }} className="mt-3 min-h-[44px] w-full rounded-xl border border-line px-4 text-left font-semibold text-ink">Descargar mis datos de este dispositivo</button>
          {cuenta.estado === 'sin-backend' && <button onClick={borrarDatos} className="mt-3 min-h-[44px] w-full rounded-xl border border-line px-4 text-left font-semibold text-ink">Borrar mis datos de este dispositivo</button>}
          {cuenta.estado !== 'sin-backend' && <p className="mt-3 text-[13px] text-ink-soft">Las cuentas conectadas necesitan un proceso de baja completo; el borrado local no eliminaría sus datos remotos.</p>}
          {avisoDatos && <p role="status" className="mt-3 text-[13px] text-ink-soft">{avisoDatos}</p>}
        </Card>
      </section>

      <CuentaSheet open={cuentaAbierta} onClose={() => setCuentaAbierta(false)} cuenta={cuenta} />
      <PrivacySheet open={privacidadAbierta} onClose={() => setPrivacidadAbierta(false)} />
    </div>
  )
}
