import districtsData from '../../data/districts.json'
import measuresData from '../../data/measures.json'
import scoringData from '../../data/scoring.json'

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

export type SynergyMetadata = (typeof measuresData.synergies)[number]
export type IncompatibilityMetadata = (typeof measuresData.incompatibilities)[number]

export interface ScoringMetadata {
  indicatorWeights: typeof scoringData.indicatorWeights
  directionWeights: typeof scoringData.directionWeights
  criticalThreshold: number
  criticalPenaltyPerPair: number
  scoreFormula: typeof scoringData.scoreFormula
  calculation: typeof scoringData.calculation
  validationRules: readonly string[]
  baseline: typeof scoringData.baseline
  exampleScenario: typeof scoringData.exampleScenario
}

export const SCORING_METADATA: ScoringMetadata = scoringData

const maxPerDirectionRule = scoringData.validationRules.find((rule) =>
  rule.startsWith('Не более '),
)
const maxMeasuresPerDirection = Number(maxPerDirectionRule?.match(/\d+/u)?.[0])

if (!Number.isInteger(maxMeasuresPerDirection)) {
  throw new Error('Не удалось прочитать ограничение мероприятий на направление из scoring.json.')
}

export const PROJECT_RULES: ProjectRules = {
  budget: measuresData.budget,
  requiredDecisions: measuresData.requiredMeasureCount,
  maxMeasuresPerDirection,
  simulationHorizon: measuresData.simulationHorizonQuarters,
  indicatorMin: districtsData.scale.min,
  indicatorMax: districtsData.scale.max,
  criticalThreshold: scoringData.criticalThreshold,
  baseScore: scoringData.baseline.score,
}

export const DIRECTION_WEIGHTS = scoringData.directionWeights
