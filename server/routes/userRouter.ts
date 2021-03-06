import { UserSchemaType } from './../models/userModel';
import { isAuth } from './../utils/utils';
import { CustomRequest, userDataType, userFromDBType } from './../types.d';
// import express, { Request, Response } from 'express';
import * as Express from 'express';
import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/utils';
import Notification from '../models/notificationModel';


const userRouter = Express.Router();

userRouter.post('/register', expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log('req.body', req.body)
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const email = req.body.email.trim();
    const password = req.body.password;



    if (firstName && lastName && userName && email && password) {
        // userName 이 동일한걸 찾거나(or) email이 동일한걸 찾거나, 즉 먼저 userName과 email이 겹치는게 있는지 먼저 찾아준다.
        const user = await User.findOne({
            $or: [
                { userName: userName }, { email: email }
            ]
        });
        const typedUser = user as userFromDBType;

        console.log('typedUser:  ', typedUser)

        if (user) { // user found
            if (email == typedUser?.email) {
                res.status(403).send({ "message": "Email already in use" })
            } else {
                res.status(403).send({ "message": "Username already in use." })
            }
        } else { // user not found
            console.log('user 생성하러 옴')
            const userData: userDataType = req.body;
            userData.password = await bcrypt.hash(password, 8);
            const user = new User(userData);
            const createdUser = await user.save();
            req.session.user = createdUser;
            const typedCreatedUser = createdUser as userFromDBType;
            res.status(200).send({
                userInfo: {
                    _id: typedCreatedUser._id,
                    firstName: typedCreatedUser.firstName,
                    lastName: typedCreatedUser.lastName,
                    userName: typedCreatedUser.userName,
                    email: typedCreatedUser.email,
                    likes: typedCreatedUser.likes,
                    token: generateToken(typedCreatedUser),
                }, message: "successfully registered"
            });
        }

    } else {
        console.log("에러")
        res.send({ "message": "Make sure each field has a valid value." })
    }

}));


userRouter.post('/signin', expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const user = await User.findOne({ userName: req.body.userName });
    const typedUser = user as userFromDBType;
    // console.log('로그인 할때 req.headers', req.headers.cookie)

    if (user) { // user found
        if (bcrypt.compareSync(req.body.password, typedUser.password)) {
            // console.log("로그인 할경우 signin: ", req.session.user)
            req.session.user = typedUser;
            const token = generateToken(typedUser);
            console.log('token', token)
            if (token) {
                //  secure: true, sameSite: 'none' 추가하면 쿠키 프론트에 전송이 안됨..
                res.cookie('my-token', token, { httpOnly: true, });
            } else {
                res.status(404).send("No token..")
            }
            res.send({
                _id: typedUser._id,
                firstName: typedUser.firstName,
                lastName: typedUser.lastName,
                userName: typedUser.userName,
                email: typedUser.email,
                profilePic: typedUser.profilePic,
                coverPic: typedUser.coverPic,
                likes: typedUser.likes,
                followers: typedUser.followers,
                following: typedUser.following,
            })

            return;
        }
    }
    res.status(401).send({ message: "Invalid email or password" });

}));

userRouter.get('/test', expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("테스트하러들어옴")
    // console.log('req.session.user: ', req.session.user)
}))


userRouter.get('/signout', expressAsyncHandler(async (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.status(200).send({ message: "Logged out successfully" });
    });

}));

userRouter.get('/detail/:userId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.status(200).send(user);
}));

userRouter.get('/info/:userId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.status(200).send(user);
}))

userRouter.put('/follow/:toFollowId', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("팔로우버튼눌러서 들어");
    const toFollowId = req.params.toFollowId;
    const signedUserId = req.session.user._id;
    const user = await User.findById(toFollowId);
    const typedUser = user as UserSchemaType;
    if (user) {
        const isFollowing = typedUser.followers && typedUser.followers.includes(signedUserId);
        const option = isFollowing ? "$pull" : "$addToSet";
        // 로그인한 유저의 계정db에 following 에 내가 follow를 하는 유저의 아이디를 저장
        await User.findByIdAndUpdate(signedUserId, { [option]: { following: toFollowId } }, { new: true });
        // console.log('isFollowing: ', isFollowing)

        // 내가 follow 하는 유저의 계정db에 나를 follow한 유저의 아이디를 저장
        const result = await User.findByIdAndUpdate(toFollowId, { [option]: { followers: signedUserId } }, { new: true });


        // follow 에 관한 notification 해주기 위함
        if (!isFollowing) {
            await Notification.insertNotification(toFollowId, signedUserId, "follow", signedUserId)
        }

        res.status(200).send(result)
    } else {
        res.status(400).send({ message: "No user found" });
    }
}));

userRouter.get('/:selectedUserId/followers', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    // console.log("followers 파퓰레이트d")
    const selectedUserId = req.params.selectedUserId;
    const user = await User.findById({ _id: selectedUserId }).populate("followers");
    const typedUser = user as UserSchemaType;
    const populatedUser = typedUser.populate("followers");
    try {
        res.status(200).send(populatedUser);
    } catch (error) {
        res.status(404).send(error)
    }

}));


userRouter.get('/:selectedUserId/following', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    // console.log("following 파퓰레이트d")
    const selectedUserId = req.params.selectedUserId;
    const user = await User.findById({ _id: selectedUserId }).populate("following");
    const typedUser = user as UserSchemaType;
    const populatedUser = typedUser.populate("following");
    try {
        res.status(200).send(populatedUser);
    } catch (error) {
        res.status(404).send(error)
    }

}));


export default userRouter;