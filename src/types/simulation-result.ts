export interface DistrictSimulationResult {
  districtId: string
  beforeIndicators: Record<string, number>
  afterIndicators: Record<string, number>
}

export interface AppliedSynergy {
  measureIds: string[]
  districtId: string | null
  bonus: Record<string, number>
}

export interface SimulationFailure {
  valid: false
  errors: string[]
}

export interface SimulationSuccess {
  valid: true
  errors: string[]
  totalCost: number
  remainingBudget: number
  baseScore: number
  finalScore: number
  scoreDelta: number
  criticalBeforeCount: number
  criticalAfterCount: number
  districts: DistrictSimulationResult[]
  synergies: AppliedSynergy[]
  warnings: string[]
}

export type SimulationResult = SimulationSuccess | SimulationFailure
