import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allPostLists, postTextArea } from '../actions/postActions';
import { Posts } from '../components/Posts';
import { UserImage } from '../components/UserImage';
import { initialAppStateType } from '../store';


export const HomeScreen = () => {

    const [text, setText] = useState<string>('');

    const allPostListStroe = useSelector((state: initialAppStateType) => state.allPostListReducer);
    const { allList, error, loading } = allPostListStroe;

    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;

    const postContentStore = useSelector((state: initialAppStateType) => state.postTextStore);
    const { success: postedSuccess, error: errorPostContent, loading: loadingPostContent } = postContentStore;

    const dispatch = useDispatch();


    const textAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const submitPost = () => {
        dispatch(postTextArea(text));
        setText('');
    }


    useEffect(() => {
        dispatch(allPostLists());
    }, [dispatch, postedSuccess])

    return (
        <>
            <div className="mainSectionContainer col-10 col-md-8"> {/* 기본 스크린일때 이 태그의 크기가 10을꽉 채운다 */}
                <div className="titleContainer">
                    <h1>Home</h1>
                </div>
                <div className="postFormContainer">
                    <UserImage userInfo={signinInfo} />
                    <div className="textareaContainer">
                        <textarea className="postTextarea" placeholder="What's happening?" value={text} onChange={textAreaChange}></textarea>
                        <div className="buttonContainer">
                            <button className="submitPostButton" disabled={text ? false : true} onClick={submitPost}>Post</button>
                        </div>
                    </div>
                </div>
                {
                    <div className="posts">
                        {error && "error 떳음"}
                        {loading && "로딩중"}
                        {
                            allList &&
                            allList.map((post) => {
                                return <Posts post={post} key={post.createdAt} />
                            })

                        }
                    </div>
                }
            </div>
        </>
    )
}
