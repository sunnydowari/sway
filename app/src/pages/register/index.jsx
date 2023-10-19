/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import "./register.css"
function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    try {
      dispatch(ShowLoader());
      const response = await RegisterUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-header">
          <i className="register-icon"></i>
          <h1 className="register-title">Sway Register</h1>
        </div>
        <hr />
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Enter your name"
          className="register-input"
        />
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
          className="register-input"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
          className="register-input"
        />
        <button
          className={
            user.name && user.email && user.password ? "register-button" : "disabled-button"
          }
          onClick={register}
        >
          Register
        </button>
        <Link to="/login" className="register-link">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default Register;
