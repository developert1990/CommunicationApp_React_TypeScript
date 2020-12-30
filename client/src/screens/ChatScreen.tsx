import Axios from "axios";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { getChatMessages, selectedChat, sendChatMessage } from '../actions/chatAction';
import { API_BASE } from "../config";
import { ChatMessageType, ChatType } from "../reducers/chatReducer";
import { SigninType } from "../reducers/userReducer";
import { initialAppStateType } from '../store';
import { getChatImage } from "./MessageScreen";
import { MessageContents } from '../components/MessageContents';


interface locationType extends Location {
    state: {
        chat?: ChatType;
        chatListInfo?: ChatType[];
        userInfoData?: SigninType;
    };
}

export const ChatScreen = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();
    const focusRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

    const [chatName, setChatName] = useState<string>("");
    const [msgcontents, setMsgContents] = useState<string>("");
    const chatRoomId = location.pathname.split("/")[3];
    const typedLocation = location as locationType;
    // console.log("chatRoomId", chatRoomId);
    // console.log("location.state", location.state);

    // console.log(locationState.state.chatListInfo);



    // const chatList = location.state.chatList;

    // 내가 로그인한 정보
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo, error: errorSignin, loading: loadingSignin } = signinInfoStore;

    const selectedChatStore = useSelector((state: initialAppStateType) => state.selectedChatStore);
    const { chatData, error, loading } = selectedChatStore;

    const sendChatMessageStore = useSelector((state: initialAppStateType) => state.sendChatMessageStore);
    const { messages } = sendChatMessageStore;

    const getChatMessagesStore = useSelector((state: initialAppStateType) => state.getChatMessagesStore);
    const { messages: getChatMessagesData } = getChatMessagesStore;

    console.log('getChatMessagesData: ', getChatMessagesData)

    // const chatArr: ChatMessageType[] = [];

    // if (getChatMessagesData) {
    //     getChatMessagesData.map((data) => chatArr.push(data));
    // }

    // console.log('messages: ', messages)

    // if (messages) {
    //     chatArr.push(messages);
    // }

    // console.log('chatArr: ', chatArr)


    // Bootstrap modal -------------------------------------------
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        if (focusRef && focusRef.current) {
            focusRef.current.focus();
        }
    }
    const handleSaveClose = async () => {
        setShow(false);
        const { data } = await Axios.put(`${API_BASE}/chats/changeChatName/${chatRoomId}`, { chatName }, {
            withCredentials: true,
        });
        // console.log('data: ', data)
        setChatName(data.chatName);
        dispatch(selectedChat(chatRoomId))
    }

    // -------------------------------------------------------------

    const handleChatName = (e: ChangeEvent<HTMLInputElement>) => {
        setChatName(e.target.value);
    }

    const handleSendMsg = () => {
        console.log("submit");
        if (msgcontents.trim() === "") {
            console.log("서밋안됨: ", msgcontents)
            setMsgContents("");
            return;
        }
        console.log("서밋: ", msgcontents)
        dispatch(sendChatMessage(msgcontents, chatRoomId));
        dispatch(getChatMessages(chatRoomId))
        setMsgContents("");
    }

    const handleSendMsgPress = (event: KeyboardEvent) => {
        event.preventDefault();
        if (msgcontents.trim() === "") {
            console.log("서밋안됨: ", msgcontents)
            setMsgContents("");
            return;
        }
        console.log("서밋: ", msgcontents)
        dispatch(sendChatMessage(msgcontents, chatRoomId));
        setMsgContents("");
    }



    useEffect(() => {
        if (focusRef && focusRef.current) {
            console.log("포커싱바로됨")
            focusRef.current.focus();
        }
        (
            async () => {

                // const chat = typedLocation.state.chat;
                if (typedLocation.state?.chat) {
                    console.log("처음원래 있는 채팅창")
                    dispatch(selectedChat(chatRoomId))
                    dispatch(getChatMessages(chatRoomId))



                } else {
                    const otherUserId = typedLocation.state?.userInfoData?._id;
                    console.log("1:1채팅 열기위해 들어옴")
                    const { data } = await Axios.get(
                        `${API_BASE}/chats/chatRoom/byUserId/${otherUserId}`,
                        {
                            withCredentials: true,
                        }
                    );

                    // console.log("1:1 채팅 data: ", data);
                    dispatch(selectedChat(data._id));
                    history.push({ pathname: `/message/chatRoom/${data._id}`, state: "Add string value to avoid 404 error" })
                }
            }
        )();

    }, [chatRoomId, dispatch, history, typedLocation.state?.chat, typedLocation.state?.userInfoData?._id,]);


    const chatMessagesRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        console.log("한번실행됨: ", chatMessagesRef)
        if (chatMessagesRef && chatMessagesRef.current) {
            const pick = chatMessagesRef.current;
            console.log('pick', pick);
            // chatMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            chatMessagesRef.current!.scrollTop = chatMessagesRef.current!.scrollHeight;
        }
    }, [messages, getChatMessagesData])




    return (
        <>
            {loading && "loading"}
            {error && error}
            {chatData && (
                <div className="mainSectionContainer col-10 col-md-8">
                    <div className="titleContainer">
                        <h1>Chat</h1>
                    </div>
                    <div className="chatPageContainer">
                        <div className="chatTitleBarContainer">
                            {getChatImage(chatData)}
                            <span id="chatName">{chatData.chatName ? chatData.chatName : "This is chat room"}</span>
                            <span className="editChatName">
                                <button className="chatNameBtn" onClick={handleShow}>
                                    <i className="far fa-edit"></i>
                                </button>
                            </span>
                        </div>

                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Change Chat name</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input id="chatNameTextbox" type="text" onChange={handleChatName} ref={focusRef} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSaveClose}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>




                        <div className="mainContentContainer">
                            <div className="chatContainer">
                                <ul className="chatMessages" ref={chatMessagesRef}>
                                    <MessageContents messages={messages} signinInfo={signinInfo} getChatMessagesData={getChatMessagesData} />
                                </ul>
                                <div className="footer">
                                    <textarea
                                        name="messageInput"
                                        placeholder="Type a message..."
                                        value={msgcontents}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMsgContents(e.target.value)}
                                        onKeyPress={(event) =>
                                            event.key === "Enter" && !event.shiftKey ? handleSendMsgPress(event) : null
                                        }
                                        ref={focusRef}
                                    />
                                    <button
                                        className={`sendMessageButton ${msgcontents === "" ? "inActive" : "active"}`}
                                        onClick={handleSendMsg}

                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
