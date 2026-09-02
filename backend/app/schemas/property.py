from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
import uuid

class PropertyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    address: str
    city: str
    postal_code: Optional[str] = None
    area: Optional[str] = None
    size_sqm: float
    monthly_rent: float
    property_type: str
    available_from: Optional[date] = None
    features: List[str] = []  # t.ex. ["parkering", "skyltfönster"]

class PropertyResponse(BaseModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    title: str
    description: Optional[str]
    address: str
    city: str
    postal_code: Optional[str]
    area: Optional[str]
    size_sqm: float
    monthly_rent: float
    property_type: str
    available_from: Optional[date]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True