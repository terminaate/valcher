import React, {FC, InputHTMLAttributes, ReactNode} from 'react';
import classNames from "classnames";
import cl from "./Input.module.scss"

interface IInput extends InputHTMLAttributes<any> {
    className?: string;
    placeholder?: string;
    children?: ReactNode
}

const Input: FC<IInput> = ({className, placeholder, children, ...props}) => {
    return (
        <label className={cl.inputContainer}>
            <input {...props} data-children={Boolean(children)} className={classNames(cl.input, className!)}/>
            <span data-children={Boolean(children)} data-inputed={Boolean(props.value)} className={cl.inputPlaceholder}>{placeholder}</span>
            {children}
        </label>
    );
};

export default Input;