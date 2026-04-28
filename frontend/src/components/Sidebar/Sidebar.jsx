import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userRequest } from '../../api';
import './Sidebar.css'
import { calculateAge } from '../../utils/DateFucntions';
import { ChildrenAlert, ChildrenConfirm } from '../Dialog/Dialog.jsx';
import { useModal } from '../Dialog/ModalContext';


const Sidebar = () => {
    const navigate = useNavigate();
    const [hidden, setHidden] = useState(true);
    const handleClick = () => setHidden(!hidden);
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const { closeModal, openModal } = useModal();
    const PRIVACY_LINK = 
    "https://docs.google.com/document/d/11QdpZhEwXqzgPyeY6tpTM_JyKh28AqKz5OHvJetl2Gg/edit?usp=sharing";
    
    const handleEdit = async () => {
        if (calculateAge(birthdate) < 18) {
            openModal("Ошибка", <ChildrenAlert message="Вам должно быть больше 18 лет." />);
            return;
        }
        try {
            await userRequest.updateInfo(nickname, birthdate);
            openModal("Успех", <ChildrenAlert message="Данные сохранены" />);
        } catch (error) {
            openModal("Ошибка", <ChildrenAlert message="Произошла ошибка при сохранении данных" />);
        }
        
    }
    const handleDelete = async (e) => {
        e.preventDefault();
        openModal("Подтверждение", (
            <ChildrenConfirm 
                message="Ваш аккаунт будет удалён безвозвратно. Вы уверены?" 
                onConfirm={async () => {
                    await userRequest.delete();
                    closeModal();
                    navigate('/login');
                }}
            />
            )
        );
    }

    useEffect(() => {
        const fetchUserData = async () => {
            let userData = await userRequest.getInfo();
            setNickname(userData["name"]);
            setBirthdate(userData["birthdate"]);
        }
        fetchUserData();
    }, []);

    return (
        <div className={`sidebar ${hidden? "sidebar--closed" : "sidebar--open"}`}>
            <input type="button" className="sidebar__button" value="☰" onClick={handleClick}/>
            <div className="sidebar__content">
                <div className='content-block'>
                    <h2>Профиль</h2>
                    <input
                        className="standard-border full-width"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <input
                        type="date"
                        className="standard-border full-width"
                        placeholder="Birthdate"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                    />
                    <input
                        className="button button--to-go full-width"
                        type="button"
                        value="Сохранить"
                        onClick={handleEdit}
                    />
                </div>
                <div className='content-block'>
                    <h2>Памятка</h2>
                    <ul>
                        <li>Предупреждайте близких о том, куда и с кем идёте гулять</li>
                        <li>Встречайтесь в людных местах</li>
                        <li>Избегайте скромных переулков</li>
                        <li>Не принимайте и не отдавайте деньги</li>
                        <li>Не садитесь в машину и не заходите домой</li>
                        <li>Не бойтесь говорить НЕТ</li>
                    </ul>
                </div>
                <footer className='content-block'>
                    <p><a href={PRIVACY_LINK}>Политика и Правила сервиса</a></p>
                    <p><a href="" onClick={(e) => handleDelete(e)}>Удалить аккаунт</a></p>
                    <p>(c) 2026, Nighdee, All rights reserved</p>
                </footer>
            </div>
        </div>
    );
};

export default Sidebar;