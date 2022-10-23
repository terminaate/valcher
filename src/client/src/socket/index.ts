import {io} from "socket.io-client";
import {serverURL} from "@/http";

const socket = io(serverURL, {withCredentials: true});

export default socket;
