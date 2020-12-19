import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { SigninScreen, MainScreen, RegisterScreen } from '../screens/index';
import { PrivateRoute } from '../components/PrivateRoute';

export const Router = () => {
    return (
        <BrowserRouter>
            <PrivateRoute path="/" component={MainScreen} exact />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
        </BrowserRouter>
    )
}
