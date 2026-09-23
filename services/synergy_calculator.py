from services.models import Decision
from services.data_loader import load_measures


measures_data = load_measures()

SYNERGIES = measures_data["synergies"]

def calculate_synergies(decisions: list[Decision]) -> dict:
    decisions_by_measure = {
        decision.measure_id: decision
        for decision in decisions
    }

    effects = {}
    triggered = []

    for synergy in SYNERGIES:
        first_id, second_id = synergy["measures"]

        if first_id not in decisions_by_measure:
            continue

        if second_id not in decisions_by_measure:
            continue

        first_decision = decisions_by_measure[first_id]
        second_decision = decisions_by_measure[second_id]

        applies_to = synergy["appliesTo"]

        if applies_to == "districtOfFirstMeasure":
            target_district = first_decision.district_id
        else:
            raise ValueError(
                f"Unknown synergy appliesTo type: {applies_to}"
            )

        if target_district not in effects:
            effects[target_district] = {}

        for indicator_id, bonus in synergy["bonus"].items():
            effects[target_district][indicator_id] = (
                effects[target_district].get(indicator_id, 0)
                + bonus
            )

        triggered.append({
            "measure_ids": [first_id, second_id],
            "district_id": target_district,
            "bonus": synergy["bonus"]
        })

    return {
        "effects": effects,
        "triggered": triggered
    }