import React, {FC, ReactNode} from 'react';
import cl from "./Tooltip.module.scss"

interface ITooltip {
    children: ReactNode;
    text: string;
}

const Tooltip: FC<ITooltip> = ({children, text}) => {
    return (
        <div className={cl.tooltipContainer}>
            {children}
            <span className={cl.tooltip}>{text}</span>
        </div>
    );
};

export default Tooltip;