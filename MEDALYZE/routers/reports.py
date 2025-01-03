from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.report_generator import generate_pdf, generate_csv

router = APIRouter()

def compile_custom_report(metrics, start_date, end_date, db):
    # Placeholder function to compile data based on metrics
    # Replace with actual implementation
    data = [
        {"metric": "example_metric", "value": 123},
        {"metric": "another_metric", "value": 456},
    ]
    return data

@router.post("/generate")
def generate_report(metrics: list, start_date: str, end_date: str, format: str, db: Session = Depends(get_db)):
    # Collect data based on metrics
    data = compile_custom_report(metrics, start_date, end_date, db)

    # Generate report in desired format
    if format == "CSV":
        csv_file = generate_csv(data)
        return StreamingResponse(csv_file, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=custom_report.csv"})
    elif format == "PDF":
        pdf_file = generate_pdf(data)
        return StreamingResponse(pdf_file, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=custom_report.pdf"})
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")
