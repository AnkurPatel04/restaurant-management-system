import React, { useEffect, useState } from "react";
import axios from "axios";

const StepTwo = ({ form, setForm, onBack, onNext }) => {
  const [tables, setTables] = useState([]);
  useEffect(() => {
    fetchAvailableTables();
  }, []);

const fetchAvailableTables = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tables/available/${form.restaurantId}`,
      {
        params: {
          date: form.date,
          time: form.time,
          guests: form.guests,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTables(res.data);

  } catch (error) {
    console.log("Error fetching tables", error);
  }

};

  const isValid = form.table !== null;

  return (
    <>
      <div className="step-title">
        <span>2</span> Select Your Table
      </div>

      <div className="table-grid">
        {tables.map((t) => (
          <div
            key={t.id}
            className={
              form.table?.id === t.id
                ? "table-box selected"
                : "table-box"
            }
            onClick={() => setForm({ ...form, table: t })}
          >
            <h4>Table {t.tableNumber}</h4>
            <span className="badge">Available</span>
            <p>👥 {t.seats} seats</p>
          </div>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn-back" onClick={onBack}>
          Back
        </button>

        <button
          className={`btn-primary ${isValid ? "enabled" : ""}`}
          disabled={!isValid}
          onClick={onNext}
        >
          Continue to Details
        </button>
      </div>
    </>
  );
};

export default StepTwo;
