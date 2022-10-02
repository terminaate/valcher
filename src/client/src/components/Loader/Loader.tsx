import React from 'react';
import { useAppSelector } from '@/store';
import cl from './Loader.module.scss';
import BasicPage from '../BasicPage';
import loaderImg from "!/images/loader.gif";

const Loader = () => {
	const { isPending } = useAppSelector((state) => state.userSlice);

	return (
		<>
			{isPending && (
				<BasicPage
					pageClassName={cl.loadingContainer}
					className={cl.loadingPage}
				>
					<span>Please wait, loading data from server, heres a gif for u while u waiting ;)</span>
					<img src={loaderImg} alt=""/>
				</BasicPage>
			)}
		</>
	);
};

export default Loader;
