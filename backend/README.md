# Nighdee Backend
**Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, alembic, jwt, bcrypt, pytest

## File structure
```
.
├── alembic                   — migrations
├── app
│   ├── models
│   │   ├── database.py       — database connection
│   │   └── models.py         — all database entities
│   ├── services              — business-logic layer
│   ├── routes                — API layer
│   ├── utils                 — minor functions
│   │   ├── security.py       — token pair, password hash
│   │   └── date_functions.py — birthdate to age and vice versa
│   ├── schemas.py            — request and response schemas
│   ├── config.py             — environment info
│   └── main.py
└── tests
    ├── unit
    ├── integration
    └── conftest.py
```
## Endpoints
### user.py
`POST /api/auth/register` — register new user

`POST /api/auth/login` — sign in

`GET /api/auth/` — get current user profile

`PATCH /api/auth/` — edit profile

`DELETE /api/auth/` — delete account

`GET /api/auth/refresh` — refresh tokens if ones are expired

### event.py

`GET /api/event/` — get list of available events

`POST /api/event/` — create new event

### booking.py

`POST /api/book/` — join an event

`GET /api/book/` — check if user joined an event or not

`DELETE /api/book/` — unjoin an event

## Notes
- Access tokens expire after 10 minutes; use the refresh endpoint to obtain a new one.
- Refresh token expires after 30 days and is stored in a cookie (HttpOnly).
- Events are automatically cleaned up every 6 hours if expired.

## Tests

`unit/test_utils_security.py` — test utils (create_token_pair, create_password_hash e.t.c.)

`integration/test_auth_features.py` — registration, login, token refresh

`integration/test_event_features.py` — create new event, join it

`integration/test_full_cycle.py` — full user flow test (registration -> login -> create an event -> join it)