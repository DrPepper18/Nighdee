from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, Field, model_validator


CURFEW_BEGIN = 23
CURFEW_END = 5
CAPACITY_LIMIT = 16


class EventPostRequest(BaseModel):
    name: Annotated[str, Field(min_length=1)]
    datetime: datetime
    longitude: float
    latitude: float
    capacity: int
    min_age: int | None = None
    max_age: int | None = None
    
    @model_validator(mode='after')
    def validate_ages(self):
        if self.min_age and self.max_age and self.min_age > self.max_age:
            raise ValueError('Minimum age cannot be greater than maximum age')
        return self
    
    @model_validator(mode='after')
    def validate_datetime(self):
        if self.datetime.replace(tzinfo=None) < datetime.now():
            raise ValueError('Cannot create an event in the past')
        if self.datetime.hour >= CURFEW_BEGIN or self.datetime.hour < CURFEW_END:
            raise ValueError(
                f'Cannot create events during curfew hours {CURFEW_BEGIN}:00-{CURFEW_END}:00'
            )
        return self
    
    @model_validator(mode="after")
    def validate_capacity(self):
        if self.capacity < 1 or self.capacity > CAPACITY_LIMIT:
            raise ValueError(f'Invalid number of people. Capacity must be between 1 and {CAPACITY_LIMIT}')
        return self
    

class EventServiceResponse(BaseModel):
    event_id: int
    event_data: EventPostRequest
    message: str