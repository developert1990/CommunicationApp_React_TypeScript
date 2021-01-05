import { io, Socket } from 'socket.io-client';


const socket: Socket = io("http://localhost:9003");

export const newNotificationUsingSocket = (userId: string) => {
    console.log("노티피케이션  소켓 함수 들어옴")
    socket.emit("join", userId, (error: Error) => {
        if (error) {
            alert(error);
        }
    })
    socket.emit("newFollower", userId);


}
