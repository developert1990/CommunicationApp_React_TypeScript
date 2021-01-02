import { postSchemaType } from './../models/postTextModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, getUpdatedPost } from './../utils/utils';
import express, { Request, Response } from 'express';
import Post from '../models/postTextModel';
import User from '../models/userModel';
import { replySchemaType } from './../models/postTextModel';
import Notification from '../models/notificationModel';


const replyRouter = express.Router();


// delete reply
replyRouter.delete('/delete/:replyId/:postId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("리스트 삭제하러 들어옴");
    const replyId = req.params.replyId;
    const postId = req.params.postId;
    const deletedPost = await Post.update({ _id: postId }, { $pull: { replies: { _id: replyId } } }); // post에서 _id 가 postId 인것을 찾아서 replies 배열에 _id 가  replyId 인걸 찾아서 pull(remove) 해준다.

    const updatedPost = await Post.findOne({ _id: postId });
    const typeUpdatePost = updatedPost as postSchemaType;
    const populatedPostLists = await getUpdatedPost(typeUpdatePost);
    res.status(200).send(populatedPostLists)

}));

// get reply
replyRouter.get('/list/:postId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    console.log("리스트 뽑으러 들어옴");
    const postId = req.params.postId;
    const onePost = await Post.find({ _id: postId });
    const post = await User.populate(onePost, { path: "replies.repliedBy" }); //
    const typedPost = post as postSchemaType[];
    const replies = typedPost[0].replies;
    res.status(200).send(replies);
}));


// add reply API
replyRouter.put('/add/:postId/:userId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    // console.log('req.body', req.body.reply)
    // console.log('req.body.postId', req.params.postId)
    console.log("리플라이 추가하는 api들어옴")
    const postId = req.params.postId;
    const userId = req.params.userId;
    const comment = req.body.reply as string;
    const post = await Post.findById(postId);
    // console.log('post: ', post)

    const typedPost = post as postSchemaType;
    if (typedPost) {
        const reply: replySchemaType = {
            repliedBy: userId,
            comment: comment,
        }

        typedPost.replies.push(reply);
        const updatePost = await typedPost.save();

        // follow 에 관한 notification 해주기 위함
        if (updatePost) {
            // 순서대로 해당포스트를 올린 유저, 해당포스트에 like를 누른 유저(즉 로그인한 유저), notify type, 해당 포스트의 id
            //userTo: string, userFrom: string, notificationType: string, entityId: string
            await Notification.insertNotification(typedPost.postedBy, userId, "reply", typedPost._id)
        }

        const populatedPostLists = await getUpdatedPost(updatePost);
        res.status(201).send({ message: "Replied successfully", updatePost: populatedPostLists });
    } else {
        res.status(404).send({ message: 'Can not reply on this post' });
    }

}))

export default replyRouter;
