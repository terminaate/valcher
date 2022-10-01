import axios from "axios";
import store from "../store";

export const baseURL = "http://127.0.0.1:19245/api"

const $api = axios.create({
    baseURL
})

$api.interceptors.request.use((config) => {
    if (store.getState().userSlice.authorized && localStorage.getItem('puuid')) {
        config.headers!.Authorization = localStorage.getItem('puuid') + '';
    }
    return config;
});


export default $api