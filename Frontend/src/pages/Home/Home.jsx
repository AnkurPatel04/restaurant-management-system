import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const role = localStorage.getItem("role");

  return (
    <div className="home-page">
      {/* ================= HERO ================= */}
      <section className="hero">
        <span className="hero-badge">🚀 Restaurant Ordering + KDS System</span>

        <h1>
          Manage Your <span>Restaurant</span> Smarter
        </h1>

        <p>
          QR menu ordering, kitchen display system, live order tracking, staff
          dashboard and smart analytics – everything in one platform.
        </p>

        <div className="hero-buttons">
          {/* USER & ADMIN can see menu */}
          {(role === "USER" || role === "RESTAURANT_ADMIN") && (
            <Link to="/explore-food">
              <button className="primary-button">🍽 Explore Menu</button>
            </Link>
          )}

          {/* ADMIN only */}
          {role === "RESTAURANT_ADMIN" && (
            <Link to="/admin/dashboard">
              <button className="secondary-button">Admin Dashboard</button>
            </Link>
          )}

          {/* CHEF or ADMIN */}
          {(role === "CHEF" || role === "RESTAURANT_ADMIN") && (
            <Link to="/kitchen">
              <button className="secondary-button">Kitchen Display</button>
            </Link>
          )}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">
        <h2>Why Choose RestoX?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📱 QR Ordering</h3>
            <p>Customers scan QR and order directly from their phone.</p>
          </div>

          <div className="feature-card">
            <h3>👨‍🍳 Kitchen Display</h3>
            <p>Live order flow for chefs with real-time status updates.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Analytics</h3>
            <p>Track sales, popular items, and peak hours.</p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure Login</h3>
            <p>OTP + JWT based authentication for safety.</p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="how-subtitle">
          Seamless workflow from order to service in four simple steps
        </p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-card-circle">1</div>
            <h3>Customer Scans QR</h3>
            <p>Table QR code provides instant access to digital menu</p>
          </div>

          <div className="step-card">
            <div className="step-card-circle">2</div>
            <h3>Order Placed</h3>
            <p>Orders are sent directly to kitchen display system</p>
          </div>

          <div className="step-card">
            <div className="step-card-circle">3</div>
            <h3>Kitchen Prepares</h3>
            <p>Chefs see real-time orders and update status</p>
          </div>

          <div className="step-card">
            <div className="step-card-circle">4</div>
            <h3>Service & Payment</h3>
            <p>Waiters serve when ready and process seamless checkout</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <span className="cta-badge">✨ Get Started Today</span>

        <h2>
          Ready to Transform Your <span>Restaurant Experience?</span>
        </h2>

        <p>
          Join hundreds of restaurants already using RestoX to streamline
          operations and delight customers.
        </p>

        <div className="cta-buttons">
          <button className="cta-primary">Start Free Trial →</button>
          <button className="cta-secondary">Contact Sales</button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>🍴 RestoX</h3>
            <p>Smart restaurant management system for modern businesses.</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p>Home</p>
            <p>Menu</p>
            <p>About</p>
            <p>Contact</p>
          </div>

          <div>
            <h4>User Portals</h4>
            <p>Customer</p>
            <p>Kitchen</p>
            <p>Admin</p>
            <p>Billing</p>
          </div>

          <div>
            <h4>Contact</h4>
            <p>📍 Ahmedabad, India</p>
            <p>📞 +91 9876543210</p>
            <p>✉️ support@restox.com</p>
          </div>
        </div>

        <div className="footer-bottom">© 2026 RestoX. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
