import { UserSchemaType } from './../models/userModel';
import express, { NextFunction } from 'express';
import { Server, Socket } from "socket.io";
import { server } from '../index';

// 이렇게 해주면 cors 에러 안생김
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const chatSocketRouter = () => {
    console.log("채팅 소켓 라우트 들어옴")


    io.on("connection", (socket: Socket) => {
        console.log('We have a new connection!!!');

        socket.on("setup", (userData: UserSchemaType) => {
            console.log('소켓 체크: ', userData.firstName)
            socket.join(userData._id);
            socket.emit("connected")
        });


        socket.on("join room", (room) => socket.join(room));
        socket.on("typing", (room) => socket.in(room).emit("typing"))


    })




    return (req: Request, res: Response, next: NextFunction) => next();

}

export default chatSocketRouter;