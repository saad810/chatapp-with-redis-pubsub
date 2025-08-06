import { Server } from "socket.io";

import { config } from "dotenv";
import Redis from "ioredis";
import REDIS_URL from "../constants";

config();
// console.log(REDIS_URL)
const pub = new Redis("rediss://default:ATJoAAIjcDE5MzE3OGZjZTEyMDM0YzBiOTQyMWY2NGUyZjE2OTMyNnAxMA@settled-labrador-12904.upstash.io:6379");
const sub = new Redis("rediss://default:ATJoAAIjcDE5MzE3OGZjZTEyMDM0YzBiOTQyMWY2NGUyZjE2OTMyNnAxMA@settled-labrador-12904.upstash.io:6379");


class SocketService {
    private _io: Server;
    constructor() {
        console.log("init socket service");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        sub.subscribe("MESSAGES")
    }
    public initListener() {
        const io = this._io;
        console.log("init socket listener");
        io.on("connection", (socket) => {
            console.log("New client connected", socket.id);
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("Received message:", message);
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });

            // Add more event listeners as needed
        });
        sub.on("message", (channel: string, message: string) => {
            if (channel === "MESSAGES") {
                io.emit("event:message",  message );
            }
        })
    }
    get io() {
        return this._io;
    }
}

export default SocketService;
