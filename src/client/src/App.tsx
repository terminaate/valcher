import React, { useEffect } from 'react';
import Routing from './components/Routing';
import { useAppDispatch } from './store';
import { auth } from './store/reducers/user/userAPI';
import Loader from './components/Loader';

const App = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!localStorage.getItem('puuids')) {
			localStorage.setItem('puuids', JSON.stringify([]));
		} else if (localStorage.getItem('puuid')) {
			dispatch(auth({ puuid: localStorage.getItem('puuid')! }));
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
