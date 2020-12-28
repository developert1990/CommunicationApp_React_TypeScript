import Axios from 'axios';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { API_BASE } from '../config';
import { ChatType } from '../reducers/chatReducer';
import { SigninType } from '../reducers/userReducer';

interface locationType extends Location {
    state: {
        chat?: ChatType,
        chatListInfo?: ChatType[],
        userInfoData?: SigninType,
    }
}

export const ChatScreen = () => {
    const location = useLocation();
    const chatRoomId = location.pathname.split('/')[3];
    const typedLocation = location as locationType;
    console.log('chatRoomId', chatRoomId)
    console.log('location.state', location.state)
    const otherUserId = typedLocation.state.userInfoData?._id;
    console.log("userInfoId: ", otherUserId);
    // console.log(locationState.state.chatListInfo);
    // const chat = location.state.chat;
    // const chatList = location.state.chatList;


    useEffect(() => {
        (

            async () => {
                if (typedLocation.state.chat) {
                    const { data } = await Axios.get(`${API_BASE}/chats/chatRoom/${chatRoomId}`, {
                        withCredentials: true,
                    });
                    console.log('채팅룸안에 data', data)
                } else {
                    console.log('1:1chat 찾는다.')
                    const { data } = await Axios.get(`${API_BASE}/chats/chatRoom/byUserId/${otherUserId}`, {
                        withCredentials: true,
                    })
                    console.log('1:1 채팅 data: ', data)
                }
            }
        )();
    }, [chatRoomId, typedLocation.state.chat, otherUserId])

    return (
        <>
            {
                location.state ? (
                    <div className="mainSectionContainer col-10 col-md-8">
                        <div className="titleContainer">
                            <h1>채팅 screen</h1>
                        </div>
                    </div>
                ) : (
                        <div className="mainSectionContainer col-10 col-md-8">
                            <div className="titleContainer">
                                <h1>Chat does not exist or you do not have permission to view it</h1>
                            </div>
                        </div>
                    )
            }
        </>
    )
}
