import { supabase } from './supabase'

export interface ProvinceOption {
  code: string
  name: string
  regionCode: string
  regionName: string
}

export interface PurchaseLocation {
  provinceCode: string
  provinceName: string
  locality?: string
}

const LOCAL_KEY = 'vianda.purchase-location.v1'

export const PROVINCIAS: ProvinceOption[] = [
  { code: 'AR-C', name: 'Ciudad Autónoma de Buenos Aires', regionCode: 'AR-REG-AMBA', regionName: 'AMBA' },
  { code: 'AR-B', name: 'Buenos Aires', regionCode: 'AR-REG-PAMPEANA', regionName: 'Región Pampeana' },
  { code: 'AR-K', name: 'Catamarca', regionCode: 'AR-REG-NOA', regionName: 'Noroeste' },
  { code: 'AR-H', name: 'Chaco', regionCode: 'AR-REG-NEA', regionName: 'Noreste' },
  { code: 'AR-U', name: 'Chubut', regionCode: 'AR-REG-PATAGONIA', regionName: 'Patagonia' },
  { code: 'AR-X', name: 'Córdoba', regionCode: 'AR-REG-CENTRO', regionName: 'Centro' },
  { code: 'AR-W', name: 'Corrientes', regionCode: 'AR-REG-NEA', regionName: 'Noreste' },
  { code: 'AR-E', name: 'Entre Ríos', regionCode: 'AR-REG-CENTRO', regionName: 'Centro' },
  { code: 'AR-P', name: 'Formosa', regionCode: 'AR-REG-NEA', regionName: 'Noreste' },
  { code: 'AR-Y', name: 'Jujuy', regionCode: 'AR-REG-NOA', regionName: 'Noroeste' },
  { code: 'AR-L', name: 'La Pampa', regionCode: 'AR-REG-PAMPEANA', regionName: 'Región Pampeana' },
  { code: 'AR-F', name: 'La Rioja', regionCode: 'AR-REG-NOA', regionName: 'Noroeste' },
  { code: 'AR-M', name: 'Mendoza', regionCode: 'AR-REG-CUYO', regionName: 'Cuyo' },
  { code: 'AR-N', name: 'Misiones', regionCode: 'AR-REG-NEA', regionName: 'Noreste' },
  { code: 'AR-Q', name: 'Neuquén', regionCode: 'AR-REG-PATAGONIA', regionName: 'Patagonia' },
  { code: 'AR-R', name: 'Río Negro', regionCode: 'AR-REG-PATAGONIA', regionName: 'Patagonia' },
  { code: 'AR-A', name: 'Salta', regionCode: 'AR-REG-NOA', regionName: 'Noroeste' },
  { code: 'AR-J', name: 'San Juan', regionCode: 'AR-REG-CUYO', regionName: 'Cuyo' },
  { code: 'AR-D', name: 'San Luis', regionCode: 'AR-REG-CUYO', regionName: 'Cuyo' },
  { code: 'AR-Z', name: 'Santa Cruz', regionCode: 'AR-REG-PATAGONIA', regionName: 'Patagonia' },
  { code: 'AR-S', name: 'Santa Fe', regionCode: 'AR-REG-CENTRO', regionName: 'Centro' },
  { code: 'AR-G', name: 'Santiago del Estero', regionCode: 'AR-REG-NOA', regionName: 'Noroeste' },
  { code: 'AR-V', name: 'Tierra del Fuego', regionCode: 'AR-REG-PATAGONIA', regionName: 'Patagonia' },
  { code: 'AR-T', name: 'Tucumán', regionCode: 'AR-REG-NOA', regionName: 'Noroeste' },
]

export const provinceByCode = (code?: string) => PROVINCIAS.find((p) => p.code === code)

export const defaultPurchaseLocation: PurchaseLocation = {
  provinceCode: 'AR-B',
  provinceName: 'Buenos Aires',
}

const readLocal = (): PurchaseLocation => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? 'null') as PurchaseLocation | null
    if (raw?.provinceCode && raw?.provinceName) return raw
  } catch {
    // Un valor local roto no debe bloquear la app.
  }
  return defaultPurchaseLocation
}

const writeLocal = (location: PurchaseLocation) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(location))
  } catch {
    // Sigue funcionando aunque el navegador no deje persistir.
  }
}

export async function loadPurchaseLocation(): Promise<PurchaseLocation> {
  const local = readLocal()
  if (!supabase) return local

  const { data: sessionData } = await supabase.auth.getSession()
  const uid = sessionData.session?.user.id
  if (!uid) return local

  const { data, error } = await supabase
    .from('purchase_locations')
    .select('province_code,province_name,locality')
    .eq('profile_id', uid)
    .maybeSingle()

  if (error || !data) return local

  const location: PurchaseLocation = {
    provinceCode: data.province_code,
    provinceName: data.province_name,
    locality: data.locality ?? undefined,
  }
  writeLocal(location)
  return location
}

export async function savePurchaseLocation(location: PurchaseLocation): Promise<void> {
  writeLocal(location)
  if (!supabase) return

  const { data: sessionData } = await supabase.auth.getSession()
  const uid = sessionData.session?.user.id
  if (!uid) return

  const { error } = await supabase.from('purchase_locations').upsert({
    profile_id: uid,
    province_code: location.provinceCode,
    province_name: location.provinceName,
    locality: location.locality?.trim() || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'profile_id' })

  if (error) throw error
}

/**
 * Orden de respaldo de precios. La app nunca finge una precisión que no tiene:
 * localidad/provincia primero, después región y por último referencia nacional.
 * AMBA queda como fallback adicional para CABA y Buenos Aires.
 */
export function priceRegionChain(location: PurchaseLocation): string[] {
  const province = provinceByCode(location.provinceCode)
  const regions: string[] = [location.provinceCode]

  if (location.provinceCode === 'AR-C' || location.provinceCode === 'AR-B') {
    regions.push('AR-BA-AMBA')
  }
  if (province?.regionCode) regions.push(province.regionCode)
  regions.push('AR-NATIONAL')

  return [...new Set(regions)]
}

export function purchaseLocationLabel(location: PurchaseLocation): string {
  return location.locality?.trim()
    ? `${location.locality.trim()}, ${location.provinceName}`
    : location.provinceName
}
