import { useRef, useState } from 'react'
import { ApiError } from '../api/client'
import { runSimulation } from '../api/simulation'
import MeasureCatalog from '../components/measures/MeasureCatalog'
import ScenarioPanel from '../components/scenario/ScenarioPanel'
import { MEASURES, PROJECT_RULES } from '../data'
import { MeasureScope, type Decision, type Measure, type SimulationSuccess } from '../types'
import { validateScenario } from '../validation/scenario'
import ResultsPage from './ResultsPage'
import '../styles/simulator.css'

type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

function SimulatorPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [result, setResult] = useState<SimulationSuccess | null>(null)
  const [engineErrors, setEngineErrors] = useState<string[]>([])
  const [requestError, setRequestError] = useState<string | null>(null)
  const requestId = useRef(0)
  const selectedMeasureIds = new Set(decisions.map(({ measureId }) => measureId))
  const validationErrors = validateScenario(decisions)

  function invalidateResult() {
    requestId.current += 1
    setStatus('idle')
    setEngineErrors([])
    setRequestError(null)
  }

  function handleSelect(measure: Measure) {
    invalidateResult()
    setDecisions((current) => {
      if (
        current.length >= PROJECT_RULES.requiredDecisions ||
        current.some((decision) => decision.measureId === measure.id)
      ) return current

      return [...current, { measureId: measure.id, districtId: null }]
    })
  }

  function handleDistrictChange(measureId: string, districtId: string | null) {
    invalidateResult()
    setDecisions((current) => current.map((decision) => {
      if (decision.measureId !== measureId) return decision
      const measure = MEASURES.find((item) => item.id === measureId)
      if (measure?.scope !== MeasureScope.DISTRICT) return decision
      return { ...decision, districtId }
    }))
  }

  function handleRemove(measureId: string) {
    invalidateResult()
    setDecisions((current) => current.filter((decision) => decision.measureId !== measureId))
  }

  async function handleRun() {
    if (status === 'loading' || validateScenario(decisions).length > 0) return

    const currentRequestId = ++requestId.current
    setStatus('loading')
    setEngineErrors([])
    setRequestError(null)

    try {
      const response = await runSimulation({ decisions: decisions.map((decision) => ({ ...decision })) })
      if (requestId.current !== currentRequestId) return

      if (!response.valid) {
        setEngineErrors(response.errors)
        setStatus('error')
        return
      }

      setResult(response)
      setStatus('success')
    } catch (error) {
      if (requestId.current !== currentRequestId) return
      setRequestError(error instanceof ApiError
        ? error.message
        : 'Не удалось обработать ответ сервера симуляции. Повторите попытку.')
      setStatus('error')
    }
  }

  if (status === 'success' && result) {
    return <ResultsPage result={result} onBack={() => setStatus('idle')} />
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
            engineErrors={engineErrors}
            requestError={requestError}
            isLoading={status === 'loading'}
            onDistrictChange={handleDistrictChange}
            onRemove={handleRemove}
            onRun={() => void handleRun()}
          />
        </div>
      </div>
    </main>
  )
}

export default SimulatorPage
