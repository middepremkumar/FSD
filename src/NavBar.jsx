import React, { useState } from "react";
import "./NavBar.css";
import amazonLogo from "./assets/amazon-logo-amazon-icon-transparent-free-png.webp";

function NavBar({ 
  cartCount = 0, 
  onOpenCart, 
  onOpenOrders, 
  search = "", 
  setSearch, 
  selectedCategory = "All", 
  setSelectedCategory,
  categories = ["All", "Mobiles", "Laptops", "Audio", "Fashion", "Smart Wearables", "Cameras"],
  apiHealth = null,
  deliveryLocation = "Mumbai 400001",
  onOpenLocation
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="top-nav">
        {/* Amazon Logo */}
        <div 
          className="nav-logo" 
          role="button"
          tabIndex={0}
          onClick={() => {
            setSelectedCategory?.("All");
            setSearch?.("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          title="Amazon.in Home"
        >
          <img src={amazonLogo} alt="Amazon" />
          <span>.in</span>
        </div>

        {/* Deliver To Location */}
        <div 
          className="deliver-to" 
          onClick={onOpenLocation}
          title="Change delivery location"
          style={{ cursor: "pointer" }}
        >
          <small>Deliver to</small>
          <strong>📍 {deliveryLocation}</strong>
        </div>

        {/* Global Search Bar */}
        <form 
          className="nav-search" 
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <select 
            aria-label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory?.(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== "All").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            placeholder="Search Amazon.in products, brands and tech..."
            value={search}
            onChange={(e) => setSearch?.(e.target.value)}
          />
          <button 
            type="submit" 
            title="Search"
            aria-label="Search button"
          >
            🔍
          </button>
        </form>

        {/* Language selector */}
        <div className="nav-language">🇮🇳 EN ▾</div>

        {/* Hello Sign in / Account & Lists */}
        <div 
          className="nav-account" 
          title="Account & Lists" 
          style={{ cursor: "pointer", display: "flex", flexDirection: "column", padding: "4px 8px" }}
        >
          <small style={{ color: "#ccc", fontSize: "11px", lineHeight: "1" }}>Hello, sign in</small>
          <strong style={{ color: "#fff", fontSize: "13px", lineHeight: "1.2" }}>Account & Lists ▾</strong>
        </div>

        {/* Returns & Orders */}
        <div 
          className="nav-orders" 
          onClick={onOpenOrders}
          style={{ cursor: "pointer" }}
          title="View your past orders"
        >
          <small>Returns</small>
          <strong>& Orders</strong>
        </div>

        {/* Cart Button */}
        <div
          className="nav-cart"
          style={{ cursor: "pointer" }}
          onClick={onOpenCart}
          title="View Cart"
        >
          🛒
          <span className="cart-badge">{cartCount}</span>
          <b>Cart</b>
        </div>
      </header>

      {/* Sub-Navigation Categories Bar */}
      <nav className="sub-nav">
        <span 
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰ All
        </span>
        {categories.map((cat) => (
          <span 
            key={cat}
            className={selectedCategory === cat ? "active-sub-item" : ""}
            onClick={() => {
              setSelectedCategory?.(cat);
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ cursor: "pointer" }}
          >
            {cat}
          </span>
        ))}
        <span 
          onClick={onOpenOrders} 
          style={{ cursor: "pointer", marginLeft: "auto", color: "#febd69" }}
        >
          📦 Track Orders
        </span>
      </nav>
    </>
  );
}

export default NavBar;
