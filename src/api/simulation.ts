import type { ScenarioRequest, SimulationResult, SimulationSuccess } from '../types'
import { ApiError, postJson } from './client'
import type {
  BackendSimulationRequest,
  BackendSimulationResponse,
  BackendSimulationSuccess,
} from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'number')
}

function isCriticalIndicator(value: unknown): boolean {
  return isRecord(value) &&
    typeof value.district_id === 'string' &&
    typeof value.indicator_id === 'string' &&
    typeof value.value === 'number'
}

function isDecision(value: unknown): boolean {
  return isRecord(value) &&
    typeof value.measure_id === 'string' &&
    (typeof value.district_id === 'string' || value.district_id === null) &&
    typeof value.cost === 'number'
}

function isDistrict(value: unknown): boolean {
  return isRecord(value) &&
    typeof value.district_id === 'string' &&
    isNumberRecord(value.indicators_before) &&
    isNumberRecord(value.indicators_after)
}

function isSynergy(value: unknown): boolean {
  return isRecord(value) &&
    isStringArray(value.measure_ids) &&
    (typeof value.district_id === 'string' || value.district_id === null) &&
    isNumberRecord(value.bonus)
}

function isBackendResponse(value: unknown): value is BackendSimulationResponse {
  if (!isRecord(value) || typeof value.valid !== 'boolean' || !isStringArray(value.errors)) return false
  if (!value.valid) return Array.isArray(value.incompatibilities)

  return isRecord(value.budget) &&
    typeof value.budget.limit === 'number' &&
    typeof value.budget.total_cost === 'number' &&
    typeof value.budget.remaining === 'number' &&
    isRecord(value.score) &&
    typeof value.score.base === 'number' &&
    typeof value.score.final === 'number' &&
    typeof value.score.delta === 'number' &&
    isRecord(value.critical_indicators) &&
    typeof value.critical_indicators.before_count === 'number' &&
    typeof value.critical_indicators.after_count === 'number' &&
    Array.isArray(value.critical_indicators.before) &&
    value.critical_indicators.before.every(isCriticalIndicator) &&
    Array.isArray(value.critical_indicators.after) &&
    value.critical_indicators.after.every(isCriticalIndicator) &&
    Array.isArray(value.decisions) &&
    value.decisions.every(isDecision) &&
    Array.isArray(value.districts) &&
    value.districts.every(isDistrict) &&
    Array.isArray(value.synergies) &&
    value.synergies.every(isSynergy) &&
    Array.isArray(value.incompatibilities) &&
    isStringArray(value.warnings)
}

export function mapBackendSimulationResponse(response: BackendSimulationSuccess): SimulationSuccess {
  return {
    valid: true,
    errors: response.errors,
    totalCost: response.budget.total_cost,
    remainingBudget: response.budget.remaining,
    baseScore: response.score.base,
    finalScore: response.score.final,
    scoreDelta: response.score.delta,
    criticalBeforeCount: response.critical_indicators.before_count,
    criticalAfterCount: response.critical_indicators.after_count,
    districts: response.districts.map((district) => ({
      districtId: district.district_id,
      beforeIndicators: district.indicators_before,
      afterIndicators: district.indicators_after,
    })),
    synergies: response.synergies.map((synergy) => ({
      measureIds: synergy.measure_ids,
      districtId: synergy.district_id,
      bonus: synergy.bonus,
    })),
    warnings: response.warnings,
  }
}

export async function runSimulation(request: ScenarioRequest): Promise<SimulationResult> {
  const backendRequest: BackendSimulationRequest = {
    decisions: request.decisions.map(({ measureId, districtId }) => ({
      measure_id: measureId,
      district_id: districtId,
    })),
  }

  const response = await postJson('/api/simulate', backendRequest)
  if (!isBackendResponse(response)) {
    throw new ApiError('Сервер симуляции вернул ответ в неожиданном формате.')
  }
  if (!response.valid) return { valid: false, errors: response.errors }

  return mapBackendSimulationResponse(response)
}
