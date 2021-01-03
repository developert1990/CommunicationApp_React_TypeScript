import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatList } from '../actions/chatAction';
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { ChatMessageType, ChatType } from '../reducers/chatReducer';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { API_BASE } from '../config';
import { io, Socket } from 'socket.io-client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Alert from '@material-ui/lab/Alert';
import { SigninType } from '../reducers/userReducer';





export const getChatImage = (chat: ChatType) => {
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


export const MessageScreen = () => {
    const chatListStore = useSelector((state: initialAppStateType) => state.chatListStore);
    const { chatList: chatListInfo, error, loading } = chatListStore;
    // console.log('chatListInfo: ', chatListInfo);
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
                {

                    loading ? <LoadingSpinner /> :
                        error ? <Alert severity="warning">There is an error to load page..</Alert> :
                            chatListInfo && chatListInfo.length === 0 ? (
                                <Alert severity="warning">You have no chats..</Alert>
                            ) : (
                                    <div>
                                        {
                                            chatListInfo.map((chat) => {
                                                // console.log('chat.messages: ', chat.messages)
                                                // console.log('signinInfo._id: ', signinInfo._id)
                                                const numOfUnreadMsg = chat.messages.filter((message) => !message.readBy.includes(signinInfo._id as string & SigninType)).length
                                                // console.log('numOfUnreadMsg: ', numOfUnreadMsg)



                                                const getLatestMessage = () => {
                                                    if (chat.latestMessage && chat.latestMessage !== null) {
                                                        const sender = chat.latestMessage.sender;
                                                        const latestMessageSection = `${sender.firstName} ${sender.lastName}: ${chat.latestMessage.content}`
                                                        return latestMessageSection;
                                                    } else {
                                                        return "No message"
                                                    }
                                                }

                                                return (
                                                    <Link to={{
                                                        pathname: `/message/chatRoom/${chat._id}`,
                                                        state: { chat, chatListInfo }
                                                    }} className="resultlistitem" key={chat._id}>
                                                        {getChatImage(chat)}
                                                        <div className="resultsDetailscontainer ellipsis">
                                                            <span className="heading ellipsis">{chat.chatName ? chat.chatName : getChatName(chat)}</span>
                                                            <span className="subText ellipsis">{getLatestMessage()}</span>
                                                        </div>
                                                        <div>{numOfUnreadMsg}</div>
                                                    </Link>
                                                )
                                            })
                                        }
                                    </div>)
                }
            </div>
        </>
    )
}
