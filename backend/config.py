from functools import lru_cache
import os

from dotenv import load_dotenv
from pydantic import BaseModel, Field


class Settings(BaseModel):
    supabase_url: str = Field(validation_alias="SUPABASE_URL")
    supabase_key: str = Field(validation_alias="SUPABASE_ANON_KEY")
    frontend_url: str = Field(default="http://localhost:5173", validation_alias="FRONTEND_URL")


@lru_cache
def get_settings() -> Settings:
    load_dotenv()
    return Settings(
        SUPABASE_URL=os.getenv("SUPABASE_URL", ""),
        SUPABASE_ANON_KEY=os.getenv("SUPABASE_ANON_KEY", ""),
        FRONTEND_URL=os.getenv("FRONTEND_URL", "http://localhost:5173"),
    )
