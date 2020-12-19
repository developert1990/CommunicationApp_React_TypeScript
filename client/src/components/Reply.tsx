import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postLists } from '../actions/postActions';
import { API_BASE } from '../config';
import { postDataType, replyType } from '../reducers/postReducer';
import { timeDifference, useStyles } from '../utils/utils';
import { deleteReply, listReply } from '../actions/replyActions';
import { SigninType } from '../reducers/userReducer';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import { initialAppStateType } from '../store';

export interface ReplyPropsType {
    post: postDataType;
    signinInfo: SigninType;
    list: replyType[];
}

export const Reply: React.FC<ReplyPropsType> = ({ post, signinInfo, list }) => {

    const getRepliedTime = (reply: replyType) => {
        const repliedTime = timeDifference(new Date().valueOf(), new Date(reply.createdAt).valueOf());
        return repliedTime;
    }

    const replyDeleteStore = useSelector((state: initialAppStateType) => state.replyDeleteStore);
    const { error: errorDelete, loading: loadingDelete, success: successDelete } = replyDeleteStore;


    const dispatch = useDispatch();


    const handleDelete = (replyId: string, postId: string) => {
        dispatch(deleteReply(replyId, postId));
    }

    const sortedReplies = list && list.sort((reply_A, reply_B) => {
        const A_time = new Date(reply_A.createdAt).valueOf();
        const B_time = new Date(reply_B.createdAt).valueOf();
        return B_time - A_time;
    });

    useEffect(() => {
        // dispatch(listReply(post._id))
    }, [dispatch, post._id, successDelete])


    // pagination
    const classes = useStyles();
    const [page, setPage] = useState<number>(1);
    const [pageData, setPageData] = useState<replyType[]>([]);
    const dataLimit = 5;
    const indexOfLast = page * dataLimit;
    const indexOfFirst = indexOfLast - dataLimit;
    const handlePageChange: UsePaginationProps["onChange"] = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    useEffect(() => {
        if (sortedReplies) {
            setPageData(sortedReplies.slice(indexOfFirst, indexOfLast));
        }
    }, [indexOfFirst, indexOfLast, sortedReplies])

    // ****************************


    return (
        <div>
            { sortedReplies && sortedReplies.length !== 0 &&
                <div >
                    {
                        pageData.map((reply) => {
                            return (
                                <div className="each__reply">
                                    <div className="top__reply">
                                        <div className="userImageContainer__reply">
                                            <img src={`${API_BASE}/images/${reply.repliedBy.profilePic}`} alt="profile" />
                                        </div>
                                        <div className="comment__reply">
                                            <span>{reply.repliedBy.firstName + " " + reply.repliedBy.lastName}</span>
                                            <span> {reply.comment}</span>
                                        </div>

                                        {
                                            (reply._id === post._id || signinInfo._id === post.postedBy._id) &&
                                            <span className="deleteReplyBtn">
                                                <button className="deleteReplyIcon" onClick={() => handleDelete(reply._id, post._id)}>
                                                    <DeleteOutlinedIcon />
                                                </button>
                                            </span>
                                        }
                                    </div>
                                    <div className="time__reply">
                                        {getRepliedTime(reply)}
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        (sortedReplies.length / dataLimit) >= 1 &&
                        <div className={`${classes.root} pagination__reply`}>
                            <Pagination count={Math.ceil(sortedReplies.length / dataLimit)} color="primary" size="small" page={page} onChange={handlePageChange} />
                        </div>
                    }
                </div>
            }
        </div>
    )
}
