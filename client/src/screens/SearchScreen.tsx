import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useHistory, useLocation } from 'react-router-dom';
import { initialAppStateType } from '../store';
import { SearchPosts } from '../components/SearchPosts';
import { SearchUsers } from '../components/SearchUsers';
import { searchPosts, searchUsers } from '../actions/searchAction';

import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';


export const SearchScreen = () => {

    const [search, setSearch] = useState<string>("");
    // const [searchedPosts, setSearchedPosts] = useState<postDataType[]>([]);
    // const [searchedUsers, setSearchedUsers] = useState<SigninType[]>([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const slicedUrl = location.pathname.slice(14);


    const searchPostsStore = useSelector((state: initialAppStateType) => state.searchPostsStore);
    const { error: errorPosts, loading: loadingPosts, posts } = searchPostsStore;

    const searchUsersStore = useSelector((state: initialAppStateType) => state.searchUsersStore);
    const { error: errorUsers, loading: loadingUsers, users } = searchUsersStore;


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
            dispatch(searchPosts(search))
        } else {
            dispatch(searchUsers(search))
        }
        setSearch("");
    }



    return (
        <>
            <div className="mainSectionContainer col-10 col-md-8">
                <div className="SearchHeaderContainer">
                    <div className="titleContainer">
                        <h1>Search</h1>
                    </div>
                    <form className="search__form" noValidate autoComplete="off" onSubmit={handleSubmit} >
                        <TextField id="standard-basic" label="Search for users or posts" autoFocus={true} onChange={handleSearch} value={search} />
                        <SearchIcon />
                    </form>
                </div>

                <div className="tabsContainer">
                    <Link to={`/search/posts`}
                        className={`tab ${activePost ? "active" : ""}`}
                        onClick={handleActivePost}
                    >Posts</Link>
                    <Link to={`/search/posts/users`}
                        className={`tab ${activeReplies ? "active" : ""}`}
                        onClick={handleActiveReplies}
                    >Users</Link>
                </div>

                <div className="postsContainer">
                    <Route path={`/search/posts`} render={() => <SearchPosts posts={posts} loadingPosts={loadingPosts} errorPosts={errorPosts} />} exact />
                    <Route path={`/search/posts/users`} render={() => <SearchUsers users={users} loadingUsers={loadingUsers} errorUsers={errorUsers} />} />
                </div>
            </div>

        </>
    )
}
