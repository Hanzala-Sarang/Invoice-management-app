import React from "react";
import "./login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../firebase/FirebaseProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = await firebase.signinUserWithEmailAndPassword(
      email,
      password
    );
    localStorage.setItem("cName", user.displayName);
    localStorage.setItem("logo", user.photoURL);
    localStorage.setItem("email", user.email);
    localStorage.setItem("uid", user.uid);
    navigate("/dashboard");
    console.log(user);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h1 className="login-heading">Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="text"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <input className="login-input login-btn" type="submit" />
          </form>
          <Link to="/register" className="register-link">
            Don&apos;t have an Account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
