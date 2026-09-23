export const Direction = {
  TRANSPORT: 'TRANSPORT',
  ECOLOGY: 'ECOLOGY',
  SOCIAL: 'SOCIAL',
  SAFETY: 'SAFETY',
  SERVICES: 'SERVICES',
} as const

export type Direction = (typeof Direction)[keyof typeof Direction]
