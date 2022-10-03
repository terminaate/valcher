import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import ShopPage from '@/pages/ShopPage';
import AuthorizedRoute from './AuthorizedRoute';
import InventoryPage from '../pages/InventoryPage';
import ContractsPage from '../pages/ContractsPage';

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
				<Route
					path={'/inventory'}
					element={
						<AuthorizedRoute>
							<InventoryPage />
						</AuthorizedRoute>
					}
				/>
				<Route
					path={'/inventory'}
					element={
						<AuthorizedRoute>
							<InventoryPage />
						</AuthorizedRoute>
					}
				/>
				<Route
					path={'/contracts'}
					element={
						<AuthorizedRoute>
							<ContractsPage />
						</AuthorizedRoute>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
};

export default Routing;
