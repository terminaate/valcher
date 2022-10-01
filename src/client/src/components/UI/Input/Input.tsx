import React, {FC, InputHTMLAttributes, ReactNode} from 'react';
import classNames from "classnames";
import cl from "./Input.module.scss"

interface IInput extends InputHTMLAttributes<any> {
    className?: string;
    placeholder?: string;
    children?: ReactNode
}

const Input: FC<IInput> = ({className, placeholder, children, ...props}) => {
    // const [active, setActive] = useState(false);
    //
    // const event = (value: boolean) => {
    //     const click = () => {
    //         setActive(value)
    //     }
    //
    //     addEventListener("click", click)
    // }

    return (
        // onMouseEnter={() => event(true)} onMouseOut={() => event(true)} data-active={active}
        <label data-type={props.type} className={cl.inputContainer}>
            <input {...props} data-children={Boolean(children)} className={classNames(cl.input, className!)}/>
            <span data-inputed={Boolean(props.value)} className={cl.inputPlaceholder}>{placeholder}</span>
            {props.type === "text" || props.type === "password" ? children : ""}
        </label>
    );
};

export default Input;