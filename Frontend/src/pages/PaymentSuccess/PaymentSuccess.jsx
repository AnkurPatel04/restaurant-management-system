import React, { useEffect, useState } from "react";
import "./PaymentSuccess.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [seconds, setSeconds] = useState(8);
  const [paymentUpdated, setPaymentUpdated] = useState(false);

  let orderIds = location.state?.orderIds;

  if (!orderIds || orderIds.length === 0) {
    const stored = localStorage.getItem("paymentOrderIds");
    orderIds = stored ? JSON.parse(stored) : [];
  }

  const isCashPayment = location.state?.orderIds ? true : false;

  // console.log("Order IDs:", orderIds);

  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");
  const tableNumber = localStorage.getItem("tableNo");
  const couponCode = localStorage.getItem("paymentCouponCode");
  const discount = localStorage.getItem("paymentDiscount");

  useEffect(() => {
    const markOrdersPaid = async () => {
      if (isCashPayment) {
        setPaymentUpdated(true);
        return;
      }
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/orders/${restaurantId}/pay/${tableNumber}`,
          { paymentMethod: "CARD", couponCode, discount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // console.log("Orders marked PAID");

        setPaymentUpdated(true);
      } catch (error) {
        console.error("Payment update failed:", error);
      }
    };

    markOrdersPaid();
  }, []);

  // ⏳ countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds === 0) {
      navigate("/");
    }

    return () => clearInterval(timer);
  }, [seconds]);

  const downloadInvoice = async () => {
    // console.log(orderIds)

    try {
      if (!paymentUpdated) {
        alert("Payment still processing...");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/invoice`,
        orderIds,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "invoice.pdf");

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  return (
    <div className="order-success">
      <div className="success-glow"></div>

      <div className="success-card premium">
        {/* Animated Check */}
        <div className="check-wrapper">
          <div className="check-circle">
            <span className="check-icon">✓</span>
          </div>
        </div>

        <h1 className="success-title">
          <span className="title-dark">Payment</span>{" "}
          <span className="title-gradient">Successfully!</span>
        </h1>

        {/* <p className="subtitle">
          Your delicious food is being prepared and will reach you shortly 🍽️
        </p> */}

        <p className="redirect-text">
          Redirecting to home page in <strong>{seconds}s</strong>...
        </p>

        <div className="success-buttons">
          <button
            className="btn-primary1"
            onClick={downloadInvoice}
            disabled={!paymentUpdated}
          >
            {paymentUpdated ? "Download Invoice" : "Processing Payment..."}
          </button>

          <button className="btn-outline" onClick={() => navigate("/")}>
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
