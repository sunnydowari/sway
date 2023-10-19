/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import "./login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      dispatch(ShowLoader());
      const response = await LoginUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <i className="icon-message"></i>
          <h1 className="login-title">Sway Login</h1>
        </div>
        <hr />

        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
          className="login-input"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
          className="login-input"
        />

        <button
          className={
            user.email && user.password ? "login-button" : "disabled-button"
          }
          onClick={login}
        >
          LOGIN
        </button>

        <Link to="/register" className="login-link">
          Do not have an account? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
