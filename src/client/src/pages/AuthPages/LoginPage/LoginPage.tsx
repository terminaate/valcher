import React from 'react';
import {Link} from "react-router-dom";
import BasicPage from "../../../components/BasicPage/BasicPage";

const LoginPage = () => {
    return (
        <BasicPage>
            Login page
            <Link to={"/register"}>Register page</Link>
        </BasicPage>
    );
};

export default LoginPage;