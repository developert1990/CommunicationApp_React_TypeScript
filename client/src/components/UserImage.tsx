import React, { useEffect } from 'react'
import { API_BASE } from '../config';
import { SigninType } from '../reducers/userReducer';

interface UserImageProps {
    userInfo: SigninType;
    userDetailInfo: SigninType | undefined;
}

export const UserImage: React.FC<UserImageProps> = ({ userInfo, userDetailInfo }) => {
    return (
        <div className="userImageContainer">
            <img
                src={`${API_BASE}/uploads/images/${userDetailInfo === undefined ? userInfo.profilePic : userDetailInfo.profilePic}`}
                alt="User's profile" />
        </div>
    )
}
