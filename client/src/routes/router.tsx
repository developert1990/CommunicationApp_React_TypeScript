import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { SigninScreen, MainScreen, RegisterScreen, ProfileScreen, OtherUserProfileScreen } from '../screens/index';
import { PrivateRoute } from '../components/PrivateRoute';
import { Navbar } from '../components/Navbar';
import { Row } from 'react-bootstrap';
import { ThirdColumn } from '../components/ThirdColumn';

export const Router = () => {
    return (
        <BrowserRouter>
            <div className="mainScreen">
                <Row className="row">
                    <PrivateRoute component={Navbar} />
                    <PrivateRoute path="/" component={MainScreen} exact />
                    <PrivateRoute path="/profile" component={ProfileScreen} exact />
                    <PrivateRoute path="/profile/:userId" component={OtherUserProfileScreen} />
                    <PrivateRoute component={ThirdColumn} exact />

                </Row>
            </div>
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
        </BrowserRouter>
    )
}