import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    request_id = Column(UUID(as_uuid=True), ForeignKey("space_requests.id"), nullable=False)
    score = Column(Integer, nullable=True)  # 0–100
    source = Column(String, nullable=False, default="manual")  # manual / rule_based / ai
    reason = Column(String, nullable=True)
    status = Column(String, nullable=False, default="new")  # Ny/Kontaktad/Intresserad/osv.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)