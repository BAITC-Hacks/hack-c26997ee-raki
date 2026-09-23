from typing import Any

from ..schemas import AIAnalysis


def generate_fallback_analysis(result: dict[str, Any]) -> AIAnalysis:
    budget = result.get("budget") or {}
    score = result.get("score") or {}
    critical = result.get("critical_indicators") or {}
    decisions = result.get("decisions") or []

    total_cost = budget.get("total_cost", "не указан")
    remaining = budget.get("remaining", "не указан")
    delta = score.get("delta", "не указан")
    before = critical.get("before_count", "не указано")
    after = critical.get("after_count", "не указано")

    return AIAnalysis(
        summary=f"Сценарий содержит {len(decisions)} решений. Изменение итогового Score: {delta}.",
        strengths=[f"После сценария критических показателей: {after} (до сценария: {before})."],
        risks=[f"Общая стоимость решений: {total_cost}; остаток бюджета: {remaining}."],
        tradeoffs=["Распределение бюджета между выбранными решениями требует контроля."],
        recommendations=["Проверить фактическое выполнение решений и повторно оценить показатели после реализации."],
        source="fallback",
    )
