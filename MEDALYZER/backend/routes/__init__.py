# Initialize routes package

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import csv
from io import StringIO
import requests
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI()

# Models for API input
class CostItem(BaseModel):
    name: str
    amount: float

class Treatment(BaseModel):
    name: str
    description: Optional[str] = None
    keywords: Optional[List[str]] = []
    symptoms: Optional[List[str]] = []
    images: Optional[List[str]] = []  # URLs or base64 encoded images
    fixed_costs: List[CostItem]
    variable_costs: List[CostItem]
    depreciation: float
    working_days: int
    patients_per_day: int
    desired_sale_price: Optional[float] = None
    tax_rate: float
    payment_commission: float

class AdvancedSettings(BaseModel):
    default_tax_rate: float
    default_payment_commission: float
    margin_threshold: float  # Minimum acceptable profit margin

# Database simulation
catalog: Dict[str, Treatment] = {}
historical_data: List[Dict] = []  # Stores historical income data for analysis
recommendations: List[Dict] = []
inventory: Dict[str, CostItem] = {}
patient_reports: Dict[str, Dict] = {}
settings: AdvancedSettings = AdvancedSettings(default_tax_rate=0.16, default_payment_commission=0.03, margin_threshold=0.2)

# Synchronization settings
MEDALYZE_API_URL = "https://api.medalyze.com/sync"
API_KEY = "your-api-key-here"

# Advanced settings management functions
def update_settings(new_settings: AdvancedSettings):
    global settings
    settings.default_tax_rate = new_settings.default_tax_rate
    settings.default_payment_commission = new_settings.default_payment_commission
    settings.margin_threshold = new_settings.margin_threshold
    return {"message": "Settings updated successfully.", "settings": settings}

@app.get("/settings/")
def get_settings():
    return settings

@app.put("/settings/")
def update_advanced_settings(new_settings: AdvancedSettings):
    return update_settings(new_settings)

@app.post("/add-historical-data/")
def add_historical_data(month: int, revenue: float):
    historical_data.append({"month": month, "revenue": revenue})
    return {"message": "Historical data added successfully.", "data": historical_data}

@app.get("/predict-revenue/")
def predict_revenue():
    if not historical_data:
        raise HTTPException(status_code=400, detail="No historical data available.")
    return analyze_predictions(historical_data)

@app.post("/add-treatment/")
def add_treatment(treatment: Treatment):
    if treatment.name in catalog:
        return {"error": "Treatment already exists."}
    catalog[treatment.name] = treatment
    return {"message": "Treatment added successfully.", "treatment": treatment}

@app.put("/update-treatment/{treatment_name}/")
def update_treatment(treatment_name: str, updated_treatment: Treatment):
    if treatment_name not in catalog:
        return {"error": "Treatment not found."}
    catalog[treatment_name] = updated_treatment
    return {"message": "Treatment updated successfully.", "treatment": updated_treatment}

@app.delete("/delete-treatment/{treatment_name}/")
def delete_treatment(treatment_name: str):
    if treatment_name not in catalog:
        return {"error": "Treatment not found."}
    del catalog[treatment_name]
    return {"message": "Treatment deleted successfully."}

@app.get("/list-treatments/")
def list_treatments():
    return {"catalog": catalog}

@app.get("/treatment/{treatment_name}/")
def get_treatment(treatment_name: str):
    if treatment_name not in catalog:
        raise HTTPException(status_code=404, detail="Treatment not found.")
    return catalog[treatment_name]

@app.post("/calculate-pricing/{treatment_name}/")
def calculate_pricing(treatment_name: str):
    if treatment_name not in catalog:
        return {"error": "Treatment not found."}

    treatment = catalog[treatment_name]
    fixed_cost_per_patient = calculate_fixed_cost_per_patient(
        treatment.fixed_costs, treatment.depreciation, treatment.working_days, treatment.patients_per_day
    )
    variable_cost_per_treatment = calculate_variable_cost_per_treatment(treatment.variable_costs)
    total_cost = calculate_total_cost(fixed_cost_per_patient, variable_cost_per_treatment)

    if treatment.desired_sale_price:
        sale_price = treatment.desired_sale_price
    else:
        sale_price = total_cost * (1 + settings.margin_threshold)

    income_distribution = calculate_income_distribution(sale_price, settings.default_tax_rate, settings.default_payment_commission)

    return {
        "fixed_cost_per_patient": fixed_cost_per_patient,
        "variable_cost_per_treatment": variable_cost_per_treatment,
        "total_cost": total_cost,
        "sale_price": sale_price,
        "income_distribution": income_distribution,
    }
