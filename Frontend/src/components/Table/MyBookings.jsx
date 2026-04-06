import React, { useEffect, useState } from "react";

import axios from "axios";

const MyBookings = ({setTab }) => {

  
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    // console.log("Fetching bookings for user:", userId);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);

    } catch (error) {
      console.log("Error fetching bookings", error);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBookings();

    } catch (error) {
      console.log("Error cancelling booking", error);
    }
  };

  return (
  <div className="mybookings-wrapper">
    <h2>My Bookings</h2>

    {bookings.length === 0 ? (
      <div className="no-bookings">
        <div className="empty-icon">📅</div>
        <h3>No Bookings Yet</h3>
        <p>You haven’t reserved a table yet.</p>
        <button onClick={() => setTab("book")}>
          Book a Table
        </button>
      </div>
    ) : (
      bookings.map((b) => (
        <div key={b.id} className="booking-item">
          <div>
            <small>Booking ID</small>
            <h3>{b.bookingNumber}</h3>

            <div className="booking-grid">
              <div>📅 {b.date}</div>
              <div>⏰ {b.time}</div>
              <div>📍 Table {b.tableNumber || b.tableId}</div>
              <div>👥 {b.guests} guests</div>
            </div>
          </div>

          <div className="booking-right">
            <span
              className={
                b.status === "BOOKED"
                  ? "status confirmed"
                  : "status cancelled"
              }
            >
              {b.status === "BOOKED" ? "Confirmed" : "Cancelled"}
            </span>

            {b.status === "BOOKED" && (
              <button
                className="cancel-btn"
                onClick={() => cancelBooking(b.id)}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </div>
      ))
    )}
  </div>
);

  // return (
  //   <div className="mybookings-wrapper">
  //     <h2>My Bookings</h2>

  //     {bookings.map((b) => (
  //       <div key={b.id} className="booking-item">

  //         <div>
  //           <small>Booking ID</small>
  //           <h3>{b.id}</h3>

  //           <div className="booking-grid">
  //             <div>📅 {b.date}</div>
  //             <div>⏰ {b.time}</div>
  //             <div>📍 Table {b.tableNumber || b.tableId}</div>
  //             <div>👥 {b.guests} guests</div>
  //           </div>
  //         </div>

  //         <div className="booking-right">
  //           <span
  //             className={
  //               b.status === "BOOKED"
  //                 ? "status confirmed"
  //                 : "status cancelled"
  //             }
  //           >
  //             {b.status === "BOOKED" ? "Confirmed" : "Cancelled"}
  //           </span>

  //           {b.status === "BOOKED" && (
  //             <button
  //               className="cancel-btn"
  //               onClick={() => cancelBooking(b.id)}
  //             >
  //               ❌ Cancel
  //             </button>
  //           )}
  //         </div>

  //       </div>
  //     ))}
  //   </div>


  // );
};

export default MyBookings;
