import { AxiosResponse } from 'axios';
import $api from '@/http';

type User = {
	puuid: string;
	username: string;
	tag: string;
	profileTitle: string;
	profileCard: {
		displayIcon: string;
		smallArt: string;
		wideArt: string;
		largeArt: string;
	};
};

class UserService {
	static async getUserInfo(): Promise<AxiosResponse<User>> {
		return await $api.get<User>('/users/@me');
	}

	static async getNews(): Promise<AxiosResponse> {
		return await $api.get(
			'https://playvalorant.com/page-data/ru-ru/news/page-data.json'
		);
	}

	static async launchGame(): Promise<AxiosResponse> {
		return await $api.post('/launch');
	}
}

export default UserService;
