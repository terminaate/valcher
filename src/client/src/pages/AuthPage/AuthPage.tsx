import React from 'react';
import BasicPage from "../../components/BasicPage";
import cl from "./AuthPage.module.scss"

const AuthPage = () => {
    return (
        <BasicPage pageClassName={cl.authPage}>
          <div className={cl.authPageContainer}>

          </div>
        </BasicPage>
    );
};

export default AuthPage;