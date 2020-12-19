import { ReplyDeleteInitialStatetype, replyDeleteInitialState, replyDeleteReducer, ReplyListInitialStateType, replyListInitialState, replyListReducer } from './reducers/replyReducer';
import { postTextInitalStateType, postTextInitialState, postTextReducer, postListInitialStateType, postListReducer, postListInitialState, postDeleteInitialStateType, postDeleteInitialState, postDeleteReducer } from './reducers/postReducer';
import { UserRegisterInitialStateType, userRegisterReducer, userRegisterInitialState, UserSigninInitialStateType, userSigninInitialState, userSinginReducer, userDetailInitialStateType, userDetailInitialState, userDetailReducer } from './reducers/userReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';

// signinStore 에는 최초 sign in 할 때 해당 user의 정보를 토큰과 함께 받는다. userInfoStore에는 likes와 같은 어떠한 변화가 있을때 DB에서 해당 user의 정보를 다 받아와서 store에 저장한다.

export interface initialAppStateType {
    registerStore: UserRegisterInitialStateType,
    signinStore: UserSigninInitialStateType,
    userInfoStore: userDetailInitialStateType,
    postTextStore: postTextInitalStateType,
    postListStore: postListInitialStateType,
    postDeleteStore: postDeleteInitialStateType,
    replyDeleteStore: ReplyDeleteInitialStatetype,
    replyListStore: ReplyListInitialStateType,
}

export const initialAppState: initialAppStateType = {
    registerStore: userRegisterInitialState,
    signinStore: userSigninInitialState,
    userInfoStore: userDetailInitialState,
    postTextStore: postTextInitialState,
    postListStore: postListInitialState,
    postDeleteStore: postDeleteInitialState,
    replyDeleteStore: replyDeleteInitialState,
    replyListStore: replyListInitialState,
}

export const reducer = combineReducers({
    registerStore: userRegisterReducer,
    signinStore: userSinginReducer,
    userInfoStore: userDetailReducer,
    postTextStore: postTextReducer,
    postListStore: postListReducer,
    postDeleteStore: postDeleteReducer,
    replyDeleteStore: replyDeleteReducer,
    replyListStore: replyListReducer,
})
const initialState = {}
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)));

export default store;