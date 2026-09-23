import { Direction, MeasureScope } from '../types'

const directionMap: Record<string, Direction> = {
  transport: Direction.TRANSPORT,
  ecology: Direction.ECOLOGY,
  social: Direction.SOCIAL,
  safety: Direction.SAFETY,
  services: Direction.SERVICES,
}

const scopeMap: Record<string, MeasureScope> = {
  district: MeasureScope.DISTRICT,
  city: MeasureScope.CITY,
}

export function normalizeDirection(value: string): Direction {
  const direction = directionMap[value]
  if (!direction) throw new Error(`Неизвестное направление в JSON: ${value}`)
  return direction
}

export function normalizeMeasureScope(value: string): MeasureScope {
  const scope = scopeMap[value]
  if (!scope) throw new Error(`Неизвестная область мероприятия в JSON: ${value}`)
  return scope
}
