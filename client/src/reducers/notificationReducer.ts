import { userDataType } from './../../../server/types.d';
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS, NOTIFICATION_FAIL, NOTIFICATION_RESET, UNREAD_NOTIFICATION_REQUEST, UNREAD_NOTIFICATION_SUCCESS, UNREAD_NOTIFICATION_FAIL, UNREAD_NOTIFICATION_RESET } from './../constants/notificationConstants';
import { notificationActionType } from './../actions/types.d';
export interface notificationType {
    // declare any instance methods here
    _id: string;
    userTo: userDataType;
    userFrom: userDataType;
    notificationType: string;
    opened: boolean;
    entityId: string;
}

export interface notificationInitialStateType {
    error: string;
    loading: boolean;
    notifications: notificationType[];
}

export const notificationInitialState: notificationInitialStateType = {
    error: '',
    loading: false,
    notifications: [],
}

export const notificationReducer = (state = notificationInitialState, action: notificationActionType) => {
    switch (action.type) {
        case NOTIFICATION_REQUEST:
            return { loading: true };
        case NOTIFICATION_SUCCESS:
            return { loading: false, notifications: action.payload };
        case NOTIFICATION_FAIL:
            return { loading: false, error: action.payload };
        case NOTIFICATION_RESET:
            return {};

        default:
            return state;
    }
}

// 어차피 notificationReducer에서 받아오는 값이랑 똑같은 type이기 때문에 그냥 notificationInitialStateType 이거 사용해줌
export const unReadNotificationInitialState: notificationInitialStateType = {
    error: '',
    loading: false,
    notifications: [],
}

export const unReadNotificationReducer = (state = unReadNotificationInitialState, action: notificationActionType) => {
    switch (action.type) {
        case UNREAD_NOTIFICATION_REQUEST:
            return { loading: true };
        case UNREAD_NOTIFICATION_SUCCESS:
            return { loading: false, notifications: action.payload };
        case UNREAD_NOTIFICATION_FAIL:
            return { loading: false, error: action.payload };
        case UNREAD_NOTIFICATION_RESET:
            return {};

        default:
            return state;
    }
}