import { isAuth } from './../utils/utils';
import { CustomRequest, userDataType, userFromDBType } from './../types.d';
import express, { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/utils';
import { create } from 'ts-node';

const app = express();

const userRouter = express.Router();

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
            userData.password = bcrypt.hashSync(password, 8);
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
    if (user) { // user found
        if (bcrypt.compareSync(req.body.password, typedUser.password)) {
            req.session.user = typedUser;
            res.send({
                _id: typedUser._id,
                firstName: typedUser.firstName,
                lastName: typedUser.lastName,
                userName: typedUser.userName,
                email: typedUser.email,
                profilePic: typedUser.profilePic,
                likes: typedUser.likes,
                token: generateToken(typedUser)
            });
            return;
        }
    }
    res.status(401).send({ message: "Invalid email or password" });

}));


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


export default userRouter;