import { SigninType } from './userReducer';
import { POST_REQUEST, POST_SUCCESS, POST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS, POST_LIST_FAIL, POST_LIST_RESET, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DELETE_FAIL, POST_DELETE_RESET, POST_LIST_ONEUSER_REQUEST, POST_LIST_ONEUSER_SUCCESS, POST_LIST_ONEUSER_FAIL, POST_LIST_ONEUSER_RESET, POST_ALL_LIST_REQUEST, POST_ALL_LIST_SUCCESS, POST_ALL_LIST_FAIL, POST_ALL_LIST_RESET } from './../constants/postConstants';
import { postTextActionType } from './../actions/types.d';

// export interface dataType {
//     message: string;
//     postData: postDataType;
// }


export interface postTextInitalStateType {
    error: string;
    loading: boolean
    success: boolean;
}

export const postTextInitialState: postTextInitalStateType = {
    error: '',
    loading: false,
    success: false,
}

export const postTextReducer = (state = postTextInitialState, action: postTextActionType) => {
    switch (action.type) {
        case POST_REQUEST:
            return { loading: true };
        case POST_SUCCESS:
            return { loading: false, success: true };
        case POST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}


export interface replyType {
    _id: string;
    repliedBy: SigninType;
    comment: string;
    createdAt: string;
}

export interface postDataType {
    content: string;
    createdAt: string;
    postedBy: SigninType;
    updatedAt: string;
    _id: string;
    likes: string[];
    replies: replyType[];
}


export interface postListInitialStateType {
    error: string;
    loading: boolean;
    list: postDataType[];
}

export const postListInitialState: postListInitialStateType = {
    error: '',
    loading: false,
    list: [],
}

export const postListReducer = (state = postListInitialState, action: postTextActionType) => {
    switch (action.type) {
        case POST_LIST_REQUEST:
            return { loading: true };
        case POST_LIST_SUCCESS:
            return { loading: false, list: action.payload };
        case POST_LIST_FAIL:
            return { loading: false, error: action.payload };
        case POST_LIST_RESET:
            return {};
        default:
            return state;
    }
}

export interface postDeleteInitialStateType {
    error: string;
    loading: boolean;
    success: boolean;
}

export const postDeleteInitialState: postDeleteInitialStateType = {
    error: '',
    loading: false,
    success: false,
}

export const postDeleteReducer = (state = postDeleteInitialState, action: postTextActionType) => {
    switch (action.type) {
        case POST_DELETE_REQUEST:
            return { loading: true };
        case POST_DELETE_SUCCESS:
            return { loading: false, success: true }
        case POST_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case POST_DELETE_RESET:
            return {};
        default:
            return state;
    }
}





export interface postListByOneUserInitialStateType {
    error: string;
    loading: boolean;
    list: postDataType[];
}

export const postListByOneUserInitialState: postListByOneUserInitialStateType = {
    error: '',
    loading: false,
    list: [],
}

export const postListByOneUserReducer = (state = postListByOneUserInitialState, action: postTextActionType) => {
    switch (action.type) {
        case POST_LIST_ONEUSER_REQUEST:
            return { loading: true };
        case POST_LIST_ONEUSER_SUCCESS:
            return { loading: false, list: action.payload };
        case POST_LIST_ONEUSER_FAIL:
            return { loading: false, error: action.payload };
        case POST_LIST_ONEUSER_RESET:
            return {};
        default:
            return state;
    }
}






export interface allPostListInitialStateType {
    error: string;
    loading: boolean;
    allList: postDataType[];
}

export const allPostListInitialState: allPostListInitialStateType = {
    error: '',
    loading: false,
    allList: [],
}

export const allPostListReducer = (state = allPostListInitialState, action: postTextActionType) => {
    switch (action.type) {
        case POST_ALL_LIST_REQUEST:
            return { loading: true };
        case POST_ALL_LIST_SUCCESS:
            return { loading: false, allList: action.payload };
        case POST_ALL_LIST_FAIL:
            return { loading: false, error: action.payload };
        case POST_ALL_LIST_RESET:
            return {};
        default:
            return state;
    }
}