import React, { useState } from "react";
import "./NavBar.css";
import amazonLogo from "./assets/amazon-logo-amazon-icon-transparent-free-png.webp";

function NavBar({ cartCount }) {
  const [location] = useState("India");

  return (
    <>
      <div className="top-nav">
        <div className="nav-logo">
          <img src={amazonLogo} alt="Amazon" />
          <span>.in</span>
        </div>

        <div className="deliver-to">
          <small>Deliver to</small>
          <strong>📍 {location}</strong>
        </div>

        <div className="nav-search">
          <select aria-label="Category">
            <option>All</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
          </select>
          <input placeholder="Search Amazon.in" />
          <button>🔍</button>
        </div>

        <div className="nav-language">🇮🇳 EN ▾</div>

        <div className="nav-account">
          <small>Hello, sign in</small>
          <strong>Account & Lists ▾</strong>
        </div>

        <div className="nav-orders">
          <small>Returns</small>
          <strong>& Orders</strong>
        </div>

        <div className="nav-cart">🛒<span>{cartCount}</span><b>Cart</b></div>
      </div>

      <div className="sub-nav">
        <span>☰ All</span>
        <span>Fresh</span>
        <span>MX Player</span>
        <span>Sell</span>
        <span>Best Sellers</span>
        <span>Today's Deals</span>
        <span>Mobiles</span>
        <span>Prime</span>
        <span>Customer Service</span>
        <span>New Releases</span>
      </div>
    </>
  );
}

export default NavBar;
