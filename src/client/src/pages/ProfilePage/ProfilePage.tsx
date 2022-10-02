import React, {useEffect, useRef} from 'react';
import BasicPage from "../../components/BasicPage";
import {useAppDispatch, useAppSelector} from "../../store";
import {getUserInfo} from "../../store/reducers/user/userAPI";
import cl from "./ProfilePage.module.scss"
import UserService from "../../services/UserService";

const ProfilePage = () => {
    const dispatch = useAppDispatch()
    const {authorized} = useAppSelector(state => state.userSlice);
    const wasAuthorized = useRef(false);
    const {user} = useAppSelector(state => state.userSlice);

    useEffect(() => {
        if (authorized && !wasAuthorized.current) {
            dispatch(getUserInfo())
            wasAuthorized.current = true;
        }
    }, [authorized])

    const launchGame = () => {
        UserService.launchGame().then(() => {
            window.close()
        })
    }

    return (
        <BasicPage>
            <span>Profile Page - {user.puuid}</span>
            <span>Profile Title - {user.playerTitle}</span>
            <button onClick={launchGame}>Launch game</button>
        </BasicPage>
    );
};

export default ProfilePage;