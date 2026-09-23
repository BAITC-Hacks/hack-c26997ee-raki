from services.models import Decision
from services.simulation_engine import simulate

decisions = [
    Decision("M7", "nura"),
    Decision("M8", "nura"),
    Decision("M10", "nura"),
    Decision("M12"),
    Decision("M5", "saryarka")
]

result = simulate(decisions)
print(result)