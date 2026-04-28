from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, AfterValidator, EmailStr, Field, model_validator
from app.utils.date_functions import calculate_age


class BookingServiceResponse(BaseModel):
    user_id: int
    event_id: int
    message: str
    is_joined: bool | None = None