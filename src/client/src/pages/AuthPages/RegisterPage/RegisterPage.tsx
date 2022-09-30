import React from 'react';
import {Link} from "react-router-dom";
import BasicPage from "../../../components/BasicPage/BasicPage";

const RegisterPage = () => {
    return (
        <BasicPage>
            Register page
            <Link to={"/"}>Login page</Link>
        </BasicPage>
    );
};

export default RegisterPage;