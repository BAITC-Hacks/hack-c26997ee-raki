import asyncio
import json
from typing import Any

from ..openai_client import get_openai_client, get_openai_model
from ..prompts import AI_ANALYSIS_JSON_SCHEMA, SYSTEM_PROMPT
from ..schemas import AIAnalysis
from backend.supabase import get_supabase
from .fallback_service import generate_fallback_analysis


async def generate_ai_analysis(result: dict[str, Any]) -> AIAnalysis:
    """Generate structured analysis and fall back without breaking simulation flow."""
    try:
        client = get_openai_client()
        response = await client.responses.create(
            model=get_openai_model(),
            instructions=SYSTEM_PROMPT,
            input=json.dumps(result, ensure_ascii=False),
            text={
                "format": {
                    "type": "json_schema",
                    "name": "ai_analysis",
                    "strict": True,
                    "schema": AI_ANALYSIS_JSON_SCHEMA,
                }
            },
        )
        analysis = AIAnalysis.model_validate_json(response.output_text)
        if analysis.source != "openai":
            raise ValueError("OpenAI response contains an invalid source")
        return analysis
    except Exception:
        return generate_fallback_analysis(result)


async def save_ai_analysis(scenario_id: int, analysis: AIAnalysis) -> None:
    """Save analysis text and lists in Supabase JSONB columns."""
    row = {
        "scenario_id": scenario_id,
        "summary": analysis.summary,
        "strengths": analysis.strengths,
        "risks": analysis.risks,
        "tradeoffs": analysis.tradeoffs,
        "recommendations": analysis.recommendations,
        "source": analysis.source,
    }
    def insert() -> None:
        get_supabase().table("ai_analyses").insert(row).execute()

    try:
        await asyncio.to_thread(insert)
    except Exception as error:
        raise RuntimeError(
            f"Failed to save AI analysis for scenario {scenario_id}: {error}"
        ) from error
