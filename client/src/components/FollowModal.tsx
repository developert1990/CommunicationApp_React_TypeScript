import Axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { API_BASE } from '../config';
import { SigninType } from '../reducers/userReducer';
import { initialAppStateType } from '../store';
import { Link } from 'react-router-dom';

export interface populatedSigninType {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    profilePic: string;
    token: string;
    likes: string[];
    followers: SigninType[];
    following: SigninType[];
}

export interface ModalPropsType {
    handleClose: () => void;
    data: string;
    chooseBtn: string;
}

export const FollowModal: React.FC<ModalPropsType> = ({ handleClose, data, chooseBtn }) => {

    const [populatedData, setPopulatedData] = useState<populatedSigninType>();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;

    const selectedUserId = data;

    useEffect(() => {

        (
            async () => {
                const { data } = await Axios.get(`${API_BASE}/users/${selectedUserId}/${chooseBtn}`, {
                    // headers: { Authorization: `Hong ${signinInfo.token}` },
                    withCredentials: true
                });
                setPopulatedData(data);
            }
        )();
    }, [chooseBtn, followers, following, selectedUserId, signinInfo.token])

    console.log('populatedData', typeof populatedData?.followers[0] === "object");

    return (
        <div>{

            typeof populatedData?.followers[0] === "object" ? (
                <div>
                    <Modal.Header closeButton>
                        <Modal.Title>Follower</Modal.Title>
                    </Modal.Header>
                    {
                        populatedData.followers.map((follower) => {
                            return (

                                <Modal.Body>
                                    <div className="user" key={follower._id}>
                                        <div className="userImageContainer">
                                            <img src={`${API_BASE}/uploads/images/${follower.profilePic}`} alt="profile" />
                                        </div>
                                        <div className="userDetailsContainer">
                                            <div className="header">
                                                <Link to={
                                                    {
                                                        pathname: `/profile/${follower?.userName}`,
                                                        state: follower,
                                                    }
                                                }
                                                    onClick={handleClose}
                                                    className="displayName">{follower?.firstName + " " + follower?.lastName}</Link>
                                                <span className="username">@{follower?.userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                            )
                        })
                    }

                </div>
            ) : (
                    <div>
                        <Modal.Header closeButton>
                            <Modal.Title>Following</Modal.Title>
                        </Modal.Header>
                        {

                            populatedData?.following.map((following) => {
                                return (

                                    <Modal.Body>
                                        <div className="user">
                                            <div className="userImageContainer">
                                                <img src={`${API_BASE}/uploads/images/${following.profilePic}`} alt="profile" />
                                            </div>
                                            <div className="userDetailsContainer">
                                                <div className="header">
                                                    <Link to={
                                                        {
                                                            pathname: `/profile/${following?.userName}`,
                                                            state: following,
                                                        }
                                                    }
                                                        onClick={handleClose}
                                                        className="displayName">{following?.firstName + " " + following?.lastName}</Link>
                                                    <span className="username">@{following?.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                )
                            })
                        }
                    </div>
                )
        }
        </div>
    )
}
