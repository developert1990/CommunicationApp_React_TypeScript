import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useLocation } from 'react-router-dom';
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



import EmailIcon from '@material-ui/icons/Email';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Modal } from 'react-bootstrap';




export const ProfileScreen = () => {
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

    // 이 setUserProfilePic 을 ImgUploadModal 로 넘겨서 프로필사진을 수정하면 db에서 이미지 이름을 받아와서 변경이 될 경우에 useEffect에 dependency로 인해 리랜더가 되게끔 해주었다.
    const [userProfilePic, setUserProfilePic] = useState<string>(userDetailInfo?.profilePic as string);

    const [userCoverPic, setUserCoverPic] = useState<string>(userDetailInfo?.coverPic as string);

    const filter = (result: SigninType) => {
        // console.log('signinInfo?._id: ', signinInfo?._id)
        // console.log('result.following.filter=>>> ', result.followers.filter(data => data))
        return userInfoData && result?.following && (
            result.followers.filter(data => data === signinInfo?._id).length === 0
        )
            ? false : true
    }

    // 팔로우 버튼 클릭 할 경우에 바뀌는 state
    const [followBtnCheck, setFollowBtnCheck] = useState<boolean>(userInfoData as SigninType && filter(userInfoData as SigninType));
    // 팔로우 버튼 클릭할때 팔로워 숫자 변화주는 state
    const [numOfFollowers, setNumOfFollowers] = useState<number>(userInfoData as SigninType && userInfoData?.followers.length as number);
    // 선택한 유저의 following state 보여줌
    // const [numOfFollowing, setNumOfFollowing] = useState<number>(userInfoData as SigninType && userInfoData?.following.length as number);


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
            // headers: { Authorization: `Hong ${signinInfo.token}` },
            withCredentials: true,
        });

        const result = await data as SigninType;
        const checkFollowFromData = filter(result);
        setFollowBtnCheck(checkFollowFromData)
        setNumOfFollowers(result.followers.length);
    }


    useEffect(() => {
        console.log("유즈이펙")
        dispatch(userInfo(userId as string))
        dispatch(userDetail());

        return () => { // 언마운트 될때 실행한다. 즉 이 페이지의 랜더가 끝날때 비워준다
            dispatch({ type: USER_INFO_RESET });
        }

    }, [dispatch, userId, userProfilePic, userCoverPic])







    // Follow modal control ----------------------------------------
    const [show, setShow] = useState(false);
    const [sendFollowers, setSendFollowers] = useState<string>(userInfoData?._id as string);
    const [chooseBtn, setChooseBtn] = useState<string>('');
    const handleClose = () => setShow(false);

    // Following 하는거 보기
    const handleShowFollowing = () => {
        setSendFollowers(userInfoData?._id as string);
        setChooseBtn("following");
        setShow(true);
    }

    // Followers 보기
    const handleShowFollowers = () => {
        setSendFollowers(userInfoData?._id as string);
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
            {error && "error message..."}
            {loading && "loading... "}
            {
                userInfoData && (

                    <div className="mainSectionContainer col-10 col-md-8">
                        <div className="profileHeaderContainer">
                            <div className="coverPhotoSection">
                                <div className="coverPhotoContainer">
                                    {console.log(userInfoData)}
                                    {console.log(userCoverPic)}
                                    {
                                        userInfoData.coverPic !== undefined && (
                                            <img src={`${API_BASE}/uploads/coverImg/${userInfoData.coverPic}`} alt="cover" />
                                        )
                                    }
                                    {
                                        userInfoData._id === signinInfo._id && (
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
                                    <img src={`${API_BASE}/uploads/images/${userInfoData.profilePic}`} alt="profile" />
                                    {
                                        userInfoData._id === signinInfo._id && (
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
                                    userInfoData._id !== signinInfo._id && (
                                        <div>
                                            <Link to={{
                                                pathname: `/message/chatRoom/${userInfoData._id}`,
                                                state: { userInfoData }
                                            }} className="profileButton">
                                                <EmailIcon />
                                            </Link>
                                            <button onClick={handleFollow} className="profileButton">{
                                                followBtnCheck === undefined ? filter(userInfoData) ? "Following" : "Follow" :
                                                    followBtnCheck ? "Following" : "Follow"
                                            }
                                            </button>
                                        </div>

                                    )
                                }
                            </div>
                            {/* Modal */}
                            <div className="userDetailsContainer">
                                <span className="displayName">{userInfoData.firstName} {userInfoData.lastName}</span>
                                <span className="username">@{userInfoData.userName}</span>
                                {/* <span className="description">{userInfoData.description}</span> */}
                                {/* {console.log('numOfFollowers: ', numOfFollowers)}
                            {console.log('userInfoData.followers.length: ', userInfoData.followers.length)} */}
                                <div className="followersContainer">
                                    <button
                                        className={userInfoData.following.length === 0 ? "btnInActive" : "btnActive"}
                                        onClick={handleShowFollowing}
                                        disabled={userInfoData.following.length === 0 ? true : false}>
                                        <span className="value">{userInfoData.following.length}</span>
                                        <span className="name">Following</span>
                                    </button>
                                    <button
                                        className={userInfoData.followers.length === 0 ? "btnInActive" : "btnActive"}
                                        onClick={handleShowFollowers}
                                        disabled={userInfoData.followers.length === 0 ? true : false}>
                                        <span className="value">{numOfFollowers !== undefined ? numOfFollowers : userInfoData.followers.length}</span>
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
                )
            }
        </>
    )
}
