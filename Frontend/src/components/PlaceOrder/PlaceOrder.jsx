import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PlaceOrder = () => {
  const { foodList, quantities, setquantities } = useContext(StoreContext);
  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurantId");
  // ---------------- FORM STATE ----------------
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  // ---------------- CART CALCULATION ----------------
  const cartItems = foodList.filter((item) => quantities[item.id] > 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * quantities[item.id],
    0,
  );

  // const tax = subtotal * 0.1;
  // const shipping = cartItems.length > 0 && subtotal <= 250 ? 50 : 0;
  // const total = subtotal + tax + shipping;

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    if (!formData.address || !formData.phone || !formData.email) {
      toast.warning("Please fill all required fields ⚠️");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const orderPayload = {
        userId: userId,
        restaurantId: restaurantId,
        customerName: `${formData.firstName} ${formData.lastName}`,
        userAddress: formData.address,
        email: formData.email,
        phoneNumber: formData.phone,
        amount: subtotal,
        orderStatus: "CREATED",
        tableNumber: parseInt(localStorage.getItem("tableNo")),
        orderedItems: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: quantities[item.id],
        })),
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order placed successfully 🎉");

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear cart after success
      setquantities({});

      navigate("/order-success");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  useEffect(() => {
    const loadLastOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/last/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data) {
          const o = res.data;

          const nameParts = o.customerName?.split(" ") || [];

          setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: o.email || "",
            phone: o.phoneNumber || "",
            address: o.userAddress || "",
          });
        }
      } catch (err) {
        console.log("No previous order found");
      }
    };

    loadLastOrder();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="place-order">
      {/* LEFT SIDE – Billing */}
      <div className="billing-section">
        <h2>Billing Address</h2>

        <div className="row">
          <input
            type="text"
            placeholder="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Phone number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <button
          className="checkout-btn"
          disabled={cartItems.length === 0}
          onClick={placeOrder}
        >
          Continue to Checkout
        </button>
      </div>

      {/* RIGHT SIDE – Cart Summary */}
      <div className="cart-summary">
        <h3>
          Your Cart <span className="badge">{cartItems.length}</span>
        </h3>

        {cartItems.map((item) => (
          <div className="summary-item" key={item.id}>
            <span>
              {item.name} x {quantities[item.id]}
            </span>
            <span>₹{(item.price * quantities[item.id]).toFixed(2)}</span>
          </div>
        ))}

        <div className="summary-item">
          <span>Shipping</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>

        <div className="summary-item">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <hr />

        <div className="summary-total">
          <strong>Total</strong>
          <strong>₹{subtotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
