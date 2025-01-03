from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Payment
from services.payment_service import process_payment, generate_invoice

router = APIRouter()

@router.post("/process")
def process_payment_endpoint(payment_data: dict, db: Session = Depends(get_db)):
    try:
        payment_result = process_payment(payment_data, db)
        return payment_result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error processing payment") from e

@router.get("/invoice/{payment_id}")
def get_invoice(payment_id: int, db: Session = Depends(get_db)):
    try:
        invoice = generate_invoice(payment_id, db)
        return invoice
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating invoice") from e
