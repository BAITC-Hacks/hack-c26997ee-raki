export interface ProjectRules {
  budget: number
  requiredDecisions: number
  maxMeasuresPerDirection: number
  simulationHorizon: number
  indicatorMin: number
  indicatorMax: number
  criticalThreshold: number
  baseScore: number
}

export interface SynergyMetadata {
  measures: readonly [string, string]
}

export interface IncompatibilityMetadata {
  measures: readonly [string, string]
  districtScope: 'ANY' | 'SAME'
}

export const PROJECT_RULES: ProjectRules = {
  budget: 100,
  requiredDecisions: 5,
  maxMeasuresPerDirection: 2,
  simulationHorizon: 8,
  indicatorMin: 0,
  indicatorMax: 100,
  criticalThreshold: 40,
  baseScore: 52.56,
}

export const SYNERGIES: readonly SynergyMetadata[] = [
  { measures: ['M1', 'M2'] },
  { measures: ['M10', 'M12'] },
  { measures: ['M5', 'M6'] },
]

export const INCOMPATIBILITIES: readonly IncompatibilityMetadata[] = [
  { measures: ['M1', 'M3'], districtScope: 'ANY' },
  { measures: ['M4', 'M7'], districtScope: 'SAME' },
  { measures: ['M5', 'M13'], districtScope: 'SAME' },
]
