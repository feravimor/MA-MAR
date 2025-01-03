from fastapi import APIRouter

router = APIRouter()

@router.post("/sync")
def sync():
    return {"message": "Sync"}

# ...existing code...
