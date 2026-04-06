import React, { useEffect, useState } from "react";
import "./OrderStatus.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const steps = [
  { label: "Order Placed", icon: "🕒" },
  { label: "Cooking", icon: "👨‍🍳" },
  { label: "Ready", icon: "🍽️" },
  { label: "Served", icon: "✅" },
];
const statusMap = {
  CREATED: 0,
  COOKING: 1,
  READY: 2,
  SERVED: 3,
};

const messages = [
  {
    title: "Order Received!",
    desc: "Your order is being processed",
  },
  {
    title: "Cooking in Progress",
    desc: "Our chef is preparing your food with care",
  },
  {
    title: "Your Order is Ready!",
    desc: "A staff member will serve you shortly",
  },
  {
    title: "Enjoy Your Meal!",
    desc: "Thank you for dining with us",
  },
];

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

 useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data);
    } catch (error) {
      console.error("Failed to load order", error);
    }
  };

  // first load
  fetchOrder();

  // auto refresh every 5 sec
  const interval = setInterval(fetchOrder, 5000);

  return () => clearInterval(interval);
}, [orderId]);

  useEffect(() => {
    if (order?.orderStatus) {
      const stepIndex = statusMap[order.orderStatus];
      setActiveStep(stepIndex);
    }
  }, [order?.orderStatus]);

  const subtotal = order?.amount || 0;
  const tax = subtotal * 0.1;
  const finalTotal = subtotal + tax;

  return (
    <div className="order-page">
      <div className="order-status-header">
        <div className="header-left">
          <span className="back-arrow" onClick={() => window.history.back()}>
            ←
          </span>
          <div>
            <h2>Order Status</h2>
            <p>{order?.orderNumber}</p>
          </div>
        </div>
      </div>
      <hr className="order-status-divider" />
      {/* ===== Status Card ===== */}
      <div className="order-wrapper">
        <div className="order-card">
          {/* Step Progress */}
          <div className="steps">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div
                  className={`step-circle ${index <= activeStep ? "active" : ""}`}
                >
                  {step.icon}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`step-line ${index < activeStep ? "active" : ""}`}
                  />
                )}

                <p className="step-label">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          <h2 className="order-title">{messages[activeStep].title}</h2>
          <p className="order-desc">{messages[activeStep].desc}</p>

          <div className="order-time">⏱ ~15 min</div>
        </div>
      </div>

      {/* ===== Order Summary ===== */}
      <div className="summary-card">
        <h3>Order Summary</h3>
        <div className="summary-scroll">
          {order?.orderedItems.map((item, i) => (
            <div className="summary-item" key={item.id}>
              <div className="qty-circle">{item.quantity}</div>

              <div className="item-info">
                <h4>{item.name}</h4>
              </div>
              <span className="item-price">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="summary-divider" />

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Tax (10%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ===== Buttons ===== */}
      <button className="primary-btn">💳 View Bill</button>
      <button className="secondary-btn">🔔 Call Waiter</button>
    </div>
  );
};

export default OrderStatus;
