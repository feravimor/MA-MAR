from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Specialist

router = APIRouter()

@router.post("/advanced")
def advanced_search(query: str, filters: dict, db: Session = Depends(get_db)):
    # Base query
    specialists = db.query(Specialist)

    # Apply query filter
    if query:
        specialists = specialists.filter(Specialist.name.ilike(f"%{query}%") | Specialist.specialty.ilike(f"%{query}%"))

    # Apply price range filter
    if "priceRange" in filters:
        specialists = specialists.filter(Specialist.price >= filters["priceRange"][0], Specialist.price <= filters["priceRange"][1])

    # Apply distance filter (simplified for demonstration)
    if "distance" in filters:
        # Assume `Specialist.distance_from_user` is a precomputed field
        specialists = specialists.filter(Specialist.distance_from_user <= filters["distance"])

    # Apply language filter
    if "languages" in filters and filters["languages"]:
        specialists = specialists.filter(Specialist.languages.any(filters["languages"]))

    # Return results
    results = specialists.all()
    return [{
        "id": specialist.id,
        "name": specialist.name,
        "specialty": specialist.specialty,
        "price": specialist.price,
        "distance": specialist.distance_from_user,
    } for specialist in results]
