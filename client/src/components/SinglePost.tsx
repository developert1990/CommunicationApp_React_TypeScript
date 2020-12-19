import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { postDataType, replyType } from '../reducers/postReducer';
import { API_BASE } from '../config';
import { timeDifference } from '../utils/utils';

import Badge from '@material-ui/core/Badge';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import { postDelete } from '../actions/postActions';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { userDetail } from '../actions/userActions';
import { listReply } from '../actions/replyActions';

export interface SinglePostPropsType {
    post: postDataType;
    setShow: Dispatch<SetStateAction<boolean>>;
    handleLikeBtn: (postId: string) => any;
    updatedPostData: postDataType;
    list: replyType[];
}
export const SinglePost: React.FC<SinglePostPropsType> = ({ post, setShow, handleLikeBtn, updatedPostData, list }) => {

    const signinStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinStore;



    const dispatch = useDispatch();

    const { _id, content, createdAt, postedBy, updatedAt } = post;
    const displayName = postedBy?.firstName + " " + postedBy?.lastName;
    const timeStamp = timeDifference(new Date().valueOf(), new Date(createdAt).valueOf());



    const handleDelete = async (postId: string) => {
        dispatch(postDelete(postId));
    }

    const commentsHandle = (postId: string) => {
        dispatch(listReply(postId));
        setShow(true);
    }


    return (
        <div>
            {
                list &&
                <div className="mainContentContainer" >
                    <div className="userImageContainer">
                        <img src={`${API_BASE}/images/${postedBy?.profilePic}`} alt="Profile" />
                    </div>
                    <div className="postContentContainer">
                        <div className="header">
                            <Link to={`/profile/${postedBy?.userName}`} className="displayName">{displayName}</Link>
                            <span className="username">@{postedBy?.userName}</span>
                            <span className="date">{timeStamp}</span>
                            {
                                signinInfo._id === postedBy._id &&
                                <span className="deleteBtn">
                                    <button className="deleteIcon" onClick={() => handleDelete(post._id)}>
                                        <DeleteOutlinedIcon />
                                    </button>
                                </span>
                            }
                        </div>

                        <div className="postBody">
                            <span>{content}</span>
                        </div>
                        <div className="postFooter">
                            <div className="postButtonContainer">
                                <button onClick={() => commentsHandle(post._id)} >
                                    <Badge badgeContent={list.length} color="primary">
                                        <QuestionAnswerOutlinedIcon className={list.length === 0 ? "noReply" : "reply"} />
                                    </Badge>
                                </button>
                            </div>

                            <div className="postButtonContainer">
                                <button onClick={() => handleLikeBtn(post._id)}>
                                    <Badge badgeContent={updatedPostData?.likes.length} color="error">
                                        <FavoriteBorderIcon className={`far fa-heart ${list.length === 0 ? "inactive" : "active"}`} />
                                    </Badge>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
