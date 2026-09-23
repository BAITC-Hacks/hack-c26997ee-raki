from services.data_loader import load_measures
from services.models import Decision


measures_data = load_measures()

MEASURES = {
    measure["id"]: measure
    for measure in measures_data["measures"]
}

BUDGET = measures_data["budget"]
REQUIRED_COUNT = measures_data["requiredMeasureCount"]

def validate_count(decisions: list[Decision]):
    if len(decisions) != REQUIRED_COUNT:
        raise ValueError(
            f"Exactly {REQUIRED_COUNT} decisions are required."
        )

def validate_duplicates(decisions: list[Decision]):
    ids = [decision.measure_id for decision in decisions]

    if len(ids) != len(set(ids)):
        raise ValueError("Measures cannot be selected more than once.")

def validate_budget(decisions: list[Decision]):
    total_cost = 0

    for decision in decisions:
        measure = MEASURES[decision.measure_id]
        total_cost += measure["cost"]

    if total_cost > BUDGET:
        raise ValueError(
            f"Budget exceeded: {total_cost}/{BUDGET}"
        )

    return total_cost

def validate(decisions: list[Decision]):
    validate_count(decisions)
    validate_duplicates(decisions)

    total_cost = validate_budget(decisions)

    return {
        "valid": True,
        "total_cost": total_cost,
        "remaining_budget": BUDGET - total_cost
    }