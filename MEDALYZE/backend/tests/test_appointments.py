// ...existing code...

def test_create_appointment(test_client, test_db):
    response = test_client.post(
        "/appointments",
        json={"specialist_id": 1, "date": "2023-10-10", "time": "10:00"}
    )
    assert response.status_code == 201
    assert "id" in response.json()
