import { postSchemaType } from './../models/postTextModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from './../utils/utils';
import express, { Request, Response } from 'express';
import Post from '../models/postTextModel';
import User from '../models/userModel';


const replyRouter = express.Router();


// delete reply
replyRouter.delete('/delete/:replyId/:postId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("리스트 삭제하러 들어옴");
    const replyId = req.params.replyId;
    const postId = req.params.postId;
    await Post.update({ _id: postId }, { $pull: { replies: { _id: replyId } } }); // post에서 _id 가 postId 인것을 찾아서 replies 배열에 _id 가  replyId 인걸 찾아서 pull(remove) 해준다.

    res.status(200).send("Deleted successfully")

}));

// get reply
replyRouter.get('/list/:postId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("리스트 뽑으러 들어옴");
    const postId = req.params.postId;
    const onePost = await Post.find({ _id: postId });
    const post = await User.populate(onePost, { path: "replies.repliedBy" }); //
    const typedPost = post as postSchemaType[];
    const replies = typedPost[0].replies;
    console.log('postreplies: ', typedPost[0].replies);
    res.status(200).send(replies);
}))

export default replyRouter;
