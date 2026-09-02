from fastapi import Depends, HTTPException
from app.models.user import User
from app.auth.dependencies import get_current_user

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Endast administratörer har åtkomst")
    return current_user