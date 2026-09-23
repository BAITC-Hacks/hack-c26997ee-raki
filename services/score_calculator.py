from services.data_loader import load_scoring


scoring_data = load_scoring()

INDICATOR_WEIGHTS = scoring_data["indicatorWeights"]
CRITICAL_THRESHOLD = scoring_data["criticalThreshold"]

CITY_AVERAGE_WEIGHT = scoring_data["scoreFormula"]["cityAverageWeight"]
WEAKEST_DISTRICT_WEIGHT = scoring_data["scoreFormula"]["weakestDistrictWeight"]
CRITICAL_PENALTY_WEIGHT = scoring_data["scoreFormula"]["criticalPenaltyWeight"]

def calculate_district_score(district: dict) -> float:
    score = 0

    for indicator_id, value in district["indicators"].items():
        weight = INDICATOR_WEIGHTS[indicator_id]

        score += value * weight

    return score

def find_critical_indicators(districts: list[dict]) -> list[dict]:
    critical = []

    for district in districts:
        for indicator_id, value in district["indicators"].items():

            if value < CRITICAL_THRESHOLD:
                critical.append({
                    "district_id": district["id"],
                    "indicator_id": indicator_id,
                    "value": value
                })

    return critical


def calculate_score(districts: list[dict]) -> dict:
    district_scores = {}

    city_average = 0

    for district in districts:
        district_score = calculate_district_score(district)

        district_scores[district["id"]] = district_score

        city_average += (
            district["populationShare"]
            * district_score
        )

    weakest_district_score = min(
        district_scores.values()
    )

    critical_indicators = find_critical_indicators(districts)

    critical_count = len(critical_indicators)

    final_score = (
        CITY_AVERAGE_WEIGHT * city_average
        + WEAKEST_DISTRICT_WEIGHT * weakest_district_score
        - CRITICAL_PENALTY_WEIGHT * critical_count
    )

    return {
        "district_scores": district_scores,
        "city_average": city_average,
        "weakest_district_score": weakest_district_score,
        "critical_count": critical_count,
        "critical_indicators": critical_indicators,
        "final_score": final_score
    }