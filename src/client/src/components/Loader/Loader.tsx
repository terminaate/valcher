import React from 'react';
import { useAppSelector } from '../../store';
import cl from './Loader.module.scss';
import BasicPage from '../BasicPage';

const Loader = () => {
	const { isPending } = useAppSelector((state) => state.userSlice);

	return (
		<>
			{isPending && (
				<BasicPage
					pageClassName={cl.loadingContainer}
					className={cl.loadingPage}
				>
					Loading
				</BasicPage>
			)}
		</>
	);
};

export default Loader;
