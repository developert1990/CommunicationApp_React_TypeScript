import { SigninType } from './userReducer';
import { REPLY_DELETE_REQUEST, REPLY_DELETE_SUCCESS, REPLY_DELETE_FAIL, REPLY_LIST_REQUEST, REPLY_LIST_SUCCESS, REPLY_LIST_FAIL, REPLY_LIST_RESET } from './../constants/replyConstants';
import { replyActionType } from './../actions/types.d';

export interface ReplyListType {
    _id: string;
    repliedBy: SigninType;
    comment: string;
    createdAt: string;
}

export interface ReplyListInitialStateType {
    error: string;
    loading: boolean;
    list: ReplyListType[];
}

export const replyListInitialState: ReplyListInitialStateType = {
    error: '',
    loading: false,
    list: [],
}

export const replyListReducer = (state = replyListInitialState, action: replyActionType) => {
    switch (action.type) {
        case REPLY_LIST_REQUEST:
            return { loading: true };
        case REPLY_LIST_SUCCESS:
            return { loading: false, list: action.payload };
        case REPLY_LIST_FAIL:
            return { loading: false, error: action.payload };
        case REPLY_LIST_RESET:
            return {};
        default:
            return state;
    }
}


export interface ReplyDeleteInitialStatetype {
    error: string;
    loading: boolean;
    success: boolean;
}


export const replyDeleteInitialState: ReplyDeleteInitialStatetype = {
    error: '',
    loading: false,
    success: false,
}

export const replyDeleteReducer = (state = replyDeleteInitialState, action: replyActionType) => {
    switch (action.type) {
        case REPLY_DELETE_REQUEST:
            return { loading: true }
        case REPLY_DELETE_SUCCESS:
            return { loading: false, success: true };
        case REPLY_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

