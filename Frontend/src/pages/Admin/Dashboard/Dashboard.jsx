import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [availableTables, setAvailableTables] = useState(0);
  const [totalTables, setTotalTables] = useState(0);

  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  const fetchData = async () => {
    try {
      const ordersRes = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/orders/restaurant/${restaurantId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      setOrders(ordersRes.data);

      const foodRes = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/foods/restaurant/${restaurantId}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

      setFoods(foodRes.data);
      // console.log(foodRes.data);
      // console.log(ordersRes.data);


const tableRes = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/tables/${restaurantId}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

const allTables = tableRes.data;

// Total Tables
setTotalTables(allTables.length);

// Available Tables
const available = allTables.filter(
  (table) => table.status === "AVAILABLE"
);

setAvailableTables(available.length);


    } catch (error) {
      console.error("Dashboard load failed", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const todayOrders = orders.filter((o) => o.createdAt.slice(0, 10) === today);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  const avgOrder =
    todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  const activeOrders = orders.filter((order) => order.orderStatus !== "SERVED");

  const recentOrders = orders
    .filter((o) => o.createdAt.slice(0, 10) === today)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ===== TOP DISHES =====
  const dishMap = {};

  orders.forEach((o) => {
    o.orderedItems?.forEach((i) => {
      dishMap[i.name] = (dishMap[i.name] || 0) + i.quantity;
    });
  });

  const topDishes = Object.entries(dishMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // ===== LAST 7 DAYS DATA =====
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });

      const dayOrders = orders.filter(
        (o) => o.createdAt?.slice(0, 10) === dateStr,
      );

      const revenue = dayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

      days.push({
        day: label,
        orders: dayOrders.length,
        revenue: revenue,
      });
    }
    return days;
  };

  const weeklyData = getLast7Days();

  // ===== POPULAR ITEMS % =====
  const totalQty = Object.values(dishMap).reduce((a, b) => a + b, 0);

  const popularData = Object.entries(dishMap)
    .sort((a, b) => b[1] - a[1]) // sort by quantity
    .slice(0, 5) // only top 5
    .map(([name, qty]) => ({
      name,
      value: totalQty ? Math.round((qty / totalQty) * 100) : 0,
    }));

  const top5TotalQty = Object.entries(dishMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .reduce((sum, item) => sum + item[1], 0);

  const overallTotalQty = Object.values(dishMap).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const top5Percentage = overallTotalQty
    ? Math.round((top5TotalQty / overallTotalQty) * 100)
    : 0;

  const COLORS = ["#f4a261", "#2a9d8f", "#457b9d", "#e76f51", "#9b5de5"];

  // ===== LAST 6 MONTHS REVENUE =====
  const getLast6Months = () => {
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      const month = d.toLocaleString("default", { month: "short" });
      const monthIndex = d.getMonth();
      const year = d.getFullYear();

      const monthOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return (
          orderDate.getMonth() === monthIndex &&
          orderDate.getFullYear() === year
        );
      });

      const revenue = monthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

      months.push({
        month,
        revenue,
      });
    }

    return months;
  };

  const monthlyRevenueData = getLast6Months();

  // ===== PEAK HOURS DATA (UNIQUE CUSTOMERS) =====
  // ===== MONTHLY PEAK HOURS DATA =====
  const getPeakHoursData = () => {
    const hourMap = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1️⃣ Filter only current month orders
    orders.forEach((o) => {
      const orderDate = new Date(o.createdAt);

      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        const hour = orderDate.getHours();

        if (!hourMap[hour]) {
          hourMap[hour] = new Set();
        }

        hourMap[hour].add(o.userId); // unique customer per hour
      }
    });

    const hours = [];

    // 2️⃣ Create fixed time slots (10AM – 11PM)
    for (let i = 10; i <= 23; i++) {
      const uniqueCustomers = hourMap[i] ? hourMap[i].size : 0;

      hours.push({
        hour: `${i > 12 ? i - 12 : i}${i >= 12 ? "PM" : "AM"}`,
        customers: uniqueCustomers,
        occupancy:
          totalTables > 0
            ? Math.min((uniqueCustomers / totalTables) * 100, 100)
            : 0,
      });
    }

    return hours;
  };

  const peakHoursData = getPeakHoursData();

  // ===== HOURLY ORDERS TODAY =====
  // ===== HOURLY UNIQUE CUSTOMERS TODAY =====
  const getHourlyOrdersToday = () => {
    const hourMap = {};
    const todayDate = new Date().toISOString().slice(0, 10);

    orders.forEach((o) => {
      if (o.createdAt?.slice(0, 10) === todayDate) {
        const hour = new Date(o.createdAt).getHours();

        if (!hourMap[hour]) {
          hourMap[hour] = new Set();
        }

        hourMap[hour].add(o.userId); // unique customer
      }
    });

    const hours = [];

    for (let i = 10; i <= 23; i++) {
      const uniqueCount = hourMap[i] ? hourMap[i].size : 0;

      hours.push({
        hour: `${i > 12 ? i - 12 : i}${i >= 12 ? "PM" : "AM"}`,
        orders: uniqueCount,
      });
    }

    return hours;
  };

  const hourlyOrdersToday = getHourlyOrdersToday();

  return (
    <div className="dashboard">
      {/* ===== Stats Cards ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Today's Revenue</h4>
          <h2>₹{todayRevenue.toFixed(2)}</h2>
          {/* <p className="green">+12.5% from yesterday</p> */}
        </div>

        <div className="stat-card">
          <h4>Orders Today</h4>
          <h2>{todayOrders.length}</h2>
          {/* <p className="green">+8 orders</p> */}
        </div>

        <div className="stat-card">
          <h4>Average Order</h4>
          <h2>₹{avgOrder.toFixed(2)}</h2>
          {/* <p className="green">+2.3%</p> */}
        </div>

        <div className="stat-card">
          <h4>Active Orders</h4>
          <h2>{activeOrders.length}</h2>
        </div>

        <div className="stat-card">
          <h4>Available Tables</h4>
          <h2>
            {availableTables}/{totalTables}
          </h2>
        </div>

        <div className="stat-card">
          <h4>Menu Items</h4>
          <h2>{foods.length}</h2>
        </div>
      </div>

      <div className="card">
        <h3>Orders Per Day</h3>
        <p className="sub-title">Last 7 days</p>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#f4a261"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Revenue Per Day</h3>
        <p className="sub-title">Last 7 days (₹)</p>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Monthly Revenue Trend</h3>
        <p className="sub-title">Last 6 months performance</p>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.2}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Peak Hours & Occupancy</h3>
        <p className="sub-title">Customers & table occupancy %</p>

        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === "occupancy") {
                  return [`${value.toFixed(0)}%`, "Occupancy"];
                }
                if (name === "customers") {
                  return [value, "Customers"];
                }
                return value;
              }}
            />

            <Bar
              yAxisId="left"
              dataKey="customers"
              fill="#f97316"
              radius={[6, 6, 0, 0]}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="occupancy"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Hourly Orders Today</h3>
        <p className="sub-title">Order volume throughout the day</p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyOrdersToday}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="orders" radius={[8, 8, 0, 0]}>
              {hourlyOrdersToday.map((entry, index) => (
                <Cell key={index} fill="#f97316" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Chart + Recent Orders Section ===== */}
      <div className="bottom-section">
        {/* LEFT - Popular Items */}
        <div className="card">
          <h3>Popular Items</h3>
          <p className="sub-title">By order percentage</p>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={popularData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                {popularData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="top5-text">
            Top 5 items account for
            <span className="top5-highlight">{top5Percentage}%</span>
            of total sales
          </p>
        </div>

        {/* RIGHT - Recent Orders */}
        <div className="card recent-card">
          <h3 className="section-title">Recent Orders</h3>

          <div className="recent-list">
            {recentOrders.length === 0 ? (
              <p className="no-orders">No orders today</p>
            ) : (
              recentOrders.map((o) => (
                <div className="order-row" key={o.id}>
                  <div className="order-info">
                    <span className="table">Table {o.tableNumber}</span>
                    <span className="order-no">{o.orderNumber}</span>
                  </div>

                  <span className={`badge ${o.orderStatus?.toLowerCase()}`}>
                    {o.orderStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
