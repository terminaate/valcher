import React, { useEffect, useRef, useState } from 'react';
import BasicPage from '../../components/BasicPage';
import { useAppDispatch, useAppSelector } from '../../store';
import { getUserInfo } from '../../store/reducers/user/userAPI';
import cl from './ProfilePage.module.scss';
import UserService from '../../services/UserService';

const ProfilePage = () => {
	const dispatch = useAppDispatch();
	const { authorized } = useAppSelector((state) => state.userSlice);
	const wasAuthorized = useRef(false);
	const { user } = useAppSelector((state) => state.userSlice);

	useEffect(() => {
		if (authorized && !wasAuthorized.current) {
			dispatch(getUserInfo());
			wasAuthorized.current = true;
			return;
		}
	}, [authorized]);

	const launchGame = () => {
		UserService.launchGame().then(() => {
			window.close();
		});
	};

	return (
		<BasicPage pageClassName={cl.userPage}>
			<div className={cl.container}>
				<div
					className={cl.bannerImage}
					style={{ backgroundImage: `url("${user.playerCard?.wideArt}")` }}
				/>
			</div>
			<div className={cl.newsContainer}>News</div>
			{/*<span>Profile Page - {user.puuid}</span>*/}
			{/*<span>Profile Title - {user.playerTitle}</span>*/}
			{/*<button onClick={launchGame}>Launch game</button>*/}
		</BasicPage>
	);
};

export default ProfilePage;
