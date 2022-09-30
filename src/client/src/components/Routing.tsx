import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {AnimatePresence} from "framer-motion";
import AuthPage from "../pages/AuthPage";

const Routing = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode={"wait"}>
            <Routes location={location} key={location.pathname}>
                <Route path={"/"} element={<AuthPage/>}/>
            </Routes>
        </AnimatePresence>
    );
};

export default Routing;