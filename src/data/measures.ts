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

export const INCOMPATIBILITIES: IncompatibilityMetadata[] = measuresData.incompatibilities.map(
  ({ measures, reason, type }) => ({
    measures,
    reason,
    districtScope: type === 'global' ? 'ANY' : 'SAME',
  }),
)
