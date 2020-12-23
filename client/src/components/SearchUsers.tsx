import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';
import { SigninType } from '../reducers/userReducer';

import Alert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import { SEARCH_USERS_RESET } from '../constants/searchConstants';

interface SearchUsersPropsType {
    users: SigninType[];
    loadingUsers: boolean;
    errorUsers: string;
}

export const SearchUsers: React.FC<SearchUsersPropsType> = ({ users, errorUsers, loadingUsers }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        return () => { dispatch({ type: SEARCH_USERS_RESET }) }
    }, [dispatch])


    return (
        <div>
            {
                loadingUsers ? "Loading..." :
                    errorUsers ? <Alert severity="warning">There is no posts.. Search again!!</Alert> :
                        users ?
                            users.map((user) => {
                                return (
                                    <div className="user" key={user._id}>
                                        <div className="userImageContainer">
                                            <img src={`${API_BASE}/uploads/images/${user.profilePic}`} alt="profile" />
                                        </div>
                                        <div className="userDetailsContainer">
                                            <div className="header">
                                                <Link to={
                                                    {
                                                        pathname: `/profile/${user?.userName}`,
                                                        state: user,
                                                    }
                                                }
                                                    className="displayName">{user?.firstName + " " + user?.lastName}</Link>
                                                <span className="username">@{user?.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <Alert severity="info">Search users !!</Alert>
                            )

            }
        </div>
    )
}
