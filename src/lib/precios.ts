import { supabase } from './supabase'
import type { ShoppingGroup, ShoppingLine } from './domain'

export const DEFAULT_PRICE_REGION = 'AR-BA-AMBA'

export interface PriceReference {
  foodKey: string
  regionCode: string
  locality?: string
  currency: string
  minPrice: number
  medianPrice: number
  maxPrice: number
  purchaseUnit: string
  purchaseQty: number
  sourceName: string
  sourceUrl?: string
  observedOn: string
  validUntil?: string
  sampleSize?: number
  confidence: 'alta' | 'media' | 'estimada'
}

export interface LineEstimate {
  line: ShoppingLine
  min: number
  median: number
  max: number
  reference: PriceReference
}

export interface ShoppingEstimate {
  currency: string
  min: number
  median: number
  max: number
  pricedLines: number
  totalLines: number
  coverage: number
  latestObservedOn?: string
  lines: LineEstimate[]
}

type DbPriceReference = {
  food_key: string | null
  region_code: string
  locality: string | null
  currency: string
  min_price: number | string
  median_price: number | string
  max_price: number | string
  purchase_unit: string
  purchase_qty: number | string
  source_name: string
  source_url: string | null
  observed_on: string
  valid_until: string | null
  sample_size: number | null
  confidence: 'alta' | 'media' | 'estimada'
}

/**
 * Trae una sola referencia vigente por ingrediente, priorizando la más
 * reciente. Los precios son datos públicos: funciona también sin sesión.
 */
export async function loadFoodPrices(
  regionCode = DEFAULT_PRICE_REGION,
): Promise<Map<string, PriceReference>> {
  if (!supabase) return new Map()

  const { data, error } = await supabase
    .from('price_references')
    .select(
      'food_key,region_code,locality,currency,min_price,median_price,max_price,purchase_unit,purchase_qty,source_name,source_url,observed_on,valid_until,sample_size,confidence',
    )
    .eq('region_code', regionCode)
    .not('food_key', 'is', null)
    .order('observed_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) return new Map()

  const result = new Map<string, PriceReference>()
  for (const raw of data as DbPriceReference[]) {
    if (!raw.food_key || result.has(raw.food_key)) continue
    result.set(raw.food_key, {
      foodKey: raw.food_key,
      regionCode: raw.region_code,
      locality: raw.locality ?? undefined,
      currency: raw.currency,
      minPrice: Number(raw.min_price),
      medianPrice: Number(raw.median_price),
      maxPrice: Number(raw.max_price),
      purchaseUnit: raw.purchase_unit,
      purchaseQty: Number(raw.purchase_qty),
      sourceName: raw.source_name,
      sourceUrl: raw.source_url ?? undefined,
      observedOn: raw.observed_on,
      validUntil: raw.valid_until ?? undefined,
      sampleSize: raw.sample_size ?? undefined,
      confidence: raw.confidence,
    })
  }
  return result
}

const numericValue = (value: string) => Number(value.replace(/\./g, '').replace(',', '.'))

/** Convierte la cantidad visible de la lista a la unidad de la referencia. */
function amountInReferenceUnits(line: ShoppingLine, ref: PriceReference): number | null {
  const value = numericValue(line.value)
  if (!Number.isFinite(value) || value <= 0 || ref.purchaseQty <= 0) return null

  const lineUnit = line.unit || 'u'
  const refUnit = ref.purchaseUnit || 'u'

  let normalized = value
  if (lineUnit === refUnit) {
    // nada
  } else if (lineUnit === 'g' && refUnit === 'kg') {
    normalized = value / 1000
  } else if (lineUnit === 'kg' && refUnit === 'g') {
    normalized = value * 1000
  } else if (lineUnit === 'ml' && refUnit === 'l') {
    normalized = value / 1000
  } else if (lineUnit === 'l' && refUnit === 'ml') {
    normalized = value * 1000
  } else {
    return null
  }

  return normalized / ref.purchaseQty
}

export function estimateShopping(
  groups: ShoppingGroup[],
  prices: Map<string, PriceReference>,
): ShoppingEstimate {
  const all = groups.flatMap((g) => g.lines)
  const estimated: LineEstimate[] = []

  for (const line of all) {
    const ref = prices.get(line.item)
    if (!ref) continue
    const factor = amountInReferenceUnits(line, ref)
    if (factor == null) continue
    estimated.push({
      line,
      min: ref.minPrice * factor,
      median: ref.medianPrice * factor,
      max: ref.maxPrice * factor,
      reference: ref,
    })
  }

  const sum = (field: 'min' | 'median' | 'max') =>
    estimated.reduce((total, row) => total + row[field], 0)

  const latest = estimated
    .map((x) => x.reference.observedOn)
    .sort()
    .at(-1)

  return {
    currency: estimated[0]?.reference.currency ?? 'ARS',
    min: sum('min'),
    median: sum('median'),
    max: sum('max'),
    pricedLines: estimated.length,
    totalLines: all.length,
    coverage: all.length ? estimated.length / all.length : 0,
    latestObservedOn: latest,
    lines: estimated,
  }
}

export const money = (amount: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
