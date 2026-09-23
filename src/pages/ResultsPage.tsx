import { DISTRICTS, INDICATORS, type IndicatorCode } from '../data'
import type { SimulationSuccess } from '../types'
import '../styles/results.css'

interface ResultsPageProps {
  result: SimulationSuccess
  onBack: () => void
}

const districtNames = new Map(DISTRICTS.map(({ id, name }) => [id, name]))
const formatValue = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value)
const formatSigned = (value: number) => `${value > 0 ? '+' : ''}${formatValue(value)}`

function districtName(id: string | null): string {
  return id === null ? 'Весь город' : districtNames.get(id) ?? id
}

function ResultsPage({ result, onBack }: ResultsPageProps) {
  return (
    <main className="results-page">
      <div className="results-shell">
        <header className="results-header">
          <span className="dashboard-brand"><span className="dashboard-brand__mark">А</span>Аким на 5 часов</span>
          <button className="results-back" type="button" onClick={onBack}>← Изменить сценарий</button>
        </header>

        <section className="results-hero" aria-labelledby="results-title">
          <p className="section-eyebrow">РЕЗУЛЬТАТ СИМУЛЯЦИИ</p>
          <h1 id="results-title">Astana Quality of Life Score</h1>
          <div className="results-score">
            <span>{result.baseScore.toFixed(2)}</span>
            <span className="results-score__arrow" aria-label="изменился на">→</span>
            <strong>{result.finalScore.toFixed(2)}</strong>
          </div>
          <p className={`results-delta${result.scoreDelta < 0 ? ' results-delta--negative' : ''}`}>
            {result.scoreDelta > 0 ? '+' : ''}{result.scoreDelta.toFixed(2)}
          </p>
        </section>

        <section className="results-stats" aria-label="Сводка сценария">
          <div><span>Использовано бюджета</span><strong>{formatValue(result.totalCost)}</strong></div>
          <div><span>Остаток бюджета</span><strong>{formatValue(result.remainingBudget)}</strong></div>
          <div><span>Критические показатели</span><strong>{result.criticalBeforeCount} → {result.criticalAfterCount}</strong></div>
          <div><span>Сработавшие синергии</span><strong>{result.synergies.length}</strong></div>
        </section>

        <section className="results-districts" aria-labelledby="district-results-title">
          <div className="results-section-heading">
            <p className="section-eyebrow">ПО РАЙОНАМ</p>
            <h2 id="district-results-title">Изменение показателей</h2>
          </div>
          <div className="results-district-grid">
            {result.districts.map((district) => {
              const indicatorCodes = [...new Set([
                ...Object.keys(district.beforeIndicators),
                ...Object.keys(district.afterIndicators),
              ])]

              return (
                <article className="results-district" key={district.districtId}>
                  <h3>{districtName(district.districtId)}</h3>
                  <div className="results-table-wrap">
                    <table>
                      <thead><tr><th>Показатель</th><th>До</th><th>После</th><th>Разница</th></tr></thead>
                      <tbody>
                        {indicatorCodes.map((code) => {
                          const before = district.beforeIndicators[code]
                          const after = district.afterIndicators[code]
                          const delta = typeof before === 'number' && typeof after === 'number' ? after - before : null
                          const label = INDICATORS[code as IndicatorCode]?.name ?? code

                          return (
                            <tr key={code}>
                              <th scope="row"><span className="results-indicator-code">{code}</span>{label}</th>
                              <td>{typeof before === 'number' ? formatValue(before) : '—'}</td>
                              <td>{typeof after === 'number' ? formatValue(after) : '—'}</td>
                              <td className={delta === null ? '' : delta > 0 ? 'results-change--positive' : delta < 0 ? 'results-change--negative' : ''}>
                                {delta === null ? '—' : formatSigned(delta)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {result.synergies.length > 0 && (
          <section className="results-extras" aria-labelledby="synergies-title">
            <h2 id="synergies-title">Сработавшие синергии</h2>
            <ul>
              {result.synergies.map((synergy, index) => (
                <li key={`${synergy.measureIds.join('-')}-${synergy.districtId}-${index}`}>
                  <strong>{synergy.measureIds.join(' + ')}</strong>
                  <span>{districtName(synergy.districtId)}</span>
                  <span>{Object.entries(synergy.bonus).map(([code, value]) => `${code} ${formatSigned(value)}`).join(', ')}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.warnings.length > 0 && (
          <section className="results-extras results-warnings" aria-labelledby="warnings-title">
            <h2 id="warnings-title">Предупреждения</h2>
            <ul>{result.warnings.map((warning, index) => <li key={`${index}-${warning}`}>{warning}</li>)}</ul>
          </section>
        )}
      </div>
    </main>
  )
}

export default ResultsPage
