import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class SpaceRequest(Base):
    __tablename__ = "space_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    description = Column(String, nullable=True)
    city = Column(String, nullable=False, index=True)
    area = Column(String, nullable=True)
    min_size = Column(Numeric, nullable=True)
    max_size = Column(Numeric, nullable=True)
    max_rent = Column(Numeric, nullable=True)
    desired_from = Column(Date, nullable=True)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)