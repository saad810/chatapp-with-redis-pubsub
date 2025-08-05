import { Server } from "socket.io";

class SocketService {
    private _io: Server;
    constructor() {
        console.log("init socket service");
        this._io = new Server({
            cors: {
                allowedHeaders:["*"],
                origin:"*",
            }
        });
    }
    public initListener() {
        const io = this._io;
        console.log("init socket listener");
        io.on("connection", (socket) => {
            console.log("New client connected",socket.id);
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("Received message:", message);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });

            // Add more event listeners as needed
        });
    }
    get io() {
        return this._io;
    }
}

export default SocketService;
