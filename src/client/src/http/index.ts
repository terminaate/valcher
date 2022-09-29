import axios from "axios";

const baseURL = "http://127.0.0.1:19245"

const $api = axios.create({
    baseURL
})

export default $api