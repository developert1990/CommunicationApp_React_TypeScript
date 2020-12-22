import expressAsyncHandler from 'express-async-handler';
import { isAuth } from './../utils/utils';
import multer from 'multer';
import express, { Request, Response } from 'express';
import User from '../models/userModel';
import mongoose from 'mongoose';
import fs from 'fs';

const uploadRouter = express.Router();


// define storage
const storage = multer.diskStorage({
    destination: `./public/uploads/images`,
    filename(req, file, callback) {
        callback(null, `${Date.now()}.jpg`);
    }
});



const upload = multer({ storage }).single('croppedImage'); // productEditScreen 에서 bodyFormdata 의 file 이름을 image라고 해줘서

uploadRouter.post('/profilePicture/:userId/:existingPic', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("프로필 이미지 등록");
    const userId = req.params.userId;
    const existingPic = req.params.existingPic;

    // 기존의 이미지를 삭제하기 위한것 ------------------
    if (existingPic !== "profilePic.png") { // default user이미지는 지우면 안되기 때문에 이렇게 조건을 걸어줌.
        const path = `./public/uploads/images/${existingPic}`;
        fs.unlink(path, (err) => {
            if (err) {
                console.log("err: ", err)
                return;
            }
        });
    }
    // -------------------------------------------------

    upload(req, res, async (err: any) => {
        if (err) { return res.status(404).send({ message: 'Can not upload image' }) };
        // console.log('req.file:___', req.file)

        const fileName = req.file.filename;

        // mongoose에서 findByIdAndUpdate 가 mongoDB의 useFindAndModify` option set to false are deprecated 퇴보된 것이라서 아래 44번 줄 처럼 정의를 해줘야한다.
        mongoose.set('useFindAndModify', false);
        await User.findByIdAndUpdate(userId, { profilePic: fileName }, { new: true });

        return res.send(`${req.file.filename}`)
    })
}));


export default uploadRouter;