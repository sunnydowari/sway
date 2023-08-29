import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const login = async () => {
    console.log(user)
  }

  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <div className="bg-ternary shadow-md p-5 flex flex-col gap-5 w-96">
        <h1 className="text-4x1 uppercase font-semibold text-secondary">
          Login to Sway
        </h1>
        <hr />
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="enter your name"
        />
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="enter your email"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="enter password"
        />
        <button className="contained-btn" onClick={login}>
          LOGIn
        </button>

        <Link to="/register" className="underline">
          new here? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
