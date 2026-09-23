from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .auth import CurrentUser
from .config import get_settings
from .supabase import get_supabase


class ScenarioCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    selections: list[dict[str, Any]] = Field(default_factory=list)
    score: float | None = Field(default=None, ge=0, le=100)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Fail early in deployment if the Supabase connection is missing.
    get_supabase()
    yield


settings = get_settings()
app = FastAPI(title="Akim API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "akim-api"}


@app.get("/api/me")
def me(user: CurrentUser) -> dict[str, Any]:
    return {"id": user.user.id, "email": user.user.email, "metadata": user.user.user_metadata}


@app.get("/api/districts")
def list_districts(user: CurrentUser) -> list[dict[str, Any]]:
    result = user.client.table("districts").select("*").order("name").execute()
    return result.data


@app.get("/api/measures")
def list_measures(user: CurrentUser, direction: str | None = Query(default=None)) -> list[dict[str, Any]]:
    query = user.client.table("measures").select("*").order("id")
    if direction:
        query = query.eq("direction", direction)
    return query.execute().data


@app.get("/api/scenarios")
def list_scenarios(user: CurrentUser) -> list[dict[str, Any]]:
    return user.client.table("scenarios").select("*").eq("user_id", user.user.id).order("created_at", desc=True).execute().data


@app.post("/api/scenarios", status_code=201)
def create_scenario(payload: ScenarioCreate, user: CurrentUser) -> dict[str, Any]:
    row = {"user_id": user.user.id, **payload.model_dump()}
    result = user.client.table("scenarios").insert(row).execute()
    if not result.data:
        raise HTTPException(status_code=502, detail="Supabase did not return the created scenario")
    return result.data[0]
