import { CustomRequest } from './../types.d';
import User, { UserSchemaType } from './../models/userModel';
import { ChatSchema } from './../models/chatModel';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { isAuth } from './../utils/utils';
import express, { Request, Response } from 'express';
import Chat from '../models/chatModel';


const chatRouter = express.Router();

// 로그인한 유저의 모든 채팅 리스트 가져온다
chatRouter.get('/list', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const user = req.session.user;
    // chats collections 에서 users 에 해당 로그인한 유저의 id와 일치하는게 있으면 리턴한다. users 가 오브젝트로 된 값을들 어레이로 가지고 있기 때문에 key:value로 찾을수 없다 그래서 &eq : value 로 사용해준다.
    const chatList = await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } }).populate({ path: "users" }).sort({ updatedAt: -1 })

    console.log('populatedChatlist: ', chatList)
    if (chatList) {
        res.status(200).send(chatList)
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


chatRouter.get('/chatRoom/:chatRoomId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const userId = req.session.user._Id;
    const chatRoomId = req.params.chatRoomId;

    const chat = await Chat.findOne({ _id: chatRoomId, users: { $elemMatch: { $eq: userId } } }).populate("users");
    if (chat) {
        res.status(200).send(chat);
    } else {
        //Check if chat id is really user id
    }
}));

// 프로필에서 메세지 버튼 누르고 1:1 채팅한다.
chatRouter.get('/chatRoom/byUserId/:otherUserId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("1:1 뽕아보러 들어옴")
    const otherUserId = req.params.otherUserId;
    const signinId = req.session.user._id;
    console.log('otherUserId: ', otherUserId)
    console.log('signinId: ', signinId)

    const chat = await Chat.findOneAndUpdate(
        // filter
        {
            isGroupChat: false,
            users: {
                $all: [
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(signinId) } },
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } },
                ]
            }
        },
        // update
        {
            $setOnInsert: {
                users: [mongoose.Types.ObjectId(signinId), mongoose.Types.ObjectId(otherUserId)]
            }
        },
        // option
        {
            new: true,
            upsert: true //  this mean is that if you dont find it, create ! 
        }).populate("users");

    if (chat) {
        res.status(200).send(chat);

    }


}))


export default chatRouter;