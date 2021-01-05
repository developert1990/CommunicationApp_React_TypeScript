import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useHistory, useLocation } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { userInfo, userDetail } from '../actions/userActions';
import { API_BASE } from '../config';
import { FollowModal } from '../components/FollowModal';
import { ProfileReplies } from '../components/ProfileReplies';
import { ProfilePosts } from '../components/ProfilePosts';
import { SigninType } from '../reducers/userReducer';
import Axios from 'axios';
import { USER_INFO_RESET } from '../constants/userConstants';
import { ImgUploadModal } from '../components/ImgUploadModal';
import { CoverImgUploadModal } from '../components/CoverImgUploadModal';
import { io, Socket } from 'socket.io-client';
import { newNotificationUsingSocket } from '../components/socketio';

import EmailIcon from '@material-ui/icons/Email';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Modal } from 'react-bootstrap';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Alert from '@material-ui/lab/Alert';



let socket: Socket = io("http://localhost:9003");;

export const ProfileScreen = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();
    const postedUser = location.state;
    const typedUser = postedUser as SigninType;
    const userId = typedUser._id



    // 내가 클릭한 유저의 정보
    const userInfoStore = useSelector((state: initialAppStateType) => state.userInfoStore);
    const { userInfo: clickedUserInfoData, error, loading } = userInfoStore;

    // 내가 로그인한 정보
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo, error: errorSignin, loading: loadingSignin } = signinInfoStore;

    // 유저 업데이트된 디테일
    const userDetailStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userDetailInfo, loading: loadingUserDetail } = userDetailStore;

    // 이 setUserProfilePic 을 ImgUploadModal 로 넘겨서 프로필사진을 수정하면 db에서 이미지 이름을 받아와서 변경이 될 경우에 useEffect에 dependency로 인해 리랜더가 되게끔 해주었다.
    const [userProfilePic, setUserProfilePic] = useState<string>(userDetailInfo?.profilePic as string);

    const [userCoverPic, setUserCoverPic] = useState<string>(userDetailInfo?.coverPic as string);

    const filter = (result: SigninType) => {
        // console.log('signinInfo?._id: ', signinInfo?._id)
        // console.log('result.following.filter=>>> ', result.followers.filter(data => data))
        return clickedUserInfoData && result?.following && (
            result.followers.filter(data => data === signinInfo?._id).length === 0
        )
            ? false : true
    }

    // 팔로우 버튼 클릭 할 경우에 바뀌는 state
    const [followBtnCheck, setFollowBtnCheck] = useState<boolean>(clickedUserInfoData as SigninType && filter(clickedUserInfoData as SigninType));
    // 팔로우 버튼 클릭할때 팔로워 숫자 변화주는 state
    const [numOfFollowers, setNumOfFollowers] = useState<number>(clickedUserInfoData as SigninType && clickedUserInfoData?.followers.length as number);
    // 선택한 유저의 following state 보여줌
    // const [numOfFollowing, setNumOfFollowing] = useState<number>(clickedUserInfoData as SigninType && clickedUserInfoData?.following.length as number);


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
        const { data } = await Axios.put(`${API_BASE}/users/follow/${clickedUserInfoData?._id}`, {}, { // put Request 는 반드시 body가 포함되어야 하는것 같다.
            // headers: { Authorization: `Hong ${signinInfo.token}` },
            withCredentials: true,
        });

        const result = await data as SigninType;
        const checkFollowFromData = filter(result);
        setFollowBtnCheck(checkFollowFromData)

        // newNotificationUsingSocket(clickedUserInfoData?._id as string);

        setNumOfFollowers(result.followers.length);
        socket.on("receive newFollow", () => {
            console.log("팔로우한다.")
        })
    }



    useEffect(() => {
        // console.log("유즈이펙")
        dispatch(userInfo(userId as string))
        dispatch(userDetail());

        return () => { // 언마운트 될때 실행한다. 즉 이 페이지의 랜더가 끝날때 비워준다
            dispatch({ type: USER_INFO_RESET });
        }

    }, [dispatch, userId, userProfilePic, userCoverPic])







    // Follow modal control ----------------------------------------
    const [show, setShow] = useState(false);
    const [sendFollowers, setSendFollowers] = useState<string>(clickedUserInfoData?._id as string);
    const [chooseBtn, setChooseBtn] = useState<string>('');
    const handleClose = () => setShow(false);

    // Following 하는거 보기
    const handleShowFollowing = () => {
        setSendFollowers(clickedUserInfoData?._id as string);
        setChooseBtn("following");
        setShow(true);
    }

    // Followers 보기
    const handleShowFollowers = () => {
        setSendFollowers(clickedUserInfoData?._id as string);
        setChooseBtn("followers");
        setShow(true);
    }
    // -------------------------------------------------------------

    // Image Upload Modal control --------------------------
    const [showImgUploadModal, setShowImgUploadModal] = useState<boolean>(false);


    const handleShowImageUpload = () => {
        setShowImgUploadModal(true);
    }
    const handleCloseImageUpload = () => {
        setShowImgUploadModal(false);
    }

    const handleCreateChatRoom = async () => {
        console.log("프로필에서 메세지버튼눌렀을때 이쪽으로")
        const otherUserId = clickedUserInfoData?._id
        const { data } = await Axios.get(
            `${API_BASE}/chats/chatRoom/byUserId/${otherUserId}`,
            {
                withCredentials: true,
            }
        );

        history.push({ pathname: `/message/chatRoom/${data._id}`, state: "Add string value to avoid 404 error" })
    }

    // -----------------------------------------------------

    //Cover Image Upload Modal control ---------------------
    const [showCoverImgUploadModal, setShowCoverImgUploadModal] = useState<boolean>(false);
    const handleShowCoverImageUpload = () => {
        setShowCoverImgUploadModal(true);
    }

    const handleCloseCoverImagUpload = () => {
        setShowCoverImgUploadModal(false);
    }

    // ------------------------------------------------------


    return (
        <>
            {
                loading ? <LoadingSpinner /> :
                    error ? <Alert severity="warning">There is an error to load page..</Alert> :
                        clickedUserInfoData && (

                            <div className="mainSectionContainer col-10 col-md-8">
                                <div className="profileHeaderContainer">
                                    <div className="coverPhotoSection">
                                        <div className="coverPhotoContainer">
                                            {
                                                clickedUserInfoData.coverPic !== undefined && (
                                                    <img src={`${API_BASE}/uploads/coverImg/${clickedUserInfoData.coverPic}`} alt="cover" />
                                                )
                                            }
                                            {
                                                clickedUserInfoData._id === signinInfo._id && (
                                                    <button
                                                        onClick={handleShowCoverImageUpload}
                                                        className="coverPhotoButton">
                                                        <AddAPhotoIcon />
                                                    </button>
                                                )
                                            }
                                            <Modal className="followModal" show={showCoverImgUploadModal} onHide={handleCloseImageUpload}>
                                                <CoverImgUploadModal handleClose={handleCloseCoverImagUpload} setUserCoverPic={setUserCoverPic} userCoverPic={userCoverPic} />
                                            </Modal>
                                        </div>
                                        <div className="userImageContainer">
                                            <img src={`${API_BASE}/uploads/images/${clickedUserInfoData.profilePic}`} alt="profile" />
                                            {
                                                clickedUserInfoData._id === signinInfo._id && (
                                                    <button
                                                        onClick={handleShowImageUpload}
                                                        className="profilePictureButton"><AddAPhotoIcon />
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <Modal className="followModal" show={showImgUploadModal} onHide={handleCloseImageUpload}>
                                            <ImgUploadModal handleClose={handleCloseImageUpload} setUserProfilePic={setUserProfilePic} userProfilePic={userProfilePic} />
                                        </Modal>
                                    </div>

                                    <div className="profileButtonContainer">
                                        {
                                            // 여기 !== 이렇게 바꿔야함
                                            clickedUserInfoData._id !== signinInfo._id && (
                                                <div>
                                                    <button onClick={handleCreateChatRoom} className="profileButton">
                                                        <EmailIcon />
                                                    </button>
                                                    <button onClick={handleFollow} className="profileButton">{
                                                        followBtnCheck === undefined ? filter(clickedUserInfoData) ? "Following" : "Follow" :
                                                            followBtnCheck ? "Following" : "Follow"
                                                    }
                                                    </button>
                                                </div>

                                            )
                                        }
                                    </div>
                                    {/* Modal */}
                                    <div className="userDetailsContainer">
                                        <span className="displayName">{clickedUserInfoData.firstName} {clickedUserInfoData.lastName}</span>
                                        <span className="username">@{clickedUserInfoData.userName}</span>
                                        {/* <span className="description">{clickedUserInfoData.description}</span> */}
                                        {/* {console.log('numOfFollowers: ', numOfFollowers)}
                            {console.log('clickedUserInfoData.followers.length: ', clickedUserInfoData.followers.length)} */}
                                        <div className="followersContainer">
                                            <button
                                                className={clickedUserInfoData.following.length === 0 ? "btnInActive" : "btnActive"}
                                                onClick={handleShowFollowing}
                                                disabled={clickedUserInfoData.following.length === 0 ? true : false}>
                                                <span className="value">{clickedUserInfoData.following.length}</span>
                                                <span className="name">Following</span>
                                            </button>
                                            <button
                                                className={clickedUserInfoData.followers.length === 0 ? "btnInActive" : "btnActive"}
                                                onClick={handleShowFollowers}
                                                disabled={clickedUserInfoData.followers.length === 0 ? true : false}>
                                                <span className="value">{numOfFollowers !== undefined ? numOfFollowers : clickedUserInfoData.followers.length}</span>
                                                <span className="name">Followers</span>
                                            </button>
                                        </div>
                                        <Modal className="followModal" show={show} onHide={handleClose}>
                                            <FollowModal handleClose={handleClose} data={sendFollowers} chooseBtn={chooseBtn} />
                                        </Modal>

                                    </div>


                                </div>

                                <div className="tabsContainer">
                                    <Link to={{
                                        pathname: `/profile/${clickedUserInfoData.userName}`,
                                        state: clickedUserInfoData
                                    }}
                                        className={`tab ${activePost ? "active" : ""}`}
                                        onClick={handleActivePost}
                                    >Posts</Link>
                                    <Link to={{
                                        pathname: `/profile/${clickedUserInfoData.userName}/replies`,
                                        state: clickedUserInfoData
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
                        )
            }
        </>
    )
}
