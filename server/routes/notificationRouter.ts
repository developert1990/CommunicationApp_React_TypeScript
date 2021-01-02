import { CustomRequest } from './../types.d';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from './../utils/utils';
import express, { Response } from 'express';
import Notification from '../models/notificationModel';

const notificationRouter = express.Router();


// 해당 유저가 가지는 notification을 newMessage를 제외하고 다 받는다. 
notificationRouter.get('/', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {

    const signinUserId = req.session.user._id;
    const notifications = await Notification.find({ userTo: signinUserId, notificationType: { $ne: "newMessage" } }).populate("userTo").populate("userFrom").sort({ createdAt: -1 }) // $ne: not equal to

    if (notifications) {
        res.status(200).send(notifications);
    } else {
        res.status(400).send({ message: "There is an error to get notifications.." })
    }

}));

// 해당 유저의 notification 을 확인햇을 경우 opened를 false => true 로 바꾼다.
notificationRouter.put('/markNotiOpened/:notiId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const notificationId = req.params.notiId;
    const markOpenedNoti = await Notification.findByIdAndUpdate(notificationId, { opened: true });
    if (markOpenedNoti) {
        res.status(200).send("Updated the key 'open' to true.");
    } else {
        res.status(400).send({ message: "Can not access this order." })
    }

}));

// 해당 유저의 모든 notification 에서 opened 을 false => true로 바꾼다.
notificationRouter.put('/markAllNotiOpened/', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {

    const signinUserId = req.session.user._id;
    const markAllOpenedNoti = await Notification.updateMany({ userTo: signinUserId }, { opened: true });
    if (markAllOpenedNoti) {
        res.status(200).send("Updated the key 'open' to true on all notifications.");
    } else {
        res.status(400).send({ message: "Can not access this order." })
    }
}));

// 해당유저의 모든 unread notification 받아온다. (읽지 않은 notification 들);
notificationRouter.get('/unread', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("읽지 않은 noti 가지러 들어옴");
    const signinUserId = req.session.user._id;
    const unReadNotification = await Notification.find({ userTo: signinUserId, notificationType: { $ne: "newMessage" }, opened: false }).populate("userTo").populate("userFrom").sort({ createdAt: -1 })
    console.log('unReadNotification', unReadNotification);
    if (unReadNotification) {
        res.status(200).send(unReadNotification);
    } else {
        res.status(400).send({ message: "There is an error to get notifications.." })
    }
}))

export default notificationRouter;