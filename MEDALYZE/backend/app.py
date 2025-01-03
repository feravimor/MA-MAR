from fastapi import FastAPI
from backend.routes import appointments

app = FastAPI()

app.include_router(appointments.router, prefix="/appointments", tags=["appointments"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Medalyze API"}
