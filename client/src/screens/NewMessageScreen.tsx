import Axios from 'axios';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { searchUsers } from '../actions/searchAction';
import { SearchUsers } from '../components/SearchUsers';
import { API_BASE } from '../config';
import { SigninType } from '../reducers/userReducer';
import { initialAppStateType } from '../store';
import { userDetail } from '../actions/userActions';

export const NewMessageScreen = () => {
    const [input, setInput] = useState<string>("");
    const [selectedUserList, setSelectedUserList] = useState<SigninType[]>([]);

    // const selectedUserList: SigninType[] = []


    const searchUserStore = useSelector((state: initialAppStateType) => state.searchUsersStore);
    const { users, error: errorUsers, loading: loadingUsers } = searchUserStore;

    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo } = signinInfoStore;

    // 아래에 채팅을 보낼때 단순히 signinInfo를 보내면 로그인했을때 정보만 넘겨줄수잇다 그래서 userDetail 을 받아서 로그인후에 활동한 업데이트 된 정보를 넘겨주기위해 detail store를 call 한것이다.
    const userDetailInfoStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userDetailInfo } = userDetailInfoStore;

    // console.log('userDetail', userDetailInfo)

    const dispatch = useDispatch();
    const history = useHistory();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement> & KeyboardEvent<Element>) => {
        setInput(e.target.value);

        if (input !== "") {
            dispatch(searchUsers(input));
        }
    }

    // BackSpace 구현
    const handleKeyDown = (e: KeyboardEvent<Element>) => {

        if (input === "" && e.key === "Backspace") {
            setSelectedUserList(selectedUserList.slice(0, selectedUserList.length - 1))

        }
    }

    const handleSelectUser = (user: SigninType) => {
        const selectedUserFullName = user.firstName + " " + user.lastName;
        selectedUserList.push(user);
        setInput("");
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }


    const handleChatCreate = async () => {
        const userList = JSON.stringify(selectedUserList); // 이 전체 유저의 리스트를 Axios로 서버로 전송해야하는데 string값으로 전송만 가능하기때문에 이렇게 변환해 준다.
        const signinUserDetail = JSON.stringify(userDetailInfo);
        const { data } = await Axios.post(`${API_BASE}/chats`, { userList, signinUserDetail }, {
            withCredentials: true,

        });
        const chat = data;
        console.log('유저 다 저장하고 채팅방만드는 api 부른 데이터 chat: ', chat)
        if (!chat || !chat._id) { return alert("Invalid response from the server") };

        // const { data: chatRoomData } = await Axios.get(
        //     `${API_BASE}/chats/chatRoom/byUserId/${selectedUserList[0]._id}`,
        //     {
        //         withCredentials: true,
        //     }
        // );

        history.push({ pathname: `/message/chatRoom/${chat._id}`, state: { userInfoDataFromNewMessageComponent: { ...userDetailInfo, roomId: chat._id } } })

    }


    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        }
        dispatch(userDetail());
    }, [dispatch])

    // const [newList, setNewList] = useState<SigninType[]>([]);
    // if (users && users.length !== 0) {
    //     const test = users.filter((user) => !selectedUserList.includes(user));
    //     console.log('users: ', users)
    //     console.log('selectedUserList: ', selectedUserList)
    //     console.log('test: ', test)
    // }

    // const a = [{ a: "1" }, { a: "2" }, { a: "3" }];
    // const b = [{ a: "1" }]

    // if (users && users.length !== 0) {
    // const newA = users.map((user) => selectedUserList.find(k => k._id !== user._id));
    // const newB = newA.filter((data) => data !== undefined);
    // console.log('newB: ', newB)
    // }

    return (
        <div className="mainSectionContainer col-10 col-md-8">
            <div className="titleContainer">
                <h1>New Message</h1>
            </div>
            <div className="chatPageContainer">
                <div className="chatTitleBar">
                    <label htmlFor="userSearchTextbox">To: </label>
                    <div id="selectedUsers">
                        {
                            selectedUserList.map((user, index) => {
                                const fullName = user.firstName + " " + user.lastName + "; ";
                                return (
                                    <span className="selectedUserToSend" key={index}>{fullName}</span>
                                )
                            })
                        }
                        <input onKeyDown={handleKeyDown} type="text" id="userSearchTextBox" placeholder="Type the name of the person"
                            autoComplete="off"
                            value={input}
                            ref={inputRef}
                            onChange={handleChangeInput} />
                    </div>
                </div>
                {
                    input === "" ? "" :
                        users && users.length !== 0 &&
                        <div className="search__newMessage">
                            {
                                users.map((user) => {

                                    return (
                                        // 로그인한유저, 즉 자기 자신은 검색이 안되도록
                                        user._id !== signinInfo._id && !selectedUserList.includes(user) &&
                                        <div className="user" key={user._id} onClick={() => handleSelectUser(user)}>
                                            <div className="userImageContainer">
                                                <img src={`${API_BASE}/uploads/images/${user.profilePic}`} alt="profile" />
                                            </div>
                                            <div className="userDetailsContainer">
                                                <div className="header">
                                                    {user?.firstName + " " + user?.lastName}
                                                    <span className="username">@{user?.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>

                }

                <div className="resultsContainer">
                    <button id="createChatButton" disabled={selectedUserList.length === 0 ? true : false} onClick={handleChatCreate}>Create chat</button>
                </div>
            </div>
        </div>
    )
}
