import React, { useState } from "react";
import axios from "axios";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
    const navigate = useNavigate();

  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

  const handleUpdate = async () => {

    if(newPassword !== confirmPassword){
      alert("Passwords do not match");
      return;
    }

    try{

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/change-password`,
        {
          email,
          currentPassword,
          newPassword
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      alert("Password updated successfully");

    }catch(error){
      alert("Password update failed");
    }

  };

  return (

  <div className="change-password-page">

    {/* <div className="back-link">← Back</div> */}

    <div className="change-password-card">

      <div className="icon-box">
        🔒
      </div>

      <h2>Change Password</h2>
      <p className="subtitle">
        Enter your current password and choose a new one
      </p>

      <div className="form-group">
        <label>Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
        />
       <span 
  className="forgot"
  onClick={() => navigate("/forgot-password")}
>
  Forgot your password?
</span>
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />
      </div>

      <button className="update-btn" onClick={handleUpdate}>
        Update Password
      </button>

    </div>
  </div>
);

};

export default ChangePassword;