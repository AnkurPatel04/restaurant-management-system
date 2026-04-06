import React, { useEffect, useState } from "react";
import "./MenuManagement.css";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/foods/restaurant`;
const token = localStorage.getItem("token");
const categories = [
  { id: 1, name: "Roti", icon: "🫓" },
  { id: 2, name: "Butter Milk", icon: "🥛" },
  { id: 3, name: "Soups & Salads", icon: "🥗" },
  { id: 4, name: "Main Courses", icon: "🍛" },
  { id: 5, name: "Subji", icon: "🍲" },
  { id: 6, name: "Burger", icon: "🍔" },
  { id: 7, name: "Pizza", icon: "🍕" },
  { id: 8, name: "Ice Cream", icon: "🍨" },
  { id: 9, name: "Beverages", icon: "🥤" },
  { id: 10, name: "Biryani", icon: "🍚" },
  { id: 11, name: "Rolls", icon: "🌯" },
];

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Pizza",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ================= FETCH ITEMS =================
  const fetchItems = async () => {
    try {
      const restaurantId = localStorage.getItem("restaurantId");
     const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/foods/restaurant/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      // console.log(res);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load menu items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ================= FILTER =================
  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleAdd = async () => {
    if (!image) {
      alert("Please upload image");
      return;
    }

    try {
      // const fd = new FormData();

      // // 👇 send full JSON as STRING
      // const foodJson = {
      //   name: form.name,
      //   description: form.description,
      //   price: Number(form.price),
      //   category: form.category,
      // };

      const fd = new FormData();

      const foodJson = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        restaurantId: localStorage.getItem("restaurantId"),

      };
      // console.log(foodJson);
      // console.log(image);
      fd.append(
        "food",
        new Blob([JSON.stringify(foodJson)], { type: "application/json" }),
      );

      fd.append("file", image);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/foods/add`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Food added");

      setShowModal(false);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "Pizza",
      });
      setImage(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditId(item.id || item._id);

    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
    });

   
    setPreviewImage(item.imageUrl || null);

    setImage(null); // only if user uploads new one
    setShowModal(true);
  };

  // ================= TOGGLE ACTIVE (UI ONLY) =================
  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(
       `${import.meta.env.VITE_API_URL}/api/foods/status/${id}?active=${!currentStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Status update failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/foods/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const fd = new FormData();

      const foodJson = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
         restaurantId: localStorage.getItem("restaurantId"),
      };

      fd.append(
        "food",
        new Blob([JSON.stringify(foodJson)], { type: "application/json" }),
      );
      if (image) fd.append("file", image); // optional

      await axios.put(`${import.meta.env.VITE_API_URL}/api/foods/update/${editId}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Food updated");
      resetModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);
    setPreviewImage(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "Pizza",
    });
    setImage(null);
  };

  return (
    <div className="menu-page">
      {/* TOOLBAR */}
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="🔍 Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Item
        </button>
      </div>

      {/* CATEGORY CARDS */}
      <div className="category-grid">
        {categories.map((cat) => {
          const count = items.filter((i) => i.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className={`category-card ${
                categoryFilter === cat.name ? "active" : ""
              }`}
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === cat.name ? "All" : cat.name,
                )
              }
            >
              <div className="emoji">{cat.icon}</div>
              <h4>{cat.name}</h4>
              <p>{count} items</p>
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div className="table-card">
        <h3>Menu Items ({filteredItems.length})</h3>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    {item.imageUrl && (
                    
                      <img
                        src={item.imageUrl}
                        alt=""
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div>
                      <strong>{item.name}</strong>
                      <div className="desc">{item.description}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="category-badge">{item.category}</span>
                </td>

                <td>₹{item.price}</td>

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={item.active ?? true}
                      onChange={() => toggleActive(item.id, item.active)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>

                <td className="actions">
                  <span onClick={() => handleEdit(item)}>✏️</span>
                  <span onClick={() => handleDelete(item.id)}>🗑️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Menu Item" : "Add New Menu Item"}</h3>

              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            {/* IMAGE */}
            <div className="image-upload">
              <label className="image-box">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : previewImage || "https://via.placeholder.com/100"
                  }
                  alt=""
                  height={100}
                  width={100}
                />

                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>

            <input
              placeholder="Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Price *"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="modal-footer">
              <button onClick={resetModal}>Cancel</button>

              {isEdit ? (
                <button className="primary" onClick={handleUpdate}>
                  Update Item
                </button>
              ) : (
                <button className="primary" onClick={handleAdd}>
                  Add Item
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
