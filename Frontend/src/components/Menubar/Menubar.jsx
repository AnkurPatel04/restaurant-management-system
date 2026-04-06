import React, { useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useContext } from "react";
import axios from "axios";

//navbar component
const Menubar = () => {
  const userEmail = localStorage.getItem("userEmail");
  const restaurantId = localStorage.getItem("restaurantId");
  

  // Extract name from email
  const userName = userEmail
    ? userEmail.split("@")[0].replace(/[0-9]/g, "")
    : "";

  const [mobileOpen, setMobileOpen] = useState(false);

  const { quantities, token, settoken, setquantities } =
    useContext(StoreContext);
  const totalUniqueItems = Object.values(quantities).filter(
    (qty) => qty > 0
  ).length;
  const navigate = useNavigate();

  const closeMenu = () => setMobileOpen(false);


  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.put(
  `${import.meta.env.VITE_API_URL}/api/cart/clear-table/${restaurantId}`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
        // console.log("✅ Table cleared from DB");
      }
    } catch (error) {
      console.error(
        "❌ Failed to clear table from DB:",
        error.response?.status
      );
    }

    localStorage.removeItem("token");
    localStorage.removeItem("tableNo");
    settoken("");
    setquantities({});
    navigate("/");
  };

  return (
    <>
      <div className="menubar">
        {/* Left */}
        <div className="menubar-left">
          <Link to="/">
            <img src={assets.logo} alt="Logo" className="menubar-logo" />
          </Link>

          {/* Desktop Links */}
          <div className="menu-links">
            <Link to="/" className="menubar-brand-name">
              Home
            </Link>
            <Link to="/explore-food" className="menubar-brand-name">
              Explore
            </Link>
            <Link to="/contact-us" className="menubar-brand-name">
              Contact Us
            </Link>
              <Link to="/my-order" className="menubar-brand-name">
              My Orders
            </Link>
             <Link to="/table-booking" className="menubar-brand-name">
              Table Booking
            </Link>
                <Link to="/change-password" className="menubar-brand-name">
              Change Password
            </Link>

            
          </div>
        </div>

        {/* Right */}
        <div className="menubar-right">
          <div className="cart-wrapper">
            <Link to="/cart">
              <img src={assets.cart} alt="Cart" className="menubar-cart" />
            </Link>
            <span className="cart-badge">{totalUniqueItems}</span>
          </div>

          {!token ? (
            <div className="auth-buttons">
              <button
                className="menubar-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="menubar-button menubar-signup-button"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="dropdown-wrapper">
              <img src={assets.profile} alt="Profile" />
              {userName && (
                <span className="user-name">
                  👋 Hi, {userName.charAt(0).toUpperCase() + userName.slice(1)}
                </span>
              )}

              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={logout}>
                  Logout
                </div>
                {/* <div
                  className="dropdown-item"
                  onClick={() => navigate("/myorders")}
                >
                  Orders
                </div> */}
              </div>
            </div>
          )}

          {/* Mobile Hamburger */}
          <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            ☰
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/explore-food"  onClick={closeMenu}>
            Explore
          </Link>
          <Link to="/contact-us"  onClick={closeMenu}>
            Contact Us
          </Link>
           <Link to="/my-order"  onClick={closeMenu} className="menubar-brand-name">
              My Orders
            </Link>
           <Link to="/table-booking"  onClick={closeMenu} className="menubar-brand-name">
              Table Booking
            </Link>
              <Link to="/change-password"  onClick={closeMenu} className="menubar-brand-name">
              Change Password
            </Link>

          <div className="mobile-divider" />

          {!token ? (
            <div className="mobile-auth">
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileOpen(false);
                }}
              >
                Login
              </button>

              <button
                className="signup"
                onClick={() => {
                  navigate("/register");
                  setMobileOpen(false);
                }}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="mobile-auth">
              <button onClick={logout}>Logout</button>
             
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Menubar;
