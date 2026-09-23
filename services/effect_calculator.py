from services.models import Decision
from services.data_loader import load_measures, load_districts


measures_data = load_measures()
districts_data = load_districts()


MEASURES = {
    measure["id"]: measure
    for measure in measures_data["measures"]
}

DISTRICT_IDS = [
    district["id"]
    for district in districts_data["districts"]
]

HORIZON = measures_data["simulationHorizonQuarters"]


def calculate_effects(decisions: list[Decision]) -> dict:
    effects = {}

    for decision in decisions:
        measure = MEASURES[decision.measure_id]

        lag = measure["lagQuarters"]

        lag_factor = (HORIZON - lag) / HORIZON

        if measure["scope"] == "district":
            target_districts = [decision.district_id]
        else:
            target_districts = DISTRICT_IDS

        for district_id in target_districts:

            if district_id not in effects:
                effects[district_id] = {}

            for indicator_id, raw_effect in measure["effects"].items():

                adjusted_effect = raw_effect * lag_factor

                current_effect = effects[district_id].get(
                    indicator_id,
                    0
                )

                effects[district_id][indicator_id] = (
                    current_effect + adjusted_effect
                )

    return effects