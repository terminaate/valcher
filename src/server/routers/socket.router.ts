import {Server, Socket} from "socket.io";
import isRunning from "../utils/isRunning";

class SocketRouter {
    private socket: Socket;
    private io: Server;

    constructor(socket: Socket, io: Server) {
        this.socket = socket;
        this.io = io;
        setInterval(() => {
            isRunning('RiotClientServices.exe', (status) => {
                this.io.emit("game:state", status);
            });
        }, 1500);
    }
}

export default SocketRouter