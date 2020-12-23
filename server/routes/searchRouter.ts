import { postSchemaType } from './../models/postTextModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from './../utils/utils';
import express, { Request, Response } from 'express';
import Post from '../models/postTextModel';
import User from '../models/userModel';

const searchRouter = express.Router();

searchRouter.get(`/posts/:searchText`, isAuth, expressAsyncHandler(async (req: Request, res: Response) => {

    console.log("포스트 써치");
    const searchText = req.params.searchText;
    console.log('searchText ===>> ', searchText)
    const searchedPost = await Post.find({ content: { $regex: searchText, $options: "i" } }).populate([{ path: "postedBy" }, { path: "replies.repliedBy" }, { path: "likes" }]); // options 에서 i는 대소문자를 구분하지 않겟다는 의미
    try {
        if (searchedPost.length === 0) {
            res.status(403).send({ message: "No posts found" });
        } else {
            res.status(200).send(searchedPost);
        }
    } catch (error) {
        res.status(400).send({ "error occured": error });
    }
}));

searchRouter.get(`/users/:searchText`, isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("유저 써치");
    const searchText = req.params.searchText;
    console.log('searchText ===>> ', searchText)
    const searchedUsers = await User.find({
        $or: [
            { firstName: { $regex: searchText, $options: "i" } },
            { lastName: { $regex: searchText, $options: "i" } },
            { userName: { $regex: searchText, $options: "i" } },
        ]
    }
    ).populate([{ path: "following" }, { path: "followers" }, { path: "likes" }]); // options 에서 i는 대소문자를 구분하지 않겟다는 의미
    try {
        if (searchedUsers.length === 0) {
            res.status(403).send({ message: "No users found" });
        } else {
            res.status(200).send(searchedUsers);
        }
    } catch (error) {
        res.status(400).send({ "error occured": error });
    }

}));

export default searchRouter;