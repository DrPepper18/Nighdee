import pytest
from httpx import AsyncClient
from app.utils.date_functions import calculate_birthdate
from fastapi import status

users = [
    {
        "email": "",
        "password": "", 
        "name": "", 
        "birthdate": None
    },
    {
        "email": "Late bird", 
        "password": "ihavetime", 
        "name": "Late bird", 
        "birthdate": calculate_birthdate(20).isoformat()
    },
    {
        "email": "naughtykid@mail.ru", 
        "password": "im18iswear", 
        "name": "Kid", 
        "birthdate": calculate_birthdate(17).isoformat()
    },
    {
        "email": "owner@mail.ru", 
        "password": "iamnormal", 
        "name": "Owner", 
        "birthdate": calculate_birthdate(27).isoformat()
    },
]

@pytest.mark.parametrize("user, status_code", [
    (users[0], status.HTTP_422_UNPROCESSABLE_ENTITY),       # Empty spaces == 422
    (users[1], status.HTTP_422_UNPROCESSABLE_ENTITY),       # Email not in email format == 422
    (users[2], status.HTTP_422_UNPROCESSABLE_ENTITY),       # Underage == 422
    (users[3], status.HTTP_201_CREATED)                     # OK == 201
])
@pytest.mark.asyncio
async def test_auth_register(client: AsyncClient, user, status_code):
    response = await client.post('/api/auth/register', json=user)
    assert response.status_code == status_code


@pytest.mark.asyncio
async def test_auth_register_duplicate(client: AsyncClient):
    user = users[3]
    await client.post('/api/auth/register', json=user)
    response = await client.post('/api/auth/register', json=user)
    assert response.status_code == status.HTTP_409_CONFLICT


@pytest.mark.parametrize("user, status_code", [
    # Empty fields
    (
        {"email": "", "password": ""}, 
        status.HTTP_422_UNPROCESSABLE_ENTITY
    ),
    # Non-existent user
    (
        {"email": "ghost@exists.not", "password": "password123"}, 
        status.HTTP_404_NOT_FOUND
    ),
    # Incorrect password
    (
        {"email": "wrongpass@mail.ru", "password": "correct_pass", "attempt": "wrong_pass"}, 
        status.HTTP_401_UNAUTHORIZED
    ),
    # Success
    (
        {"email": "good@user.ru", "password": "password123", "attempt": "password123"}, 
        status.HTTP_200_OK
    )
])
@pytest.mark.asyncio
async def test_auth_login(client: AsyncClient, user, status_code):
    if status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_200_OK]:
        await client.post('/api/auth/register', json={
            "email": user["email"], 
            "password": user["password"],
            "name": "TestUser", "birthdate": calculate_birthdate(20).isoformat()
        })

    login_password = user.get("attempt", user["password"])
    
    response = await client.post('/api/auth/login', json={
        "email": user["email"],
        "password": login_password
    })
    
    assert response.status_code == status_code


@pytest.mark.asyncio
async def test_tokens_refresh(client: AsyncClient):
    user = {
        "email": "good@user.ru", 
        "password": "password123",
        "name": "TestUser", 
        "birthdate": calculate_birthdate(20).isoformat()
    }
    response = await client.post('/api/auth/register', json=user)
    refresh_token = response.cookies.get("refresh")
    access_token = response.json()["token"]
    assert refresh_token
    assert access_token

    client.cookies.set("refresh", refresh_token)
    response = await client.get('/api/auth/refresh')
    new_refresh_token = response.cookies.get("refresh")
    new_access_token = response.json()["token"]
    assert new_refresh_token
    assert new_access_token

    # I still didn't add refresh token rotation.
    # So theoretically every generated RT
    # that isn't out of date will be valid. 
    # But OK i think nevermind rn.

    client.cookies.set("refresh", new_refresh_token)
    response = await client.get('/api/auth/', headers={'Authorization': f"Bearer {new_access_token}"})
    user_data = response.json()
    assert user_data["name"] == user["name"]
    
    client.cookies.clear()
    response = await client.get('/api/auth/refresh')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED