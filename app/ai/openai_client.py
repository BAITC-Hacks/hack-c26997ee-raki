import os

from openai import AsyncOpenAI


def get_openai_client() -> AsyncOpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    return AsyncOpenAI(
        api_key=api_key,
        timeout=20.0,
        max_retries=1,
    )


def get_openai_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-5-mini")
