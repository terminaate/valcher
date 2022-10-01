import React, {FC, useEffect} from 'react';
import {useNavigate} from "react-router-dom";

interface IAuthorizedRoute {
    children: JSX.Element
}

const AuthorizedRoute: FC<IAuthorizedRoute> = ({children}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("puuid")) {
            navigate("/")
        }
    }, [])

    return children;
};

export default AuthorizedRoute;