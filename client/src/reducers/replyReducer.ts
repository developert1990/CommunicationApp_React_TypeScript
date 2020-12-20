import { postDataType } from './postReducer';
import { SigninType } from './userReducer';
import { REPLY_DELETE_REQUEST, REPLY_DELETE_SUCCESS, REPLY_DELETE_FAIL, REPLY_LIST_REQUEST, REPLY_LIST_SUCCESS, REPLY_LIST_FAIL, REPLY_LIST_RESET, REPLY_DELETE_RESET } from './../constants/replyConstants';
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
    result: postDataType | undefined;
}


export const replyDeleteInitialState: ReplyDeleteInitialStatetype = {
    error: '',
    loading: false,
    result: undefined,
}

export const replyDeleteReducer = (state = replyDeleteInitialState, action: replyActionType) => {
    switch (action.type) {
        case REPLY_DELETE_REQUEST:
            return { loading: true }
        case REPLY_DELETE_SUCCESS:
            return { loading: false, result: action.payload };
        case REPLY_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case REPLY_DELETE_RESET:
            return {};
        default:
            return state;
    }
}

