import { API_BASE } from './../config/index';
import Axios from 'axios';
import { SEARCH_POSTS_REQUEST, SEARCH_POSTS_SUCCESS, SEARCH_POSTS_FAIL, SEARCH_USERS_REQUEST, SEARCH_USERS_SUCCESS, SEARCH_USERS_FAIL } from './../constants/searchConstants';
import { ThunkDispatch } from 'redux-thunk';

export const searchPosts = (searchText: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: SEARCH_POSTS_REQUEST });
    try {
        const { signinStore: { signinInfo } } = getState();
        const { data } = await Axios.get(`${API_BASE}/search/posts/${searchText}`, {
            headers: { Authorization: `Hong ${signinInfo.token}` },
            withCredentials: true,
        });
        dispatch({ type: SEARCH_POSTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: SEARCH_POSTS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}


export const searchUsers = (searchText: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: SEARCH_USERS_REQUEST });
    try {
        const { signinStore: { signinInfo } } = getState();
        const { data } = await Axios.get(`${API_BASE}/search/users/${searchText}`, {
            headers: { Authorization: `Hong ${signinInfo.token}` },
            withCredentials: true,
        });
        dispatch({ type: SEARCH_USERS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: SEARCH_USERS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}