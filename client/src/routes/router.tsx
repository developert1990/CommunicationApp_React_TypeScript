import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { SigninScreen, HomeScreen, RegisterScreen, ProfileScreen, MessageScreen, NewMessageScreen } from '../screens/index';
import { PrivateRoute } from '../components/PrivateRoute';
import { Navbar } from '../components/Navbar';
import { Row } from 'react-bootstrap';
import { ThirdColumn } from '../components/ThirdColumn';
import { SearchScreen } from '../screens/SearchScreen';
import { ChatScreen } from '../screens/ChatScreen';

export const Router = () => {
    return (
        <BrowserRouter >
            <div className="mainScreen">
                <Row className="row">
                    <PrivateRoute component={Navbar} />
                    <PrivateRoute path="/" component={HomeScreen} exact />
                    <PrivateRoute path="/profile/:userId" component={ProfileScreen} />
                    <PrivateRoute path="/search/posts" component={SearchScreen} />
                    <PrivateRoute path="/message/chatRoom/:roomNum" component={ChatScreen} />
                    <PrivateRoute path="/message" component={MessageScreen} exact />
                    <PrivateRoute path="/message/new" component={NewMessageScreen} />
                    <PrivateRoute component={ThirdColumn} exact />

                </Row>
            </div>
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
        </BrowserRouter>
    )
}
