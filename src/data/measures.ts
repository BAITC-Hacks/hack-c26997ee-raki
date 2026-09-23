import measuresData from '../../data/measures.json'
import type { Measure } from '../types'
import { normalizeDirection, normalizeMeasureScope } from './normalization'

export const MEASURES: Measure[] = measuresData.measures.map(
  ({ lagQuarters, ...measure }) => ({
    ...measure,
    direction: normalizeDirection(measure.direction),
    scope: normalizeMeasureScope(measure.scope),
    lag: lagQuarters,
  }),
)

export const SYNERGIES = measuresData.synergies

export interface IncompatibilityMetadata {
  measures: string[]
  reason: string
  districtScope: 'ANY' | 'SAME'
}

function incompatibilityScope(reason: string): IncompatibilityMetadata['districtScope'] {
  if (reason.includes('в одном районе')) return 'SAME'
  if (reason.includes('в любом районе')) return 'ANY'
  throw new Error(`Неизвестная область несовместимости: ${reason}`)
}

export const INCOMPATIBILITIES: IncompatibilityMetadata[] = measuresData.incompatibilities.map(
  ({ measures, reason }) => ({ measures, reason, districtScope: incompatibilityScope(reason) }),
)
