import React from "react";
import "./TableOrders.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const TableOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const tableNo = parseInt(localStorage.getItem("tableNo"));
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
   
    try {
      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/orders/${restaurantId}/table/${tableNo}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    //   console.log("API Response:", res.data); // Debugging line

      // Filter by table number
    const tableOrders = res.data.filter(
  (order) => order.tableNumber === tableNo
);


      setOrders(tableOrders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* FULL WIDTH HEADER */}
      <div className="orders-header">
        <div className="orders-header-inner">
          <div className="back" onClick={() => navigate(-1)}>
            ←
          </div>
          <div>
            <h2>Table {tableNo} Orders</h2>
            <p>{orders.length} orders placed</p>
          </div>
        </div>
      </div>

      <div className="table-orders-page">
        {/* CARD */}
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            {/* Top */}
            <div className="order-top">
              <div>
                <h3>{order.orderNumber}</h3>
                <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="status-badge">{order.orderStatus}</div>
            </div>

            {/* Items */}
            {order.orderedItems.map((item, i) => (
              <div className="item-row" key={i}>
                <div className="item-left">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>

                <div className="item-price">₹{item.price}</div>
              </div>
            ))}

            {/* Total */}
            <div className="order-total">
              <span>Order Total</span>
              <span className="total-price">₹{order.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}

        {/* Add More */}
        <div className="bottom-actions">
          <button
            className="add-more-btn"
            onClick={() => navigate("/explore-food")}
          >
            + Add More Items
          </button>

          <button className="view-bill-btn" onClick={() => navigate("/bill")}>
            💳 View Full Bill ({orders.length} orders)
          </button>

          <button className="call-waiter-btn">🔔 Call Waiter</button>
        </div>
      </div>
    </>
  );
};

export default TableOrders;
