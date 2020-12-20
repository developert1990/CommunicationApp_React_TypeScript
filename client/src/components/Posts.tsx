import Axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userDetail } from '../actions/userActions';
import { API_BASE } from '../config';
import { postDataType } from '../reducers/postReducer';
import { initialAppStateType } from '../store';
import { SinglePost } from './SinglePost';

import { Button, Modal } from 'react-bootstrap';
import { UserImage } from './UserImage';
import { Reply } from './Reply';

export interface PostsPropsType {
    post: postDataType;
}

export interface UpdatedPostDataType {
    message: string;
    updatePost: postDataType;
}

export const Posts: React.FC<PostsPropsType> = ({ post }) => {
    const [updatedPostData, setUpdatedPostData] = useState<postDataType>(post);
    const [show, setShow] = useState(false);
    const [text, setText] = useState<string>('');


    const signinStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinStore;

    const userDetailStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userInfoDetail } = userDetailStore;


    const dispatch = useDispatch();


    const handleLikeBtn = async (postId: string) => {
        console.log('userInfoDetail: ', userInfoDetail)
        const { data } = await Axios.put(`${API_BASE}/postText/like/${postId}`, userInfoDetail, {
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });
        const updatedData: UpdatedPostDataType = data;
        const updatedPostedData: postDataType = updatedData.updatePost;
        setUpdatedPostData(updatedPostedData);
        dispatch(userDetail());
    }




    const handleClose = () => setShow(false);

    const textAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }


    const submitReply = async (postId: string) => {
        const { data } = await Axios.put(`${API_BASE}/reply/add/${postId}/${signinInfo._id}`, { reply: text }, {
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });

        const updatedData: UpdatedPostDataType = data;
        const updatedPostedData: postDataType = updatedData.updatePost;
        setUpdatedPostData(updatedPostedData);

        setText('');
    }





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
                            <UserImage userInfo={signinInfo} />
                            <div className="textareaContainer">
                                <textarea className="postTextarea" placeholder="What's happening?" value={text} onChange={textAreaChange}></textarea>
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
        </>
    )
}
