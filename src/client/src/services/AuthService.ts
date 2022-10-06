import $api from '@/http';
import { AxiosResponse } from 'axios';

class AuthService {
	static async auth(
		accessToken?: string,
		username?: string,
		password?: string
	): Promise<AxiosResponse<{ puuid: string }>> {
		// TODO
		// add multifactor auth
		if (accessToken) {
			return await $api.post<{ puuid: string }>('/auth', { accessToken });
		} else {
			return await $api.post<{ puuid: string }>('/auth', {
				username,
				password,
			});
		}
	}
}

export default AuthService;
