from services.data_loader import load_measures, load_districts
from services.models import Decision


measures_data = load_measures()
districts_data = load_districts()

MEASURES = {
    measure["id"]: measure
    for measure in measures_data["measures"]
}

DISTRICTS = {
    district["id"]
    for district in districts_data["districts"]
}

INCOMPATIBILITIES = measures_data["incompatibilities"]


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

def validate_direction_limit(decisions: list[Decision]):
    direction_counts = {}

    for decision in decisions:
        measure = MEASURES[decision.measure_id]
        direction = measure["direction"]

        direction_counts[direction] = direction_counts.get(direction, 0) + 1

        if direction_counts[direction] > 2:
            raise ValueError(
                f"Maximum 2 measures allowed for direction: {direction}"
            )

def validate_measure_exists(decisions: list[Decision]):
    for decision in decisions:
        if decision.measure_id not in MEASURES:
            raise ValueError(
                f"Unknown measure: {decision.measure_id}"
            )

def validate_scope_and_district(decisions: list[Decision]):
    for decision in decisions:
        measure = MEASURES[decision.measure_id]
        scope = measure["scope"]

        if scope == "district":
            if decision.district_id is None:
                raise ValueError(
                    f"{decision.measure_id} requires district_id."
                )

            if decision.district_id not in DISTRICTS:
                raise ValueError(
                    f"Unknown district: {decision.district_id}"
                )

        elif scope == "city":
            if decision.district_id is not None:
                raise ValueError(
                    f"{decision.measure_id} is city-wide and must not have district_id."
                )

def validate_incompatibilities(decisions: list[Decision]):
    decisions_by_measure = {
        decision.measure_id: decision
        for decision in decisions
    }

    for rule in INCOMPATIBILITIES:
        first_id, second_id = rule["measures"]

        if first_id not in decisions_by_measure:
            continue

        if second_id not in decisions_by_measure:
            continue

        first = decisions_by_measure[first_id]
        second = decisions_by_measure[second_id]

        first_measure = MEASURES[first_id]
        second_measure = MEASURES[second_id]

        rule_type = rule["type"]

        if rule_type == "global":
            raise ValueError(
                f"Incompatible measures: "
                f"{first_id} ({first_measure['name']}) and "
                f"{second_id} ({second_measure['name']}). "
                f"Reason: {rule['reason']}"
            )

        if rule_type == "sameDistrict":
            if first.district_id == second.district_id:
                raise ValueError(
                    f"Incompatible measures in district '{first.district_id}': "
                    f"{first_id} ({first_measure['name']}) and "
                    f"{second_id} ({second_measure['name']}). "
                    f"Reason: {rule['reason']}"
                )


def validate(decisions: list[Decision]):
    validate_count(decisions)
    validate_duplicates(decisions)
    validate_measure_exists(decisions)
    validate_scope_and_district(decisions)
    validate_direction_limit(decisions)
    validate_incompatibilities(decisions)

    total_cost = validate_budget(decisions)

    return {
        "valid": True,
        "total_cost": total_cost,
        "remaining_budget": BUDGET - total_cost
    }
