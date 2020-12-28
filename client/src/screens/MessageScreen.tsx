import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatList } from '../actions/chatAction';
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { ChatType } from '../reducers/chatReducer';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { API_BASE } from '../config';


export const MessageScreen = () => {

    const chatListStore = useSelector((state: initialAppStateType) => state.chatListStore);
    const { chatList: chatListInfo, error, loading } = chatListStore;
    console.log('chatListInfo: ', chatListInfo);
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;
    const dispatch = useDispatch();


    const getChatName = (chat: ChatType) => {
        const usersnameArr: string[] = []
        chat.users.map((user) => {
            if (signinInfo._id !== user._id) {
                const username = user.firstName + " " + user.lastName;
                usersnameArr.push(username);
            }
            return "";
        });
        const userNames = usersnameArr.join(", ");
        return userNames
    }

    const getChatImage = (chat: ChatType) => {
        if (chat) {
            return (
                <AvatarGroup max={3} className="chatUser_Avatar">
                    {
                        chat.users.map((user) => {
                            return (
                                <Avatar alt={user.firstName + " " + user.lastName} src={`${API_BASE}/uploads/images/${user.profilePic}`} key={user._id} />
                            )
                        })
                    }
                </AvatarGroup>
            )
        } else {
            return "";
        }
    }

    useEffect(() => {
        dispatch(chatList())
    }, [dispatch])

    return (
        <>
            <div className="mainSectionContainer col-10 col-md-8">
                <div className="titleContainer">
                    <h1>Inbox</h1>
                    <div className="headerButton">
                        <Link to="/message/new"><RateReviewOutlinedIcon /></Link>
                    </div>
                </div>
                {error && error}
                {loading && loading}
                {
                    chatListInfo && chatListInfo.length > 0 ? (
                        <div>
                            {
                                chatListInfo.map((chat) => {
                                    const latestMessage = "This is the latest message";
                                    return (
                                        <Link to={{
                                            pathname: `/message/chatRoom/${chat._id}`,
                                            state: { chat, chatListInfo }
                                        }} className="resultlistitem" key={chat._id}>
                                            {getChatImage(chat)}
                                            <div className="resultsDetailscontainer ellipsis">
                                                <span className="heading ellipsis">{getChatName(chat)}</span>
                                                <span className="subText ellipsis">{latestMessage}</span>
                                            </div>
                                        </Link>
                                    )
                                })
                            }
                        </div>) : (
                            <div>데이터 없음</div>
                        )
                }
            </div>
        </>
    )
}
