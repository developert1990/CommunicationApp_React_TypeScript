import { API_BASE } from './../config/index';
import Axios from 'axios';
import { POST_REQUEST, POST_SUCCESS, POST_FAIL, POST_LIST_REQUEST, POST_LIST_FAIL, POST_LIST_SUCCESS, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DELETE_FAIL } from './../constants/postConstants';
import { ThunkDispatch } from 'redux-thunk';

export const postTextArea = (text: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: POST_REQUEST });
    const { signinStore: { signinInfo } } = getState();
    try {
        const { data } = await Axios.post(`${API_BASE}/postText/upload`, { text }, {
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });
        dispatch({ type: POST_SUCCESS })
    } catch (error) {
        dispatch({
            type: POST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const postLists = () => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: POST_LIST_REQUEST });
    const { signinStore: { signinInfo } } = getState();
    // console.log('signinInfo  postLists에서: ', signinInfo)
    try {
        const { data } = await Axios.get(`${API_BASE}/postText/list`, {
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });
        dispatch({ type: POST_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: POST_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const postDelete = (postId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: POST_DELETE_REQUEST });
    const { signinStore: { signinInfo } } = getState();
    try {
        const { data } = await Axios.delete(`${API_BASE}/postText/delete/${postId}`, {
            headers: { Authorization: `Hong ${signinInfo.token}` },
            data: { signinInfo: signinInfo },
        });
        console.log('delete data: ', data);
        dispatch({ type: POST_DELETE_SUCCESS })
    } catch (error) {
        dispatch({
            type: POST_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}