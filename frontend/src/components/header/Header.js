import React, { useContext } from 'react';
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/useContext';

const Header = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login")
    }

    return (
        <div className="header">
            <Link to={"/"} className="title">
                Task Dashboard
            </Link>
            { user && <button className='logoutBtn' onClick={logout}>Logout</button>}
        </div>
    )
}

export default Header