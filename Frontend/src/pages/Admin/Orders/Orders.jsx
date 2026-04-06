import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
 const token = localStorage.getItem("token");
   const restaurantId = localStorage.getItem("restaurantId");

  // ---------------- FETCH ORDERS ----------------
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Orders API Response:", res.data);
      // console.log(res.data);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!token || !restaurantId) return;

  fetchOrders();

  const interval = setInterval(fetchOrders, 5000);

  return () => clearInterval(interval);
}, [token, restaurantId]);
  const filteredOrders = orders.filter((o)=>{
    if(activeTab==="All"){
      return true;
    }else if(activeTab==="Today"){
     const today = new Date().toISOString().split("T")[0];
    return o.createdAt?.startsWith(today);
    }else if(activeTab==="New"){
      return o.orderStatus==="CREATED";
    }else if(activeTab==="Cooking"){
      return o.orderStatus==="COOKING";
    }else if(activeTab==="Ready"){
      return o.orderStatus==="READY";
    }else if(activeTab==="Completed"){
      return o.orderStatus==="SERVED";
    }
    return false;
  })



  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();
  } catch (error) {
    console.error("Delete failed", error);
    alert("Failed to delete order");
  }
};
  if (loading) return <h3 style={{ padding: 30 }}>Loading orders...</h3>;

  return (
    <div className="orders-container">
      {/* Header */}
      {/* <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track all orders</p>
        </div>
      </div> */}

      {/* Search */}
      {/* <div className="orders-toolbar">
        <input
          className="search-input"
          placeholder="🔍 Search email, phone, food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      {/* Tabs */}
      <div className="orders-tabs">
        {["All", "Today", "New", "Cooking", "Ready","Completed"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>TABLE</th>
              {/* <th>CUSTOMER</th> */}
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id }>
                <td>{order.orderNumber}</td>
                <td>
                  <b>{order.tableNumber|| "N/A"}</b>
                </td>

                {/* <td>
                  <div>
                    <b>{order.customerName || "Guest"}</b>
                
                    <div style={{ fontSize: 12, color: "#777" }}>
                      📞 {order.phoneNumber}
                    </div>
                  </div>
                </td> */}

                <td>
                  {order.orderedItems && order.orderedItems.length > 0 ? (
                    order.orderedItems.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.name}
                      </div>
                    ))
                  ) : (
                    <span style={{ color: "#999" }}>No items</span>
                  )}
                </td>

                <td>₹{order.amount?.toFixed(2)}</td>

                <td>
                  <span
                    className={`status ${order.orderStatus}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p style={{ padding: 20 }}>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
