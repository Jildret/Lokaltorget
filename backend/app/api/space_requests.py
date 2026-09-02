from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.space_request import SpaceRequest
from app.models.user import User
from app.schemas.space_request import SpaceRequestCreate, SpaceRequestResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/space-requests", tags=["space-requests"])

@router.post("", response_model=SpaceRequestResponse)
def create_space_request(
    request_in: SpaceRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_request = SpaceRequest(
        user_id=current_user.id,
        description=request_in.description,
        city=request_in.city,
        area=request_in.area,
        min_size=request_in.min_size,
        max_size=request_in.max_size,
        max_rent=request_in.max_rent,
        desired_from=request_in.desired_from,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("", response_model=List[SpaceRequestResponse])
def list_space_requests(db: Session = Depends(get_db)):
    return db.query(SpaceRequest).filter(SpaceRequest.status == "active").order_by(SpaceRequest.created_at.desc()).all()

@router.get("/mine", response_model=List[SpaceRequestResponse])
def list_my_space_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(SpaceRequest).filter(SpaceRequest.user_id == current_user.id).order_by(SpaceRequest.created_at.desc()).all()