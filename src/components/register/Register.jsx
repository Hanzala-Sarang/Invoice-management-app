import { useRef, useState } from "react";
import "../login/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../firebase/FirebaseProvider";
import Loader from "../loader/Loader";
import CloseIcon from "@mui/icons-material/Close";

const Register = () => {
  const firebase = useFirebase();
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loader, setLoader] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    setLoader(true);
    firebase.signupUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.uploadImage(displayName, file).then((downloadURL) => {
        firebase.updateUserProfile(newUser, displayName, downloadURL);
        firebase.setUserData(newUser, displayName, email, downloadURL);
        localStorage.setItem("cName", newUser.user.displayName);
        localStorage.setItem("logo", newUser.user.photoURL);
        localStorage.setItem("email", newUser.user.email);
        localStorage.setItem("uid", newUser.user.uid);

        setLoader(false);
        navigate("/dashboard");
      });
    });
  };

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  const closeImagePreview = () => {
    setFile(null);
    setImageURL(null);
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
              <h1 className="login-heading">Register</h1>
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
                  type="text"
                  placeholder="Company Name"
                  required
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <input
                  className="login-input"
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  className="login-input"
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  ref={fileInputRef}
                  required
                  onChange={(e) => onSelectFile(e)}
                />
                <input
                  className="login-input"
                  type="button"
                  value="Select your logo"
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                />
                <div className="image-preview">
                  {imageURL && (
                    <>
                      {" "}
                      <img
                        src={imageURL}
                        alt="logo-preview"
                        className="logo-preview"
                      />
                      <CloseIcon fontSize="small" onClick={closeImagePreview} />
                    </>
                  )}
                </div>
                <input className="login-input login-btn" type="submit" />
              </form>
              <Link to="/login" className="register-link">
                Already have an account? Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
