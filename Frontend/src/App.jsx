import React from "react";
import { useLocation } from "react-router-dom";

import Menubar from "./components/Menubar/Menubar";
import Home from "./pages/Home/Home";
import ExploreFood from "./pages/Explore Food/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import ContactUs from "./pages/Contact Us/ContactUs";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder";
import { Routes, Route } from "react-router-dom";

import Cart from "./pages/Cart/Cart";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { ToastContainer } from "react-toastify";

import OtpLogin from "./components/LoginOTP/OtpLogin";
import OrderStatus from "./pages/MyOrder/OrderStatus";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";
import Kitchen from "./pages/Kitchen/Kitchen";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminLayout from "./pages/Admin/AdminLayout/AdminLayout";
import Staff from "./pages/Admin/Staff/Staff";
import Analytics from "./pages/Admin/AdminBookings/AdminBookings";
import Tables from "./pages/Admin/Tables/Tables";
import Orders from "./pages/Admin/Orders/Orders";
import MenuManagement from "./pages/Admin/MenuManagement/MenuManagement";
import MyOrders from "./pages/MyOrder/MyOrders";
import BookingPage from "./pages/TableBooking/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import TableOrders from "./pages/TableOrders/TableOrders";
import BillPage from "./pages/BillPage/BillPage";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import QRLanding from "./pages/QRLanding/QRLanding";
import AddCoupon from "./pages/Admin/AddCoupon/AddCoupon";
import PaymentFailed from "./pages/PaymentFailed/PaymentFailed";
// Dummy pages (replace with your real pages)
// const Dashboard = () => <h1>Dashboard Page</h1>;
// const Tables = () => <h1>Tables Page</h1>;
// const Orders = () => <h1>Orders Page</h1>;
// const Kitchen = () => <h1>Kitchen Page</h1>;
// const Staff = () => <h1>Staff Page</h1>;
// const Analytics = () => <h1>Analytics Page</h1>;

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/kitchen");
  return (
    <div style={{ paddingTop: hideNavbar ? "0px" : "64px" }}>
      {!hideNavbar && <Menubar />}

      {/* <Header/> in Home page*/}
   <ToastContainer
  position="top-right"
  autoClose={3000}
  newestOnTop
  pauseOnHover
  style={{ zIndex: 99999 }}
/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore-food" element={<ExploreFood />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-login" element={<OtpLogin />} />
        <Route path="/order-status/:orderId" element={<OrderStatus />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/table-orders" element={<TableOrders />} />

        <Route path="/table-booking" element={<BookingPage />} />
      <Route path="/bill" element={<BillPage/>} />
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN", "CHEF"]}>
              <Kitchen />
            </ProtectedRoute>
          }
        />

        <Route path="/r/:restaurantId/t/:tableNumber" element={<QRLanding />} />

        <Route
          path="/my-order"
          element={
            <ProtectedRoute allowedRoles={["USER", "RESTAURANT_ADMIN"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["RESTAURANT_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="tables" element={<Tables />} />
          <Route path="orders" element={<Orders />} />
          <Route path="kitchen" element={<Kitchen />} />
          <Route path="staff" element={<Staff />} />
          <Route path="adminBookings" element={<Analytics />} />
          <Route path="addCoupon" element={<AddCoupon />} />
        </Route>

          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
