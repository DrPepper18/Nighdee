import React, { useState, useEffect } from 'react';
import { Popup } from 'react-leaflet';
import { bookingRequest } from '../../api';
import './EventCard.css'
import { Dialog, ChildrenAlert } from '../Dialog/Dialog.jsx';
import { useModal } from '../Dialog/ModalContext';


const EventCard = ({event}) => {
    const [isJoined, setIsJoined] = useState(false);
    const { openModal } = useModal();

    const checkStatus = async () => {
        try {
            const joined = await bookingRequest.checkStatus(event.id);
            setIsJoined(joined);
        } catch (err) {
            console.error("Ошибка проверки статуса:", err);
        }
    };

    const handleJoin = async () => {
        try {
            if (!isJoined) {
                await bookingRequest.join(event.id);
                setIsJoined(true);
                event.participants_count += 1;
                openModal("Успех", <ChildrenAlert message="Вы записаны!" />);
                // Better not remove modal windows - they slow down the process of joining events.
                // There won't be any party-poopers who sign up for everything and never show up
                // Participation will be more conscious
            } else {
                await bookingRequest.cancel(event.id);
                setIsJoined(false);
                event.participants_count -= 1;
                openModal("Успех", <ChildrenAlert message="Вы отказались от события..." />);
                // Same thing...
            }
            
        } catch {
            openModal("Ошибка", <ChildrenAlert message="Не удалось записаться" />);
        }
    };
    let ageLabel = "";
    if (event.min_age && event.max_age) {
        ageLabel = `${event.min_age}-${event.max_age} лет`;
    } else if (event.min_age) {
        ageLabel = `от ${event.min_age} лет`;
    } else if (event.max_age) {
        ageLabel = `до ${event.max_age} лет`;
    }
    const shareUrl = `${window.location.origin}/?id=${event.id}`;
    const buttonStyle = `button button--${isJoined ? 'negative' : 'to-go'}`;
    const isFull = event.participants_count >= event.capacity;
    const dateOptions = {
        day: 'numeric', 
        month: 'long',
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    };
    return (
        <Popup
            eventHandlers={{
                add: () => {checkStatus()}
            }}
        >
            <h3>{event.name}</h3>
            <p>📅 {new Date(event.datetime).toLocaleString("ru-RU", dateOptions)}</p>
            <p>
                👤 {ageLabel}{ageLabel && '. '}
                {isFull ? "Мест нет" : "Осталось мест: "}{isFull ? "" : event.capacity - event.participants_count}
            </p>
            <input 
                type="button" 
                id="ConfirmButton"
                className={`${buttonStyle} full-width`} 
                disabled={isFull && !isJoined} 
                value={isJoined ? "Я не приду..." : (isFull ? "Мест нет" : "Я приду!")}
                onClick={handleJoin}
            />
            <div>
                <small>🔗 
                    <a 
                        href={shareUrl} 
                        onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(shareUrl);
                            alert("Скопировано!");
                        }}
                    >
                        {shareUrl}
                    </a>
                </small>
            </div>
        </Popup>
    );
}


export {EventCard};