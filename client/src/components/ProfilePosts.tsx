import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPostsByOneUser } from '../actions/postActions';
import { SigninType } from '../reducers/userReducer';
import { initialAppStateType } from '../store';
import { LoadingSpinner } from './LoadingSpinner';
import { Posts } from './Posts';

export const ProfilePosts = () => {
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


    return (
        <div className="posts">
            {error && "error 떳음"}
            {loading && <LoadingSpinner />}
            {
                list &&
                list.map((post) => {
                    return <Posts post={post} key={post.createdAt} />
                })

            }
        </div>
    )
}
