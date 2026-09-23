import { Direction, type Indicators } from '../types'

export type IndicatorCode = keyof Indicators

export interface IndicatorMetadata {
  code: IndicatorCode
  direction: Direction
  directionName: string
  name: string
  weight: number
}

export const INDICATORS: Record<IndicatorCode, IndicatorMetadata> = {
  T1: {
    code: 'T1',
    direction: Direction.TRANSPORT,
    directionName: 'Транспорт',
    name: 'Разгрузка дорог',
    weight: 0.1,
  },
  T2: {
    code: 'T2',
    direction: Direction.TRANSPORT,
    directionName: 'Транспорт',
    name: 'Доступность общественного транспорта',
    weight: 0.1,
  },
  E1: {
    code: 'E1',
    direction: Direction.ECOLOGY,
    directionName: 'Экология',
    name: 'Озеленение',
    weight: 0.09,
  },
  E2: {
    code: 'E2',
    direction: Direction.ECOLOGY,
    directionName: 'Экология',
    name: 'Качество воздуха',
    weight: 0.11,
  },
  S1: {
    code: 'S1',
    direction: Direction.SOCIAL,
    directionName: 'Соцсфера',
    name: 'Школы и детские сады',
    weight: 0.11,
  },
  S2: {
    code: 'S2',
    direction: Direction.SOCIAL,
    directionName: 'Соцсфера',
    name: 'Поликлиники и первичная медпомощь',
    weight: 0.11,
  },
  B1: {
    code: 'B1',
    direction: Direction.SAFETY,
    directionName: 'Безопасность',
    name: 'Безопасность улиц',
    weight: 0.09,
  },
  B2: {
    code: 'B2',
    direction: Direction.SAFETY,
    directionName: 'Безопасность',
    name: 'Безопасность дорожного движения',
    weight: 0.09,
  },
  C1: {
    code: 'C1',
    direction: Direction.SERVICES,
    directionName: 'Сервисы',
    name: 'Надёжность ЖКХ',
    weight: 0.1,
  },
  C2: {
    code: 'C2',
    direction: Direction.SERVICES,
    directionName: 'Сервисы',
    name: 'Скорость решения обращений жителей',
    weight: 0.1,
  },
}
