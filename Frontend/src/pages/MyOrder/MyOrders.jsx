import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/OrderCard/OrderCard";
import axios from "axios";
import "./MyOrders.css";
const API = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API}/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOrders(res.data);
      } catch (error) {
        console.log("Failed to load my orders", error);
      }
    };

    fetchOrders();
  }, []);
  return (
  <div className="orders-wrapper">
    {orders.length === 0 ? (
      <div className="no-orders">
        <div className="empty-icon">🍽️</div>
        <h2>No Orders Yet</h2>
        <p>You haven’t placed any orders yet.</p>
        <button onClick={() => navigate("/explore-food")}>
          Explore Menu
        </button>
      </div>
    ) : (
      <div className="orders-grid">
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={{
              id: o.orderNumber,
              customerName: o.customerName,
              tableNumber: o.tableNumber,
              status: o.orderStatus,
              amount: o.amount,
              time: new Date(o.createdAt).toLocaleTimeString(),
              items: o.orderedItems.map((i) => i.name),
            }}
            onClick={() => navigate(`/order-status/${o.id}`)}
          />
        ))}
      </div>
    )}
  </div>
);



};

export default MyOrders;
