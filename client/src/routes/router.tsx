import React, { useEffect } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { SigninScreen, HomeScreen, RegisterScreen, ProfileScreen, MessageScreen, NewMessageScreen } from '../screens/index';
import { PrivateRoute } from '../components/PrivateRoute';
import { CheckValidChatRoute } from '../components/CheckValidChatRoute';
import { InvalidPage } from '../components/InvalidPage';
import { Navbar } from '../components/Navbar';
import { Row } from 'react-bootstrap';
import { ThirdColumn } from '../components/ThirdColumn';
import { SearchScreen } from '../screens/SearchScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { initialAppStateType } from '../store';
import { getUnReadNotification } from '../actions/notificationAction';
import { newNotificationUsingSocket } from '../components/socketio';


let socket: Socket = io("http://localhost:9003");

export const Router = () => {

    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;


    const dispatch = useDispatch();
    console.log("라우터 tsx")
    useEffect(() => {
        if (signinInfo) {
            console.log("소켓 newFollow reveive하러 옴 로그인유저: ", signinInfo._id)
            // newNotificationUsingSocket(signinInfo._id)
            socket.emit("join", signinInfo._id, (error: Error) => {
                if (error) {
                    alert(error);
                }
            })
        }
    }, [signinInfo, signinInfo?._id]);

    socket.on("receive notification", () => {
        console.log("노티 받았다.")
        dispatch(getUnReadNotification());

    })


    return (
        <BrowserRouter >
            <div className="mainScreen">
                <Row className="row">
                    <PrivateRoute component={Navbar} />
                    <PrivateRoute path="/" component={HomeScreen} exact />
                    <PrivateRoute path="/profile/:userId" component={ProfileScreen} />
                    <PrivateRoute path="/search/posts" component={SearchScreen} />
                    <CheckValidChatRoute path="/message/chatRoom/:roomNum" component={ChatScreen} />
                    <PrivateRoute path="/message" component={MessageScreen} exact />
                    <PrivateRoute path="/message/new" component={NewMessageScreen} />
                    <PrivateRoute path="/notification" component={NotificationScreen} />
                    <Route path="/invalidPage" component={InvalidPage} />
                    <PrivateRoute component={ThirdColumn} exact />
                    <Route path="/signin" component={SigninScreen} />
                    <Route path="/register" component={RegisterScreen} />
                </Row>
            </div>
        </BrowserRouter>
    )
}
