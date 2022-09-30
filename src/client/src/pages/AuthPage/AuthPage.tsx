import React, {useEffect} from 'react';
import BasicPage from "../../components/BasicPage";
import cl from "./AuthPage.module.scss"
import useInputState from "../../../hooks/useInputState";
import {useAppDispatch, useAppSelector} from "../../store";
import {auth, getUserInfo} from "../../store/reducers/user/userAPI";

const AuthPage = () => {
    const [username, onUsernameChange] = useInputState("");
    const [password, onPasswordChange] = useInputState("");
    const dispatch = useAppDispatch();
    const {authorized, user} = useAppSelector(state => state.userSlice)

    const authAttempt = () => {
        dispatch(auth({username, password}))
        localStorage.setItem("rememberMe", "false")
    }

    const getUser = () => {
        dispatch(getUserInfo())
    }

    useEffect(() => {
        console.log(authorized)
    }, [authorized])

    return (
        <BasicPage pageClassName={cl.authPage}>
            <div className={cl.authPageContainer}>
                <input type="text" value={username} onChange={onUsernameChange} placeholder={"Username"}/>
                <input type="text" value={password} onChange={onPasswordChange} placeholder={"Username"}/>
                <button onClick={authAttempt}>Auth</button>
                <button onClick={getUser}>Get</button>
                {JSON.stringify(user)}
            </div>
        </BasicPage>
    );
};

export default AuthPage;