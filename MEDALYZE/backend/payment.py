from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Payment, Appointment
import stripe

# Configure Stripe API key
stripe.api_key = "your_stripe_secret_key"

router = APIRouter()

# Endpoint to process payment
@router.post("/process")
def process_payment(appointment_id: int, token: str, db: Session = Depends(get_db)):
    # Fetch the appointment details
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    try:
        # Create a charge
        charge = stripe.Charge.create(
            amount=int(appointment.price * 100),  # Stripe requires amount in cents
            currency="usd",
            source=token,
            description=f"Payment for Appointment ID: {appointment_id}"
        )

        # Record the payment in the database
        payment = Payment(
            appointment_id=appointment_id,
            amount=appointment.price,
            method="Stripe",
            status="Completed",
            transaction_id=charge.id,
        )
        db.add(payment)
        db.commit()

        return {"status": "success", "payment_id": payment.id}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Payment failed: {e.user_message}")

# Endpoint to retrieve payment history
@router.get("/history/{user_id}")
def get_payment_history(user_id: int, db: Session = Depends(get_db)):
    payments = db.query(Payment).filter(Payment.user_id == user_id).all()
    return [
        {
            "id": payment.id,
            "appointment_id": payment.appointment_id,
            "amount": payment.amount,
            "method": payment.method,
            "status": payment.status,
            "transaction_id": payment.transaction_id,
        }
        for payment in payments
    ]

# Endpoint to refund a payment
@router.post("/refund")
def refund_payment(payment_id: int, db: Session = Depends(get_db)):
    # Fetch the payment details
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    try:
        # Refund the charge
        refund = stripe.Refund.create(
            charge=payment.transaction_id
        )

        # Update the payment status in the database
        payment.status = "Refunded"
        db.commit()

        return {"status": "success", "refund_id": refund.id}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Refund failed: {e.user_message}")
