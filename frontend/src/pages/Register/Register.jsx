import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { userRequest } from "../../api";
import { calculateAge } from '../../utils/DateFucntions';
import { Dialog, ChildrenAlert } from '../../components/Dialog/Dialog.jsx';


const RegScreen = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [consent, setConsent] = useState(false);
    const [modal, setModal] = useState({ 
            isOpen: false, 
            title: '', 
            content: null 
        });
    const closeModal = () => setModal({ ...modal, isOpen: false });
    const PRIVACY_LINK = 
    "https://docs.google.com/document/d/11QdpZhEwXqzgPyeY6tpTM_JyKh28AqKz5OHvJetl2Gg/edit?usp=sharing";

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleRegister = async () => {
        if (!consent) {
            setModal({
                isOpen: true,
                title: "Ошибка",
                content: <ChildrenAlert message="Вы должны согласиться с Политикой и Правилами сервиса" onClose={closeModal} />
            });
            return;
        }
        if (!validateEmail(email)) {
            setModal({
                isOpen: true,
                title: "Ошибка",
                content: <ChildrenAlert message="Некорректный формат почты" onClose={closeModal} />
            });
            return;
        }
        const age = calculateAge(birthdate);
        if (age < 18 || age > 100) {
            setModal({
                isOpen: true,
                title: "Ошибка",
                content: <ChildrenAlert message="Для регистрации в сервисе Вам должно быть больше 18 лет." onClose={closeModal} />
            });
            return;
        }
        const user = {
            name: nickname,
            email: email,
            password: password,
            birthdate: birthdate,
        };

        try {
            await userRequest.register(user);
            navigate('/');
        } catch (error) {
            alert(error.response.data.detail || "Произошла ошибка");
        }
    };

    return (
        <div className="standard-window standard-border">
            <h1>Nighdee. Join us!</h1>
            <input
                type="email"
                className="standard-border full-width"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="standard-border full-width"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
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
            <div style={{display: 'flex'}}>
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                />
                <p>
                    Я соглашаюсь с <a href={PRIVACY_LINK}>Политикой и Правилами сервиса</a>
                </p>
            </div>
            <input
                className="button button--to-go full-width"
                type="button"
                value="Register"
                onClick={handleRegister}
            />
            <input
                className="button full-width"
				type="button"
				value="Log in"
				onClick={() => navigate('/login')}
			/>
            {modal.isOpen && (
                <Dialog title={modal.title} onClose={closeModal}>
                    {modal.content}
                </Dialog>
            )}
        </div>
    );
};

export { RegScreen };
