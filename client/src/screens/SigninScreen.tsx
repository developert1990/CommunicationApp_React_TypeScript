import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { signin } from '../actions/userActions';
import { initialAppStateType } from '../store';

export const SigninScreen = () => {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const dispatch = useDispatch();
    const history = useHistory();

    const singinStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { error, loading, signinInfo } = singinStore;

    const isValid: boolean = userName === "" || password === "";

    const submitHandler = () => {
        dispatch(signin(userName, password));
    }

    useEffect(() => {
        if (signinInfo) {
            history.push('/');
        }
    }, [history, signinInfo])

    return (
        <div className="wrapper">
            <div className="loginContainer">
                <h1>Login</h1>
                {error && "errorBox"}
                {loading && "loadingBox"}
                <div className="form">
                    <input type="text" name="username" placeholder="Username or Email" required
                        value={userName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
                    <input type="password" name="password" placeholder="Password" required
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    <button className={isValid ? "disable" : "able"} type="submit" onClick={submitHandler} disabled={isValid}>Submit</button>
                </div>
                Need an account? Register <Link to="/register">here</Link>.
            </div>
        </div>
    )
}
