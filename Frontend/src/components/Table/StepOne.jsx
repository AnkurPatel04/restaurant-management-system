import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const StepOne = ({ form, setForm, onNext }) => {
  // ✅ tomorrow date
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem("token");

  const isValid =
  form.restaurantId !== "" &&
  form.date !== "" &&
  form.time !== "" &&
  form.guests !== "";

  // ✅ time slots (1 hour gap)
  const timeSlots = [
    "10:00 - 11:00 AM",
    "11:00 - 12:00 AM",
    "12:00 - 1:00 PM",
    "1:00 - 2:00 PM",
    "2:00 - 3:00 PM",
    "3:00 - 4:00 PM",
    "4:00 - 5:00 PM",
    "5:00 - 6:00 PM",
    "6:00 - 7:00 PM",
    "7:00 - 8:00 PM",
    "8:00 - 9:00 PM",
    "9:00 - 10:00 PM",
    "10:00 - 11:00 PM",
  ];
  const isPastSlot = (slot) => {
    if (form.date !== todayStr) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Extract starting time from slot (e.g., "3:00 - 4:00 PM")
    const startTime = slot.split(" - ")[0]; // "3:00"
    const period = slot.includes("PM") ? "PM" : "AM";

    let parts = startTime.split(":");
    let hour = parseInt(parts[0]);
    let minute = parseInt(parts[1]);

    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12;
    }
    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    // Compare properly
    if (hour < currentHour) return true;
    if (hour === currentHour && minute <= currentMinutes) return true;

    return false;
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/restaurants`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setRestaurants(res.data);
  };

  return (
    <>
      <div className="step-title">
        <span>1</span> Select Date & Time
      </div>

      <div className="grid-3">
        <div className="input-group">
          <label>🍽 Restaurant</label>

          <select
            value={form.restaurantId}
            onChange={(e) => setForm({ ...form, restaurantId: e.target.value })}
          >
            <option value="">Select Restaurant</option>

            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        {/*  Date — only from tomorrow */}
        <div className="input-group">
          <label>📅 Date</label>
          <input
            type="date"
            min={todayStr}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        {/* ✅ Time Slots — 1 hour gap */}
        <div className="input-group">
          <label>⏰ Time Slot</label>
          <select
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          >
            <option value="">Select Time</option>
            {timeSlots.map((slot, i) => (
              <option key={i} value={slot} disabled={isPastSlot(slot)}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div className="input-group">
          <label>👥 Guests</label>
          <select
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Guests
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className={`btn-primary ${isValid ? "enabled" : ""}`}
        disabled={!isValid}
        onClick={onNext}
      >
        Continue to Select Table
      </button>
    </>
  );
};

export default StepOne;

// import React from "react";

// const StepOne = ({ form, setForm, onNext }) => {
//   // ✅ tomorrow date
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const minDate = tomorrow.toISOString().split("T")[0];

//   const isValid = form.date !== "" && form.time !== "" && form.guests !== "";

//   // ✅ time slots (1 hour gap)
//   const timeSlots = [
//     "10:00 - 11:00 AM",
//     "11:00 - 12:00 PM",
//     "12:00 - 1:00 PM",
//     "1:00 - 2:00 PM",
//     "2:00 - 3:00 PM",
//     "3:00 - 4:00 PM",
//     "4:00 - 5:00 PM",
//     "5:00 - 6:00 PM",
//     "6:00 - 7:00 PM",
//     "7:00 - 8:00 PM",
//     "8:00 - 9:00 PM",
//     "9:00 - 10:00 PM",
//     "10:00 - 11:00 PM",
//   ];
//   return (
//     <>
//       <div className="step-title">
//         <span>1</span> Select Date & Time
//       </div>

//       <div className="grid-3">
//         {/*  Date — only from tomorrow */}
//         <div className="input-group">
//           <label>📅 Date</label>
//           <input
//             type="date"
//             min={minDate} //  cannot select today or past
//             value={form.date}
//             onChange={(e) => setForm({ ...form, date: e.target.value })}
//           />
//         </div>

//         {/* ✅ Time Slots — 1 hour gap */}
//         <div className="input-group">
//           <label>⏰ Time Slot</label>
//           <select
//             value={form.time}
//             onChange={(e) => setForm({ ...form, time: e.target.value })}
//           >
//             <option value="">Select Time</option>
//             {timeSlots.map((slot, i) => (
//               <option key={i} value={slot}>
//                 {slot}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Guests */}
//         <div className="input-group">
//           <label>👥 Guests</label>
//           <select
//             value={form.guests}
//             onChange={(e) => setForm({ ...form, guests: e.target.value })}
//           >
//             <option value="">Select</option>
//             {[1, 2, 3, 4, 5, 6].map((n) => (
//               <option key={n} value={n}>
//                 {n} Guests
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <button
//         className={`btn-primary ${isValid ? "enabled" : ""}`}
//         disabled={!isValid}
//         onClick={onNext}
//       >
//         Continue to Select Table
//       </button>
//     </>
//   );
// };

// export default StepOne;
