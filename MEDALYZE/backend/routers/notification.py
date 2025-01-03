from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Appointment, NotificationPreference, User
from services.notification_service import send_email, send_sms, send_push

router = APIRouter()

# Function to send notifications based on preferences
@router.post("/send_reminders")
def send_reminders(db: Session = Depends(get_db)):
    appointments = (
        db.query(Appointment)
        .filter(Appointment.date == "tomorrow")  # Example filter for appointments tomorrow
        .all()
    )

    for appt in appointments:
        user = db.query(User).filter(User.id == appt.user_id).first()
        preferences = db.query(NotificationPreference).filter(NotificationPreference.user_id == user.id).first()

        message = f"Reminder: You have an appointment with {appt.specialist_name} at {appt.time} tomorrow."

        if preferences.email:
            send_email(user.email, "Appointment Reminder", message)
        if preferences.sms:
            send_sms(user.phone, message)
        if preferences.push:
            send_push(user.id, message)

    return {"status": "Reminders sent successfully"}

# Endpoint to update notification preferences
@router.put("/preferences/{user_id}")
def update_preferences(user_id: int, preferences: dict, db: Session = Depends(get_db)):
    user_preferences = db.query(NotificationPreference).filter(NotificationPreference.user_id == user_id).first()
    if not user_preferences:
        raise HTTPException(status_code=404, detail="User preferences not found")

    for key, value in preferences.items():
        setattr(user_preferences, key, value)

    db.commit()
    return {"status": "Preferences updated successfully"}
