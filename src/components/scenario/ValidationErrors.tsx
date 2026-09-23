interface ValidationErrorsProps {
  errors: readonly string[]
}

function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) {
    return <p className="scenario-valid" role="status">Сценарий готов к запуску.</p>
  }

  return (
    <div className="validation-errors" aria-live="polite">
      <span className="validation-errors__heading">Проверьте сценарий</span>
      <ul>
        {errors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}
      </ul>
    </div>
  )
}

export default ValidationErrors
