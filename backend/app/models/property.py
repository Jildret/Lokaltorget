import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    postal_code = Column(String, nullable=True)
    area = Column(String, nullable=True)  # område/stadsdel, t.ex. "Centrum"
    size_sqm = Column(Numeric, nullable=False)
    monthly_rent = Column(Numeric, nullable=False)
    property_type = Column(String, nullable=False, index=True)  # t.ex. "butik", "kontor"
    available_from = Column(Date, nullable=True)
    status = Column(String, nullable=False, default="active")  # active/inactive/rented
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)