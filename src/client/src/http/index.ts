import axios from "axios";

const baseURL = "http://127.0.0.1:19245"

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