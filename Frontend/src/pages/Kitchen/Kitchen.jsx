
import React, { useState, useEffect } from "react";
import "./Kitchen.css";
import axios from "axios";
import { assets } from "../../assets/assets"
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  const updateStatus = async (id, nextStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}/status?status=${nextStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, orderStatus: nextStatus } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //   axios.get("http://localhost:8080/api/orders/kitchen")
  //     .then(res => setOrders(res.data))
  //     .catch(err => console.log(err));
  // }, []);
  //or
 useEffect(() => {
  const fetchOrders = async () => {
    try {
     const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/orders/kitchen/${restaurantId}`,
  {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }
);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchOrders();

  // 🔥 WebSocket
  const socket = new WebSocket("ws://localhost:8080/ws");

  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      // console.log("WebSocket Connected");

      stompClient.subscribe("/topic/orders", (message) => {
        const updatedOrder = JSON.parse(message.body);

        setOrders((prev) => {
          const exists = prev.find(o => o.id === updatedOrder.id);

          if (exists) {
            return prev.map(o =>
              o.id === updatedOrder.id ? updatedOrder : o
            );
          } else {
            return [updatedOrder, ...prev];
          }
        });
      });
    },
  });

  stompClient.activate();

  return () => {
    stompClient.deactivate();
  };
}, []);


  const nextAction = (status) => {
    if (status === "CREATED")
      return { label: "Start Cooking", next: "COOKING" };
    if (status === "COOKING") return { label: "Mark Ready", next: "READY" };
    if (status === "READY") return { label: "Mark Served", next: "SERVED" };
    return null;
  };
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return order.orderStatus !== "SERVED";
    if (activeFilter === "new") return order.orderStatus === "CREATED";
    if (activeFilter === "cooking") return order.orderStatus === "COOKING";
    if (activeFilter === "ready") return order.orderStatus === "READY";
    if (activeFilter === "completed") return order.orderStatus === "SERVED";
    return true;
  });

  const newCount = orders.filter((o) => o.orderStatus === "CREATED").length;
  const cookingCount = orders.filter((o) => o.orderStatus === "COOKING").length;
  const readyCount = orders.filter((o) => o.orderStatus === "READY").length;
  const completedCount = orders.filter(
    (o) => o.orderStatus === "SERVED"
  ).length;

  

  return (
    <div className="kds">
      {/* HEADER */}
   <div className="kds-header">
  <div className="kds-title">
    <h2>🍳 Kitchen Display</h2>
    <span className="kds-sub">Live Order Monitor</span>
  </div>

  <div className="kds-stats">
    <div className="stat active">
      Active
      <span>{orders.filter(o => o.orderStatus !== "SERVED").length}</span>
    </div>

    <div className="stat completed">
      Completed
      <span>{orders.filter(o => o.orderStatus === "SERVED").length}</span>
    </div>
  </div>
</div>


      {/* FILTERS */}
      <div className="filters">
        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
        >
          All Active
        </button>

        <button
          className={activeFilter === "new" ? "active" : ""}
          onClick={() => setActiveFilter("new")}
        >
          New
        </button>

        <button
          className={activeFilter === "cooking" ? "active" : ""}
          onClick={() => setActiveFilter("cooking")}
        >
          Cooking
        </button>

        <button
          className={activeFilter === "ready" ? "active" : ""}
          onClick={() => setActiveFilter("ready")}
        >
          Ready
        </button>
        <button
          className={activeFilter === "completed" ? "active" : ""}
          onClick={() => setActiveFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* ORDERS */}
      <div className="cards">
        {orders.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🍽️</div>
            <h3>No active orders</h3>
            <p>New orders will appear here automatically</p>
          </div>
        )}

        {filteredOrders.map((order) => {
          const action = nextAction(order.orderStatus);

          return (
            <div
              className={`order-card ${order.orderStatus} ${
                order.exiting ? "exiting" : ""
              }`}
              key={`${order.id}-${order.orderStatus}`}
            >
              {/* Card Header */}
              <div className="order-header">
                <div>
                  <h4>{order.orderNumber}</h4>
                  <small>Table {order.tableNumber}</small>
                </div>
                <span className={`badge ${order.orderStatus}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Items */}
              <div className="order-items">
                {order.orderedItems.map((item, i) => (
                  <div className="item-row" key={i}>
                    <div className="qty">{item.quantity}x</div>

                    <div className="item-info">
                      <p>{item.name}</p>
                      {/* {item.note && <small>{item.note}</small>} */}
                    </div>

                    <div className={`dot ${item.isVeg ? "veg" : "veg"}`} />
                  </div>
                ))}
              </div>

              {/* Action */}
              {action && (
                <button
                  className={`action-btn ${order.orderStatus}`}
                  onClick={() => updateStatus(order.id, action.next)}
                >
                  {action.label}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔻 BOTTOM COUNTERS */}
      <div className="kds-footer">
        <div className="counter counternew">
          <div className="circle">{newCount}</div>
          <p>New</p>
        </div>

        <div className="counter countercooking">
          <div className="circle">{cookingCount}</div>
          <p>Cooking</p>
        </div>

        <div className="counter counterready">
          <div className="circle">{readyCount}</div>
          <p>Ready</p>
        </div>

        <div className="counter countercompleted">
          <div className="circle">{completedCount}</div>
          <p>Completed</p>
        </div>
      </div>
    </div>
  );
}
