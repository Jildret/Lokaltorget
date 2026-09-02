from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class LeadCreate(BaseModel):
    property_id: uuid.UUID
    name: Optional[str] = None
    contact_information: Optional[str] = None
    message: Optional[str] = None

class LeadResponse(BaseModel):
    id: uuid.UUID
    property_id: uuid.UUID
    user_id: uuid.UUID
    name: Optional[str]
    contact_information: Optional[str]
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True