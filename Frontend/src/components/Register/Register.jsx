import React from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "", 
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Register Data:", data);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`,data);
      if (response.status === 201) {
        // console.log("User registered successfully", response.data);
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
      else{ 
        toast.error("Registration failed. Please try again.");
      } 
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />

          <button className="signup-btn" type="submit">
            SIGN UP
          </button>
          <button className="reset-btn">RESET</button>
        </form>
        <p className="signin-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
