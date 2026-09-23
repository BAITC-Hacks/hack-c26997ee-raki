import { Direction } from '../../types'
import type { Direction as DirectionValue } from '../../types'
import { DIRECTION_LABELS } from '../../ui/direction-labels'

interface DirectionFilterProps {
  selectedDirection: DirectionValue | null
  onChange: (direction: DirectionValue | null) => void
}

const directions = Object.values(Direction)

function DirectionFilter({ selectedDirection, onChange }: DirectionFilterProps) {
  return (
    <div className="direction-filter" role="group" aria-label="Фильтр по направлению">
      <button
        type="button"
        className="direction-filter__button"
        aria-pressed={selectedDirection === null}
        onClick={() => onChange(null)}
      >
        Все
      </button>
      {directions.map((direction) => (
        <button
          key={direction}
          type="button"
          className="direction-filter__button"
          aria-pressed={selectedDirection === direction}
          onClick={() => onChange(direction)}
        >
          {DIRECTION_LABELS[direction]}
        </button>
      ))}
    </div>
  )
}

export default DirectionFilter
