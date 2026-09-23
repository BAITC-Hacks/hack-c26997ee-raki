from typing import Any

from .supabase import get_supabase


def save_simulation_result(team_id: str, result: dict[str, Any]) -> str:
    """Save a simulation result and its decisions in Supabase.

    The function assumes that ``scenarios`` and ``decisions`` already exist
    with the columns documented by the application schema.
    """
    if not team_id:
        raise ValueError("team_id is required")

    for field in ("budget", "score", "critical_indicators", "decisions"):
        if field not in result:
            raise ValueError(f"Simulation result is missing required field: {field}")

    budget = result["budget"]
    score = result["score"]
    critical_indicators = result["critical_indicators"]
    decisions = result["decisions"]

    if not isinstance(budget, dict) or not isinstance(score, dict):
        raise ValueError("budget and score must be JSON objects")
    if not isinstance(critical_indicators, dict):
        raise ValueError("critical_indicators must be a JSON object")
    if not isinstance(decisions, list):
        raise ValueError("decisions must be a JSON array")

    scenario_row = {
        "team_id": team_id,
        "total_cost": budget.get("total_cost"),
        "remaining_budget": budget.get("remaining"),
        "base_score": score.get("base"),
        "final_score": score.get("final"),
        "score_delta": score.get("delta"),
        "critical_before": critical_indicators.get("before_count"),
        "critical_after": critical_indicators.get("after_count"),
    }

    supabase = get_supabase()
    try:
        scenario_response = supabase.table("scenarios").insert(scenario_row).execute()
    except Exception as error:
        raise RuntimeError(f"Failed to save simulation scenario: {error}") from error

    if not scenario_response.data or not scenario_response.data[0].get("id"):
        raise RuntimeError("Supabase did not return the created scenario id")

    scenario_id = str(scenario_response.data[0]["id"])
    decision_rows = []
    for index, decision in enumerate(decisions):
        if not isinstance(decision, dict):
            raise ValueError(f"decisions[{index}] must be a JSON object")
        decision_rows.append(
            {
                "scenario_id": scenario_id,
                "measure_id": decision.get("measure_id"),
                "district_id": decision.get("district_id"),
                "cost": decision.get("cost"),
            }
        )

    if decision_rows:
        try:
            supabase.table("decisions").insert(decision_rows).execute()
        except Exception as error:
            raise RuntimeError(
                f"Failed to save decisions for scenario {scenario_id}: {error}"
            ) from error

    return scenario_id
