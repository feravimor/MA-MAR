from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, treatments, reports, inventory, sync, profile

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(treatments.router, prefix="/treatments", tags=["Treatments"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(sync.router, prefix="/sync", tags=["Synchronization"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(notification.router, prefix="/notifications", tags=["notifications"])

@app.get("/")
def root():
    return {"message": "Welcome to Medalyze API"}
