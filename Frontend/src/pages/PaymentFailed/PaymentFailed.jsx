import React from "react";
import "./PaymentFailed.css";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {

  const navigate = useNavigate();
  console.log("Rendering PaymentFailed component");

  return (
    <div className="order-failed">

      <div className="failed-glow"></div>

      <div className="failed-card premium">

        <div className="cross-wrapper">
          <div className="cross-circle">
            <span className="cross-icon">✕</span>
          </div>
        </div>

        <h1 className="failed-title">
          <span className="title-dark">Payment</span>{" "}
          <span className="title-gradient">Failed!</span>
        </h1>

        <p className="subtitle">
          Something went wrong during payment. Please try again.
        </p>

        <div className="failed-buttons">

          <button
            className="btn-primary1"
            onClick={() => navigate("/bill")}
          >
            🔁 Try Again
          </button>

          <button
            className="btn-outline"
            onClick={() => navigate("/")}
          >
            🏠 Go Home
          </button>

        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;