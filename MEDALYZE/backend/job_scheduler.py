from apscheduler.schedulers.background import BackgroundScheduler
from notification_service import send_notification
from appointment_service import get_upcoming_appointments

scheduler = BackgroundScheduler()

def check_appointments():
    appointments = get_upcoming_appointments()
    for appointment in appointments:
        send_notification(appointment.patient_id, "Reminder: You have an appointment tomorrow.")

scheduler.add_job(check_appointments, "interval", hours=1)
scheduler.start()
