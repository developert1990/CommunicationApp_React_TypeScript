import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPostsByOneUser } from '../actions/postActions';
import { postDataType } from '../reducers/postReducer';
import { SigninType } from '../reducers/userReducer';
import { initialAppStateType } from '../store';
import { Reply } from './Reply';

import ReplyAllIcon from '@material-ui/icons/ReplyAll';

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
                        <div className="profileReplies">
                            <h3>Content</h3>
                            <span>{post.content}</span>
                            <ReplyAllIcon />
                            <Reply post={post} signinInfo={signinInfo} updatedPostData={post} />
                        </div>
                    )
                })
            }
        </div>
    )
}
