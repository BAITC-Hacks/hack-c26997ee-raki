import { MeasureScope, type Measure } from '../../types'
import { DIRECTION_LABELS } from './DirectionFilter'

interface MeasureCardProps {
  measure: Measure
  selected?: boolean
  onSelect: (measure: Measure) => void
}

function quarterLabel(value: number): string {
  const lastTwoDigits = value % 100
  const lastDigit = value % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'кварталов'
  if (lastDigit === 1) return 'квартал'
  if (lastDigit >= 2 && lastDigit <= 4) return 'квартала'
  return 'кварталов'
}

function MeasureCard({ measure, selected = false, onSelect }: MeasureCardProps) {
  const effects = Object.entries(measure.effects).filter(
    (entry): entry is [string, number] => typeof entry[1] === 'number',
  )

  return (
    <article className={`measure-card${selected ? ' measure-card--selected' : ''}`}>
      <div className="measure-card__topline">
        <span className="measure-card__id">{measure.id}</span>
        <span className={`direction-badge direction-badge--${measure.direction.toLowerCase()}`}>
          {DIRECTION_LABELS[measure.direction]}
        </span>
      </div>

      <h3 className="measure-card__title">{measure.name}</h3>

      <div className="measure-card__badges">
        <span className="measure-badge measure-badge--cost">Стоимость {measure.cost}</span>
        <span className="measure-badge">
          {measure.scope === MeasureScope.CITY ? 'Весь город' : 'Один район'}
        </span>
      </div>

      <div className="measure-card__details">
        <span className="measure-card__detail-label">Срок эффекта</span>
        <span>{measure.lag} {quarterLabel(measure.lag)}</span>
      </div>

      <div className="measure-card__effects">
        <span className="measure-card__detail-label">Влияние на показатели</span>
        <div className="measure-card__effect-list">
          {effects.map(([indicator, value]) => (
            <span key={indicator} className="effect-chip">
              <span className="effect-chip__code">{indicator}</span>
              <span className={value < 0 ? 'effect-chip__value effect-chip__value--negative' : 'effect-chip__value'}>
                {value > 0 ? `+${value}` : value}
              </span>
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="measure-card__button"
        aria-pressed={selected}
        onClick={() => onSelect(measure)}
      >
        {selected ? 'Выбрано' : 'Рассмотреть меру'}
        <span aria-hidden="true">↗</span>
      </button>
    </article>
  )
}

export default MeasureCard
