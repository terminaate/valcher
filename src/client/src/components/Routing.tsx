import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthPage from '../pages/AuthPage';
import ProfilePage from '../pages/ProfilePage';
import ShopPage from '../pages/ShopPage';
import AuthorizedRoute from './AuthorizedRoute';

const Routing = () => {
	const location = useLocation();

	return (
		<AnimatePresence mode={'wait'}>
			<Routes location={location} key={location.pathname}>
				<Route path={'/'} element={<AuthPage />} />
				<Route
					path={'/profile'}
					element={
						<AuthorizedRoute>
							<ProfilePage />
						</AuthorizedRoute>
					}
				/>
				<Route
					path={'/shop'}
					element={
						<AuthorizedRoute>
							<ShopPage />
						</AuthorizedRoute>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
};

export default Routing;
