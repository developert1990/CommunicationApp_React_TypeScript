import { API_BASE } from './../config/index';
import Axios from 'axios';
import { NOTIFICATION_REQUEST, NOTIFICATION_FAIL, NOTIFICATION_SUCCESS, UNREAD_NOTIFICATION_REQUEST, UNREAD_NOTIFICATION_SUCCESS } from './../constants/notificationConstants';
import { ThunkDispatch } from 'redux-thunk';


// 모든 notification 받아오는것
export const getNotification = () => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: NOTIFICATION_REQUEST });
    try {
        const { data } = await Axios.get(`${API_BASE}/notifications`, {
            withCredentials: true,
        })
        dispatch({ type: NOTIFICATION_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: NOTIFICATION_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}


// unread notification 받아오는것
export const getUnReadNotification = () => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch({ type: UNREAD_NOTIFICATION_REQUEST });
    try {
        const { data } = await Axios.get(`${API_BASE}/notifications/unread`, {
            withCredentials: true,
        })
        // console.log('unread data: ', data)
        dispatch({ type: UNREAD_NOTIFICATION_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: NOTIFICATION_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}