from pydantic import BaseModel

class AdminStats(BaseModel):
    total_users: int
    total_properties: int
    active_properties: int
    total_space_requests: int
    active_space_requests: int
    total_matches: int
    total_leads: int