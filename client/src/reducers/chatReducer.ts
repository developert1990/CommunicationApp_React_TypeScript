import { SigninType } from './userReducer';
import { CHAT_LIST_REQUEST, CHAT_LIST_SUCCESS, CHAT_LIST_FAIL, CHAT_LIST_RESET, SELECTED_CHAT_REQUEST, SELECTED_CHAT_SUCCESS, SELECTED_CHAT_RESET, SELECTED_CHAT_FAIL, SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAIL, GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAIL, GET_MESSAGES_RESET, GET_UNREAD_MESSAGES_REQUEST, GET_UNREAD_MESSAGES_SUCCESS, GET_UNREAD_MESSAGES_FAIL, GET_UNREAD_MESSAGES_RESET } from './../constants/chatConstants';
import { chatListActionType } from './../actions/types.d';



export interface ChatMessageType extends Document {
    _id: string;
    sender: SigninType;
    content: string;
    chat: ChatType;
    readBy: SigninType[] | string[];
    createdAt: string;

}

export interface ChatType {
    chatName: string;
    createdAt: string;
    isGroupChat: boolean;
    latestMessage: ChatMessageType;
    updatedAt: string;
    users: SigninType[];
    messages: ChatMessageType[];
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








export interface sendChatMessageInitialStateType {
    error: string;
    loading: boolean;
    message: ChatMessageType | undefined;
}

export const sendChatMessageInitialState: sendChatMessageInitialStateType = {
    error: '',
    loading: false,
    message: undefined
}

export const sendChatMessageReducer = (state = sendChatMessageInitialState, action: chatListActionType) => {
    switch (action.type) {
        case SEND_MESSAGE_REQUEST:
            return { loading: true }
        case SEND_MESSAGE_SUCCESS:
            return { loading: false, message: action.payload };
        case SEND_MESSAGE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}



export interface getChatMessagesInitialStateType {
    error: string;
    loading: boolean;
    messages: ChatMessageType[];
}

export const getChatMessagesInitialState: getChatMessagesInitialStateType = {
    error: '',
    loading: false,
    messages: [],
}

export const getChatMessagesReducer = (state = getChatMessagesInitialState, action: chatListActionType) => {
    switch (action.type) {
        case GET_MESSAGES_REQUEST:
            return { loading: true };
        case GET_MESSAGES_SUCCESS:
            return { loading: false, messages: action.payload };
        case GET_MESSAGES_FAIL:
            return { loading: false, error: action.payload };
        case GET_MESSAGES_RESET:
            return {};
        default:
            return state;
    }
}




export const unRedMessagesInitialState: getChatMessagesInitialStateType = {
    error: '',
    loading: false,
    messages: [],
}

export const unReadMessagesReducer = (state = unRedMessagesInitialState, action: chatListActionType) => {
    switch (action.type) {
        case GET_UNREAD_MESSAGES_REQUEST:
            return { loading: true };
        case GET_UNREAD_MESSAGES_SUCCESS:
            return { loading: false, messages: action.payload };
        case GET_UNREAD_MESSAGES_FAIL:
            return { loading: false, error: action.payload };
        case GET_UNREAD_MESSAGES_RESET:
            return {};
        default:
            return state;
    }
}