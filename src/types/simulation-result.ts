import type { Indicators } from './indicators'

export interface DistrictSimulationResult {
  districtId: string
  districtName: string
  beforeIndicators: Indicators
  afterIndicators: Indicators
  indicatorDeltas: Indicators
  beforeScore: number
  afterScore: number
  scoreDelta: number
}

export interface AIAnalysis {
  summary: string
  strengths: string[]
  risks: string[]
  tradeoffs: string[]
  recommendations: string[]
}

export interface SimulationResult {
  totalCost: number
  remainingBudget: number
  baseScore: number
  finalScore: number
  scoreDelta: number
  criticalCount: number
  weakestDistrictId: string
  districts: DistrictSimulationResult[]
  appliedSynergies: string[]
  aiAnalysis: AIAnalysis
}
