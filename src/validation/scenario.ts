import { DISTRICTS, INCOMPATIBILITIES, MEASURES, PROJECT_RULES } from '../data'
import { MeasureScope, type Decision, type Direction, type Measure } from '../types'
import { DIRECTION_LABELS } from '../ui/direction-labels'

const measuresById = new Map(MEASURES.map((measure) => [measure.id, measure]))
const districtsById = new Map(DISTRICTS.map((district) => [district.id, district]))

export function calculateUsedBudget(decisions: readonly Decision[]): number {
  return decisions.reduce(
    (total, decision) => total + (measuresById.get(decision.measureId)?.cost ?? 0),
    0,
  )
}

export function validateScenario(decisions: readonly Decision[]): string[] {
  const errors: string[] = []
  const selectedIds = decisions.map(({ measureId }) => measureId)
  const directionCounts = new Map<Direction, number>()

  if (decisions.length < PROJECT_RULES.requiredDecisions) {
    errors.push(`Для запуска выберите ${PROJECT_RULES.requiredDecisions} мероприятий. Сейчас выбрано ${decisions.length}.`)
  } else if (decisions.length > PROJECT_RULES.requiredDecisions) {
    errors.push(`Нельзя выбрать более ${PROJECT_RULES.requiredDecisions} мероприятий.`)
  }

  if (new Set(selectedIds).size !== selectedIds.length) {
    errors.push('Одно мероприятие нельзя выбрать дважды.')
  }

  for (const decision of decisions) {
    const measure = measuresById.get(decision.measureId)
    if (!measure) {
      errors.push(`Мероприятие ${decision.measureId} отсутствует в каталоге.`)
      continue
    }

    directionCounts.set(measure.direction, (directionCounts.get(measure.direction) ?? 0) + 1)

    if (measure.scope === MeasureScope.DISTRICT) {
      if (!decision.districtId) {
        errors.push(`Для «${measure.name}» необходимо выбрать район.`)
      } else if (!districtsById.has(decision.districtId)) {
        errors.push(`Для «${measure.name}» выбран неизвестный район.`)
      }
    } else if (decision.districtId !== null) {
      errors.push(`Для «${measure.name}» район указывать нельзя.`)
    }
  }

  for (const [direction, count] of directionCounts) {
    if (count > PROJECT_RULES.maxMeasuresPerDirection) {
      errors.push(
        `Нельзя выбрать более ${PROJECT_RULES.maxMeasuresPerDirection} мер направления «${DIRECTION_LABELS[direction]}».`,
      )
    }
  }

  const usedBudget = calculateUsedBudget(decisions)
  if (usedBudget > PROJECT_RULES.budget) {
    errors.push(`Превышен бюджет: использовано ${usedBudget} из ${PROJECT_RULES.budget}.`)
  }

  for (const incompatibility of INCOMPATIBILITIES) {
    const [firstId, secondId] = incompatibility.measures
    const firstDecision = decisions.find((decision) => decision.measureId === firstId)
    const secondDecision = decisions.find((decision) => decision.measureId === secondId)
    if (!firstDecision || !secondDecision) continue

    if (incompatibility.districtScope === 'ANY') {
      errors.push(`${firstId} и ${secondId} несовместимы: ${incompatibility.reason}`)
    } else if (
      firstDecision.districtId &&
      firstDecision.districtId === secondDecision.districtId
    ) {
      const districtName = districtsById.get(firstDecision.districtId)?.name
      errors.push(
        `${firstId} и ${secondId} нельзя реализовать в одном районе${districtName ? ` «${districtName}»` : ''}.`,
      )
    }
  }

  return errors
}

export function findSelectedMeasure(decision: Decision): Measure | undefined {
  return measuresById.get(decision.measureId)
}
