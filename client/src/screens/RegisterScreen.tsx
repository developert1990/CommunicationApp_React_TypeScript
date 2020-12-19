
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { register } from '../actions/userActions';
import { USER_REGISTER_RESET } from '../constants/userConstants';
import { initialAppStateType } from '../store';

export const RegisterScreen = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordConfirmError, setPasswordConfirmError] = useState<string>('');
    const isInvalid = firstName === '' || lastName === '' || password === '' || email === '' || confirmPassword === '';

    const userRegisterStore = useSelector((state: initialAppStateType) => state.registerStore);
    const { erorr, loading, userInfo } = userRegisterStore;

    const dispatch = useDispatch();
    const history = useHistory();

    const submitHandler = () => {
        if (password !== confirmPassword) {
            setPasswordConfirmError('Please Enter the same password');
        } else {
            dispatch(register(firstName, lastName, userName, email, password));
            setFirstName('')
            setLastName('')
            setUserName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('');
        }
    }

    useEffect(() => {

        console.log('userInfo_____: ', userInfo)
        if (userInfo) {
            console.log('userInfo_____: ', userInfo)
            history.push('/signin');

            dispatch({ type: USER_REGISTER_RESET });
        }
    }, [dispatch, history, userInfo])

    return (
        <div className="wrapper">
            <div className="loginContainer">
                <h1>Register</h1>
                {erorr && "errorBox"}
                {loading && "loadingBox"}
                <div className="form">
                    <input type="text" name="firstName" placeholder="First Name" required value={firstName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
                    <input type="text" name="lastName" placeholder="Last Name" required value={lastName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
                    <input type="text" name="username" placeholder="Username" required value={userName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
                    <input type="email" name="email" placeholder="Email" required value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    <input type="password" name="password" placeholder="Password" required value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    <input type="password" name="passwordConfirm" placeholder="Confirm password" required value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
                    {passwordConfirmError}
                    <button className={isInvalid ? "disable" : "able"} type="submit" onClick={submitHandler} disabled={isInvalid}>Submit</button>
                </div>
                Already have an account? Sign in <Link to="/signin">here</Link>.
            </div>
        </div>
    )
}
