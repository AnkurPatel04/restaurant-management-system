import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
    const restaurantId = localStorage.getItem("restaurantId");

  const {
    foodList,
    quantities,
    increseQuantity,
    decreaseQuantity,
    removeItem,
    setquantities,
  } = useContext(StoreContext);

  const cartItems = foodList.filter((item) => quantities[item.id] > 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * quantities[item.id],
    0,
  );
  // const tax = subtotal * 0.1; // Assuming 10% tax
  // let shipping = 0;
  // if (cartItems.length > 0 && subtotal <= 250) {
  //   shipping = 50;
  // }
  // const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const orderData = {
        userId: localStorage.getItem("userId"),
        restaurantId: restaurantId,
        tableNumber: parseInt(localStorage.getItem("tableNo")),
        customerName: localStorage.getItem("customerName"),
        orderedItems: cartItems.map((item) => ({
          name: item.name,
          quantity: quantities[item.id],
          price: item.price,
          isVeg: item.isVeg,
        })),
        amount: subtotal,
      };
      // console.log("Order Payload:", orderData);

      // ✅ 1. Create order
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ 2. Clear cart in backend
     await axios.delete(
  `${import.meta.env.VITE_API_URL}/api/cart/${restaurantId}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

      // ✅ 3. Clear cart in frontend
      setquantities({});

      toast.success("Order placed successfully!");

      navigate("/table-orders");
    } catch (error) {
      console.log(error);
      toast.error("Failed to place order");
    }
  };

  return (
    <>
      <div className="cart-header">
        <div className="cart-header-content">
          <h2 className="cart-title">Your Order</h2>
          <p className="cart-subtitle">
            Review your items before placing order
          </p>
        </div>
      </div>

      <div className="cart-page">
        <div className="cart-container">
          {/* LEFT SIDE */}
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-info">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="food-image"
                    />

                    <div className="item-text">
                      <h4>{item.name}</h4>
                      <p>Category: {item.category}</p>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{quantities[item.id]}</span>
                    <button onClick={() => increseQuantity(item.id)}>+</button>
                  </div>

                  <div className="item-price">
                    ₹{item.price.toFixed(2)}
                    <button
                      className="delete-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="continue-wrapper">
            <Link to="/explore-food">
              <button className="continue-btn">← Continue Shopping</button>
            </Link>
            <button className="checkout-btn" onClick={handleCheckout}>
              Place Order
            </button>
          </div>

          <div className="checkout-wrapper"></div>

        
        </div>
      </div>
    </>
  );
};

export default Cart;
