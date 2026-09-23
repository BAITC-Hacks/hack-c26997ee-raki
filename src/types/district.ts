import type { Indicators } from './indicators'

export interface District {
  id: string
  name: string
  populationShare: number
  indicators: Indicators
  baseScore: number
}
