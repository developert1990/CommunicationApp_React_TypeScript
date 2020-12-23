import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPostsByOneUser } from '../actions/postActions';
import { SigninType } from '../reducers/userReducer';
import { initialAppStateType } from '../store';
import { Reply } from './Reply';

import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import Alert from '@material-ui/lab/Alert';

export const ProfileReplies = () => {

    const location = useLocation();
    const postedUser = location.state;
    const typedPostedUser = postedUser as SigninType;
    const postedUserId = typedPostedUser._id;
    const dispatch = useDispatch();


    const postsByOneUserStore = useSelector((state: initialAppStateType) => state.postListByOneUserStore);
    const { error, list, loading } = postsByOneUserStore;

    useEffect(() => {
        dispatch(getPostsByOneUser(postedUserId));
    }, [dispatch, postedUserId])

    const signinStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinStore;


    if (list) {
        console.log('list', list)
    }

    return (
        <div>
            {error && "error"}
            {loading && "loading"}
            {
                list &&
                list.map((post) => {
                    return (
                        <div className="profileReplies" key={post.createdAt}>
                            <h3>Content</h3>
                            <span>{post.content}</span>
                            {
                                post.replies.length !== 0 ? (
                                    <>
                                        <ReplyAllIcon />
                                        <Reply post={post} signinInfo={signinInfo} updatedPostData={post} />
                                    </>
                                ) : (
                                        <div className="reply__alert">
                                            <Alert severity="warning">No Replies..</Alert>
                                        </div>
                                    )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}
