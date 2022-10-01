import React from 'react';
import {useAppSelector} from "../../store";
import cl from "./Loader.module.scss";
import {AnimatePresence, motion} from "framer-motion";

const Loader = () => {
    const {isPending} = useAppSelector(state => state.userSlice);

    return (
        <AnimatePresence>
            {isPending && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={cl.loadingPage}>
                    Loading
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;