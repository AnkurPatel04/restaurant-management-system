import React, { useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Login = () => {
  const { settoken, loadCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("API URL =", import.meta.env.VITE_API_URL);
      
     
      const reaponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
      );

      if (reaponse.status === 200) {
        toast.success("Login successful!");
        // console.log("Login response:", reaponse.data);

        settoken(reaponse.data.token);
        localStorage.setItem("token", reaponse.data.token);
        localStorage.setItem("userEmail", reaponse.data.email);
        localStorage.setItem("userId", reaponse.data.userId);
        localStorage.setItem("role", reaponse.data.role);
        localStorage.setItem("restaurantId", reaponse.data.restaurantId);

      
          const role = reaponse.data.role;
        if (role === "USER") {
          await loadCart(reaponse.data.token);
        }


  if (role === "USER") {
    await loadCart(reaponse.data.token);
    navigate("/"); 
  } else if (role === "RESTAURANT_ADMIN") {
    navigate("/admin/dashboard");  
  } else if (role === "CHEF") {
    navigate("/kitchen");
  } else {
    navigate("/");
  }

      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      console.log("Login error:", err);
      toast.error("Login failed. Please try again.");
    }
  };
  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Sign In</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
          <p
  className="forgot-link"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>

          <button className="signin-btn" type="submit">
            SIGN IN
          </button>
          <p className="signup-text">
            Login with OTP?{" "}
            <span
              style={{ color: "#ff7a18", cursor: "pointer" }}
              onClick={() => navigate("/otp-login")}
            >
              Use OTP
            </span>
          </p>
        </form>
        <p className="signup-text">
          Already have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
