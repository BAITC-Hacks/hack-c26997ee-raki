export interface BackendDecisionRequest {
  measure_id: string
  district_id: string | null
}

export interface BackendSimulationRequest {
  decisions: BackendDecisionRequest[]
}

interface BackendCriticalIndicator {
  district_id: string
  indicator_id: string
  value: number
}

export interface BackendSimulationSuccess {
  valid: true
  errors: string[]
  budget: {
    limit: number
    total_cost: number
    remaining: number
  }
  score: {
    base: number
    final: number
    delta: number
  }
  critical_indicators: {
    before_count: number
    after_count: number
    before: BackendCriticalIndicator[]
    after: BackendCriticalIndicator[]
  }
  decisions: Array<{ measure_id: string; district_id: string | null; cost: number }>
  districts: Array<{
    district_id: string
    indicators_before: Record<string, number>
    indicators_after: Record<string, number>
  }>
  synergies: Array<{
    measure_ids: string[]
    district_id: string | null
    bonus: Record<string, number>
  }>
  incompatibilities: unknown[]
  warnings: string[]
}

export interface BackendSimulationFailure {
  valid: false
  errors: string[]
  incompatibilities: unknown[]
}

export type BackendSimulationResponse = BackendSimulationSuccess | BackendSimulationFailure
