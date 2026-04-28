from fastapi import APIRouter, Depends, status
from app.models.database import AsyncSession, get_db
from app.services.booking import (
    get_join_status,
    join_user_to_event,
    cancel_join_to_event
)
from app.utils.security import verify_access_token
from app.schemas.booking import BookingServiceResponse


router = APIRouter(prefix='/book')


@router.post("/{event_id}", status_code=status.HTTP_201_CREATED)
async def join_event(event_id: int, 
                     payload = Depends(verify_access_token), 
                     db: AsyncSession = Depends(get_db)):
    await join_user_to_event(event_id=event_id, user_id=int(payload["sub"]), session=db)
    
    return BookingServiceResponse(
        user_id=int(payload["sub"]),
        event_id=event_id,
        message="User successfully joined the event"
    )


@router.delete("/{event_id}", status_code=status.HTTP_200_OK)
async def cancel_join(event_id: int, 
                     payload = Depends(verify_access_token), 
                     db: AsyncSession = Depends(get_db)):
    await cancel_join_to_event(event_id=event_id, user_id=int(payload["sub"]), session=db)
    
    return BookingServiceResponse(
        user_id=int(payload["sub"]),
        event_id=event_id,
        message="User successfully canceled the join"
    )
    

@router.get("/{event_id}", status_code=status.HTTP_200_OK)
async def check_event_join(event_id: int, 
                           payload = Depends(verify_access_token), 
                           db: AsyncSession = Depends(get_db)):    
    result = await get_join_status(event_id=event_id, user_id=int(payload["sub"]), session=db)
    
    return BookingServiceResponse(
        user_id=int(payload["sub"]),
        event_id=event_id,
        is_joined=result,
        message="Join status retrieved successfully"
    )