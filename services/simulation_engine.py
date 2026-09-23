from services.models import Decision
from services.data_loader import (
    load_districts,
    load_measures,
    load_scoring
)

from services.validator import validate
from services.effect_calculator import calculate_effects
from services.synergy_calculator import calculate_synergies
from services.score_calculator import (
    calculate_score,
    find_critical_indicators
)

from copy import deepcopy


districts_data = load_districts()
measures_data = load_measures()
scoring_data = load_scoring()


MEASURES = {
    measure["id"]: measure
    for measure in measures_data["measures"]
}

BUDGET = measures_data["budget"]

BASE_SCORE = scoring_data["baseline"]["score"]

def simulate_indicators(decisions: list[Decision]) -> dict:
    result = deepcopy(districts_data)

    normal_effects = calculate_effects(decisions)

    synergy_result = calculate_synergies(decisions)
    synergy_effects = synergy_result["effects"]

    for district in result["districts"]:
        district_id = district["id"]

        for indicator_id, base_value in district["indicators"].items():

            normal_delta = normal_effects.get(
                district_id, {}
            ).get(
                indicator_id, 0
            )

            synergy_delta = synergy_effects.get(
                district_id, {}
            ).get(
                indicator_id, 0
            )

            new_value = (
                base_value
                + normal_delta
                + synergy_delta
            )

            new_value = max(
                0,
                min(100, new_value)
            )

            district["indicators"][indicator_id] = new_value

    return {
        "districts": result["districts"],
        "normal_effects": normal_effects,
        "synergies": synergy_result["triggered"]
    }


def simulate(decisions: list[Decision]) -> dict:
    try:
        validation = validate(decisions)

    except ValueError as error:
        return {
            "valid": False,
            "errors": [str(error)],
            "incompatibilities": []
        }

    simulation = simulate_indicators(decisions)

    districts_after = simulation["districts"]
    districts_before = districts_data["districts"]

    score_result = calculate_score(districts_after)

    critical_before = find_critical_indicators(
        districts_before
    )

    critical_after = score_result["critical_indicators"]

    formatted_decisions = []

    for decision in decisions:
        measure = MEASURES[decision.measure_id]

        formatted_decisions.append({
            "measure_id": decision.measure_id,
            "district_id": decision.district_id,
            "cost": measure["cost"]
        })

    before_by_id = {
        district["id"]: district
        for district in districts_before
    }

    formatted_districts = []

    for district in districts_after:
        district_id = district["id"]

        formatted_districts.append({
            "district_id": district_id,
            "indicators_before":
                before_by_id[district_id]["indicators"],
            "indicators_after":
                district["indicators"]
        })

    formatted_synergies = []

    for synergy in simulation["synergies"]:
        formatted_synergies.append({
            "measure_ids": synergy["measure_ids"],
            "district_id": synergy["district_id"],
            "bonus": synergy["bonus"]
        })

    warnings = []

    if validation["remaining_budget"] <= 5:
        warnings.append(
            f"Остаток бюджета составляет "
            f"{validation['remaining_budget']} единиц."
        )

    final_score = score_result["final_score"]

    return {
        "valid": True,
        "errors": [],

        "budget": {
            "limit": BUDGET,
            "total_cost": validation["total_cost"],
            "remaining": validation["remaining_budget"]
        },

        "score": {
            "base": round(BASE_SCORE, 2),
            "final": round(final_score, 2),
            "delta": round(final_score - BASE_SCORE, 2)
        },

        "critical_indicators": {
            "before_count": len(critical_before),
            "after_count": len(critical_after),
            "before": critical_before,
            "after": critical_after
        },

        "decisions": formatted_decisions,
        "districts": formatted_districts,
        "synergies": formatted_synergies,

        "incompatibilities": [],
        "warnings": warnings
    }