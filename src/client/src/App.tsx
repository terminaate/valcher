import React, { useEffect } from 'react';
import Routing from './components/Routing';
import { useAppDispatch } from './store';
import { auth } from './store/reducers/user/userAPI';
import Loader from './components/Loader';

const App = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!localStorage.getItem('accounts')) {
			localStorage.setItem('accounts', JSON.stringify([]));
		} else if (localStorage.getItem('accessToken')) {
			dispatch(auth({ accessToken: localStorage.getItem('accessToken')! }));
		}
	}, []);

	return (
		<>
			<Loader />
			<Routing />
		</>
	);
};

export default App;
