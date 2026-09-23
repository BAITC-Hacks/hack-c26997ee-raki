
import asyncio
from app.ai.openai_client import get_openai_client, get_openai_model

async def main():
    client = get_openai_client()
    response = await client.responses.create(
        model=get_openai_model(),
        input="Ответь одним словом: работает"
    )
    print(response.output_text)

asyncio.run(main())