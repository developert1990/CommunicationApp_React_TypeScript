import { API_BASE } from './../config/index';
import Axios from 'axios';
import { CHAT_LIST_REQUEST, CHAT_LIST_FAIL, CHAT_LIST_SUCCESS, SELECTED_CHAT_REQUEST, SELECTED_CHAT_SUCCESS } from './../constants/chatConstants';
import { ThunkDispatch } from 'redux-thunk';

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

export const selectedChat = (chatId: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    console.log('chatId: ', chatId)
    dispatch({ type: SELECTED_CHAT_REQUEST });
    try {
        const { data } = await Axios.get(`${API_BASE}/chats/chatRoom/${chatId}`, {
            withCredentials: true,
        });
        console.log('채팅정보 data: ', data)
        dispatch({ type: SELECTED_CHAT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CHAT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}