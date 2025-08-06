"use client"
import React, { useCallback, useEffect } from "react"
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}
interface IsocketContext {
    sendMessage: (message: string) => any;
    messages: string[];

}

const SocketContext = React.createContext<IsocketContext | null>(null);
export const useSocket = () => {
    const state = React.useContext(SocketContext);
    if (!state) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [messages, setMessages] = React.useState<string[]>([]);

    const sendMessage: IsocketContext["sendMessage"] = useCallback((message) => {
        console.log("Sending message:", message);
        if (socket) {
            socket.emit("event:message", { message });
        } else {
            console.error("Socket is not connected");
        }
    }, [socket]);
    const onMessageRecieved = useCallback((message: string) => {
        console.log("Message received:", message);
        const { message: msg } = JSON.parse(message) as { message: string };
        // console.log("Parsed message:", message);
        setMessages((prevMessages) => [...prevMessages, msg]);
    }, []);

    useEffect(() => {
        const _socket = io("http://localhost:3003")
        _socket.on("event:message", onMessageRecieved);
        setSocket(_socket);
        return () => {
            _socket.off("event:message", onMessageRecieved);
            _socket.disconnect();
            setSocket(null);
        }
    }, []);
    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}