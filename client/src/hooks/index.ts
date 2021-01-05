import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url?: string) => {
    let socket: Socket = io(url || "http://localhost:9003");
    useEffect(() => {
        return () => {
            socket.off();
            socket.emit('disconnected');
        }
    }, []);
    return { socket };
}
