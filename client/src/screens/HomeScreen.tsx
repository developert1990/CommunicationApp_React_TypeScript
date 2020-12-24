import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allPostLists, postTextArea } from '../actions/postActions';
import { userDetail } from '../actions/userActions';
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

    const userDetailInfoStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userDetailInfo } = userDetailInfoStore;

    const dispatch = useDispatch();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    const textAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const submitPost = () => {
        dispatch(postTextArea(text));
        setText('');
    }
    console.log('userDetailInfo: 홈스크린에서 ', userDetailInfo?.profilePic);

    useEffect(() => {
        if (textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
        }
        dispatch(allPostLists());
        dispatch(userDetail());
    }, [dispatch, postedSuccess])

    return (
        <>
            <div className="mainSectionContainer col-10 col-md-8"> {/* 기본 스크린일때 이 태그의 크기가 10을꽉 채운다 */}
                <div className="titleContainer">
                    <h1>Home</h1>
                </div>
                <div className="postFormContainer">
                    {/* userDetailInfo를 넘겨주는 이유는 signinInfo는 유저가 로그인할때 그 유저의 데이터이므로 변화가 없다. 그래서 user의 데이터에 변동이있을경우에는 detail을 뽑아서 갱신해주기위함이다. 이렇게 넘겨줘야 user profile photo를 변경할 경우 바로 변경이 된다. */}
                    <UserImage userInfo={signinInfo} userDetailInfo={userDetailInfo} />
                    <div className="textareaContainer">
                        <textarea className="postTextarea" placeholder="What's happening?" value={text} onChange={textAreaChange} ref={textAreaRef}></textarea>
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
