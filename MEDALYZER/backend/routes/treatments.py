from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Treatment

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_treatments(db: Session = Depends(get_db)):
    return db.query(Treatment).all()

@router.post("/")
def create_treatment(name: str, base_cost: float, sale_price: float, db: Session = Depends(get_db)):
    treatment = Treatment(name=name, base_cost=base_cost, sale_price=sale_price)
    db.add(treatment)
    db.commit()
    db.refresh(treatment)
    return treatment

# ...existing code...
