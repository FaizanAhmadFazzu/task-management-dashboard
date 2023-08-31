import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/loading/Loading';
import "./register.css";
import axios from "axios";

const Register = () => {

    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
        if(credentials.name){
            setErrors({
                ...errors,
                name: ""
            })
        }
        if(credentials.password.length >= 8){
            setErrors({
                ...errors,
                password: ""
            })
        }
        if(credentials.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)){
            setErrors({
                ...errors,
                email: ""
            })
        }
    }

    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (credentials.name.trim() === '') {
            newErrors.name = 'Username is required.';
            valid = false;
        }

        if (!credentials.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            newErrors.email = 'Invalid email address.';
            valid = false;
        }

        if (credentials.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }
        setErrors(newErrors);
        return valid
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if(!validateForm())return;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            if (!credentials.name || !credentials.email || !credentials.password) return;
            setLoading(true);
            const { data } = await axios.post("/users", credentials, config);
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            const message = error.response && error.response.data.message ? error.response.data.message : error.message
            setErrorMessage(message);
        }
    }
    return (
        <div className="register">
            {loading && <Loading size={50} />}
            <div className="rContainer">
                <input
                    type="text"
                    placeholder="Name"
                    id="name"
                    onChange={handleChange}
                    className="rInput"
                />
                {errors.name && <p className='error'>{errors.name}</p>}
                <input
                    type="text"
                    placeholder="Email"
                    id="email"
                    onChange={handleChange}
                    className="rInput"
                />
                {errors.email && <p className='error'>{errors.email}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    onChange={handleChange}
                    className="rInput"
                />
                {errors.password && <p className='error'>{errors.password}</p>}
                <button disabled={loading} onClick={handleClick} className="rButton">
                    Register
                </button>
                <div>
                    Already have an account? <Link to="/login">Login Now</Link>
                </div>
                {errorMessage && <span>{errorMessage}</span>}
            </div>
        </div>
    )
}

export default Register