import { SigninType } from './userReducer';
import { CHAT_LIST_REQUEST, CHAT_LIST_SUCCESS, CHAT_LIST_FAIL, CHAT_LIST_RESET, SELECTED_CHAT_REQUEST, SELECTED_CHAT_SUCCESS, SELECTED_CHAT_RESET, SELECTED_CHAT_FAIL } from './../constants/chatConstants';
import { chatListActionType } from './../actions/types.d';

export interface ChatType {
    chatName: string;
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

export interface selectedChatInitialStateType {
    error: string;
    loading: boolean;
    chatData: ChatType | undefined;
}
export const selectedChatInitialState: selectedChatInitialStateType = {
    error: '',
    loading: false,
    chatData: undefined,
}

export const selectedChatReducer = (state = selectedChatInitialState, action: chatListActionType) => {
    switch (action.type) {
        case SELECTED_CHAT_REQUEST:
            return { loading: true };
        case SELECTED_CHAT_SUCCESS:
            return { loading: false, chatData: action.payload };
        case SELECTED_CHAT_FAIL:
            return { loading: false, error: action.payload };
        case SELECTED_CHAT_RESET:
            return {};
        default:
            return state;
    }
}