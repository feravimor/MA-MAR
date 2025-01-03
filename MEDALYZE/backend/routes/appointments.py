from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.appointment import Appointment

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_appointment(patient_id: int, professional_id: int, date: str, db: Session = Depends(get_db)):
    appointment = Appointment(
        patient_id=patient_id,
        professional_id=professional_id,
        date=date
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/{professional_id}")
def get_appointments(professional_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.professional_id == professional_id).all()
    return appointments
