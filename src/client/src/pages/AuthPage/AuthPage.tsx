import React, { useState } from 'react';
import BasicPage from '../../components/BasicPage';
import cl from './AuthPage.module.scss';
import useInputState from '../../hooks/useInputState';
import { useAppDispatch, useAppSelector } from '../../store';
import { auth } from '../../store/reducers/user/userAPI';
import Input from '../../components/UI/Input';
import { FaEye, FaEyeSlash, FaPen, FaUser, FiLogIn } from 'react-icons/all';
import Button from '../../components/UI/Button';
import { baseURL } from '../../http';

const AuthPage = () => {
	const [username, onUsernameChange] = useInputState('');
	const [password, onPasswordChange] = useInputState('');
	const [passwordHidden, setPasswordHidden] = useState(true);
	const dispatch = useAppDispatch();
	const [rememberMe, onRememberMeChange] = useInputState(false);
	const { isPending } = useAppSelector((state) => state.userSlice);

	// TODO
	// Shows error

	const authAttempt = () => {
		if (isPending) return;
		dispatch(auth({ username, password }));
		// TODO
		// edit rememberMe system
		if (localStorage.getItem('rememberMe') === null) {
			localStorage.setItem('rememberMe', rememberMe);
		}
	};

	return (
		<BasicPage pageClassName={cl.authPage}>
			<div className={cl.authPageContainer}>
				<span className={cl.promptText}>Welcome back to Valcher!</span>
				<div className={cl.inputsContainer}>
					<Input
						type="text"
						value={username}
						onChange={onUsernameChange}
						placeholder={'Username'}
					>
						<FaUser />
					</Input>
					<Input
						type={passwordHidden ? 'password' : 'text'}
						value={password}
						onChange={onPasswordChange}
						placeholder={'Password'}
					>
						<span onClick={() => setPasswordHidden(!passwordHidden)}>
							{passwordHidden ? <FaEye /> : <FaEyeSlash />}
						</span>
					</Input>
					{localStorage.getItem('rememberMe') === null && (
						<Input
							value={rememberMe}
							onChange={onRememberMeChange}
							placeholder={'Remember me'}
							type={'checkbox'}
						/>
					)}
				</div>
				<Button className={cl.authButton} onClick={authAttempt}>
					<span>Login</span>
					<FiLogIn />
				</Button>
			</div>
			<div
				style={{ backgroundImage: `url("${baseURL}/config/background")` }}
				className={cl.backgroundImage}
			>
				<Button className={cl.editBackgroundImageButton}>
					<FaPen />
				</Button>
			</div>
		</BasicPage>
	);
};

export default AuthPage;
