import { ChatMessageSchemaType } from './models/chatMessageModel';
import { UserSchemaType } from './models/userModel';
import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import postTextRouter from './routes/postTextRouter';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import session from 'express-session';
import replyRouter from './routes/replyRouter';
import uploadRouter from './routes/uploadRouter';
import searchRouter from './routes/searchRouter';
import chatRouter from './routes/chatRouter';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { Server, Socket } from "socket.io";
import chatSocketRouter from './routes/chatSocketRouter';
import notificationRouter from './routes/notificationRouter';

dotenv.config();

const app = express();
export const PORT = 9003;
export const server = http.createServer(app);


// server connect
server.listen(PORT, () => {
    console.log("App is listening on port 9003")
});





// mongoDB connect
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/Chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Database connection successfully");
}).catch((err) => {
    console.log("Database connection error " + err);
});


const corsOption = {
    origin: true,
    credentials: true,
    preFlightContinue: true,
}

app.use(cors<cors.CorsRequest>(corsOption));
app.use(express.json());
app.use(express.static("public"));




//redis 스토어를 세션과 연결시킴
const RedisStore = connectRedis(session);

// configure redis client - connect redis server 
const redisClient = redis.createClient(6379, 'localhost');


redisClient.on('error', (err) => {
    console.log('Could not establish a connection with redis ' + err)
});
redisClient.on('connect', (err) => {
    console.log('Connected to redis successfully');
})


// 여기서 프론트에 connect.sid (쿠키값) 를 자동으로 생성해준다. 이렇게 session미들웨어를 설정해놓으면 라우터 요청이 끝나고 자동으로 스토어에 저장을 한다. store를 지정하지 않으면 자동으로 메모리에 저장이 된다.
app.use(session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
        client: redisClient,
        // ttl: 260                  // ttl: 언제 Redis DB에서 세션을 사라지게할지에 대한 만료 시간.
    }),
    cookie: { maxAge: 6000 * 60 * 60, httpOnly: true, }
}));



app.use((req: Request, res: Response, next: NextFunction) => {
    // console.log('req.session.id 아이디 있는지 검사: ', req.session.id)
    next();
})


// register, signin
app.use('/users', userRouter);

// post Text
app.use('/postText', postTextRouter);

// reply
app.use('/reply', replyRouter);

// upload
app.use('/upload', uploadRouter);

// search
app.use('/search', searchRouter);

// chat
app.use('/chats', chatRouter);

// notification
app.use('/notifications', notificationRouter)

app.get('/', (req: Request, res: Response) => {
    res.send(`server is running on ${PORT}`)
});


// 이렇게 해주면 cors 에러 안생김
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

// const clients: {[key: string]: Socket} = {}

io.on("connect", (socket: Socket) => {
    console.log('소켓 connected!')
    // clients[socket.id] = socket;
    socket.on("join", (room) => {
        console.log('room 방에 들어옴', room)
        socket.join(room)
    });

    socket.on("typing", (room) => {
        // console.log("타이핑 받음")
        // 자신 빼고 다른 유저한테만 보여줌..
        socket.in(room).emit("typing")
    });

    socket.on("noContents", (room) => {
        // console.log("타이핑 다 없앰")
        socket.in(room).emit("noContents")
    })

    socket.on("sendMessage", (room, newMessage) => {
        // console.log('newMessage: ', newMessage)
        // 자신을 포함해서 모든 유저한테 보여줌
        io.to(room).emit("receive message", newMessage)
    });

    // socket.emit()  :  direct 로 emit 하면 나 자신에게만 보임...

    socket.on("newFollower", (userId) => {
        console.log("newFollwer들어옴 방 ===>> ", userId)
        socket.to(userId).emit("receive notification")
    })

    // socket.on("newFollower", (userId, socketId) => {
    //     console.log("newFollwer들어옴 방 ===>> ", userId)
    //     socket.to(userId).emit("receive notification")
    // })




    socket.on('disconnected', () => {
        console.log('User had left!!!');

    })

})







// io.on("connect", (socket: Socket) => {
//     socket.on("setup", (userData: UserSchemaType) => {
//         console.log('We have a new connection!!!');
//         console.log('소켓 체크: ', userData.firstName)
//         socket.join(userData._id);
//         socket.emit("connected")
//     });


//     socket.on("join room", (room) => socket.join(room));
//     socket.on("typing", (room) => socket.in(room).emit("typing"));
//     socket.on("send message", (room, newMessage) => {
//         console.log('newMessage: ', newMessage)
//         socket.in(room).emit("receive message", newMessage)
//     });


//     // socket.on("new message", (newMessage: ChatMessageSchemaType) => {
//     //     const chat = newMessage.chat;
//     //     if (!chat.users) return console.log('Chat.users not defined!!!');

//     //     chat.users.map((user) => {
//     //         if (user._id === newMessage.sender._id) return;
//     //         socket.in(user._id).emit("message received", newMessage);
//     //     })
//     // })

// })




// // chatting socket io
// app.use(chatSocketRouter);

