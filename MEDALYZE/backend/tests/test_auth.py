// ...existing code...

# Test failed login
def test_login_failure(test_client):
    response = test_client.post(
        "/auth/login",
        json={"username": "wronguser", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()
