import React, { useState } from "react";
import "./BillPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BillPage = () => {
  const [selected, setSelected] = useState("UPI");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const tableNumber = parseInt(localStorage.getItem("tableNo"));
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/${restaurantId}/table/${tableNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      //   console.log("API Response:", res.data); // Debugging line
      setOrders(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = orders.reduce((acc, o) => acc + o.amount, 0);

  const sgst = subtotal * 0.025; // 2.5%
  const cgst = subtotal * 0.025; // 2.5%

  const totalWithTax = subtotal + sgst + cgst;
  const grandTotal = totalWithTax - discount;

  const handlePayment = async () => {
    try {
      // console.log("Initiating payment with method:", selected); // Debugging line

      // CASH PAYMENT (no stripe)
      if (selected === "Cash") {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/orders/${restaurantId}/pay/${tableNumber}`,
          { paymentMethod: "CASH",
            couponCode,
            discount
           },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Payment Successful!");

        navigate("/payment-success", {
          state: { orderIds: response.data },
        });

        return;
      }

      // STRIPE PAYMENT
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-session`,
        {
          restaurantId,
          tableNumber,
          amount: grandTotal,
          paymentMethod: selected,
          couponCode,
    discount

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // store order ids before stripe redirect
      const orderIds = orders.map((o) => o.id);
      localStorage.setItem("paymentOrderIds", JSON.stringify(orderIds));

      localStorage.setItem("paymentTableNo", tableNumber);
      localStorage.setItem("paymentRestaurantId", restaurantId);

      localStorage.setItem("paymentCouponCode", couponCode);
localStorage.setItem("paymentDiscount", discount);
      window.location.href = res.data.url;
    } catch (error) {
      console.log("Payment error:", error.response);
      alert("Payment Failed");
    }
  };

  const applyCoupon = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupons/apply`,
        {
          code: couponCode,
          restaurantId,
          amount: grandTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDiscount(res.data.discount);
      setCouponApplied(true);

      toast.success("Coupon Applied!");
    } catch (err) {
      toast.error("Invalid Coupon");
    }
  };
  return (
    <>
      <div className="bill-header">
        <div className="bill-header-content">
          <span className="back-arrow" onClick={() => navigate(-1)}>
            ←
          </span>

          <div className="header-text">
            <h2>💵 Bill — Table {tableNumber}</h2>
            <p>{orders.length} orders consolidated</p>
          </div>
        </div>
      </div>

      <div className="bill-page">
        {/* HEADER */}

        {/* ORDER CARDS */}
        {orders.map((order) => (
          <div className="bill-card" key={order.id}>
            <div className="bill-top">
              <h4>{order.orderNumber}</h4>
            </div>

            {order.orderedItems.map((item, i) => (
              <div className="bill-row" key={i}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="bill-total">
              <span>Order Total</span>
              <span>₹{order.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="summary-card1">
          <h3>Bill Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({orders.length} orders)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

       <div className="coupon-box">
  <input
    type="text"
    placeholder="Enter Coupon Code"
    value={couponCode}
    disabled={couponApplied}
    onChange={(e) => setCouponCode(e.target.value)}
  />

  <button
    className={`apply-btn ${couponApplied ? "applied" : ""}`}
    disabled={couponApplied}
    onClick={applyCoupon}
  >
    {couponApplied ? "Applied ✓" : "Apply"}
  </button>
</div>

          {discount > 0 && (
            <div className="summary-row">
              <span>Coupon ({couponCode})</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>SGST (2.5%)</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>CGST (2.5%)</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>

          {discount > 0 && (
           <div className="coupon-success">
  Coupon {couponCode} <span className="applied-text">Applied ✓</span>
</div>
          )}

          <div className="grand-total">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="payment-card">
          <h3>Payment Method</h3>

          <div className="payment-options">
            {["Cash", "UPI", "Card"].map((method) => (
              <div
                key={method}
                className={`payment-box ${selected === method ? "active" : ""}`}
                onClick={() => setSelected(method)}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* PAY BUTTON */}
        <button className="pay-btn" onClick={handlePayment}>
          Pay ₹{grandTotal.toFixed(2)}
        </button>
      </div>
    </>
  );
};

export default BillPage;
