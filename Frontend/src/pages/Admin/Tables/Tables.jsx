import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Tables.css";

const statusOptions = ["AVAILABLE", "OCCUPIED", "RESERVED"];

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const [form, setForm] = useState({
    tableNumber: "",
    seats: "",
    status: "AVAILABLE",
  });

  const token1 = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  // ================= FETCH TABLES =================
  const fetchTables = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tables/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        },
      );

      if (response.status === 200) {
        setTables(response.data);
      }
    } catch (error) {
      console.log("Error while fetching tables", error);
    }
  };

  useEffect(() => {
    if (token1) {
      fetchTables();
    }
  }, [token1]);

  // ================= OPEN MODAL =================
  const openAddModal = () => {
    setEditingTable(null);
    setForm({
      tableNumber: "",
      seats: "",
      status: "AVAILABLE",
    });
    setShowModal(true);
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setForm({
      tableNumber: table.tableNumber,
      seats: table.seats,
      status: table.status,
    });
    setShowModal(true);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!form.tableNumber || !form.seats) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingTable) {
        // UPDATE
       await axios.put(
  `${import.meta.env.VITE_API_URL}/api/tables/${editingTable.id}`,
  {
    ...form,
    restaurantId: restaurantId,
  },
  {
    headers: {
      Authorization: `Bearer ${token1}`,
    },
  }
);
      } else {
        // ADD
        axios.post(
          `${import.meta.env.VITE_API_URL}/api/tables`,
          {
            ...form,
            restaurantId: restaurantId,
          },
          {
            headers: {
              Authorization: `Bearer ${token1}`,
            },
          },
        );
      }
      // console.log(form);

      setShowModal(false);
      fetchTables(); // refresh list
    } catch (error) {
      console.log("Error while saving table", error);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Delete this table?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/tables/${id}`, {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        });
        fetchTables();
      } catch (error) {
        console.log("Error while deleting table", error);
      }
    }
  };
  const handleStatusChange = async (id, newStatus) => {
    try {
      const tableToUpdate = tables.find((t) => t.id === id);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tables/${id}`,
        {
          ...tableToUpdate,
          restaurantId: restaurantId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        },
      );

      // Update UI after success
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
      );
    } catch (error) {
      console.log("Error updating status", error);
    }
  };

  return (
    <div className="tables-page">
      {/* Header */}
      <div className="tables-header">
        <h2>Table Management</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Table
        </button>
      </div>

      {/* Grid */}
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-card ${table.status.toLowerCase().replace(" ", "-")}`}
          >
            <div className="table-top">
              <div className="table-number">{table.tableNumber}</div>
              <span className="status-badge">{table.status}</span>
            </div>

            <p>{table.seats} Seats</p>

            <select
              value={table.status}
              onChange={(e) => handleStatusChange(table.id, e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <div className="table-actions">
              <button onClick={() => openEditModal(table)}>✏️ Edit</button>
              <button onClick={() => handleDelete(table.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingTable ? "Edit Table" : "Add New Table"}</h3>
              <span className="close-btn" onClick={() => setShowModal(false)}>
                ✖
              </span>
            </div>

            <p className="subtitle">Configure table details and capacity.</p>

            <div className="form-row">
              <div>
                <label>Table Number *</label>
                <input
                  type="number"
                  value={form.tableNumber}
                  onChange={(e) =>
                    setForm({ ...form, tableNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Seats *</label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="btn-save" onClick={handleSave}>
                {editingTable ? "Update Table" : "Add Table"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
