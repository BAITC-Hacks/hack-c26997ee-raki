from numbers import Real
from typing import Any

from app.ai.schemas import AIAnalysis


def _format_number(value: Real) -> str:
    return f"{value:g}"


def _unique(items: list[str]) -> list[str]:
    return list(dict.fromkeys(items))


def generate_fallback_analysis(result: dict[str, Any]) -> AIAnalysis:
    """Build a deterministic analysis using only values present in ``result``."""
    budget = result["budget"]
    score = result["score"]
    critical = result["critical_indicators"]

    limit = budget["limit"]
    total_cost = budget["total_cost"]
    remaining = budget["remaining"]
    final_score = score["final"]
    delta = score["delta"]
    before_count = critical["before_count"]
    after_count = critical["after_count"]
    synergies = result.get("synergies") or []
    incompatibilities = result.get("incompatibilities") or []
    warnings = result.get("warnings") or []

    if after_count < before_count:
        critical_change = (
            f"Количество критических показателей уменьшилось с "
            f"{before_count} до {after_count}."
        )
    elif after_count > before_count:
        critical_change = (
            f"Количество критических показателей увеличилось с "
            f"{before_count} до {after_count}."
        )
    else:
        critical_change = (
            f"Количество критических показателей не изменилось: "
            f"{before_count} до и после сценария."
        )

    delta_text = _format_number(delta)
    if delta > 0:
        delta_text = f"+{delta_text}"

    summary = (
        f"Итоговый Score составил {_format_number(final_score)} и изменился на "
        f"{delta_text}. {critical_change} Использовано {_format_number(total_cost)} "
        f"из {_format_number(limit)} единиц бюджета, остаток — "
        f"{_format_number(remaining)}."
    )

    strengths: list[str] = []
    if delta > 0:
        strengths.append(f"Score вырос на +{_format_number(delta)}.")
    if after_count < before_count:
        strengths.append(
            f"Количество критических показателей уменьшилось с "
            f"{before_count} до {after_count}."
        )
    if synergies:
        strengths.append(f"В сценарии найдено синергий: {len(synergies)}.")
    if not strengths:
        strengths.append(
            "Сценарий успешно рассчитан и может быть доработан на основе выявленных рисков."
        )

    risks: list[str] = []
    if delta <= 0:
        risks.append("Итоговый Score не вырос.")
    if after_count > 0:
        risks.append(
            f"После сценария остались критические показатели: {after_count}."
        )
    if remaining <= limit * 0.1:
        risks.append(
            f"Остаток бюджета мал: {_format_number(remaining)} из "
            f"{_format_number(limit)} единиц."
        )
    for incompatibility in incompatibilities:
        if isinstance(incompatibility, dict):
            description = incompatibility.get("description")
            if isinstance(description, str) and description:
                risks.append(description)
    risks.extend(warning for warning in warnings if isinstance(warning, str) and warning)
    risks = _unique(risks)

    tradeoffs: list[str] = []
    if total_cost > limit * 0.8:
        tradeoffs.append(
            "Улучшение показателей потребовало значительной части доступного бюджета."
        )
    if remaining > limit * 0.2:
        tradeoffs.append("Часть доступного бюджета не была использована.")
    if incompatibilities:
        tradeoffs.append("Некоторые меры ограничивают совместное применение.")
    if not tradeoffs:
        tradeoffs.append("Явные компромиссы по заданным правилам не выявлены.")

    recommendations: list[str] = []
    if after_count > 0:
        recommendations.append(
            "Направить следующие решения на устранение оставшихся критических показателей."
        )
    if delta <= 0:
        recommendations.append(
            "Пересмотреть набор выбранных мер и их распределение по районам."
        )
    if remaining > 0:
        recommendations.append(
            "Рассмотреть использование оставшегося бюджета для улучшения проблемных показателей."
        )
    if incompatibilities:
        recommendations.append("Заменить или перераспределить несовместимые меры.")
    if not risks:
        recommendations.append(
            "Сохранить сценарий как один из успешных вариантов для сравнения в leaderboard."
        )
    elif not recommendations:
        recommendations.append("Учесть выявленные риски при доработке сценария.")

    return AIAnalysis(
        summary=summary,
        strengths=_unique(strengths),
        risks=risks,
        tradeoffs=_unique(tradeoffs),
        recommendations=_unique(recommendations),
        source="fallback",
    )
