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
export const INCOMPATIBILITIES = measuresData.incompatibilities
