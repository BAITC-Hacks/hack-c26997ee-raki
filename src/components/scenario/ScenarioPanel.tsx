import DistrictSelector from '../district/DistrictSelector'
import { PROJECT_RULES } from '../../data'
import { MeasureScope, type Decision } from '../../types'
import { DIRECTION_LABELS } from '../../ui/direction-labels'
import { findSelectedMeasure } from '../../validation/scenario'
import BudgetMeter from './BudgetMeter'
import ValidationErrors from './ValidationErrors'

interface ScenarioPanelProps {
  decisions: readonly Decision[]
  errors: readonly string[]
  onDistrictChange: (measureId: string, districtId: string | null) => void
  onRemove: (measureId: string) => void
  onRun: () => void
}

function ScenarioPanel({
  decisions,
  errors,
  onDistrictChange,
  onRemove,
  onRun,
}: ScenarioPanelProps) {
  return (
    <aside className="scenario-panel" aria-labelledby="scenario-title">
      <div className="scenario-panel__heading">
        <span className="section-eyebrow">ВАШ ПЛАН</span>
        <h2 id="scenario-title">Ваш сценарий</h2>
        <p>
          <strong>{decisions.length}</strong> / {PROJECT_RULES.requiredDecisions} решений
        </p>
      </div>

      <BudgetMeter decisions={decisions} />

      <div className="scenario-panel__selection">
        <h3>Выбранные меры</h3>
        {decisions.length === 0 ? (
          <p className="scenario-panel__empty">Пока ничего не выбрано. Добавьте меру из каталога.</p>
        ) : (
          <ol className="selected-measures">
            {decisions.map((decision) => {
              const measure = findSelectedMeasure(decision)
              if (!measure) return null

              return (
                <li key={decision.measureId} className="selected-measure">
                  <div className="selected-measure__topline">
                    <span className="selected-measure__id">{measure.id}</span>
                    <button
                      type="button"
                      className="selected-measure__remove"
                      aria-label={`Удалить ${measure.name}`}
                      onClick={() => onRemove(measure.id)}
                    >
                      ×
                    </button>
                  </div>
                  <h4>{measure.name}</h4>
                  <div className="selected-measure__meta">
                    <span className={`direction-badge direction-badge--${measure.direction.toLowerCase()}`}>
                      {DIRECTION_LABELS[measure.direction]}
                    </span>
                    <span className="selected-measure__cost">Стоимость {measure.cost}</span>
                  </div>
                  {measure.scope === MeasureScope.DISTRICT ? (
                    <DistrictSelector
                      id={`district-${measure.id}`}
                      value={decision.districtId}
                      onChange={(districtId) => onDistrictChange(measure.id, districtId)}
                    />
                  ) : (
                    <p className="selected-measure__city">Весь город</p>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </div>

      <ValidationErrors errors={errors} />

      <button
        type="button"
        className="scenario-panel__run"
        disabled={errors.length > 0}
        onClick={onRun}
      >
        Запустить симуляцию
        <span aria-hidden="true">→</span>
      </button>
    </aside>
  )
}

export default ScenarioPanel
