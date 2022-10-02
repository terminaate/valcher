import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import cl from './Button.module.scss';
import classNames from 'classnames';

interface IButton extends ButtonHTMLAttributes<any> {
	className?: string;
	children?: ReactNode;
}

const Button: FC<IButton> = ({ className, children, ...props }) => {
	return (
		<button className={classNames(cl.button, className!)} {...props}>
			{children}
		</button>
	);
};

export default Button;
