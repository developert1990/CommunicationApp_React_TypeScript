import Axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { signout } from '../actions/userActions'
import { API_BASE } from '../config'

export const Navbar = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const handleSignout = async () => {
        const { data } = await Axios.get(`${API_BASE}/users/signout`);
        console.log('data signout:  ', data);
        dispatch(signout());
        history.push('/signin');
    }

    return (
        <div className="nav col-2"> {/* 이 태그의 크기를 항상 10중에 2로 해준다. */}
            <Link to="/" className="redColor"><i className="fas fa-cat"></i></Link>
            <Link to="/"><i className="fas fa-home"></i></Link>
            <Link to="/"><i className="fas fa-search"></i></Link>
            <Link to="/"><i className="fas fa-bell"></i></Link>
            <Link to="/"><i className="fas fa-envelope"></i></Link>
            <Link to="/"><i className="fas fa-user"></i></Link>
            <Link to="/" onClick={handleSignout}><i className="fas fa-sign-out-alt"></i></Link>
        </div>
    )
}
