import Axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { selectedChat } from '../actions/chatAction';
import { API_BASE } from "../config";
import { ChatType } from "../reducers/chatReducer";
import { SigninType } from "../reducers/userReducer";
import { initialAppStateType } from '../store';
import { getChatImage } from "./MessageScreen";


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

    const [chatName, setChatName] = useState<string>("");
    const chatRoomId = location.pathname.split("/")[3];
    const typedLocation = location as locationType;
    // console.log("chatRoomId", chatRoomId);
    console.log("location.state", location.state);

    // console.log(locationState.state.chatListInfo);



    // const chatList = location.state.chatList;

    const selectedChatStore = useSelector((state: initialAppStateType) => state.selectedChatStore);
    const { chatData, error, loading } = selectedChatStore;

    console.log('chatData : ', chatData)



    // Bootstrap modal -------------------------------------------
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSaveClose = async () => {
        setShow(false);
        const { data } = await Axios.put(`${API_BASE}/chats/changeChatName/${chatRoomId}`, { chatName }, {
            withCredentials: true,
        });
        console.log('data: ', data)
        setChatName(data.chatName);
        dispatch(selectedChat(chatRoomId))
    }

    // -------------------------------------------------------------

    const handleChatName = (e: ChangeEvent<HTMLInputElement>) => {
        setChatName(e.target.value);
    }




    useEffect(() => {
        (
            async () => {
                // const chat = typedLocation.state.chat;
                if (typedLocation.state?.chat) {
                    dispatch(selectedChat(chatRoomId))
                } else {
                    const otherUserId = typedLocation.state?.userInfoData?._id;
                    console.log("userInfoId: ", otherUserId);
                    console.log("1:1채팅 열기위해 들어옴")
                    const { data } = await Axios.get(
                        `${API_BASE}/chats/chatRoom/byUserId/${otherUserId}`,
                        {
                            withCredentials: true,
                        }
                    );

                    console.log("1:1 채팅 data: ", data);
                    dispatch(selectedChat(data._id));
                    history.push({ pathname: `/message/chatRoom/${data._id}`, state: "Add string value to avoid 404 error" })
                }
            }
        )();

    }, [chatRoomId, dispatch, history, typedLocation.state?.chat, typedLocation.state?.userInfoData?._id])

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
                                <button onClick={handleShow}>
                                    <i className="far fa-edit"></i>
                                </button>
                            </span>
                        </div>

                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Change Chat name</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input id="chatNameTextbox" type="text" onChange={handleChatName} />
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
                                <div className="chatMessages"></div>
                                <div className="footer">
                                    <textarea
                                        name="messageInput"
                                        placeholder="Type a message..."
                                    />
                                    <button className="sendMessageButton">
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
