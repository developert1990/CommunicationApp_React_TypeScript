import { chatListInitialStateType, chatListinitialState, chatListReducer, selectedChatInitialStateType, selectedChatInitialState, selectedChatReducer } from './reducers/chatReducer';
import { searchPostInitialStateType, searchPostInitialState, searchPostReducer, searchUsersInitialStateType, searchUsersInitialState, searchUsersReducer } from './reducers/searchReducer';
import { ReplyDeleteInitialStatetype, replyDeleteInitialState, replyDeleteReducer } from './reducers/replyReducer';
import { postTextInitalStateType, postTextInitialState, postTextReducer, postListInitialStateType, postListReducer, postListInitialState, postDeleteInitialStateType, postDeleteInitialState, postDeleteReducer, postListByOneUserInitialStateType, postListByOneUserInitialState, postListByOneUserReducer, allPostListInitialStateType, allPostListInitialState, allPostListReducer } from './reducers/postReducer';
import { UserRegisterInitialStateType, userRegisterReducer, userRegisterInitialState, UserSigninInitialStateType, userSigninInitialState, userSinginReducer, userDetailInitialStateType, userDetailInitialState, userDetailReducer, userInfoReducer, userInfoInitialStateType, userInfoInitialState } from './reducers/userReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';

// signinStore 에는 최초 sign in 할 때 해당 user의 정보를 토큰과 함께 받는다. userInfoStore에는 likes와 같은 어떠한 변화가 있을때 DB에서 해당 user의 정보를 다 받아와서 store에 저장한다.

export interface initialAppStateType {
    registerStore: UserRegisterInitialStateType,
    signinStore: UserSigninInitialStateType,
    userDetailStore: userDetailInitialStateType,
    userInfoStore: userInfoInitialStateType,
    postTextStore: postTextInitalStateType,
    postListStore: postListInitialStateType,
    postDeleteStore: postDeleteInitialStateType,
    replyDeleteStore: ReplyDeleteInitialStatetype,
    postListByOneUserStore: postListByOneUserInitialStateType,
    allPostListReducer: allPostListInitialStateType,
    searchPostsStore: searchPostInitialStateType,
    searchUsersStore: searchUsersInitialStateType,
    chatListStore: chatListInitialStateType,
    selectedChatStore: selectedChatInitialStateType,
}

export const initialAppState: initialAppStateType = {
    registerStore: userRegisterInitialState,
    signinStore: userSigninInitialState,
    userDetailStore: userDetailInitialState,
    userInfoStore: userInfoInitialState,
    postTextStore: postTextInitialState,
    postListStore: postListInitialState,
    postDeleteStore: postDeleteInitialState,
    replyDeleteStore: replyDeleteInitialState,
    postListByOneUserStore: postListByOneUserInitialState,
    allPostListReducer: allPostListInitialState,
    searchPostsStore: searchPostInitialState,
    searchUsersStore: searchUsersInitialState,
    chatListStore: chatListinitialState,
    selectedChatStore: selectedChatInitialState,
}

export const reducer = combineReducers({
    registerStore: userRegisterReducer,
    signinStore: userSinginReducer,
    userDetailStore: userDetailReducer,
    userInfoStore: userInfoReducer,
    postTextStore: postTextReducer,
    postListStore: postListReducer,
    postDeleteStore: postDeleteReducer,
    replyDeleteStore: replyDeleteReducer,
    postListByOneUserStore: postListByOneUserReducer,
    allPostListReducer: allPostListReducer,
    searchPostsStore: searchPostReducer,
    searchUsersStore: searchUsersReducer,
    chatListStore: chatListReducer,
    selectedChatStore: selectedChatReducer,
})
const initialState = {}
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)));

export default store;