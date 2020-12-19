import { USER_REGISTER_REQUEST, USER_REGISTER_FAIL, USER_REGISTER_SUCCESS, USER_SINGIN_REQUEST, USER_SINGIN_FAIL, USER_SINGIN_SUCCESS, USER_SIGNOUT, USER_DETAIL_REQUEST, USER_DETAIL_SUCCESS, USER_DETAIL_FAIL, USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAIL } from './../constants/userConstants';
import Axios from 'axios';
import { ThunkDispatch } from 'redux-thunk';
import { API_BASE } from '../config/index';

export const register = (firstName: string, lastName: string, userName: string, email: string, password: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: USER_REGISTER_REQUEST });
    try {
        const { data } = await Axios.post(`${API_BASE}/users/register`, { firstName, lastName, userName, email, password });
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        // dispatch signin success 
        localStorage.setItem('userInfo', JSON.stringify(data));
        // dispatch({ type: USER_REGISTER_RESET });
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const signin = (userName: string, password: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: USER_SINGIN_REQUEST });
    try {
        const { data } = await Axios.post(`${API_BASE}/users/signin`, { userName, password });
        dispatch({ type: USER_SINGIN_SUCCESS, payload: data });
        dispatch({ type: USER_DETAIL_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_SINGIN_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
};

export const signout = () => (dispatch: ThunkDispatch<any, any, any>) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_SIGNOUT });
}

export const userDetail = () => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_DETAIL_REQUEST })
    const { signinStore: { signinInfo } } = getState();
    // console.log('signinInfo', signinInfo)
    try {
        const { data } = await Axios.get(`${API_BASE}/users/detail/${signinInfo._id}`, {
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });

        // console.log("유저 디테일 뽑음", data)
        dispatch({ type: USER_DETAIL_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_DETAIL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}



export const userInfo = (userId: string) => async (dispatch: ThunkDispatch<any, any, any>, getState: () => any) => {
    dispatch({ type: USER_INFO_REQUEST })
    const { signinStore: { signinInfo } } = getState();
    // console.log('signinInfo', signinInfo)
    try {
        const { data } = await Axios.get(`${API_BASE}/users/info/${userId}`, {
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });

        console.log("유저 인포 뽑음", data)
        dispatch({ type: USER_INFO_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_INFO_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}