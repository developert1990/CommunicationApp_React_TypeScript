import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { getNotification } from '../actions/notificationAction';
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


    const handleNotification = async (notification: notificationType) => {
        console.log('notification: ', notification);
        await Axios.put(`${API_BASE}/notifications/markNotiOpened/${notification._id}`, {}, {
            withCredentials: true,
        });
    }

    const handleReadAll = async () => {
        await Axios.put(`${API_BASE}/notifications/markAllNotiOpened/`, {}, {
            withCredentials: true,
        });
        // 알림을 한번에 모두 확인(opened = true)로 바꾸는 걸 콜하고 바로 리랜더를 통해서 update된 notifications들을 불러오게 하기 위해서 사용했다.
        dispatch(getNotification());

    }


    useEffect(() => {
        dispatch(getNotification())
    }, [dispatch,])

    return (
        <div className="mainSectionContainer col-10 col-md-8">
            <div className="titleContainer">
                <h1>Notification</h1>
                <Tooltip title="Read All">
                    <button id="markNotificationsAsRead" onClick={handleReadAll}>
                        <i className="fas fa-check-double"></i>
                    </button>
                </Tooltip>
                <Tooltip title="Delete All">
                    <button id="markNotificationsAsRead">
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
