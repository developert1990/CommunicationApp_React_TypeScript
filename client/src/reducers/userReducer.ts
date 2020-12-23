import { USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_RESET, USER_SINGIN_REQUEST, USER_SINGIN_SUCCESS, USER_SINGIN_FAIL, USER_SIGNOUT, USER_DETAIL_SUCCESS, USER_DETAIL_REQUEST, USER_DETAIL_FAIL, USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAIL, USER_INFO_RESET } from './../constants/userConstants';
import { userActionType } from '../actions/types'

export interface RegisterType {
    name: string;
    email: string;
}

export interface UserRegisterInitialStateType {
    userInfo: RegisterType;
    erorr: string;
    loading: boolean;
}

export const userRegisterInitialState: UserRegisterInitialStateType = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") as string) : null,
    erorr: '',
    loading: false,
}

export const userRegisterReducer = (state = userRegisterInitialState, action: userActionType) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        case USER_REGISTER_RESET:
            return {};

        default:
            return state;
    }
}

export interface SigninType {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePic: string;
    coverPic: string;
    token: string;
    likes: string[];
    followers: string[];
    following: string[];
}

export interface UserSigninInitialStateType {
    signinInfo: SigninType;
    error: string;
    loading: boolean;
}

export const userSigninInitialState: UserSigninInitialStateType = {
    signinInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") as string) : null,
    error: '',
    loading: false,
}

export const userSinginReducer = (state = userSigninInitialState, action: userActionType) => {
    switch (action.type) {
        case USER_SINGIN_REQUEST:
            return { loading: true }
        case USER_SINGIN_SUCCESS:
            return { loading: false, signinInfo: action.payload };
        case USER_SINGIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_SIGNOUT:
            return {};
        default:
            return state;
    }
}



export interface userDetailInitialStateType {
    userDetail: SigninType | undefined;
    loading: boolean;
    error: string;
}

export const userDetailInitialState: userDetailInitialStateType = {
    userDetail: undefined,
    loading: false,
    error: '',
}

export const userDetailReducer = (state = userDetailInitialState, action: userActionType) => {

    switch (action.type) {
        case USER_DETAIL_REQUEST:
            return { loading: true }
        case USER_DETAIL_SUCCESS:
            return { loading: false, userDetail: action.payload };
        case USER_DETAIL_FAIL:
            return { laoding: false, error: action.payload }

        default:
            return state;
    }
}




export interface userInfoInitialStateType {
    userInfo: SigninType | undefined;
    loading: boolean;
    error: string;
}

export const userInfoInitialState: userInfoInitialStateType = {
    userInfo: undefined,
    loading: false,
    error: '',
}

export const userInfoReducer = (state = userInfoInitialState, action: userActionType) => {

    switch (action.type) {
        case USER_INFO_REQUEST:
            return { loading: true }
        case USER_INFO_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_INFO_FAIL:
            return { laoding: false, error: action.payload }
        case USER_INFO_RESET:
            return {};
        default:
            return state;
    }
}