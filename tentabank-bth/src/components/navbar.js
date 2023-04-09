import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import img from "./bilder/logga-tentabank.png";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [cookies] = useCookies(["user"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <>
      <nav className="nav">
        <NavLink className="logo" to="/">
          <img src={img} alt="logo" />
        </NavLink>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>

          {cookies.role !== "Reviewer" && (
            <NavLink className="nav-link" to="/browse" activeClassName="active">
              Tentabank
            </NavLink>
          )}
          {cookies.role !== "Reviewer" && (
            <NavLink className="nav-link" to="/upload" activeClassName="active">
              Ladda upp
            </NavLink>
          )}
          {cookies.role === "Reviewer" && (
            <NavLink className="nav-link" to="/review" activeClassName="active">
              Granska
            </NavLink>
          )}
          <NavLink className="nav-link" to="/about" activeClassName="active">
            Om oss
          </NavLink>
          <div className="profile-icon" onClick={handleProfileClick}>
            <i className="fas fa-user-circle"></i>
            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <NavLink className="nav-link" to="/profile" activeClassName="active">
                  Min sida
                </NavLink>
                <NavLink className="nav-link" to="/notifications" activeClassName="active">
                  Notifications
                </NavLink>
                <NavLink className="nav-link" to="/settings" activeClassName="active">
                  Settings
                </NavLink>
                {!cookies.loggedIn && <LoginButton />}
                {cookies.loggedIn && <LogoutButton />}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
