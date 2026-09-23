import type { Direction } from './direction'
import type { Indicators } from './indicators'
import type { MeasureScope } from './measure-scope'

export interface Measure {
  id: string
  name: string
  direction: Direction
  scope: MeasureScope
  cost: number
  lag: number
  effects: Partial<Indicators>
}
