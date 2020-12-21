import { postDataType } from './postReducer';
import { REPLY_DELETE_REQUEST, REPLY_DELETE_SUCCESS, REPLY_DELETE_FAIL, REPLY_DELETE_RESET } from './../constants/replyConstants';
import { replyActionType } from './../actions/types.d';


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

