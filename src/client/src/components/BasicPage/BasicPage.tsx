import React, {FC, ReactNode} from 'react';
import cl from "./BasicPage.module.scss"
import classNames from "classnames";
import NavBar from "../NavBar";

interface IBasicPage {
    children?: ReactNode,
    className?: string;
}

const BasicPage: FC<IBasicPage> = ({children, className}) => {
    return (
        <div className={classNames(cl.basicPage, className)}>
            <NavBar/>
            <div className={cl.pageContainer}>

            </div>
        </div>
    );
};

export default BasicPage;