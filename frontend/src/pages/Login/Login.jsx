import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userRequest } from "../../api"
import './Login.css'
import { Dialog, ChildrenAlert } from '../../components/Dialog/Dialog.jsx';



const LoginScreen = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [modal, setModal] = useState({ 
			isOpen: false, 
			title: '', 
			content: null 
		});
	const closeModal = () => setModal({ ...modal, isOpen: false });

	const handleLogin = async () => {
		if (!email || !password) {
			setModal({
				isOpen: true,
				title: "Ошибка",
				content: <ChildrenAlert message="Пожалуйста, введите все данные" onClose={closeModal} />
			});
			return;
		}
		try {
			await userRequest.login(email, password);
			navigate('/');
		} catch(error) {
			setModal({
				isOpen: true,
				title: "Ошибка",
				content: <ChildrenAlert message={error.message} onClose={closeModal} />
			});
		}
	};

	return (
		<div className='standard-window standard-border'>
			<h1>Nighdee. Log in</h1>
			<input
				className='login-panel__input standard-border full-width'
				placeholder="E-mail"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				className='login-panel__input standard-border full-width'
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<input
				className='button button--to-go full-width'
				type="button"
				value="Log in"
				onClick={handleLogin}
			/>
			<input
				className='button full-width'
				type="button"
				value="Register"
				onClick={() => navigate('/register')}
			/>
			{modal.isOpen && (
				<Dialog title={modal.title} onClose={closeModal}>
					{modal.content}
				</Dialog>
			)}
		</div>
	);
};

export { LoginScreen };
