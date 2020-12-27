import { API_BASE } from './../config/index';
import Axios from 'axios';
import { CHAT_LIST_REQUEST, CHAT_LIST_FAIL, CHAT_LIST_SUCCESS } from './../constants/chatConstants';
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