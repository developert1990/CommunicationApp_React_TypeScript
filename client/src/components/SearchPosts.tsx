import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SEARCH_POSTS_RESET } from '../constants/searchConstants';
import { postDataType } from '../reducers/postReducer';
import { Posts } from './Posts';

import Alert from '@material-ui/lab/Alert';

interface SearchPostsPropsType {
    posts: postDataType[];
    loadingPosts: boolean;
    errorPosts: string;
}

export const SearchPosts: React.FC<SearchPostsPropsType> = ({ posts, errorPosts, loadingPosts }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        return () => { dispatch({ type: SEARCH_POSTS_RESET }) }
    }, [dispatch])

    return (
        <div>
            {
                loadingPosts ? "Loading..." :
                    errorPosts ? <Alert severity="warning">There is no posts.. Search again!!</Alert> :
                        posts ?
                            posts.map((post) => {
                                return <Posts post={post} key={post.createdAt} />
                            }) : (
                                <Alert severity="info">Search posts !!</Alert>
                            )
            }
        </div>
    )
}
