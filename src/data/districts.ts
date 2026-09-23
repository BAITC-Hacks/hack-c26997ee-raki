import districtsData from '../../data/districts.json'
import type { District } from '../types'

export interface IndicatorScale {
  min: number
  max: number
  higherIsBetter: boolean
  note: string
}

export const INDICATOR_SCALE: IndicatorScale = districtsData.scale
export const DISTRICTS: District[] = districtsData.districts
