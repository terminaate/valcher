import $api from "../http";
import {AxiosResponse} from "axios";

class AuthService {
    static async auth(username: string, password: string): Promise<AxiosResponse<{ puuid: string }>> {
        return await $api.post<{ puuid: string }>("/auth", {username, password})
    }
}

export default AuthService