import React, { useState, useEffect } from 'react';
import { Popup } from 'react-leaflet';
import { bookingRequest } from '../../api';
import './EventCard.css'
import { Dialog, ChildrenAlert } from '../Dialog/Dialog.jsx';


const EventCard = ({event}) => {
    const [isJoined, setIsJoined] = useState(false);
    const [modal, setModal] = useState({ 
        isOpen: false, 
        title: '', 
        content: null 
    });
    const closeModal = () => setModal({ ...modal, isOpen: false });

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
                setModal({
                    isOpen: true,
                    title: "Успех",
                    content: <ChildrenAlert message="Вы записаны!" onClose={closeModal} />
                });
                // Лучше модальные окна пока не убирать - они замедляют присоединение к событию.
                // Не будет кайфоломов, которые будут регаться на все подряд и никуда не приходить
                // Участие будет более осознанное
            } else {
                await bookingRequest.cancel(event.id);
                setIsJoined(false);
                event.participants_count -= 1;
                setModal({
                    isOpen: true,
                    title: "Успех",
                    content: <ChildrenAlert message="Вы отказались от события..." onClose={closeModal} />
                });
                // Аналогично...
            }
            
        } catch {
            setModal({
                isOpen: true,
                title: "Ошибка",
                content: <ChildrenAlert message="Не удалось записаться" onClose={closeModal} />
            });
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
            {modal.isOpen && (
                <Dialog title={modal.title} onClose={closeModal}>
                    {modal.content}
                </Dialog>
            )}
        </Popup>
    );
}


export {EventCard};