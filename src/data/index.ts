import { DISTRICTS } from './districts'
import { INDICATORS } from './indicators'
import { INCOMPATIBILITIES, MEASURES, SYNERGIES } from './measures'

export { DISTRICTS } from './districts'
export { INDICATOR_SCALE } from './districts'
export type { IndicatorScale } from './districts'
export { INDICATORS } from './indicators'
export type { IndicatorCode, IndicatorMetadata } from './indicators'
export { INCOMPATIBILITIES, MEASURES, SYNERGIES } from './measures'
export { DIRECTION_WEIGHTS, PROJECT_RULES, SCORING_METADATA } from './project-rules'
export type {
  IncompatibilityMetadata,
  ProjectRules,
  ScoringMetadata,
  SynergyMetadata,
} from './project-rules'

function assertDatasetSanity(): void {
  const districtIds = DISTRICTS.map(({ id }) => id)
  const measureIds = MEASURES.map(({ id }) => id)
  const populationShareTotal = DISTRICTS.reduce(
    (total, district) => total + district.populationShare,
    0,
  )
  const indicatorWeightTotal = Object.values(INDICATORS).reduce(
    (total, indicator) => total + indicator.weight,
    0,
  )
  const indicatorIds = Object.keys(INDICATORS)
  const synergyMeasureIds = SYNERGIES.flatMap(({ measures }) => measures)
  const incompatibilityMeasureIds = INCOMPATIBILITIES.flatMap(({ measures }) => measures)

  const errors: string[] = []

  if (DISTRICTS.length !== 5) errors.push(`Ожидалось 5 районов, получено ${DISTRICTS.length}.`)
  if (MEASURES.length !== 14) errors.push(`Ожидалось 14 мероприятий, получено ${MEASURES.length}.`)
  if (Math.abs(populationShareTotal - 1) > Number.EPSILON * 10) {
    errors.push(`Сумма долей населения должна быть 1, получено ${populationShareTotal}.`)
  }
  if (Math.abs(indicatorWeightTotal - 1) > Number.EPSILON * 10) {
    errors.push(`Сумма весов показателей должна быть 1, получено ${indicatorWeightTotal}.`)
  }
  if (new Set(districtIds).size !== districtIds.length) errors.push('ID районов должны быть уникальны.')
  if (new Set(measureIds).size !== measureIds.length) errors.push('ID мероприятий должны быть уникальны.')
  if (indicatorIds.length !== 10) errors.push(`Ожидалось 10 показателей, получено ${indicatorIds.length}.`)
  if (Object.values(INDICATORS).some(({ meaning, weight }) => !meaning || !Number.isFinite(weight))) {
    errors.push('У каждого показателя должны быть официальное описание и вес из JSON.')
  }
  if ([...synergyMeasureIds, ...incompatibilityMeasureIds].some((id) => !measureIds.includes(id))) {
    errors.push('Синергии и несовместимости должны ссылаться на существующие мероприятия.')
  }

  if (errors.length > 0) {
    throw new Error(`Проверка датасета не пройдена:\n- ${errors.join('\n- ')}`)
  }
}

if (import.meta.env.DEV) {
  assertDatasetSanity()
}
