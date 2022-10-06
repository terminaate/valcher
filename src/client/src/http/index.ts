import axios from 'axios';
import store from '../store';

export const baseURL = 'http://127.0.0.1:19245/api';

const $api = axios.create({
	baseURL,
	withCredentials: true,
});


$api.interceptors.request.use((config) => {
	if (store.getState().userSlice.authorized && localStorage.getItem('accessToken')) {
		config.headers!.Authorization = `Bearer ${localStorage.getItem(
			'accessToken'
		)}`;
	}
	return config;
});

$api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status === 401 &&
			error.config &&
			!error.config._isRetry &&
			localStorage.getItem('accessToken')
		) {
			originalRequest._isRetry = true;
			try {
				const response = await axios.post<AuthResponse>(
					`${baseURL}/auth/refresh`,
					{},
					{ withCredentials: true }
				);
				store.dispatch(userSlice.actions.updateUser({ authorized: true }));
				localStorage.setItem('accessToken', response.data.accessToken);
				return $api.request(originalRequest);
			} catch (e) {
				store.dispatch(userSlice.actions.updateUser(initialState));
			}
		}
		throw error;
	}
);
// TODO
/* localStorage => {
	username: string;
	accessToken: string;
	avatar: string;
}

*/

export default $api;
