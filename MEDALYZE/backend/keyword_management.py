from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Keyword, Specialist

router = APIRouter()

# ...existing code...

# Endpoint to update a keyword
@router.put("/{keyword_id}")
def update_keyword(keyword_id: int, new_keyword: str, db: Session = Depends(get_db)):
    keyword = db.query(Keyword).filter(Keyword.id == keyword_id).first()
    if not keyword:
        raise HTTPException(status_code=404, detail="Keyword not found")

    keyword.keyword = new_keyword
    db.commit()
    db.refresh(keyword)
    return keyword

# Endpoint to delete a keyword
@router.delete("/{keyword_id}")
def delete_keyword(keyword_id: int, db: Session = Depends(get_db)):
    keyword = db.query(Keyword).filter(Keyword.id == keyword_id).first()
    if not keyword:
        raise HTTPException(status_code=404, detail="Keyword not found")

    db.delete(keyword)
    db.commit()
    return {"status": "success"}
