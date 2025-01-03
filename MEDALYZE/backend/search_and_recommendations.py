from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Specialist, Keyword, SearchLog
from services.keyword_recommender import recommend_keywords

router = APIRouter()

# Endpoint to log a search
@router.post("/log")
def log_search(user_id: int, query: str, db: Session = Depends(get_db)):
    search_log = SearchLog(user_id=user_id, query=query)
    db.add(search_log)
    db.commit()
    return {"status": "success"}

# Endpoint to get search recommendations
@router.get("/recommendations/{specialist_id}")
def get_search_recommendations(specialist_id: int, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    specialist_profile = {
        "category": specialist.category,
        "area": specialist.area,
        "keywords": [kw.keyword for kw in specialist.keywords],
    }

    search_data = db.query(SearchLog.query).all()
    keyword_search_data = {"keyword": [entry[0] for entry in search_data]}  # Simplified example

    recommendations = recommend_keywords(specialist_profile, keyword_search_data)
    return {"recommendations": recommendations}

# Endpoint to get trending keywords
@router.get("/trending")
def get_trending_keywords(db: Session = Depends(get_db)):
    trending = (
        db.query(Keyword.keyword, func.count(SearchLog.id).label("search_count"))
        .join(SearchLog, Keyword.id == SearchLog.keyword_id)
        .group_by(Keyword.keyword)
        .order_by(func.count(SearchLog.id).desc())
        .limit(10)
        .all()
    )

    return [{"keyword": keyword, "search_count": count} for keyword, count in trending]
