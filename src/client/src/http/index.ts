import axios from "axios";

const baseURL = window.origin + "/api"

const $api = axios.create({
    baseURL
})

$api.interceptors.request.use((config) => {
    if (localStorage.getItem('puuid')) {
        config.headers!.Authorization = localStorage.getItem('puuid') + '';
    }
    return config;
});


export default $api