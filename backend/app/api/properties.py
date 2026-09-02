from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.property import Property
from app.models.property_feature import PropertyFeature
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/properties", tags=["properties"])

@router.get("", response_model=List[PropertyResponse])
def list_properties(
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    min_size: Optional[float] = None,
    max_size: Optional[float] = None,
    max_rent: Optional[float] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Property).filter(Property.status == "active")
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_size:
        query = query.filter(Property.size_sqm >= min_size)
    if max_size:
        query = query.filter(Property.size_sqm <= max_size)
    if max_rent:
        query = query.filter(Property.monthly_rent <= max_rent)
    return query.order_by(Property.created_at.desc()).all()

@router.get("/mine/list", response_model=List[PropertyResponse])
def list_my_properties(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Property).filter(Property.owner_id == current_user.id).order_by(Property.created_at.desc()).all()

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: uuid.UUID, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Lokalen hittades inte")
    return prop

@router.post("", response_model=PropertyResponse)
def create_property(
    property_in: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_property = Property(
        owner_id=current_user.id,
        title=property_in.title,
        description=property_in.description,
        address=property_in.address,
        city=property_in.city,
        postal_code=property_in.postal_code,
        area=property_in.area,
        size_sqm=property_in.size_sqm,
        monthly_rent=property_in.monthly_rent,
        property_type=property_in.property_type,
        available_from=property_in.available_from,
    )
    db.add(new_property)
    db.commit()
    db.refresh(new_property)

    for feature_key in property_in.features:
        db.add(PropertyFeature(property_id=new_property.id, feature_key=feature_key))
    db.commit()

    return new_property

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: uuid.UUID,
    property_in: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Lokalen hittades inte")
    if prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Du äger inte denna lokal")

    for key, value in property_in.model_dump(exclude={"features"}).items():
        setattr(prop, key, value)
    db.commit()
    db.refresh(prop)
    return prop

@router.delete("/{property_id}")
def delete_property(
    property_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Lokalen hittades inte")
    if prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Du äger inte denna lokal")

    prop.status = "inactive"
    db.commit()
    return {"message": "Lokalen inaktiverad"}