from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class MatchCreate(BaseModel):
    property_id: uuid.UUID
    request_id: uuid.UUID
    score: Optional[int] = None
    reason: Optional[str] = None

class MatchResponse(BaseModel):
    id: uuid.UUID
    property_id: uuid.UUID
    request_id: uuid.UUID
    score: Optional[int]
    source: str
    reason: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class MatchStatusUpdate(BaseModel):
    status: str