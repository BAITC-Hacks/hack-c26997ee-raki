import { useState } from 'react'
import MeasureCatalog from '../components/measures/MeasureCatalog'
import ScenarioPanel from '../components/scenario/ScenarioPanel'
import { MEASURES, PROJECT_RULES } from '../data'
import { MeasureScope, type Decision, type Measure, type ScenarioRequest } from '../types'
import { validateScenario } from '../validation/scenario'
import '../styles/simulator.css'

function SimulatorPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const selectedMeasureIds = new Set(decisions.map(({ measureId }) => measureId))
  const validationErrors = validateScenario(decisions)

  function handleSelect(measure: Measure) {
    setDecisions((current) => {
      if (
        current.length >= PROJECT_RULES.requiredDecisions ||
        current.some((decision) => decision.measureId === measure.id)
      ) return current

      return [...current, { measureId: measure.id, districtId: null }]
    })
  }

  function handleDistrictChange(measureId: string, districtId: string | null) {
    setDecisions((current) => current.map((decision) => {
      if (decision.measureId !== measureId) return decision
      const measure = MEASURES.find((item) => item.id === measureId)
      if (measure?.scope !== MeasureScope.DISTRICT) return decision
      return { ...decision, districtId }
    }))
  }

  function handleRemove(measureId: string) {
    setDecisions((current) => current.filter((decision) => decision.measureId !== measureId))
  }

  function handleRun() {
    if (validateScenario(decisions).length > 0) return
    const request: ScenarioRequest = { decisions: decisions.map((decision) => ({ ...decision })) }
    console.info('ScenarioRequest:', request)
  }

  return (
    <main className="simulator-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="dashboard-brand" aria-label="Аким на 5 часов">
            <span className="dashboard-brand__mark" aria-hidden="true">А</span>
            <span>Аким на 5 часов</span>
          </div>
          <span className="dashboard-header__tag">Городской симулятор</span>
        </header>

        <section className="dashboard-intro" aria-labelledby="page-title">
          <div className="dashboard-intro__copy">
            <span className="section-eyebrow">УПРАВЛЕНИЕ ГОРОДОМ</span>
            <h1 id="page-title">Аким на 5 часов</h1>
            <p>Изучите официальные мероприятия и соберите план улучшений для города.</p>
          </div>
          <div className="dashboard-intro__accent" aria-hidden="true">
            <span>А</span>
          </div>
        </section>

        <div className="overview-grid" aria-label="Параметры сценария">
          <div className="overview-card">
            <span className="overview-card__label">Доступный бюджет</span>
            <strong className="overview-card__value">{PROJECT_RULES.budget}</strong>
            <span className="overview-card__hint">Лимит для одного сценария</span>
          </div>
          <div className="overview-card">
            <span className="overview-card__label">Необходимо решений</span>
            <strong className="overview-card__value">{PROJECT_RULES.requiredDecisions}</strong>
            <span className="overview-card__hint">Мероприятия из каталога</span>
          </div>
        </div>

        <div className="workspace-grid">
          <MeasureCatalog
            selectedMeasureIds={selectedMeasureIds}
            selectionLimitReached={decisions.length >= PROJECT_RULES.requiredDecisions}
            onSelect={handleSelect}
          />
          <ScenarioPanel
            decisions={decisions}
            errors={validationErrors}
            onDistrictChange={handleDistrictChange}
            onRemove={handleRemove}
            onRun={handleRun}
          />
        </div>
      </div>
    </main>
  )
}

export default SimulatorPage
