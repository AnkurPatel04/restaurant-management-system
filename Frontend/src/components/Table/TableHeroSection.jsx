import "./styles/booking.css";
import React from "react";
const TableHeroSection = ({ tab, setTab }) => {
  return (
    <div className="hero">
      <h1>Reserve Your Table</h1>
      <p>
        Experience exceptional dining at La Maison. Book your perfect table in
        just a few clicks.
      </p>

      <div className="tabs">
        <button
          className={tab === "book" ? "active" : ""}
          onClick={() => setTab("book")}
        >
          📅 Book a Table
        </button>
        <button
          className={tab === "my" ? "active" : ""}
          onClick={() => setTab("my")}
        >
          📋 My Bookings
        </button>
      </div>
    </div>
  );
};

export default TableHeroSection;
