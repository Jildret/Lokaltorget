import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=True)
    contact_information = Column(String, nullable=True)
    message = Column(String, nullable=True)
    status = Column(String, nullable=False, default="new")  # Ny/Kontaktad/Visning/Förhandling/Vunnen/Förlorad
    created_at = Column(DateTime, default=datetime.utcnow)