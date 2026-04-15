import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userRequest } from "../../api"
import './Login.css'



const LoginScreen = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () => {
		if (!email || !password) {
			alert("Пожалуйста, введите все данные");
			return;
		}
		try {
			await userRequest.login(email, password);
			navigate('/');
		} catch(error) {
			alert(error);
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
		</div>
	);
};

export { LoginScreen };
