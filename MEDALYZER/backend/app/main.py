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

class CostData(BaseModel):
    total_fixed_costs: float
    depreciation: float
    working_days: int
    patients_per_day: int
    variable_costs: List[float]
    desired_sale_price: Optional[float] = None
    tax_rate: float
    payment_commission: float
    custom_distribution: Optional[dict] = None  # Example: {"tax_rate": 0.15, "payment_commission": 0.02}

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

# Function to calculate fixed cost per patient
def calculate_fixed_cost_per_patient(total_fixed_costs, depreciation, working_days, patients_per_day):
    if working_days * patients_per_day == 0:
        return 0
    return (total_fixed_costs + depreciation) / (working_days * patients_per_day)

# Function to calculate variable cost per treatment
def calculate_variable_cost_per_treatment(variable_costs):
    return sum(variable_costs)

# Function to calculate total cost
def calculate_total_cost(fixed_cost_per_patient, variable_cost_per_treatment):
    return fixed_cost_per_patient + variable_cost_per_treatment

# Function to calculate income distribution
def calculate_income_distribution(sale_price, tax_rate, payment_commission):
    taxes = sale_price * tax_rate
    commission = sale_price * payment_commission
    net_profit = sale_price - taxes - commission
    return {
        "sale_price": sale_price,
        "taxes": taxes,
        "commission": commission,
        "net_profit": net_profit,
    }

@app.post("/calculate-pricing/")
def calculate_pricing(data: CostData):
    fixed_cost_per_patient = calculate_fixed_cost_per_patient(
        data.total_fixed_costs, data.depreciation, data.working_days, data.patients_per_day
    )
    variable_cost_per_treatment = calculate_variable_cost_per_treatment(data.variable_costs)
    total_cost = calculate_total_cost(fixed_cost_per_patient, variable_cost_per_treatment)

    if data.desired_sale_price:
        sale_price = data.desired_sale_price
    else:
        # Default margin-based calculation (not used when desired_sale_price is provided)
        sale_price = total_cost * (1 + 0.2)  # Example default margin of 20%

    # Apply custom distribution if provided, otherwise use defaults
    tax_rate = data.custom_distribution.get("tax_rate", data.tax_rate) if data.custom_distribution else data.tax_rate
    payment_commission = data.custom_distribution.get("payment_commission", data.payment_commission) if data.custom_distribution else data.payment_commission

    income_distribution = calculate_income_distribution(sale_price, tax_rate, payment_commission)

    suggestions = {
        "default_tax_rate": 0.16,
        "default_payment_commission": 0.03,
        "example_suggestion": "Consider a tax rate of 16% and payment commission of 3% for balanced distribution."
    }

    return {
        "fixed_cost_per_patient": fixed_cost_per_patient,
        "variable_cost_per_treatment": variable_cost_per_treatment,
        "total_cost": total_cost,
        "sale_price": sale_price,
        "income_distribution": income_distribution,
        "suggestions": suggestions,
    }
