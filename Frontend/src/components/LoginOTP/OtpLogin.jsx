import React, { useState, useContext, useEffect } from "react";
import "./OtpLogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const OtpLogin = () => {
  const { settoken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!message) return;

    const msgTimer = setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => clearTimeout(msgTimer);
  }, [message]);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    if (cooldown > 0) return; // 🚫 block spam clicks

    try {
      setSendingOtp(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/send-otp`, { email });

      toast.success("OTP sent to your email");
      setMessage("OTP sent successfully.");
      setCooldown(5); // ⏳ 30 seconds wait
      setStep(2);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 403) {
        toast.error("User not registered. Please sign up first.");
        return;
      }

      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to send OTP"
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/api/verify-otp`,
        {
          email,
          otp,
        }
      );

      toast.success("Login successful!");

      // Save token (same as Login.jsx)
      settoken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", email);


      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>OTP Login</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="signin-btn"
              onClick={sendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="signin-btn"
              onClick={verifyOtp}
              disabled={verifyingOtp}
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>

            {cooldown > 0 ? (
              <p className="message">Resend OTP in {cooldown}s</p>
            ) : (
              <p className="resend" onClick={!sendingOtp ? sendOtp : undefined}>
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </p>
            )}

            {message && <p className="message">{message}</p>}
          </>
        )}

        <p className="signup-text">
          Login with password?{" "}
          <span
            style={{ color: "#ff7a18", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpLogin;
