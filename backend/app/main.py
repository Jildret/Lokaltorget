from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, properties, leads, space_requests, admin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(leads.router)
app.include_router(space_requests.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Hello from Lokaltorget backend!"}