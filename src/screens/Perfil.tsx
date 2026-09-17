import { useEffect, useState } from 'react'
import { Card, TituloSeccion } from '../components/base'
import { CuentaSheet } from '../components/Cuenta'
import { useSession } from '../lib/auth'
import { DIABETES_LABEL, type DiabetesType } from '../lib/types'
import type { Vianda } from '../lib/store'
import {
  PROVINCIAS,
  defaultPurchaseLocation,
  loadPurchaseLocation,
  provinceByCode,
  purchaseLocationLabel,
  savePurchaseLocation,
  type PurchaseLocation,
} from '../lib/zonas'

const diabetesOpciones: DiabetesType[] = [
  'tipo-1',
  'tipo-2',
  'gestacional',
  'prediabetes',
  'sin-diabetes',
  'prefiero-no-decir',
]

export function Perfil({ app }: { app: Vianda }) {
  const cuenta = useSession()
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const [zona, setZona] = useState<PurchaseLocation>(defaultPurchaseLocation)
  const [zonaEstado, setZonaEstado] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    let alive = true
    void loadPurchaseLocation().then((next) => {
      if (alive) setZona(next)
    })
    return () => {
      alive = false
    }
  }, [])

  const persistirZona = async (next: PurchaseLocation) => {
    setZona(next)
    setZonaEstado('saving')
    try {
      await savePurchaseLocation(next)
      setZonaEstado('saved')
    } catch {
      setZonaEstado('error')
    }
  }

  const cambiarProvincia = (provinceCode: string) => {
    const province = provinceByCode(provinceCode)
    if (!province) return
    void persistirZona({
      provinceCode: province.code,
      provinceName: province.name,
      locality: undefined,
    })
  }

  const cambiarNombre = (nombre: string) => app.setPerfil({ ...app.perfil, nombre })
  const cambiarCarbos = () => app.setPerfil({ ...app.perfil, contarCarbos: !app.perfil.contarCarbos })
  const cambiarDiabetes = (diabetes: DiabetesType | null) =>
    app.setPerfil({ ...app.perfil, diabetes })

  const province = provinceByCode(zona.provinceCode)

  return (
    <div className="mx-auto max-w-md px-5 pb-28">
      <header className="v-safe-top pt-6 pb-5">
        <h1 className="t-title text-ink">Perfil</h1>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
          Tus datos, tus horarios y la cuenta que mantiene todo sincronizado.
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
        <TituloSeccion>Zona de compra</TituloSeccion>
        <Card>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            La usamos sólo para estimar precios. No es tu domicilio y no necesitamos GPS.
          </p>

          <label className="mt-4 block">
            <span className="v-label-sm text-ink-faint">Provincia</span>
            <select
              value={zona.provinceCode}
              onChange={(e) => cambiarProvincia(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink outline-none focus:border-accent"
            >
              {PROVINCIAS.map((p) => (
                <option key={p.code} value={p.code}>{p.name}</option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="v-label-sm text-ink-faint">Ciudad o localidad · opcional</span>
            <input
              value={zona.locality ?? ''}
              onChange={(e) => setZona({ ...zona, locality: e.target.value })}
              onBlur={() => void persistirZona({ ...zona, locality: zona.locality?.trim() || undefined })}
              placeholder={zona.provinceCode === 'AR-Q' ? 'Ej. Neuquén capital' : 'Ej. Rosario, Lanús, Córdoba capital'}
              className="mt-2 w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-[16px] text-ink outline-none focus:border-accent"
            />
          </label>

          <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
            Precios para {purchaseLocationLabel(zona)}. Si no hay suficiente dato local,
            usamos {province?.regionName ?? 'la región'} y después una referencia nacional,
            siempre aclarando el nivel de precisión.
          </p>
          {zonaEstado === 'error' && (
            <p className="mt-2 text-[13px] text-red-600">
              La zona quedó guardada en este dispositivo, pero no se pudo sincronizar ahora.
            </p>
          )}
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
            <p className="v-label-sm text-ink-faint">Diabetes</p>
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

      <CuentaSheet open={cuentaAbierta} onClose={() => setCuentaAbierta(false)} cuenta={cuenta} />
    </div>
  )
}
