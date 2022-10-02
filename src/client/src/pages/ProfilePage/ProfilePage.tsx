import React, {useEffect, useRef, useState} from 'react';
import BasicPage from '@/components/BasicPage';
import {useAppDispatch, useAppSelector} from '@/store';
import {getUserInfo} from '@/store/reducers/user/userAPI';
import cl from './ProfilePage.module.scss';
import UserService, { INews } from '@/services/UserService';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const {authorized} = useAppSelector((state) => state.userSlice);
    const wasAuthorized = useRef(false);
    const {user} = useAppSelector((state) => state.userSlice);
    const [news, setNews] = useState<INews[]>([])

    useEffect(() => {
        if (authorized && !wasAuthorized.current) {
            dispatch(getUserInfo());
            wasAuthorized.current = true;
            return;
        }
    }, [authorized]);

    useEffect(() => {
        UserService.getNews().then(r => setNews(r.data))
    }, [])

    const launchGame = async () => {
        try {
            await UserService.launchGame()
            window.close()
        } catch(e: any) {
            console.log("Unexcepted error", e.response.data)
        }
    };

    return (
        <BasicPage pageClassName={cl.userPage}>
            <div className={cl.container}>
                <div
                    className={cl.bannerImage}
                    style={{backgroundImage: `url("${user.playerCard?.wideArt}")`}}
                />
            </div>
            <div className={cl.newsContainer}>
                {news.map((n, k) => (
                    <a href={n.external_link ? n.external_link : "https://playvalorant.com/en-us" + n.url.url} target={"_blank"} className={cl.newsLink}>
                        <div key={k} className={cl.newsBlock}>
                            <img src={n.banner.url} className={cl.newsBlockImg} alt=""/>
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
