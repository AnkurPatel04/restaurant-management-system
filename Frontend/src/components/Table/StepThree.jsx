import React, { useState } from "react";
import axios from "axios";

const StepThree = ({ form, setForm, onBack, onBook }) => {

  const [errors, setErrors] = useState({});
  const isValid = form.name.trim() !== "" && form.phone.trim() !== "";
  const token = localStorage.getItem("token");

  const validate = () => {
  let newErrors = {};

  if (!/^[A-Za-z ]{3,}$/.test(form.name.trim())) {
    newErrors.name = "Please enter your full name";
  }

  if (!/^[0-9]{10}$/.test(form.phone)) {
    newErrors.phone = "Phone number must be 10 digits";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleBooking = async () => {
     if (!validate()) return;
    try {
      const userId = localStorage.getItem("userId");

    const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/bookings`,
  {
    restaurantId: form.restaurantId,
    userId,
    tableId: form.table.id,
    date: form.date,
    time: form.time,
    guests: form.guests,
    name: form.name,
    phone: form.phone,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      onBook(res.data); // pass real booking data
    } catch (error) {
      console.log("Booking failed", error);
      alert("Booking failed");
    }
  };

  return (
    <>
      <div className="step-title">
        <span>3</span> Your Details
      </div>

      <div className="details-grid">
        <div className="input-group">
          <label>👤 Your Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="input-group">
          <label>📞 Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        {errors.phone && <p className="error">{errors.phone}</p>}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-back" onClick={onBack}>
          Back
        </button>

        <button
          className={`btn-primary wide ${isValid ? "enabled" : ""}`}
          disabled={!isValid}
          onClick={handleBooking}
        >
          Book Table
        </button>
      </div>
    </>
  );
};

export default StepThree;
