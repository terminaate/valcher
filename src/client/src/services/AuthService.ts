import $api from '@/http';
import { AxiosResponse } from 'axios';

class AuthService {
	static async auth(
		puuid?: string,
		username?: string,
		password?: string
	): Promise<AxiosResponse<{ puuid: string }>> {
		if (puuid) {
			return await $api.post<{ puuid: string }>('/auth', { puuid });
		} else {
			return await $api.post<{ puuid: string }>('/auth', {
				username,
				password,
			});
		}
	}
}

export default AuthService;
