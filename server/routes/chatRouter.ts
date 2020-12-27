import { CustomRequest } from './../types.d';
import User, { UserSchemaType } from './../models/userModel';
import { ChatSchema } from './../models/chatModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from './../utils/utils';
import express, { Request, Response } from 'express';
import Chat from '../models/chatModel';


const chatRouter = express.Router();

// 로그인한 유저의 모든 채팅 리스트 가져온다
chatRouter.get('/list', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const user = req.session.user;

    const chatList = await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } }) // chats collections 에서 users 에 해당 로그인한 유저의 id와 일치하는게 있으면 리턴한다. users 가 오브젝트로 된 값을들 어레이로 가지고 있기 때문에 key:value로 찾을수 없다 그래서 &eq : value 로 사용해준다.
    const populatedChatlist = await User.populate(chatList, { path: "users" });

    console.log('populatedChatlist: ', populatedChatlist)
    if (chatList) {
        res.status(200).send(populatedChatlist)
    } else {
        res.status(400).send({ message: "you got an error to call chat list .." });
    }
}))


// 채팅하기위해 사람들 초대
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