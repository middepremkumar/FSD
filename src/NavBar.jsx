import React from "react";
import "./Navbar.css";
import amzonLogo from "./assets/amazon-logo-amazon-icon-transparent-free-png.webp";
function NavBar() {
    return (
        <div className="nav-main">
            <img src={amzonLogo} alt="Amazon Logo" style={{ height: "50px" }} />
        </div>);
}
export default NavBar;