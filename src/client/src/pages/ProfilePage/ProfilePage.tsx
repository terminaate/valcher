import React, { useEffect, useRef, useState } from 'react';
import BasicPage from '@/components/BasicPage';
import { useAppDispatch, useAppSelector } from '@/store';
import { getUserInfo } from '@/store/reducers/user/userAPI';
import cl from './ProfilePage.module.scss';
import UserService, { INews } from '@/services/UserService';
import Tooltip from '../../components/Tooltip';

const ProfilePage = () => {
	const dispatch = useAppDispatch();
	const { authorized } = useAppSelector((state) => state.userSlice);
	const wasAuthorized = useRef(false);
	const { user } = useAppSelector((state) => state.userSlice);
	const [news, setNews] = useState<INews[]>([]);

	useEffect(() => {
		if (authorized && !wasAuthorized.current) {
			dispatch(getUserInfo());
			wasAuthorized.current = true;
			return;
		}
	}, [authorized]);

	useEffect(() => {
		UserService.getNews().then((r) => setNews(r.data));
	}, []);

	return (
		<BasicPage pageClassName={cl.userPage}>
			<div className={cl.container}>
				<div className={cl.userInfoContainer}>
					<div
						className={cl.bannerImage}
						style={{ backgroundImage: `url("${user.playerCard?.wideArt}")` }}
					/>
					<div className={cl.userInfo}>
						<div
							className={cl.userAvatar}
							style={{
								backgroundImage: `url("${user.playerCard?.displayIcon}")`,
							}}
						/>
						<div className={cl.userProgressContainer}>
							<div className={cl.userLevelContainer}>
								<Tooltip text={'Your current level'} position={'top'}>
									<span className={cl.currentLvl}>
										{user.playerProgress?.level}
									</span>
								</Tooltip>
								<div className={cl.progressLineContainer}>
									<Tooltip text={'Your current XP'} position={'top'}>
										<span className={cl.currentXp}>
											{user.playerProgress?.xp}
										</span>
									</Tooltip>
									<div className={cl.progressLine}>
										<Tooltip
											position={'top'}
											text={`${user.playerProgress?.xp}/5000`}
										>
											<span style={{ width: user.playerProgress?.xp / 10 }} />
										</Tooltip>
									</div>

									<Tooltip
										text={'How much XP do you need for the next level'}
										position={'top'}
									>
										<span className={cl.goalXp}>5000</span>
									</Tooltip>
								</div>
							</div>
							<div className={cl.userMmrContainer}>
								Here is your rank goes here ;) but rn i don't write this on
								backend
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={cl.newsContainer}>
				{news.map((n, k) => (
					<a
						href={
							n.external_link
								? n.external_link
								: 'https://playvalorant.com/en-us' + n.url.url
						}
						target={'_blank'}
						className={cl.newsLink}
					>
						<div key={k} className={cl.newsBlock}>
							<img src={n.banner.url} className={cl.newsBlockImg} alt="" />
							<div className={cl.newsBlockTitle}>{n.title}</div>
						</div>
					</a>
				))}
			</div>
			{/*<span>Profile Page - {user.puuid}</span>*/}
			{/*<span>Profile Title - {user.playerTitle}</span>*/}
			{/*<button onClick={launchGame}>Launch game</button>*/}
		</BasicPage>
	);
};

export default ProfilePage;
