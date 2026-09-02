from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.lead import Lead
from app.models.property import Property
from app.models.user import User
from app.schemas.lead import LeadCreate, LeadResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("", response_model=LeadResponse)
def create_lead(
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = db.query(Property).filter(Property.id == lead_in.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Lokalen hittades inte")

    new_lead = Lead(
        property_id=lead_in.property_id,
        user_id=current_user.id,
        name=lead_in.name,
        contact_information=lead_in.contact_information,
        message=lead_in.message,
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead

@router.get("/for-property/{property_id}", response_model=List[LeadResponse])
def list_leads_for_property(
    property_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Lokalen hittades inte")
    if prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Du äger inte denna lokal")

    return db.query(Lead).filter(Lead.property_id == property_id).order_by(Lead.created_at.desc()).all()