import {AxiosResponse} from "axios";
import $api from "../http";

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
    }
}

class UserService {
    static async getUserInfo(): Promise<AxiosResponse<User>> {
        return await $api.get<User>("/users/@me")
    }
}

export default UserService