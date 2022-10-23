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

export interface INews {
	id: string;
	title: string;
	date: string;
	article_type: string;
	external_link: string;
	banner: {
		url: string;
	};
	category: [
		{
			title: string;
		}
	];
	url: {
		url: string;
	};
}

export interface IStoreItem {

}

class UserService {
	static async getUserInfo(): Promise<AxiosResponse<User>> {
		return await $api.get<User>('/users/@me');
	}

	static async getNews(): Promise<AxiosResponse<INews[]>> {
		return await $api.get<INews[]>('/news');
	}

	static async launchGame(): Promise<AxiosResponse> {
		return await $api.post('/launch');
	}
}

export default UserService;
