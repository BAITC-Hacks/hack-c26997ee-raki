from dataclasses import dataclass
from typing import Annotated, Any

from fastapi import Depends, Header, HTTPException, status
from .supabase import get_supabase, get_user_supabase


@dataclass(frozen=True)
class AuthContext:
    user: Any
    client: Any


def get_current_user(authorization: Annotated[str | None, Header()] = None) -> AuthContext:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")

    try:
        response = get_supabase().auth.get_user(token)
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from error

    if not response.user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return AuthContext(user=response.user, client=get_user_supabase(token))


CurrentUser = Annotated[AuthContext, Depends(get_current_user)]
