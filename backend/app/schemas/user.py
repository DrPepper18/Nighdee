from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, AfterValidator, EmailStr
from app.utils.date_functions import calculate_age


AGE_LIMIT = 18


def validate_age(birthdate):
    if calculate_age(birthdate) < AGE_LIMIT:
        raise ValueError("Service is intended for persons over 18 years old")
    return birthdate


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    birthdate: Annotated[datetime, AfterValidator(validate_age)]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class EditUserInfoRequest(BaseModel):
    name: str
    birthdate: Annotated[datetime, AfterValidator(validate_age)]


class TokenServiceResponse(BaseModel):
    token: str
    message: str


class UserServiceResponse(BaseModel):
    user_id: int
    message: str