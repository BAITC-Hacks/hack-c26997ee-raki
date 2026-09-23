from services.models import Decision
from services.validator import validate


decisions = [
    Decision("M10", "nura"),
    Decision("M2", "nura"),
    Decision("M3", "nura"),
    Decision("M4"),
    Decision("M8", "saryarka"),
]

try:
    result = validate(decisions)

    print("VALID")
    print(result)

except ValueError as error:
    print("INVALID")
    print(error)