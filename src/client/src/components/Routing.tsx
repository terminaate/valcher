import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
import {AnimatePresence} from "framer-motion";

const Routing = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode={"wait"}>
            <Routes location={location} key={location.pathname}>
                <Route path={"/"} element={<LoginPage/>}/>
                <Route path={"/register"} element={<RegisterPage/>}/>
            </Routes>
        </AnimatePresence>
    );
};

export default Routing;