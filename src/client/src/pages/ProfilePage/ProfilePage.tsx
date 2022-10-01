import React, {useEffect, useRef} from 'react';
import BasicPage from "../../components/BasicPage";
import {useAppDispatch, useAppSelector} from "../../store";
import {getUserInfo} from "../../store/reducers/user/userAPI";
import {useNavigate} from "react-router-dom";

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

    return (
        <BasicPage>
            Profile Page - {user.puuid}
        </BasicPage>
    );
};

export default ProfilePage;