import pytest
from fastapi.testclient import TestClient
from medalyzer_api_backend import app

client = TestClient(app)

# Mock settings for subscription
HAS_MEDALYZE_SUBSCRIPTION = False
HAS_MEDALYZER_SUBSCRIPTION = True

# Sample data for tests
def sample_treatment():
    return {
        "name": "Root Canal",
        "description": "Treatment for infected root canals",
        "fixed_costs": [
            {"name": "Clinic Rent", "amount": 5000},
            {"name": "Electricity", "amount": 1000}
        ],
        "variable_costs": [
            {"name": "Anesthetic", "amount": 200},
            {"name": "Sterile Equipment", "amount": 300}
        ],
        "depreciation": 500,
        "working_days": 20,
        "patients_per_day": 10,
        "desired_sale_price": 2000,
        "tax_rate": 0.16,
        "payment_commission": 0.03
    }

# Test: Add treatment successfully
def test_add_treatment():
    response = client.post("/add-treatment/", json=sample_treatment())
    assert response.status_code == 200
    assert response.json()["message"] == "Treatment added successfully."

# Test: Attempt to sync with Medalyze without subscription
def test_sync_medalyze_without_subscription():
    global HAS_MEDALYZE_SUBSCRIPTION
    HAS_MEDALYZE_SUBSCRIPTION = False  # Simulate lack of subscription

    response = client.get("/sync-medalyze/")
    assert response.status_code == 403
    assert response.json()["detail"] == "Integration with Medalyze is restricted."

# Test: Sync with Medalyze when both subscriptions are active
def test_sync_medalyze_with_subscription():
    global HAS_MEDALYZE_SUBSCRIPTION
    HAS_MEDALYZE_SUBSCRIPTION = True  # Simulate active subscription

    response = client.get("/sync-medalyze/")
    assert response.status_code == 200
    assert response.json()["message"] == "Catalog synchronized with Medalyze successfully."

# Test: Generate financial report
def test_generate_financial_report():
    response = client.get("/generate-report/")
    assert response.status_code == 200
    assert "report_csv" in response.json()

# Test: Restrict Medalyzer functionality for unauthorized users
def test_restrict_medalyzer_access():
    global HAS_MEDALYZER_SUBSCRIPTION
    HAS_MEDALYZER_SUBSCRIPTION = False  # Simulate lack of subscription

    response = client.get("/list-treatments/")
    assert response.status_code == 403
    assert response.json()["detail"] == "Access to Medalyzer is restricted."

# Test: Verify inventory updates
def test_inventory_update():
    inventory_item = {"name": "Anesthetic", "quantity": 50, "unit_cost": 200}
    response = client.post("/inventory/add/", json=inventory_item)
    assert response.status_code == 200
    assert response.json()["message"] == "Item added to inventory successfully."

    # Update inventory
    response = client.put("/inventory/update/Anesthetic/", json={"quantity": 60})
    assert response.status_code == 200
    assert response.json()["message"] == "Item updated successfully."

# Run tests
if __name__ == "__main__":
    pytest.main()
