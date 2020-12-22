import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE } from '../config';
import { postDataType, replyType } from '../reducers/postReducer';
import { timeDifference, useStyles } from '../utils/utils';
import { deleteReply } from '../actions/replyActions';
import { SigninType } from '../reducers/userReducer';
import { REPLY_DELETE_RESET } from '../constants/replyConstants';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Pagination, { UsePaginationProps } from '@material-ui/lab/Pagination';
import { initialAppStateType } from '../store';

export interface ReplyPropsType {
    post: postDataType;
    signinInfo: SigninType;
    updatedPostData: postDataType;
    setUpdatedPostData?: Dispatch<SetStateAction<postDataType>>;
}

export const Reply: React.FC<ReplyPropsType> = ({ post, signinInfo, updatedPostData, setUpdatedPostData }) => {

    const getRepliedTime = (reply: replyType) => {
        const repliedTime = timeDifference(new Date().valueOf(), new Date(reply.createdAt).valueOf());
        return repliedTime;
    }

    const replyDeleteStore = useSelector((state: initialAppStateType) => state.replyDeleteStore);
    const { error: errorDelete, loading: loadingDelete, result: resultDelete } = replyDeleteStore;


    const dispatch = useDispatch();


    const handleDelete = (replyId: string, postId: string) => {
        dispatch(deleteReply(replyId, postId));
    }

    if (resultDelete && setUpdatedPostData !== undefined) {
        setUpdatedPostData(resultDelete); // delete 하고 난 후에 해당 post데이터를 setUpdatePostData 로 state에 넣어준다. 
        dispatch({ type: REPLY_DELETE_RESET }) // 여기 리셋을 시켜줘야 버그(reply 를 delete 하고난 후에 heart 클릭하면 작동안함) 해결됬음
    }

    const sortedReplies = updatedPostData.replies && updatedPostData.replies.sort((reply_A, reply_B) => {
        const A_time = new Date(reply_A.createdAt).valueOf();
        const B_time = new Date(reply_B.createdAt).valueOf();
        return B_time - A_time;
    });


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
            {console.log('sortedReplies', sortedReplies)}
            { sortedReplies && sortedReplies.length !== 0 &&
                <div >
                    {
                        pageData &&
                        pageData.map((reply) => {
                            return (
                                <div className="each__reply">
                                    <div className="top__reply">
                                        <div className="userImageContainer__reply">
                                            <img src={`${API_BASE}/uploads/images/${reply.repliedBy.profilePic}`} alt="profile" />
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
