from pydantic import BaseModel


class BookingServiceResponse(BaseModel):
    user_id: int
    event_id: int
    message: str
    is_joined: bool | None = None
