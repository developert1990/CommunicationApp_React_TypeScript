import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { getNotification, getUnReadNotification } from '../actions/notificationAction';
import Alert from '@material-ui/lab/Alert';
import { Link, useHistory } from 'react-router-dom';
import { API_BASE } from '../config';
import { getNotificationTextFilter, getNotificationURL } from '../utils/utils';
import { notificationType } from '../reducers/notificationReducer';
import Axios from 'axios';
import { Tooltip } from '@material-ui/core';

export const NotificationScreen = () => {

    const notificationStore = useSelector((state: initialAppStateType) => state.notificationStore);
    const { error, loading, notifications } = notificationStore;
    const dispatch = useDispatch();
    const history = useHistory();


    // 각 알림을 클릭 햇을 경우 db에서 notification collection에 open 을 false 에서 true로 변경하기위함
    const handleNotification = async (notification: notificationType) => {
        console.log('notification: ', notification);
        await Axios.put(`${API_BASE}/notifications/markNotiOpened/${notification._id}`, {}, {
            withCredentials: true,
        });
        // 알림을 읽으면 navbar에 표시된 읽지 않은 알림이 있는지 다시 받아서 숫자를 변경한다.
        dispatch(getUnReadNotification());
    }

    const handleReadAll = async () => {
        await Axios.put(`${API_BASE}/notifications/markAllNotiOpened/`, {}, {
            withCredentials: true,
        });
        // 알림을 한번에 모두 확인(opened = true)로 바꾸는 걸 콜하고 바로 리랜더를 통해서 update된 notifications들을 불러오게 하기 위해서 사용했다.
        dispatch(getNotification());
    }

    const markAllClassName = () => {
        const numOfUnreadNoti = notifications.filter((noti) => noti.opened === false).length

        if (numOfUnreadNoti > 0) {
            return "markAll__active"
        }
        return "markAll__inactive"
    }

    const deleteAllClassName = () => {
        const numOfNotification = notifications.length

        if (numOfNotification > 0) {
            return "deleteAll__active"
        }
        return "deleteAll__inactive"
    }

    const handleDelete = async () => {
        await Axios.delete(`${API_BASE}/notifications/deleteAll/`, {
            withCredentials: true,
        });
        // 알림을 모두 지우고 update된 notifications들을 불러오게 하기 위해서 사용했다.
        dispatch(getNotification());
        // 알림을 모두 지우면 navbar에 표시된 읽지 않은 알림이 있는지 다시 받아서 숫자를 변경한다.
        dispatch(getUnReadNotification());
    }


    useEffect(() => {
        dispatch(getNotification())
    }, [dispatch,])

    return (
        <div className="mainSectionContainer col-10 col-md-8">
            <div className="titleContainer">
                <h1>Notification</h1>
                <Tooltip title="Read All">
                    <button className={`${notifications && markAllClassName()}`} id="markNotificationsAsRead" onClick={handleReadAll}>
                        <i className="fas fa-check-double"></i>
                    </button>
                </Tooltip>
                <Tooltip title="Delete All" className={`${notifications && deleteAllClassName()}`}>
                    <button id="markNotificationsAsRead" onClick={handleDelete}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </Tooltip>
            </div>
            {error && error}
            {loading && loading}
            {
                notifications && notifications.length > 0 ?
                    notifications.map((notification) => {
                        const userFrom = notification.userFrom;
                        const firstName = userFrom.firstName;
                        const lastName = userFrom.lastName;
                        const className = notification.opened ? "notifyInActive" : "notifyActive";

                        return (
                            <Link to={{
                                pathname: `${getNotificationURL(notification)}`,
                                state: notification.userFrom
                            }} key={notification._id} className={`notification resultlistitem ${className}`}
                                onClick={() => handleNotification(notification)}
                            >

                                <div className="userImageContainer">
                                    <img src={`${API_BASE}/uploads/images/${userFrom.profilePic}`} alt="user profile" />
                                </div>

                                <div className="resultsDetailscontainer ellipsis">
                                    <span className="ellipsis">{`${firstName} ${lastName}, ${getNotificationTextFilter(notification)}`}</span>
                                    {/* <Alert className="ellipsis" severity="info">{`${firstName} ${lastName}, ${getNotificationTextFilter(notification)}`}</Alert> */}
                                </div>
                            </Link>
                        )
                    }) : (
                        <Alert severity="warning">You have no Notifications.</Alert>
                    )
            }

        </div>
    )
}
