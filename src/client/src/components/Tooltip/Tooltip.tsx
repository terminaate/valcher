import React, { FC, ReactNode } from 'react';
import cl from './Tooltip.module.scss';

interface ITooltip {
	children: ReactNode;
	text: string;
	position?: "top" | "left" | "bottom" | "right"
}

const Tooltip: FC<ITooltip> = ({ children, text, position="left" }) => {
	return (
		<div className={cl.tooltipContainer}>
			{children}
			<span data-position={position} className={cl.tooltip}>{text}</span>
		</div>
	);
};

export default Tooltip;
