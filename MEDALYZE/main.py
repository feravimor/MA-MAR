from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from routers import users, specialists, search, appointments, reports
from elasticsearch import Elasticsearch

app = FastAPI()

# Include Routers
app.include_router(users.router, prefix="/users")
app.include_router(specialists.router, prefix="/specialists")
app.include_router(search.router, prefix="/search")
app.include_router(appointments.router, prefix="/appointments")
app.include_router(reports.router, prefix="/reports", tags=["reports"])

# Elasticsearch client
es = Elasticsearch()

# Specialist model
class Specialist(BaseModel):
    id: int
    name: str
    specialty: str
    location: str
    keywords: list

# Function to index specialist
def index_specialist(specialist: Specialist):
    doc = {
        "name": specialist.name,
        "specialty": specialist.specialty,
        "location": specialist.location,
        "keywords": specialist.keywords,
    }
    es.index(index="specialists", id=specialist.id, document=doc)

# Route to index specialist
@app.post("/index_specialist/")
async def index_specialist_route(specialist: Specialist):
    try:
        index_specialist(specialist)
        return {"message": "Specialist indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
