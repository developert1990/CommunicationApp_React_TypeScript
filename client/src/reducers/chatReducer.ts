import { SigninType } from './userReducer';
import { CHAT_LIST_REQUEST, CHAT_LIST_SUCCESS, CHAT_LIST_FAIL, CHAT_LIST_RESET } from './../constants/chatConstants';
import { chatListActionType } from './../actions/types.d';

export interface ChatType {
    chatname: string;
    createdAt: string;
    isGroupChat: boolean;
    lastestMessage: string[];
    updatedAt: string;
    users: SigninType[];
    _id: string;
}

export interface chatListInitialStateType {
    error: string;
    loading: boolean;
    chatList: ChatType[];
}
export const chatListinitialState: chatListInitialStateType = {
    error: '',
    loading: false,
    chatList: [],
}

export const chatListReducer = (state = chatListinitialState, action: chatListActionType) => {
    switch (action.type) {
        case CHAT_LIST_REQUEST:
            return { loading: true };
        case CHAT_LIST_SUCCESS:
            return { loading: false, chatList: action.payload };
        case CHAT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case CHAT_LIST_RESET:
            return {};

        default:
            return state;
    }
}