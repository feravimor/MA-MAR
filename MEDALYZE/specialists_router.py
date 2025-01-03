from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Specialist

router = APIRouter()

# Endpoint to retrieve a specialist by ID
@router.get("/{specialist_id}")
def get_specialist(specialist_id: int, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")
    return specialist

# Endpoint to create a new specialist
@router.post("/")
def create_specialist(specialist_data: dict, db: Session = Depends(get_db)):
    new_specialist = Specialist(**specialist_data)
    db.add(new_specialist)
    db.commit()
    db.refresh(new_specialist)
    return new_specialist

# Endpoint to update specialist details
@router.put("/{specialist_id}")
def update_specialist(specialist_id: int, specialist_data: dict, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    for key, value in specialist_data.items():
        setattr(specialist, key, value)

    db.commit()
    return specialist

# Endpoint to delete a specialist
@router.delete("/{specialist_id}")
def delete_specialist(specialist_id: int, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    db.delete(specialist)
    db.commit()
    return {"status": "success"}
