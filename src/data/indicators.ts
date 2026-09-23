import districtsData from '../../data/districts.json'
import scoringData from '../../data/scoring.json'
import type { Direction, Indicators } from '../types'
import { normalizeDirection } from './normalization'

export type IndicatorCode = keyof Indicators

export interface IndicatorMetadata {
  code: IndicatorCode
  direction: Direction
  name: string
  meaning: string
  weight: number
}

export const INDICATORS = Object.fromEntries(
  districtsData.indicators.map(({ code, direction, name, meaning }) => [
    code,
    {
      code,
      direction: normalizeDirection(direction),
      name,
      meaning,
      weight: scoringData.indicatorWeights[code as IndicatorCode],
    },
  ]),
) as Record<IndicatorCode, IndicatorMetadata>
