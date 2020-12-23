import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { SigninScreen, HomeScreen, RegisterScreen, ProfileScreen } from '../screens/index';
import { PrivateRoute } from '../components/PrivateRoute';
import { Navbar } from '../components/Navbar';
import { Row } from 'react-bootstrap';
import { ThirdColumn } from '../components/ThirdColumn';
import { SearchScreen } from '../screens/SearchScreen';

export const Router = () => {
    return (
        <BrowserRouter>
            <div className="mainScreen">
                <Row className="row">
                    <PrivateRoute component={Navbar} />
                    <PrivateRoute path="/" component={HomeScreen} exact />
                    <PrivateRoute path="/profile/:userId" component={ProfileScreen} />
                    <PrivateRoute path="/search/posts" component={SearchScreen} />
                    <PrivateRoute component={ThirdColumn} exact />

                </Row>
            </div>
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
        </BrowserRouter>
    )
}
