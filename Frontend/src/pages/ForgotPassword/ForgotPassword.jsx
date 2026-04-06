import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

  const [step,setStep] = useState(1);
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [sendingOtp,setSendingOtp] = useState(false);
  const [resetting,setResetting] = useState(false);

  const [cooldown,setCooldown] = useState(0);
  const [message,setMessage] = useState("");

  useEffect(() => {
    if(cooldown <= 0) return;

    const timer = setInterval(()=>{
      setCooldown(prev => prev - 1);
    },1000);

    return () => clearInterval(timer);

  },[cooldown]);

  useEffect(()=>{
    if(!message) return;

    const msgTimer = setTimeout(()=>{
      setMessage("");
    },5000);

    return ()=>clearTimeout(msgTimer);

  },[message]);



  const sendOtp = async () => {

    if(!email){
      toast.error("Please enter email");
      return;
    }

    if(cooldown > 0) return;

    try{

      setSendingOtp(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/send-otp`,
        { email }
      );

      toast.success("OTP sent to email");

      setMessage("OTP sent successfully");
      setCooldown(5);
      setStep(2);

    }catch(err){

      toast.error(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to send OTP"
      );

    }finally{
      setSendingOtp(false);
    }

  };



  const resetPassword = async () => {

    if(!otp){
      toast.error("Please enter OTP");
      return;
    }

    if(newPassword !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }

    try{

      setResetting(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-password`,
        {
          email,
          otp,
          newPassword
        }
      );

      toast.success("Password reset successful");

      setStep(3);

    }catch(err){

      toast.error(
        err.response?.data ||
        "Reset failed"
      );

    }finally{
      setResetting(false);
    }

  };



  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <div className="icon-box">🔒</div>

        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <p>Enter your email to receive OTP</p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <button
              className="forgot-btn"
              onClick={sendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Reset Password</h2>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />

            <button
              className="forgot-btn"
              onClick={resetPassword}
              disabled={resetting}
            >
              {resetting ? "Resetting..." : "Reset Password"}
            </button>

            {cooldown > 0 ? (
              <p className="message">
                Resend OTP in {cooldown}s
              </p>
            ) : (
              <p
                className="resend"
                onClick={!sendingOtp ? sendOtp : undefined}
              >
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </p>
            )}

            {message && <p className="message">{message}</p>}
          </>
        )}

{step === 3 && (
  <>
    <h2>Password Updated</h2>
    <p>You can now login with your new password.</p>

    <button
      className="forgot-btn"
      onClick={() => navigate("/login")}
    >
      Back to Login
    </button>
  </>
)}
      </div>

    </div>
  );
};

export default ForgotPassword;