from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Appointment

router = APIRouter()

# Endpoint to retrieve all appointments
@router.get("/")
def get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found")
    return appointments

# Endpoint to retrieve appointments for a user
@router.get("/user/{user_id}")
def get_user_appointments(user_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.user_id == user_id).all()
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this user")
    return appointments

# Endpoint to retrieve a single appointment by its ID
@router.get("/{appointment_id}")
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

# Endpoint to create a new appointment
@router.post("/")
def create_appointment(appointment_data: dict, db: Session = Depends(get_db)):
    new_appointment = Appointment(**appointment_data)
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

# Endpoint to update an appointment
@router.put("/{appointment_id}")
def update_appointment(appointment_id: int, appointment_data: dict, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    for key, value in appointment_data.items():
        setattr(appointment, key, value)

    db.commit()
    return appointment

# Endpoint to delete an appointment
@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()
    return {"status": "success"}
