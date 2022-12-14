import React, { useState } from 'react';
import BasicPage from '@/components/BasicPage';
import cl from './AuthPage.module.scss';
import useInputState from '@/hooks/useInputState';
import { useAppDispatch, useAppSelector } from '@/store';
import { auth } from '@/store/reducers/user/userAPI';
import Input from '@/components/UI/Input';
import { FaEye, FaEyeSlash, FaPen, FaUser, FiLogIn } from 'react-icons/all';
import Button from '@/components/UI/Button';
import { baseURL } from '@/http';
import tLogoImg from '!/images/transperent_logo.svg';

const AuthPage = () => {
	const [username, onUsernameChange] = useInputState('');
	const [password, onPasswordChange] = useInputState('');
	const [passwordHidden, setPasswordHidden] = useState(true);
	const dispatch = useAppDispatch();
	const { isPending } = useAppSelector((state) => state.userSlice);

	// TODO
	// Shows error

	const authAttempt = () => {
		if (isPending) return;
		dispatch(auth({ username, password }));
	};

	return (
		<BasicPage pageClassName={cl.authPage}>
			<div className={cl.authPageContainer}>
				<div className={cl.promptText}>
					<img src={tLogoImg} alt="" />-<span>Welcome back to Valcher!</span>
				</div>
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
