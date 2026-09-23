export const MeasureScope = {
  DISTRICT: 'DISTRICT',
  CITY: 'CITY',
} as const

export type MeasureScope = (typeof MeasureScope)[keyof typeof MeasureScope]
