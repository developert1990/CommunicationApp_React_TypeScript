import { API_BASE } from './../config/index';
import Axios from 'axios';
import { CHAT_LIST_REQUEST, CHAT_LIST_FAIL, CHAT_LIST_SUCCESS, SELECTED_CHAT_REQUEST, SELECTED_CHAT_SUCCESS, SEND_MESSAGE_REQUEST, SEND_MESSAGE_FAIL, SEND_MESSAGE_SUCCESS, GET_MESSAGES_REQUEST, GET_MESSAGES_FAIL, GET_MESSAGES_SUCCESS, GET_UNREAD_MESSAGES_REQUEST, GET_UNREAD_MESSAGES_FAIL, GET_UNREAD_MESSAGES_SUCCESS } from './../constants/chatConstants';
import { ThunkDispatch } from 'redux-thunk';

// 해당 유저의 모든 채팅 리스트 뽑음
export const chatList = () => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: CHAT_LIST_REQUEST });
    try {
        const { data } = await Axios.get(`${API_BASE}/chats/list`, {
            withCredentials: true,
        });
        dispatch({ type: CHAT_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: CHAT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

// 채팅룸 선택
export const selectedChat = (chatId: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: SELECTED_CHAT_REQUEST });
    try {
        const { data } = await Axios.get(`${API_BASE}/chats/chatRoom/${chatId}`, {
            withCredentials: true,
        });
        // console.log('채팅정보 data: ', data)
        dispatch({ type: SELECTED_CHAT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CHAT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
};

// message 보냄
export const sendChatMessage = (content: string, chatId: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: SEND_MESSAGE_REQUEST });
    try {
        const { data } = await Axios.post(`${API_BASE}/chats/sendMessage/`, { content, chatId }, {
            withCredentials: true
        });
        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: SEND_MESSAGE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

// 해당채팅룸의 메세지 받으러 들어옴
export const getChatMessages = (chatId: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: GET_MESSAGES_REQUEST });
    console.log("채팅메세지 받으러 action")
    try {
        const { data } = await Axios.get(`${API_BASE}/chats/messages/${chatId}`, {
            withCredentials: true,
        });
        dispatch({ type: GET_MESSAGES_SUCCESS, payload: data })

    } catch (error) {
        dispatch({
            type: GET_MESSAGES_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}



// 해당 유저의 모든 채팅룸의 읽지 않은 메세지 받기
export const getUnreadMessages = () => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: GET_UNREAD_MESSAGES_REQUEST });
    try {
        const { data } = await Axios.get(`${API_BASE}/chats/unreadMessages`, {
            withCredentials: true,
        });
        console.log('읽지 않은 ㅁㅔ세지 data: ', data)
        dispatch({ type: GET_UNREAD_MESSAGES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: GET_UNREAD_MESSAGES_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}