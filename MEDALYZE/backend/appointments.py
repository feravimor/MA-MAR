from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

# ...existing code...

class Appointment(BaseModel):
    id: int
    patient_id: int
    specialist_id: int
    date: datetime
    status: str

# ...existing code...

router = APIRouter()

appointments = []

@router.post("/", response_model=Appointment)
async def create_appointment(appointment: Appointment):
    appointments.append(appointment)
    return appointment

@router.get("/", response_model=List[Appointment])
async def get_appointments():
    return appointments

@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: int):
    for appointment in appointments:
        if appointment.id == appointment_id:
            return appointment
    raise HTTPException(status_code=404, detail="Appointment not found")

@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, updated_appointment: Appointment):
    for index, appointment in enumerate(appointments):
        if appointment.id == appointment_id:
            appointments[index] = updated_appointment
            return updated_appointment
    raise HTTPException(status_code=404, detail="Appointment not found")

@router.delete("/{appointment_id}")
async def delete_appointment(appointment_id: int):
    for index, appointment in enumerate(appointments):
        if appointment.id == appointment_id:
            del appointments[index]
            return {"message": "Appointment deleted"}
    raise HTTPException(status_code=404, detail="Appointment not found")
