SYSTEM_PROMPT = """Ты анализируешь уже рассчитанный сценарий управления городом.
Все числа рассчитаны Simulation Engine.
Не пересчитывай Score, бюджет или показатели.
Не придумывай новые числа, меры или эффекты.
Объясни результат, сильные стороны, риски, компромиссы и рекомендации.
Верни только валидный JSON строго в формате AIAnalysis."""


AI_ANALYSIS_JSON_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "summary": {"type": "string"},
        "strengths": {"type": "array", "items": {"type": "string"}},
        "risks": {"type": "array", "items": {"type": "string"}},
        "tradeoffs": {"type": "array", "items": {"type": "string"}},
        "recommendations": {"type": "array", "items": {"type": "string"}},
        "source": {"type": "string", "enum": ["openai"]},
    },
    "required": [
        "summary",
        "strengths",
        "risks",
        "tradeoffs",
        "recommendations",
        "source",
    ],
}
