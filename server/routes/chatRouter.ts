import { UserSchemaType } from './../models/userModel';
import { ChatSchema } from './../models/chatModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from './../utils/utils';
import express, { Request, Response } from 'express';
import Chat from '../models/chatModel';


const chatRouter = express.Router();


chatRouter.get('/chatList', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    // const chatList = Chat.find({users:${elemMatch: {$eq:}}})
}))


chatRouter.post('/', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    if (!req.body.userList) {
        res.status(400).send({ message: "Error occured" })
    }
    const userList: UserSchemaType[] = JSON.parse(req.body.userList);
    const signinUserDetail: UserSchemaType = JSON.parse(req.body.signinUserDetail);

    if (userList.length === 0) {
        res.status(400).send({ message: "Need to add at least one user to send message" });
    }

    userList.push(signinUserDetail);

    const chatData = {
        users: userList,
        isGroupChat: true,
    }
    const typedChatData = chatData as ChatSchema;

    const chat = await Chat.create(typedChatData);
    if (chat) {
        return res.status(200).send(chat);
    }

}));



export default chatRouter;