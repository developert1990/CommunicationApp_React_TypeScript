import { ChatMessageSchemaType } from './../models/chatMessageModel';
import { CustomRequest } from './../types.d';
import User, { UserSchemaType } from './../models/userModel';
import { ChatSchemaType } from './../models/chatModel';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { isAuth, insertNotification, addUserIdReadBy } from './../utils/utils';
import express, { Request, Response } from 'express';
import Chat from '../models/chatModel';
import Message from '../models/chatMessageModel';
import { config } from 'dotenv/types';

mongoose.set('useFindAndModify', false);


const chatRouter = express.Router();

// 로그인한 유저의 모든 채팅 리스트 가져온다
chatRouter.get('/list', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const user = req.session.user;
    // chats collections 에서 users 에 해당 로그인한 유저의 id와 일치하는게 있으면 리턴한다. users 가 오브젝트로 된 값을들 어레이로 가지고 있기 때문에 key:value로 찾을수 없다 그래서 &eq : value 로 사용해준다.
    const chatList = await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } }).populate({ path: "users" }).populate("latestMessage").populate("messages").sort({ updatedAt: -1 })
    const populateSender = await User.populate(chatList, { path: "latestMessage.sender" });

    if (populateSender) {
        res.status(200).send(populateSender)
    } else {
        res.status(400).send({ message: "you got an error to call chat list .." });
    }
}))


// 채팅하기위해 사람들 초대 채팅방을 만들고 users에 채팅에 초대한 user들을 다 추가해서 최종적으로 방을 만든다.
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
        isGroupChat: userList.length === 2 ? false : true,
    }
    const typedChatData = chatData as ChatSchemaType;

    const chat = await Chat.create(typedChatData);
    if (chat) {
        return res.status(200).send(chat);
    }

}));

// 체팅방 아이디로 해당 채팅 정보 가져온다.
chatRouter.get('/chatRoom/:chatRoomId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const userId = req.session.user._id;
    const chatRoomId = req.params.chatRoomId;
    const chat = await Chat.findOne({ _id: chatRoomId, users: { $elemMatch: { $eq: userId } } }).populate("users");
    // console.log('chat: ', chat)
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


}));


// 채팅 제목 chatName 바꿈
chatRouter.put('/changeChatName/:chatRoomId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const chatRoomId = req.params.chatRoomId;
    const chatName = req.body;
    console.log("제목바꾸는 api")
    const chat = await Chat.findByIdAndUpdate(chatRoomId, chatName);
    const updatedChat = await Chat.findOne({ _id: chatRoomId });
    if (chat) {
        res.status(200).send(updatedChat);
    } else {
        console.log("Can not update chat room name .. ")
        //Check if chat id is really user id
    }
}));

// 채팅 메세지 보냄
chatRouter.post('/sendMessage', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const newMessage = {
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId,
        readBy: req.session.user._id,
    }
    console.log("메세지 생성하기전: ")
    const result = await Message.create(newMessage as ChatMessageSchemaType);
    console.log("메세지 생성하고 넘어감")

    const populatedResult = await result.populate("sender").populate("chat").execPopulate(); //  messages collections 에서 방금 send된 하나의 message
    const message = populatedResult as ChatMessageSchemaType;

    // chat collection 에 messages를 update한다.
    await Chat.findByIdAndUpdate(req.body.chatId, { $push: { messages: result } }, { new: true });

    // 해당채팅방 들어가면 message collection의 readby에 메세지보낸 유저의 아이디가 추가된다. 조건에 $push를 하면 무조건 push 가 되고 addToSet을하면 만약 해당 값이 없을 경우에 push를 한다.
    await addUserIdReadBy(req.body.chatId, req.session.user._id)

    // 메세지를 보내고 나면 채팅 목록이 최근 보낸것부터 정렬이되도록 하기 위해서 업데이트 해줌 데이터를 업데이트 해주면 updatedAt 부분이 update가 되기 때문이다.
    const chat = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: populatedResult })
    const typedChat = chat as ChatSchemaType
    insertNotification(typedChat, message);

    try {
        if (populatedResult) {
            res.status(200).send(populatedResult)
        } else {
            res.status(404).send("Cant not send Message");
        }
    } catch (error) {
        res.status(400).send("You got an error to send message")
    }

}));


// 해당 채당방의 채팅 메세지들 보내는 api
chatRouter.get('/messages/:chatId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("채팅방열었을때 메세지들 보냄")
    const userId = req.session.user._id;
    const chatRoomId = req.params.chatId;


    // 해당채팅방 들어가면 message collection의 readby에 메세지보낸 유저의 아이디가 추가된다. 조건에 $push를 하면 무조건 push 가 되고 addToSet을하면 만약 해당 값이 없을 경우에 push를 한다.
    addUserIdReadBy(chatRoomId, userId)

    const messages = await Message.find({ chat: chatRoomId }).populate("sender");

    if (messages) {
        res.status(200).send(messages);
    } else {
        //Check if chat id is really user id
    }
}));




// // 해당 유저의 모든 채팅룸의 읽지 않은 메세지 받는 api
chatRouter.get('/unreadMessages', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("unread message api 들어옴");
    const userId = req.session.user._id;
    // 해당 유저의 모든 채팅방을 일단 찾는다.
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } }).populate({ path: "users" }).populate("latestMessage").sort({ updatedAt: -1 });
    // 위에서 찾은 채팅방의 id를 array로 뽑는다.
    const chatsId = chats.map((chat) => chat._id);
    // 채팅방의 id를 이용해서 message collection에 chat id와 매칭되고 readBy 에 userId가 포함이 되지 않는 messages들을 찾는다.
    const unreadMsgs = await Message.find({ chat: { $in: chatsId }, readBy: { $nin: userId } });

    res.status(200).send(unreadMsgs);

}))


chatRouter.put('/addUserInReadBy/:chatId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("readBy 바로 추가 하러 들어옴")
    // 해당채팅방 들어가면 message collection의 readby에 메세지보낸 유저의 아이디가 추가된다. 조건에 $push를 하면 무조건 push 가 되고 addToSet을하면 만약 해당 값이 없을 경우에 push를 한다.
    addUserIdReadBy(req.params.chatId, req.session.user._id)
    res.status(200).send("success");
}))



export default chatRouter;
