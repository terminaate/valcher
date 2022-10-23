import React, {FC, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import AuthService from "@/services/AuthService";

interface IAuthorizedRoute {
    children: JSX.Element;
}

const AuthorizedRoute: FC<IAuthorizedRoute> = ({children}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate('/');
        }
        AuthService.auth(localStorage.getItem('accessToken')!).catch(() => navigate("/"))
    }, []);

    return children;
};

export default AuthorizedRoute;
