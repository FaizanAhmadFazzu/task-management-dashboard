import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/useContext';
import axios from "axios";
import "./login.css";
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (credentials.email.trim() === "") {
      newErrors.email = 'Email is required.';
      valid = false;
    }

    if (credentials.password.trim() === '') {
      newErrors.password = 'Password is required.';
      valid = false;
    }
    setErrors(newErrors);
    return valid
  }

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    if(credentials.password.trim() !== ""){
      setErrors({
          ...errors,
          password: ""
      })
  }
  if(credentials.email.trim() !== ""){
      setErrors({
          ...errors,
          email: ""
      })
  }
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/users/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
    }
  }
  return (
    <div className="login">
      {/* {loading && <Loading size={50} />} */}
      <div className="lContainer">
        <input
          type="text"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        {errors.email && <p className='error'>{errors.email}</p>}
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        {errors.password && <p className='error'>{errors.password}</p>}
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        <div>
          New User ? <Link to="/register">Register here</Link>
        </div>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  )
}

export default Login