# ...existing code...

# Test updating an appointment
def test_update_appointment(test_client, test_user, test_appointment):
    login_response = test_client.post(
        "/auth/login",
        json={"username": test_user.username, "password": "hashedpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = test_client.put(
        f"/appointments/{test_appointment.id}",
        json={"specialist_id": 2, "date": "2024-01-02", "time": "11:00"},
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["specialist_id"] == 2

# Test deleting an appointment
def test_delete_appointment(test_client, test_user, test_appointment):
    login_response = test_client.post(
        "/auth/login",
        json={"username": test_user.username, "password": "hashedpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = test_client.delete(f"/appointments/{test_appointment.id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Appointment deleted successfully"

# Test updating a payment
def test_update_payment(test_client, test_user, test_payment):
    login_response = test_client.post(
        "/auth/login",
        json={"username": test_user.username, "password": "hashedpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = test_client.put(
        f"/payments/{test_payment.id}",
        json={"amount": 150.0, "method": "PayPal", "status": "Pending"},
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["amount"] == 150.0

# Test deleting a payment
def test_delete_payment(test_client, test_user, test_payment):
    login_response = test_client.post(
        "/auth/login",
        json={"username": test_user.username, "password": "hashedpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = test_client.delete(f"/payments/{test_payment.id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Payment deleted successfully"
