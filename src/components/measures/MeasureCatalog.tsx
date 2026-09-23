import { useState } from 'react'
import { MEASURES } from '../../data'
import type { Direction, Measure } from '../../types'
import DirectionFilter from './DirectionFilter'
import MeasureCard from './MeasureCard'

interface MeasureCatalogProps {
  onSelect: (measure: Measure) => void
}

function MeasureCatalog({ onSelect }: MeasureCatalogProps) {
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null)
  const visibleMeasures = selectedDirection
    ? MEASURES.filter((measure) => measure.direction === selectedDirection)
    : MEASURES

  return (
    <section className="catalog-section" aria-labelledby="catalog-title">
      <div className="catalog-section__heading">
        <div>
          <span className="section-eyebrow">КАТАЛОГ МЕР</span>
          <h2 id="catalog-title">Городские инициативы</h2>
          <p>Изучите стоимость, сроки и влияние каждой меры перед выбором сценария.</p>
        </div>
        <div className="catalog-count" aria-live="polite">
          <strong>{visibleMeasures.length}</strong>
          <span>из {MEASURES.length} мер</span>
        </div>
      </div>

      <DirectionFilter
        selectedDirection={selectedDirection}
        onChange={setSelectedDirection}
      />

      <div className="measure-grid">
        {visibleMeasures.map((measure) => (
          <MeasureCard key={measure.id} measure={measure} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

export default MeasureCatalog
