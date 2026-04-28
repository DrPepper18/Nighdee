from fastapi import APIRouter, Depends, status
from app.models.database import AsyncSession, get_db
from app.services.event import add_new_event, get_all_events
from app.services.user import get_user_info
from app.utils.security import verify_access_token
from app.schemas.event import EventPostRequest, EventServiceResponse


router = APIRouter(prefix='/event')


@router.get("/", status_code=status.HTTP_200_OK)
async def get_events(payload = Depends(verify_access_token), 
                     db: AsyncSession = Depends(get_db)):
    user_data = await get_user_info(user_id=int(payload["sub"]), session=db)
    eventlist = await get_all_events(user_data=user_data, session=db)

    return eventlist


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_event(data: EventPostRequest, 
                       payload = Depends(verify_access_token), 
                       db: AsyncSession = Depends(get_db)):
    event_id = await add_new_event(data, session=db)

    return EventServiceResponse(
        event_id=event_id,
        event_data=data,
        message="Event successfully created"
    )
