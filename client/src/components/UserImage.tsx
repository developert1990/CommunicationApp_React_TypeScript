import React, { useEffect } from 'react'
import { API_BASE } from '../config';
import { SigninType } from '../reducers/userReducer';

interface UserImageProps {
    userInfo: SigninType;
}

export const UserImage: React.FC<UserImageProps> = ({ userInfo }) => {

    return (
        <div className="userImageContainer">
            <img src={`${API_BASE}/images/${userInfo.profilePic}`} alt="User's profile" />
        </div>
    )
}
