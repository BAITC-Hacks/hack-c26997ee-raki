import unittest

from app.services.fallback_service import generate_fallback_analysis


class FallbackAnalysisTests(unittest.TestCase):
    def test_positive_scenario(self) -> None:
        result = {
            "valid": True,
            "budget": {"limit": 100, "total_cost": 95, "remaining": 5},
            "score": {"base": 52.56, "final": 56.54, "delta": 3.98},
            "critical_indicators": {"before_count": 2, "after_count": 0},
            "decisions": [{"measure_id": "M7", "district_id": "nura", "cost": 25}],
            "synergies": [],
            "incompatibilities": [],
            "warnings": [],
        }

        analysis = generate_fallback_analysis(result)

        self.assertEqual(analysis.source, "fallback")
        self.assertEqual(
            analysis.summary,
            "Итоговый Score составил 56.54 и изменился на +3.98. "
            "Количество критических показателей уменьшилось с 2 до 0. "
            "Использовано 95 из 100 единиц бюджета, остаток — 5.",
        )
        self.assertIn("Score вырос на +3.98.", analysis.strengths)
        self.assertIn("Остаток бюджета мал: 5 из 100 единиц.", analysis.risks)

    def test_scenario_with_multiple_risks(self) -> None:
        result = {
            "valid": True,
            "budget": {"limit": 100, "total_cost": 100, "remaining": 0},
            "score": {"base": 50, "final": 49, "delta": -1},
            "critical_indicators": {"before_count": 2, "after_count": 2},
            "decisions": [],
            "synergies": [],
            "incompatibilities": [],
            "warnings": ["Требуется дополнительная проверка."],
        }

        analysis = generate_fallback_analysis(result)

        self.assertIn("Итоговый Score не вырос.", analysis.risks)
        self.assertIn("После сценария остались критические показатели: 2.", analysis.risks)
        self.assertIn("Требуется дополнительная проверка.", analysis.risks)
        self.assertIn(
            "Пересмотреть набор выбранных мер и их распределение по районам.",
            analysis.recommendations,
        )

    def test_scenario_with_incompatibility(self) -> None:
        description = "Меры M1 и M2 нельзя применять совместно."
        result = {
            "valid": True,
            "budget": {"limit": 100, "total_cost": 70, "remaining": 30},
            "score": {"base": 50, "final": 52, "delta": 2},
            "critical_indicators": {"before_count": 1, "after_count": 0},
            "decisions": [],
            "synergies": [],
            "incompatibilities": [{"description": description}],
            "warnings": [],
        }

        analysis = generate_fallback_analysis(result)

        self.assertIn(description, analysis.risks)
        self.assertIn(
            "Некоторые меры ограничивают совместное применение.",
            analysis.tradeoffs,
        )
        self.assertIn(
            "Заменить или перераспределить несовместимые меры.",
            analysis.recommendations,
        )


if __name__ == "__main__":
    unittest.main()
