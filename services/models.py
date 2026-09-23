from dataclasses import dataclass
from typing import Optional


@dataclass
class Decision:
    measure_id: str
    district_id: Optional[str] = None
