import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages } from '../actions/chatAction';
import { ChatMessageType } from '../reducers/chatReducer';
import { SigninType } from '../reducers/userReducer';
import { initialAppStateType } from '../store';

export interface MessagecontentsPropsType {
    messages: ChatMessageType | undefined;
    signinInfo: SigninType;
    chatArr: ChatMessageType[];
}

export const MessageContents: React.FC<MessagecontentsPropsType> = ({ messages, signinInfo, chatArr }) => {


    console.log('chatArr: =>>>>> ', chatArr)


    const dispatch = useDispatch();



    const messageSender = (message: ChatMessageType) => {
        const isMine = message.sender._id === signinInfo._id;
        const liClassName = isMine ? "mine" : "theirs";
        return liClassName;
    }



    return (
        <>
            {// <div>채팅</div>
                chatArr &&
                chatArr.map((message) => {


                    return (
                        <li className={`message ${messageSender(message)}`} key={message._id}>
                            <div className="messageContainer">
                                <span className="messageBody">
                                    {message.content}
                                </span>
                            </div>
                        </li>
                    )
                })
            }
        </>
    )
}
