import React, {FC, ReactNode} from 'react';
import cl from "./BasicPage.module.scss"
import classNames from "classnames";
import AccountSwitcher from "../AccountSwitcher";
import {motion} from "framer-motion";

interface IBasicPage {
    children?: ReactNode,
    className?: string;
    pageClassName?: string;
}

const BasicPage: FC<IBasicPage> = ({children, className, pageClassName}) => {
    return (
        <div className={classNames(cl.basicPage, className!)}>
            <AccountSwitcher/>
            <motion.div transition={{duration: 0.2}} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={classNames(cl.pageContainer, pageClassName!)}>
                {children}
            </motion.div>
        </div>
    );
};

export default BasicPage;