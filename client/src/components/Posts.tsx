import Axios from 'axios';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userDetail } from '../actions/userActions';
import { API_BASE } from '../config';
import { postDataType } from '../reducers/postReducer';
import { initialAppStateType } from '../store';
import { SinglePost } from './SinglePost';
import { ToggleAlert } from './ToggleAlert';


import { Button, Modal } from 'react-bootstrap';
import { UserImage } from './UserImage';
import { Reply } from './Reply';
import { io, Socket } from 'socket.io-client';
import { newNotificationUsingSocket } from './socketio';
import { useSocket } from '../hooks';

export interface PostsPropsType {
    post: postDataType;
    socket?: Socket;
}

export interface UpdatedPostDataType {
    message: string;
    updatePost: postDataType;
}

export const Posts: React.FC<PostsPropsType> = ({ post, socket }) => {

    const [updatedPostData, setUpdatedPostData] = useState<postDataType>(post);
    const [show, setShow] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>("");

    const signinStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinStore;

    const userDetailStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userInfoDetail } = userDetailStore;


    const dispatch = useDispatch();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    const handleLikeBtn = async (postId: string) => {

        console.log('userInfoDetail: ', userInfoDetail)
        console.log('post: ', post)
        const { data } = await Axios.put(`${API_BASE}/postText/like/${postId}`, userInfoDetail, {
            // headers: { Authorization: `Hong ${signinInfo.token}` },
            withCredentials: true
        });
        const updatedData: UpdatedPostDataType = data;
        const updatedPostedData: postDataType = updatedData.updatePost;
        setUpdatedPostData(updatedPostedData);
        dispatch(userDetail());
        newNotificationUsingSocket(post.postedBy._id);
        // socket.emit("newFollower", post.postedBy._id);
    }




    const handleClose = () => setShow(false);

    const textAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }


    const submitReply = async (postId: string) => {
        const { data } = await Axios.put(`${API_BASE}/reply/add/${postId}/${signinInfo._id}`, { reply: text }, {
            headers: { Authorization: `Hong ${signinInfo.token}` },
            withCredentials: true,
        });
        if (data) {
            console.log('reply 한데이터 :  ', data)
            setOpen(true);
            setAlertMsg("Replied")
            const updatedData: UpdatedPostDataType = data;
            const updatedPostedData: postDataType = updatedData.updatePost;
            newNotificationUsingSocket(post.postedBy._id);
            setUpdatedPostData(updatedPostedData);
        }


        setText('');
    }

    useEffect(() => {
        console.log("라이크 눌러서 여기 들어옴 왜냐하면 updatedPostData(like를 클릭 받은 유저데이터)가 변하기 때문에")
        socket?.emit("newFollower", post.postedBy._id);
    }, [post.postedBy._id, socket, updatedPostData])



    useEffect(() => {
        if (textAreaRef && textAreaRef.current) {
            console.log(textAreaRef.current)
            textAreaRef.current.focus();
        }
    }, [])



    return (
        post &&
        <>
            <SinglePost post={post} setShow={setShow} handleLikeBtn={() => handleLikeBtn(post._id)} updatedPostData={updatedPostData} />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>POST</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal_body_mainContentContainer">
                    <SinglePost post={post} setShow={setShow} handleLikeBtn={() => handleLikeBtn(post._id)} updatedPostData={updatedPostData} />


                    <div className="reply_section">
                        <Reply post={post} signinInfo={signinInfo} updatedPostData={updatedPostData} setUpdatedPostData={setUpdatedPostData} />
                    </div>

                </Modal.Body>

                <Modal.Body>
                    <div className="postFooter">
                        <div className="postFormContainer">
                            <UserImage userInfo={signinInfo} userDetailInfo={userInfoDetail} />
                            <div className="textareaContainer">
                                <textarea className="postTextarea" placeholder="What's happening?" value={text} onChange={textAreaChange} ref={textAreaRef}></textarea>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={text ? false : true} onClick={() => submitReply(post._id)}>
                        Reply
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToggleAlert open={open} handleAlertClose={() => setOpen(false)} alertMsg={alertMsg} />
        </>
    )
}
