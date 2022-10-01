import React from 'react';
import {useAppSelector} from "../../store";
import cl from "./Loader.module.scss";
import {AnimatePresence, motion} from "framer-motion";
import BasicPage from "../BasicPage";

const Loader = () => {
    const {isPending} = useAppSelector(state => state.userSlice);

    return (
        <AnimatePresence>
            {isPending && (
                <BasicPage className={cl.loadingPage}>
                    Loading
                </BasicPage>
            )}
        </AnimatePresence>
    );
};

export default Loader;