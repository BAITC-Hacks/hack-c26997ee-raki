import { useState } from 'react'
import MeasureCatalog from '../components/measures/MeasureCatalog'
import { PROJECT_RULES } from '../data'
import type { Measure } from '../types'
import '../styles/simulator.css'

function SimulatorPage() {
  const [lastViewedMeasure, setLastViewedMeasure] = useState<Measure | null>(null)

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

        <MeasureCatalog onSelect={setLastViewedMeasure} />
      </div>

      {lastViewedMeasure && (
        <div className="measure-notice" role="status">
          <span className="measure-notice__dot" aria-hidden="true" />
          <span>Вы рассматриваете: <strong>{lastViewedMeasure.name}</strong></span>
          <button
            type="button"
            className="measure-notice__close"
            aria-label="Закрыть сообщение"
            onClick={() => setLastViewedMeasure(null)}
          >
            ×
          </button>
        </div>
      )}
    </main>
  )
}

export default SimulatorPage
