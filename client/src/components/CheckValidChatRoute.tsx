import React, { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { initialAppStateType } from '../store';

interface PrivateCustomRoutePropsType extends RouteProps {
    component: ComponentType<any>
}

export const CheckValidChatRoute: React.FC<PrivateCustomRoutePropsType> = ({ component: Component, ...rest }) => {
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;

    const location = useLocation();
    // console.log('location.state: ', location.state)

    return (
        <Route
            {...rest}
            render={(props) => signinInfo && location.state !== undefined ? (
                <Component {...props}></Component>
            ) : (
                    <Redirect to="/invalidPage" />
                )
            }
        >

        </Route>
    )
}