from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database import get_db
from models import Specialist, Appointment, Keyword

router = APIRouter()

@router.get("/{specialist_id}/metrics")
def get_specialist_metrics(specialist_id: int, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    try:
        # Total patients
        total_patients = (
            db.query(Appointment.user_id)
            .filter(Appointment.specialist_id == specialist_id)
            .distinct()
            .count()
        )

        # Total earnings
        total_earnings = (
            db.query(func.sum(Appointment.price))
            .filter(Appointment.specialist_id == specialist_id)
            .scalar()
        ) or 0

        # Keywords searched
        keywords = (
            db.query(Keyword.keyword, func.count(Keyword.id).label("frequency"))
            .join(Specialist.keywords)
            .filter(Specialist.id == specialist_id)
            .group_by(Keyword.keyword)
            .order_by(func.count(Keyword.id).desc())
            .all()
        )

        return {
            "totalPatients": total_patients,
            "totalEarnings": total_earnings,
            "keywordsSearched": [{"keyword": kw[0], "frequency": kw[1]} for kw in keywords],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching metrics") from e
