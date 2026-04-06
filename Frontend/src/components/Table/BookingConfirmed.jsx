import React from 'react'

const BookingConfirmed = ({ form, bookingData, onNew, onMyBookings }) => {

  return (
    <div className="confirm-wrapper">

      <div className="check-circle">✔</div>

      <h2>Booking Confirmed!</h2>
      <p>Your table has been reserved successfully</p>

      <div className="confirm-card">

      <div className="booking-id">
  <small>Booking ID</small>
  <h3>{bookingData?.bookingNumber}</h3>
</div>


        <div className="confirm-grid">
          <div>📅 <b>Date</b><br />{form.date}</div>
          <div>⏰ <b>Time</b><br />{form.time}</div>
          <div>📍 <b>Table</b><br />Table {form.table?.tableNumber}</div>
          <div>👥 <b>Guests</b><br />{form.guests} people</div>
        </div>

      </div>

      <div className="btn-row1">
        <button className="btn-back" onClick={onNew}>Make Another Booking</button>
        <button className="btn-primary enabled" onClick={onMyBookings}>
          View My Bookings
        </button>
      </div>

    </div>
  );
}

export default BookingConfirmed
