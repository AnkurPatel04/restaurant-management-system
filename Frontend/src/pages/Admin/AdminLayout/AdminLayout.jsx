import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";
import { assets } from "../../../assets/assets";
import Dashboard from "../Dashboard/Dashboard";

const AdminLayout = () => {
  const location = useLocation();

  const pageTitle = location.pathname.includes("tables")
    ? "Tables"
    : location.pathname.includes("orders")
    ? "Orders"
    : location.pathname.includes("staff")
    ? "Staff"
    : location.pathname.includes("analytics")
    ? "Analytics"
     : location.pathname.includes("addCoupon")
    ? "Coupons"
    : "Dashboard";

      const userEmail = localStorage.getItem("userEmail");
  

  // Extract name from email
  const userName = userEmail
    ? userEmail.split("@")[0].replace(/[0-9]/g, "")
    : "";

  return (
    <div className="admin-layout">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🍽 RestoX</h2>

        <NavLink to="/admin/dashboard" className="menu-item">
          Dashboard
        </NavLink>
        <NavLink to="/admin/menu" className="menu-item">
         Menu Management
        </NavLink>


        <NavLink to="/admin/tables" className="menu-item">
          Tables
        </NavLink>

        <NavLink to="/admin/orders" className="menu-item">
          Orders
        </NavLink>

        <NavLink to="/admin/staff" className="menu-item">
          Staff
        </NavLink>

        <NavLink to="/admin/adminBookings" className="menu-item">
          AdminBookings
        </NavLink>

        <NavLink to="/admin/addCoupon" className="menu-item">
  Coupons
</NavLink>
      </aside>

      {/* Right Side */}
      <div className="right-panel">

        {/* ✅ Header ONLY on right side */}
        <div className="admin-header">

          <div>
            <h2>{pageTitle}</h2>
            <p>Welcome back! Here's what's happening today.</p>
          </div>

          <div className="header-right">
            {/* <div className="search-box">
              🔍
              <input placeholder="Search..." />
            </div> */}

            <div className="profile">
              <img src={assets.logo} alt="user" />
              <div>
                <strong>{userName.charAt(0).toUpperCase() + userName.slice(1)}</strong>
                <small>Admin</small>
              </div>
            </div>
          </div>

        </div>

        {/* Page Content */}
        <main className="admin-content">
         <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
