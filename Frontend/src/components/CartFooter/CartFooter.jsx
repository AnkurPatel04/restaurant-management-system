import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./CartFooter.css";

const CartFooter = () => {
  const navigate = useNavigate();

  const {
    foodList,
    quantities
  } = useContext(StoreContext);

  // 🧮 Cart Items
  const cartItems = foodList.filter((item) => quantities[item.id] > 0);

  // 🧮 Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * quantities[item.id],
    0
  );

  // 🧮 Tax (10%)
  // const tax = subtotal * 0.1;

  // 🧮 Shipping Logic
  // let shipping = 0;
  // if (cartItems.length > 0 && subtotal <= 250) {
  //   shipping = 50;
  // }

  // 🧮 Final Total
  // const total = subtotal + tax + shipping;

  //  Total Quantity
  const totalItems = cartItems.reduce(
    (acc, item) => acc + quantities[item.id],
    0
  );

  // Hide footer if cart empty
  if (totalItems === 0) return null;

  return (
    <div className="cart-footer" onClick={() => navigate("/cart")}>
      <span className="cart-text">
        🛒 View Cart ({totalItems}) • ₹{subtotal.toFixed(2)}
      </span>
    </div>
  );
};

export default CartFooter;
