import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, useLocation, useParams } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { userInfo } from '../actions/userActions';
import { API_BASE } from '../config';

import EmailIcon from '@material-ui/icons/Email';

import { Replies } from '../components/Replies';
import { ProfilePosts } from '../components/ProfilePosts';
import { SigninType } from '../reducers/userReducer';



export const OtherUserProfileScreen = () => {
    const [selectedTab, setSelectedTab] = useState<Boolean>(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const user = location.state;
    console.log('user:  ', user);
    const typedUser = user as SigninType;
    const userId = typedUser._id

    console.log('userId', userId)

    const userInfoStore = useSelector((state: initialAppStateType) => state.userInfoStore);
    const { userInfo: userInfoData, error, loading } = userInfoStore;

    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo, error: errorSignin, loading: loadingSignin } = signinInfoStore;


    console.log('userInfoData: ', userInfoData);
    useEffect(() => {
        dispatch(userInfo(userId as string))
    }, [dispatch, userId])

    return (
        <>
            {error && "error message..."}
            {loading && "loading... "}
            {userInfoData &&
                <div className="mainSectionContainer col-10 col-md-8">
                    <div className="profileHeaderContainer">
                        <div className="coverPhotoContainer">
                            <div className="userImageContainer">
                                <img src={`${API_BASE}/images/${userInfoData.profilePic}`} alt="" />
                            </div>
                        </div>
                        <div className="profileButtonContainer">
                            {
                                // 여기 !== 이렇게 바꿔야함
                                userInfoData._id === signinInfo._id && (
                                    <Link to={`/messages/${userInfoData._id}`} className="profileButton">
                                        <EmailIcon />
                                    </Link>
                                    // <button></button> 팔로우 버튼

                                )
                            }
                        </div>
                        <div className="userDetailsContainer">
                            <span className="displayName">{userInfoData.firstName} {userInfoData.lastName}</span>
                            <span className="username">@{userInfoData.userName}</span>
                            {/* <span className="description">{userInfoData.description}</span> */}
                            <div className="followersContainer">
                                <Link to={`/profile/${userInfoData.userName}/following`}>
                                    <span className="value">{0}</span>
                                    <span>Following</span>
                                </Link>
                                <Link to={`/profile/${userInfoData.userName}/followers`}>
                                    <span className="value">{0}</span>
                                    <span>Followers</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="tabsContainer">
                        <Link to={{
                            pathname: `/profile/${userInfoData.userName}`,
                            state: userInfoData
                        }}
                            className="tab active">Posts</Link>
                        <Link to={{
                            pathname: `/profile/${userInfoData.userName}/replies`,
                            state: userInfoData
                        }}
                            className="tab">Replies</Link>
                    </div>

                    <div className="postsContainer">
                        <BrowserRouter>
                            <Route path={`/profile/:userId/replies`} component={Replies} />
                            <Route path={`/profile/:userId`} component={ProfilePosts} exact />
                        </BrowserRouter>
                    </div>
                </div>
            }
        </>
    )
}