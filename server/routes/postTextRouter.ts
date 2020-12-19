import { replySchemaType } from './../models/postTextModel';
import { isAuth } from './../utils/utils';
import { CustomRequest } from './../types.d';
import expressAsyncHandler from 'express-async-handler';
import express, { Response, Request } from 'express';
import Post, { postSchemaType } from '../models/postTextModel';
import User from '../models/userModel';

const postTextRouter = express.Router();


// post 올리는 API
postTextRouter.post('/upload', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    const contents = req.body.text;
    // 해결... 여기서 req.session에 user가 없음...
    console.log('포스트 할때 req.session: ', req.session)
    if (contents) {
        const postData = {
            content: req.body.text,
            postedBy: req.userId,
        }
        const typedPostData = postData as postSchemaType;
        const post = await Post.create(typedPostData);
        if (post) {
            // 방금 post 한것만 받기
            const newPost = await User.populate(post, { path: "postedBy" }); // postedBy 부분을 populate해서 그 참조하고 있는 값의 객체를 가져온다.
            // post 된 모든거 찾기
            const postLists = await Post.find({ "postedBy": req.userId });
            const populatedPostLists = await User.populate(postLists, { path: "postedBy" });
            res.status(201).send({ message: "Posted successfully", postData: populatedPostLists }); // 201번은 무언가가 성공적으로 create 되었다는 뜻이다.
        } else {
            res.status(401).send({ message: "Can not post your message" });
        }
    } else {
        res.status(400).send({ message: "There is an error to post" });
    }

}));


// post 된 List 뽑은 API
postTextRouter.get('/list', isAuth, expressAsyncHandler(async (req: CustomRequest, res: Response) => {
    console.log("list 뽑으러 들어옴");
    const postLists = await Post.find({ "postedBy": req.userId }).sort({ "createdAt": -1 });
    if (postLists) {
        const populatedPostLists = await User.populate(postLists, [{ path: "postedBy" }, { path: "replies.repliedBy" }]); // 두번째 replies.repliedBy 는 어레이 안에 있는 참조객체를 populate시킴 !!!!!!!!!!!!
        console.log('populatedPostLists: ', populatedPostLists);
        res.status(200).send(populatedPostLists); // 201번은 무언가가 성공적으로 create 되었다는 뜻이다.
    } else {
        res.status(401).send({ message: "Posted data not found" });
    }

}));

// Post에 like button 클릭 API
postTextRouter.put('/like/:postId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const user = req.body;
    // const userId = req.params.userId;
    // console.log('user: ', user)
    const userId = user._id;
    const isLiked = user.likes && user.likes.includes(postId);

    const option = isLiked ? "$pull" : "$addToSet"; // pull은 어레이 remove역할, addToSet 은 push 역할을 한다.
    console.log('isLiked: ', isLiked)
    console.log('option: ', option)
    console.log('userId: ', userId)
    // insert user likes
    await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true });
    // insert post likes

    const updatePost = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true });

    res.status(200).send({ message: "updated", updatePost: updatePost });
}));

// post delete API
postTextRouter.delete('/delete/:postId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.postId);
    console.log('post', post)
    if (post) {
        await post.remove();
        res.status(200).send({ message: "Post deleted" });
    } else {
        res.status(404).send({ message: 'Post Not Found' });
    }
}));


// add reply API
postTextRouter.put('/reply/:postId/:userId', isAuth, expressAsyncHandler(async (req: Request, res: Response) => {
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
        res.status(201).send({ message: "Replied successfully", updatePost: updatePost });
    } else {
        res.status(404).send({ message: 'Can not reply on this post' });
    }



}))



export default postTextRouter;