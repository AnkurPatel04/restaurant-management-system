import "./OrderCard.css";
import { useEffect, useState } from "react";

const steps = [
  { label: "Order Placed", icon: "🕒" },
  { label: "Cooking", icon: "👨‍🍳" },
  { label: "Ready", icon: "🍽️" },
  { label: "Served", icon: "✅" },
];
// ✅ map backend status → step index
const statusMap = {
  CREATED: 0,
  COOKING: 1,
  READY: 2,
  SERVED: 3,
};

const OrderCard = ({ order, onClick }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepIndex = statusMap[order.status] || 0;
    setActiveStep(stepIndex);
  }, [order.status]);

  return (
    <div className="order-card" onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Top */}
      <div className="top-row">
        <div className="left">
          <span className="oid">#{order.id}</span>

          <div className="sub">
            👤 {order.customerName} &nbsp; 📍 T-{order.tableNumber}
          </div>
        </div>

        <div className="right">
          <span className={`pill ${order.status}`}>
            {order.status.replace("_", " ")}
          </span>

          <div className="amt">₹{order.amount}</div>
        </div>
      </div>
      {/* Progress */}
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

      <hr />

      {/* Items */}
      <div className="items">
        {order.items[0]}, {order.items[1]}
        {order.items.length > 2 && (
          <span className="more"> +{order.items.length - 2} more</span>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
