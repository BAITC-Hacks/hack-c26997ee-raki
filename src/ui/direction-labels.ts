import { Direction } from '../types'
import type { Direction as DirectionValue } from '../types'

export const DIRECTION_LABELS: Record<DirectionValue, string> = {
  [Direction.TRANSPORT]: 'Транспорт',
  [Direction.ECOLOGY]: 'Экология',
  [Direction.SOCIAL]: 'Соцсфера',
  [Direction.SAFETY]: 'Безопасность',
  [Direction.SERVICES]: 'Сервисы',
}
