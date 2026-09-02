from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User
from app.models.property import Property
from app.models.space_request import SpaceRequest
from app.models.match import Match
from app.models.lead import Lead
from app.schemas.admin import AdminStats
from app.schemas.property import PropertyResponse
from app.schemas.space_request import SpaceRequestResponse
from app.schemas.match import MatchCreate, MatchResponse, MatchStatusUpdate
from app.auth.admin import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return AdminStats(
        total_users=db.query(User).count(),
        total_properties=db.query(Property).count(),
        active_properties=db.query(Property).filter(Property.status == "active").count(),
        total_space_requests=db.query(SpaceRequest).count(),
        active_space_requests=db.query(SpaceRequest).filter(SpaceRequest.status == "active").count(),
        total_matches=db.query(Match).count(),
        total_leads=db.query(Lead).count(),
    )

@router.get("/properties", response_model=List[PropertyResponse])
def admin_list_properties(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return db.query(Property).order_by(Property.created_at.desc()).all()

@router.get("/space-requests", response_model=List[SpaceRequestResponse])
def admin_list_space_requests(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return db.query(SpaceRequest).order_by(SpaceRequest.created_at.desc()).all()

@router.get("/matches", response_model=List[MatchResponse])
def admin_list_matches(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return db.query(Match).order_by(Match.created_at.desc()).all()

@router.post("/matches", response_model=MatchResponse)
def create_match(
    match_in: MatchCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    new_match = Match(
        property_id=match_in.property_id,
        request_id=match_in.request_id,
        score=match_in.score,
        reason=match_in.reason,
        source="manual",
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

@router.put("/matches/{match_id}", response_model=MatchResponse)
def update_match_status(
    match_id: uuid.UUID,
    status_in: MatchStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Matchningen hittades inte")
    match.status = status_in.status
    db.commit()
    db.refresh(match)
    return match