import React, {useState} from 'react';
import BasicPage from "../../components/BasicPage";
import cl from "./AuthPage.module.scss"
import useInputState from "../../../hooks/useInputState";
import {useAppDispatch, useAppSelector} from "../../store";
import {auth} from "../../store/reducers/user/userAPI";
import Input from "../../components/UI/Input";
import {FaEye, FaEyeSlash, FaUser, FiLogIn} from "react-icons/all";
import Button from "../../components/UI/Button";

const AuthPage = () => {
    const [username, onUsernameChange] = useInputState("");
    const [password, onPasswordChange] = useInputState("");
    const [passwordHidden, setPasswordHidden] = useState(true);
    const dispatch = useAppDispatch();
    const {authorized} = useAppSelector(state => state.userSlice)

    const authAttempt = () => {
        dispatch(auth({username, password}))
        localStorage.setItem("rememberMe", "false")
    }

    // useEffect(() => {
    // }, [authorized])

    return (
        <BasicPage pageClassName={cl.authPage}>
            <div className={cl.authPageContainer}>
                <span className={cl.promptText}>Welcome back!</span>
                <div className={cl.inputsContainer}>
                    <Input type="text" value={username} onChange={onUsernameChange} placeholder={"Username"}>
                        <FaUser/>
                    </Input>
                    <Input type={passwordHidden ? "password" : "text"} value={password} onChange={onPasswordChange}
                           placeholder={"Password"}>
                        <span onClick={() => setPasswordHidden(!passwordHidden)}>
                            {passwordHidden ? <FaEye/> : <FaEyeSlash/>}
                        </span>
                    </Input>
                </div>
                <Button className={cl.authButton} onClick={authAttempt}>
                    <span>Login</span>
                    <FiLogIn/>
                </Button>
            </div>
        </BasicPage>
    );
};

export default AuthPage;