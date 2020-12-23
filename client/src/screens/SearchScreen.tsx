import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { postDataType } from '../reducers/postReducer';
import { SigninType } from '../reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, useLocation, useParams } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { signin, userInfo, userDetail } from '../actions/userActions';
import { API_BASE } from '../config';
import Axios from 'axios';
import { SearchPosts } from '../components/SearchPosts';
import { SearchUsers } from '../components/SearchUsers';


import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';


export const SearchScreen = () => {

    const [search, setSearch] = useState<string>("");
    const [searchedPosts, setSearchedPosts] = useState<postDataType[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<SigninType[]>([]);


    // 내가 클릭한 유저의 정보
    const userInfoStore = useSelector((state: initialAppStateType) => state.userInfoStore);
    const { userInfo: userInfoData, error, loading } = userInfoStore;

    // 내가 로그인한 정보
    const signinInfoStore = useSelector((state: initialAppStateType) => state.signinStore);
    const { signinInfo, error: errorSignin, loading: loadingSignin } = signinInfoStore;

    // 유저 업데이트된 디테일
    const userDetailStore = useSelector((state: initialAppStateType) => state.userDetailStore);
    const { userDetail: userDetailInfo, loading: loadingUserDetail } = userDetailStore;

    const location = useLocation();
    const slicedUrl = location.pathname.slice(14);



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



    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (slicedUrl === "") {
            const { data } = await Axios.get(`${API_BASE}/search/posts/${search}`, {
                headers: { Authorization: `Hong ${signinInfo.token}` }
            });
            console.log('search 된 posts data: ', data);
            setSearchedPosts(data);
        } else {
            const { data } = await Axios.get(`${API_BASE}/search/users/${search}`, {
                headers: { Authorization: `Hong ${signinInfo.token}` }
            });
            console.log('search 된 users data', data)
            setSearchedUsers(data);
        }


        setSearch("");
    }

    return (
        <>

            {error && "error message..."}
            {loading && "loading... "}


            <div className="mainSectionContainer col-10 col-md-8">
                <div className="SearchHeaderContainer">
                    <h1>Search</h1>
                    <form className="search__form" noValidate autoComplete="off" onSubmit={handleSubmit} >
                        <TextField id="standard-basic" label="Search for users or posts" autoFocus={true} onChange={handleSearch} value={search} />
                        <SearchIcon />
                    </form>
                </div>

                <div className="tabsContainer">
                    <Link to={{
                        pathname: `/search/posts`,
                        state: userInfoData
                    }}
                        className={`tab ${activePost ? "active" : ""}`}
                        onClick={handleActivePost}
                    >Posts</Link>
                    <Link to={{
                        pathname: `/search/posts/users`,
                        state: userInfoData
                    }}
                        className={`tab ${activeReplies ? "active" : ""}`}
                        onClick={handleActiveReplies}
                    >Users</Link>
                </div>

                <div className="postsContainer">
                    <Route path={`/search/posts`} component={SearchPosts} exact />
                    <Route path={`/search/posts/users`} component={SearchUsers} />
                </div>
            </div>

        </>
    )
}
