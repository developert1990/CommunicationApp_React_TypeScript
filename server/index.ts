import { CustomRequest } from './types.d';
import express, { Request, Response } from 'express';
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

dotenv.config();

const app = express();
const PORT = 9003;

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




app.use(cors<cors.CorsRequest>());
app.use(express.json());
app.use(express.static("public"));


app.use(session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
}));

// app.use((req: CustomRequest, res, next) => {
//     console.log('req.session.id', req.session.id)
//     console.log(req.session)
//     next();
// })

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

app.get('/', (req: Request, res: Response) => {
    res.send(`server is running on ${PORT}`)
});

app.listen(PORT, () => {
    console.log("App is listening on port 9003")
});