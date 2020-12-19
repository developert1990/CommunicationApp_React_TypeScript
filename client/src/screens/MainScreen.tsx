import React, { ChangeEvent, useEffect, useState } from 'react';
import { UserImage } from '../components/UserImage';
import { Posts } from '../components/Posts';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { postLists, postTextArea } from '../actions/postActions';

export const MainScreen = () => {

    const userInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = userInfoStore;

    const postContentStore = useSelector((state: initialAppStateType) => state.postTextStore);
    const { success: postedSuccess, error, loading } = postContentStore;

    const postListStore = useSelector((state: initialAppStateType) => state.postListStore);
    const { error: errorList, list: postList, loading: loadingList } = postListStore;

    const postDeleteStore = useSelector((state: initialAppStateType) => state.postDeleteStore);
    const { error: errorDelete, loading: loadingDelete, success: successDelete } = postDeleteStore;


    const [text, setText] = useState<string>('');
    const dispatch = useDispatch();

    const textAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const submitPost = () => {
        dispatch(postTextArea(text));
        setText('');
    }

    useEffect(() => {
        console.log("메인에 유즈이펙트")
        dispatch(postLists());
    }, [dispatch, postedSuccess, successDelete])

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
                            postList &&
                            postList.map((post) => {
                                return <Posts post={post} key={post.createdAt} />
                            })

                        }
                    </div>
                }
            </div>
        </>
    )
}
