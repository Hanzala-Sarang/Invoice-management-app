import React from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useFirebase } from "../../firebase/FirebaseProvider";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import HomeIcon from "@mui/icons-material/Home";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SettingsIcon from "@mui/icons-material/Settings";

const Dashboard = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const logout = async () => {
    await firebase.logoutUser();
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div>
      <div className="dashboard-wrapper">
        <div className="side-bar">
          <div className="profile-info">
            <img src={localStorage.getItem("logo")} alt="logo" />
            <div>
              <p>{localStorage.getItem("cName")}</p>
              <button className="logout-btn" onClick={logout}>
                {" "}
                <PowerSettingsNewIcon />
                Logout
              </button>
            </div>
          </div>
          <hr />
          <div className="menu">
            <Link to="/dashboard/home" className="menu-link">
              <HomeIcon /> Home
            </Link>
            <Link to="/dashboard/invoices" className="menu-link">
              <InsertDriveFileIcon /> Invoices
            </Link>
            <Link to="/dashboard/new-invoice" className="menu-link">
              <NoteAddIcon /> New Invoice
            </Link>
          </div>
        </div>
        <div className="main-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
