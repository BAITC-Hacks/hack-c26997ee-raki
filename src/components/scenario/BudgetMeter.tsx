import { PROJECT_RULES } from '../../data'
import type { Decision } from '../../types'
import { calculateUsedBudget } from '../../validation/scenario'

interface BudgetMeterProps {
  decisions: readonly Decision[]
}

function BudgetMeter({ decisions }: BudgetMeterProps) {
  const used = calculateUsedBudget(decisions)
  const budget = PROJECT_RULES.budget
  const remaining = budget - used
  const progress = budget > 0 ? Math.min((used / budget) * 100, 100) : 0
  const status = used > budget ? 'over' : used >= budget * 0.85 ? 'near' : 'normal'

  return (
    <div className={`budget-meter budget-meter--${status}`}>
      <div className="budget-meter__row">
        <span>Использовано</span>
        <strong>{used} <span>/ {budget}</span></strong>
      </div>
      <div
        className="budget-meter__track"
        role="progressbar"
        aria-label="Использованный бюджет"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={Math.min(used, budget)}
        aria-valuetext={`${used} из ${budget}`}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="budget-meter__row budget-meter__row--remaining">
        <span>Осталось</span>
        <strong>{remaining}</strong>
      </div>
    </div>
  )
}

export default BudgetMeter
