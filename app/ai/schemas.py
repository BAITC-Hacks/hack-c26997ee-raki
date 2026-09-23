from typing import Literal

from pydantic import BaseModel, ConfigDict


class AIAnalysis(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str
    strengths: list[str]
    risks: list[str]
    tradeoffs: list[str]
    recommendations: list[str]
    source: Literal["openai", "fallback"]
