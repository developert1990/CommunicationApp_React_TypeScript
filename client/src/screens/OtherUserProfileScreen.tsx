import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, useLocation, useParams } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { signin, userInfo, userDetail } from '../actions/userActions';
import { API_BASE } from '../config';

import EmailIcon from '@material-ui/icons/Email';

import { ProfileReplies } from '../components/ProfileReplies';
import { ProfilePosts } from '../components/ProfilePosts';
import { SigninType } from '../reducers/userReducer';
import Axios from 'axios';
import { USER_INFO_RESET } from '../constants/userConstants';



export const OtherUserProfileScreen = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const postedUser = location.state;
    const typedUser = postedUser as SigninType;
    const userId = typedUser._id



    // 내가 클릭한 유저의 정보
    const userInfoStore = useSelector((state: initialAppStateType) => state.userInfoStore);
    const { userInfo: userInfoData, error, loading } = userInfoStore;

    // 내가 로그인한 정보
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo, error: errorSignin, loading: loadingSignin } = signinInfoStore;

    // 유저 업데이트된 디테일
    const userDetailStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userDetailInfo, loading: loadingUserDetail } = userDetailStore;

    const filter = (result: SigninType) => {
        console.log('signinInfo?._id: ', signinInfo?._id)
        console.log('result.following.filter=>>> ', result.followers.filter(data => data))
        return userInfoData && result?.following && (
            result.followers.filter(data => data === signinInfo?._id).length === 0
        )
            ? false : true
    }

    // const [btn, setBtn] = useState<boolean>();


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

    const handleFollow = async () => {
        const { data } = await Axios.put(`${API_BASE}/users/follow/${userInfoData?._id}/${signinInfo._id}`, {}, { // put Request 는 반드시 body가 포함되어야 하는것 같다.
            headers: { Authorization: `Hong ${signinInfo.token}` }
        });
        // dispatch(userDetail());
        // dispatch(userInfo(userId as string))
        const result = await data as SigninType;
        console.log('result', result)
        const checkFollowFromData = filter(result);
        console.log('checkFollowFromData', checkFollowFromData)
    }


    useEffect(() => {
        dispatch(userInfo(userId as string))
        dispatch(userDetail());

        return () => { // 언마운트 될때 실행한다. 즉 이 페이지의 랜더가 끝날때 비워준다
            dispatch({ type: USER_INFO_RESET });
        }

    }, [dispatch, userId,])


    return (
        <>
            {error && "error message..."}
            {loading && "loading... "}
            {userInfoData &&

                <div className="mainSectionContainer col-10 col-md-8">
                    {console.log('filter(userInfoData): ', filter(userInfoData))}
                    <div className="profileHeaderContainer">
                        <div className="coverPhotoContainer">
                            <div className="userImageContainer">
                                <img src={`${API_BASE}/images/${userInfoData.profilePic}`} alt="" />
                            </div>
                        </div>
                        <div className="profileButtonContainer">
                            {
                                // 여기 !== 이렇게 바꿔야함
                                userInfoData._id !== signinInfo._id && (
                                    <div>
                                        <Link to={`/messages/${userInfoData._id}`} className="profileButton">
                                            <EmailIcon />
                                        </Link>
                                        <button onClick={handleFollow} className="profileButton">{filter(userInfoData) ? "Following" : "Follow"}</button>
                                    </div>

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
