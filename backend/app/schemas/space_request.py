from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
import uuid

class SpaceRequestCreate(BaseModel):
    description: Optional[str] = None
    city: str
    area: Optional[str] = None
    min_size: Optional[float] = None
    max_size: Optional[float] = None
    max_rent: Optional[float] = None
    desired_from: Optional[date] = None

class SpaceRequestResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    description: Optional[str]
    city: str
    area: Optional[str]
    min_size: Optional[float]
    max_size: Optional[float]
    max_rent: Optional[float]
    desired_from: Optional[date]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True