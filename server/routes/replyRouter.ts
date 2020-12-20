import { postSchemaType } from './../models/postTextModel';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, getUpdatedPost } from './../utils/utils';
import express, { Request, Response } from 'express';
import Post from '../models/postTextModel';
import User from '../models/userModel';
import { replySchemaType } from './../models/postTextModel';


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

// 여기 add 할때 repliedBy 를 그냥 객체 스트링인 _id를 받아온다 이걸 populate해야한다
// add reply API
replyRouter.put('/add/:postId/:userId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    // console.log('req.body', req.body.reply)
    // console.log('req.body.postId', req.params.postId)

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
        const populatedPostLists = await getUpdatedPost(updatePost);
        res.status(201).send({ message: "Replied successfully", updatePost: populatedPostLists });
    } else {
        res.status(404).send({ message: 'Can not reply on this post' });
    }

}))

export default replyRouter;
