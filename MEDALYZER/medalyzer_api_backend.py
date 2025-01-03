from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.responses import StreamingResponse
import csv
from io import StringIO

app = FastAPI()

HAS_MEDALYZE_SUBSCRIPTION = False
HAS_MEDALYZER_SUBSCRIPTION = True

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "full_name": "John Doe",
        "email": "user@example.com",
        "hashed_password": pwd_context.hash("password"),
        "disabled": False,
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

class Cost(BaseModel):
    name: str
    amount: float

class Treatment(BaseModel):
    name: str
    description: str
    fixed_costs: List[Cost]
    variable_costs: List[Cost]
    depreciation: float
    working_days: int
    patients_per_day: int
    desired_sale_price: float
    tax_rate: float
    payment_commission: float

class InventoryItem(BaseModel):
    name: str
    quantity: int
    unit_cost: float

class Appointment(BaseModel):
    patient_name: str
    treatment_name: str
    appointment_date: datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

treatments = []
inventory = {}
appointments = []

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/register/", response_model=User)
def register_user(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    fake_users_db[user.email] = user_in_db.dict()
    return user_in_db

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/users/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.username}]

@app.post("/add-treatment/")
def add_treatment(treatment: Treatment):
    treatments.append(treatment)
    return {"message": "Treatment added successfully."}

@app.get("/sync-medalyze/")
def sync_medalyze():
    if not HAS_MEDALYZE_SUBSCRIPTION:
        raise HTTPException(status_code=403, detail="Integration with Medalyze is restricted.")
    return {"message": "Catalog synchronized with Medalyze successfully."}

@app.get("/generate-report/")
def generate_report():
    # Placeholder for report generation logic
    return {"report_csv": "report content"}

@app.get("/list-treatments/")
def list_treatments():
    if not HAS_MEDALYZER_SUBSCRIPTION:
        raise HTTPException(status_code=403, detail="Access to Medalyzer is restricted.")
    return treatments

@app.post("/inventory/add/")
def add_inventory_item(item: InventoryItem):
    inventory[item.name] = item
    inventory[item.name].history = []
    return {"message": "Item added to inventory successfully."}

@app.put("/inventory/update/{item_name}/")
def update_inventory_item(item_name: str, item: Dict[str, int]):
    if item_name in inventory:
        inventory[item_name].history.append({
            "action": "Updated Quantity",
            "oldQuantity": inventory[item_name].quantity,
            "newQuantity": item["quantity"],
            "date": datetime.now().isoformat()
        })
        inventory[item_name].quantity = item["quantity"]
        return {"message": "Item updated successfully."}
    else:
        raise HTTPException(status_code=404, detail="Item not found.")

@app.delete("/inventory/delete/{item_name}/")
def delete_inventory_item(item_name: str):
    if item_name in inventory:
        inventory[item_name].history.append({
            "action": "Deleted Item",
            "date": datetime.now().isoformat()
        })
        del inventory[item_name]
        return {"message": "Item deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Item not found.")

@app.get("/inventory/history/{item_name}/")
def get_inventory_history(item_name: str):
    if item_name in inventory:
        return inventory[item_name].history
    else:
        raise HTTPException(status_code=404, detail="Item not found.")

@app.get("/inventory/export/")
def export_inventory():
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Item Name", "Quantity", "Unit Cost"])
    for item in inventory.values():
        writer.writerow([item.name, item.quantity, item.unit_cost])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=inventory.csv"})

@app.post("/appointments/add/")
def add_appointment(appointment: Appointment):
    appointments.append(appointment)
    return {"message": "Appointment added successfully."}

@app.get("/appointments/list/")
def list_appointments():
    return appointments

@app.delete("/appointments/delete/{appointment_id}/")
def delete_appointment(appointment_id: int):
    if 0 <= appointment_id < len(appointments):
        del appointments[appointment_id]
        return {"message": "Appointment deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Appointment not found.")
