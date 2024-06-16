import React from "react";
import "./login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../firebase/FirebaseProvider";
import Loader from "../loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
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
      setLoader(false);
    } catch (error) {
      setError(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {loader ? (
          <Loader />
        ) : (
          <>
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
                {error && (
                  <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
                )}
              </form>
              <Link to="/register" className="register-link">
                Don&apos;t have an Account? Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
