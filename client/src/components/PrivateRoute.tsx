import React, { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { initialAppStateType } from '../store';

interface PrivateCustomRoutePropsType extends RouteProps {
    component: ComponentType<any>
}

export const PrivateRoute: React.FC<PrivateCustomRoutePropsType> = ({ component: Component, ...rest }) => {
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;

    return (
        <Route
            {...rest}
            render={(props) => signinInfo ? (
                <Component {...props}></Component>
            ) : (
                    <Redirect to="/signin" />
                )
            }
        >

        </Route>
    )
}