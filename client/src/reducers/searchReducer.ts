import { SigninType } from './userReducer';
import { SEARCH_POSTS_REQUEST, SEARCH_POSTS_SUCCESS, SEARCH_POSTS_FAIL, SEARCH_POSTS_RESET, SEARCH_USERS_REQUEST, SEARCH_USERS_SUCCESS, SEARCH_USERS_FAIL, SEARCH_USERS_RESET } from './../constants/searchConstants';
import { searchActionType } from './../actions/types.d';
import { postDataType } from './postReducer';


export interface searchPostInitialStateType {
    error: string;
    loading: boolean;
    posts: postDataType[];
}
export const searchPostInitialState: searchPostInitialStateType = {
    error: '',
    loading: false,
    posts: [],
}

export const searchPostReducer = (state = searchPostInitialState, action: searchActionType) => {
    switch (action.type) {
        case SEARCH_POSTS_REQUEST:
            return { loading: true }
        case SEARCH_POSTS_SUCCESS:
            return { loading: false, posts: action.payload };
        case SEARCH_POSTS_FAIL:
            return { loading: false, error: action.payload };
        case SEARCH_POSTS_RESET:
            return {}
        default:
            return state;
    }
}




export interface searchUsersInitialStateType {
    error: string;
    loading: boolean;
    users: SigninType[];
}
export const searchUsersInitialState: searchUsersInitialStateType = {
    error: '',
    loading: false,
    users: [],
}

export const searchUsersReducer = (state = searchUsersInitialState, action: searchActionType) => {
    switch (action.type) {
        case SEARCH_USERS_REQUEST:
            return { loading: true }
        case SEARCH_USERS_SUCCESS:
            return { loading: false, users: action.payload };
        case SEARCH_USERS_FAIL:
            return { loading: false, error: action.payload };
        case SEARCH_USERS_RESET:
            return {}
        default:
            return state;
    }
}