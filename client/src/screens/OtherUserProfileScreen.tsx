import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, useLocation, useParams } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { userInfo } from '../actions/userActions';
import { API_BASE } from '../config';

import EmailIcon from '@material-ui/icons/Email';

import { ProfileReplies } from '../components/ProfileReplies';
import { ProfilePosts } from '../components/ProfilePosts';
import { SigninType } from '../reducers/userReducer';



export const OtherUserProfileScreen = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const postedUser = location.state;
    const typedUser = postedUser as SigninType;
    const userId = typedUser._id


    const userInfoStore = useSelector((state: initialAppStateType) => state.userInfoStore);
    const { userInfo: userInfoData, error, loading } = userInfoStore;

    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo, error: errorSignin, loading: loadingSignin } = signinInfoStore;


    // Post 랑 Replies 버튼 클릭시 bottom border색 주기 위함
    const [activePost, setActivePost] = useState<boolean>(true);
    const [activeReplies, setActiveReplies] = useState<boolean>(false);
    const handleActivePost = () => {
        setActivePost(true);
        setActiveReplies(false);
    }
    const handleActiveReplies = () => {
        setActiveReplies(true);
        setActivePost(false);
    }
    // *************************************************************
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
                            className={`tab ${activePost ? "active" : ""}`}
                            onClick={handleActivePost}
                        >Posts</Link>
                        <Link to={{
                            pathname: `/profile/${userInfoData.userName}/replies`,
                            state: userInfoData
                        }}
                            className={`tab ${activeReplies ? "active" : ""}`}
                            onClick={handleActiveReplies}
                        >Replies</Link>
                    </div>

                    <div className="postsContainer">
                        <Route path={`/profile/:userId/replies`} component={ProfileReplies} />
                        <Route path={`/profile/:userId`} component={ProfilePosts} exact />
                    </div>
                </div>
            }
        </>
    )
}
