<<<<<<< HEAD
=======
from services.models import Decision
from services.validator import validate
from services.effect_calculator import calculate_effects
from services.synergy_calculator import calculate_synergies
>>>>>>> 16c9d22 (added calculators and added more constrains for the validator)

import asyncio
from app.ai.openai_client import get_openai_client, get_openai_model

<<<<<<< HEAD
async def main():
    client = get_openai_client()
    response = await client.responses.create(
        model=get_openai_model(),
        input="Ответь одним словом: работает"
    )
    print(response.output_text)

asyncio.run(main())
=======
decisions = [
    Decision("M1","nura"),
    Decision("M6"),
    Decision("M8","esil"),
    Decision("M7","almaty"),
    Decision("M4","almaty"),
]

dsds = [
    
    Decision("M7", "nura"),
    Decision("M8", "nura"),

]


# print(calculate_effects(dsds))
print(calculate_synergies(dsds))

try:
    result = validate(decisions)

    print("VALID")
    print(result)

except ValueError as error:
    print("INVALID")
    print(error)
>>>>>>> 16c9d22 (added calculators and added more constrains for the validator)
