import React, { useEffect, useState } from "react";
import "./Staff.css";
import axios from "axios";

const roles = ["RESTAURANT_ADMIN", "CHEF", "WAITER", "CASHIER"];
const restaurantId = localStorage.getItem("restaurantId");
const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin/staff`;
const token = localStorage.getItem("token");

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    active: true,
  });

  const fetchStaff = async (searchText = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/staff/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: searchText ? { search: searchText } : {},
        },
      );
      setStaff(res.data);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStaff(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/${id}/status`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { active: !currentStatus },
      });

      setStaff((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !currentStatus } : s)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleAddStaff = async () => {
    if (!form.name || !form.email || !form.role) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/staff`,
        {
          ...form,
          restaurantId: restaurantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStaff((prev) => [...prev, res.data]);
      setShowModal(false);

      setForm({
        name: "",
        email: "",
        phone: "",
        role: "",
        active: true,
      });
    } catch (err) {
      // console.log(form);
      console.error("Failed to add staff", err);
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      active: member.active,
    });

    setEditingId(member.id);
    setShowModal(true);
  };

 const handleUpdateStaff = async () => {
  try {
    const res = await axios.put(
      `${API_BASE}/${editingId}`,
      {
        ...form,
        restaurantId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStaff((prev) =>
      prev.map((s) => (s.id === editingId ? res.data : s))
    );

    setShowModal(false);
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      active: true,
    });
  } catch (err) {
    console.error("Failed to update staff", err);
  }
};

  return (
    <div className="staff-page">
      {/* ===== TOP STATS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{staff.length}</h2>
          <p>Total Staff</p>
        </div>
        <div className="stat-card">
          <h2>{staff.filter((s) => s.role === "ADMIN").length}</h2>
          <p>Admins</p>
        </div>
        <div className="stat-card">
          <h2>{staff.filter((s) => s.role === "CHEF").length}</h2>
          <p>Chefs</p>
        </div>
        <div className="stat-card">
          <h2>{staff.filter((s) => s.role === "WAITER").length}</h2>
          <p>Waiters</p>
        </div>
      </div>

      {/* ===== ACTION BAR ===== */}
      <div className="staff-actions">
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Staff
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="staff-table">
        <table>
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <strong>{member.name}</strong>
                  </td>

                  <td>
                    <span className={`role-badge ${member.role}`}>
                      {member.role}
                    </span>
                  </td>

                  <td>
                    <div>{member.email}</div>
                    <small>{member.phone}</small>
                  </td>

                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={member.active}
                        onChange={() => toggleStatus(member.id, member.active)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>

                  <td className="actions">
                    <span onClick={() => handleEdit(member)}>✏️</span>
                    <span onClick={() => deleteStaff(member.id)}>🗑️</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== ADD STAFF MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Add New Staff</h2>
                <p className="sub-text">
                  Fill in the details for the new staff member.
                </p>
              </div>

              {/* ❌ Top Close Button */}
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <label>Full Name *</label>
            <input
              placeholder="John Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label>Email *</label>
            <input
              placeholder="john@restaurant.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label>Phone</label>
            <input
              placeholder="+1234-567-8900"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <label>Role *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <div className="toggle-row">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Active Account</span>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={editingId ? handleUpdateStaff : handleAddStaff}
              >
                {editingId ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
