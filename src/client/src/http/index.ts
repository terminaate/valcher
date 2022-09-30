import axios from "axios";
import store from "../store";
import {userSlice} from "../store/reducers/user/userSlice";

const baseURL = window.origin + "/api"

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