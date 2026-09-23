import { DISTRICTS } from './districts'
import { INDICATORS } from './indicators'
import { MEASURES } from './measures'

export { DISTRICTS } from './districts'
export { INDICATORS } from './indicators'
export type { IndicatorCode, IndicatorMetadata } from './indicators'
export { INCOMPATIBILITIES, PROJECT_RULES, SYNERGIES } from './project-rules'
export type {
  IncompatibilityMetadata,
  ProjectRules,
  SynergyMetadata,
} from './project-rules'
export { MEASURES } from './measures'

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

  if (errors.length > 0) {
    throw new Error(`Проверка датасета не пройдена:\n- ${errors.join('\n- ')}`)
  }
}

if (import.meta.env.DEV) {
  assertDatasetSanity()
}
