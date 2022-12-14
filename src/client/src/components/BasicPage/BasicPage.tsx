import React, { FC, ReactNode } from 'react';
import cl from './BasicPage.module.scss';
import classNames from 'classnames';
import AccountSwitcher from '../AccountSwitcher';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import NavBar from '../NavBar';
import { useLocation } from 'react-router-dom';

interface IBasicPage {
	children?: ReactNode;
	className?: string;
	pageClassName?: string;
}

const BasicPage: FC<IBasicPage> = ({ children, className, pageClassName }) => {
	const { authorized } = useAppSelector((state) => state.userSlice);
	const location = useLocation();

	return (
		<div className={classNames(cl.basicPage, className!)}>
			{authorized && (
				<>
					<AccountSwitcher />
					{location.pathname !== '/' && <NavBar />}
				</>
			)}
			<motion.div
				data-border-radius={authorized}
				transition={{ duration: 0.2 }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className={classNames(cl.pageContainer, pageClassName!)}
			>
				{children}
			</motion.div>
		</div>
	);
};

export default BasicPage;
