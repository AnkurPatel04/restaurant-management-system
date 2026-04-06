import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./ExploreFood.css";
import CartFooter from "../../components/CartFooter/CartFooter";
import { toast } from "react-toastify";
import axios from "axios";

const ExploreFood = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showTableModal, setShowTableModal] = useState(!localStorage.getItem("tableNo"));
  const [tableNo, setTableNo] = useState(localStorage.getItem("tableNo") || "");
  const [loading, setLoading] = useState(true);


  const restaurantId = localStorage.getItem("restaurantId");
  // const tableNo = localStorage.getItem("tableNo");

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  // ✅ Check Login
  useEffect(() => {
    const token = localStorage.getItem("token");
    

    if (!token) {
      toast.warning("Please login to continue.");
      navigate("/login");
      return;
    }
    fetchCart(token);
  }, [navigate]);

  // 🔥 Table Modal State

  const fetchCart = async (token) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const backendTable = res.data.tableNumber;
      const localTable = parseInt(localStorage.getItem("tableNo"));

      if (backendTable) {
        setTableNo(backendTable);
        localStorage.setItem("tableNo", backendTable); // sync
        setShowTableModal(false);
      } else if (localTable) {
        setTableNo(localTable);
        setShowTableModal(false);
      } else {
        setShowTableModal(true);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
      toast.error("Unable to load table information");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTable = async () => {
    if (!tableNo) {
      toast.error("Please enter table number");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tables/${restaurantId}/occupy/${tableNo}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("tableNo", tableNo);
      setShowTableModal(false);

      toast.success("Table occupied successfully!");
    } catch (err) {
      console.error("Failed to occupy table", err);
      toast.error("Invalid table number or already occupied");
    }
  };

  //handleSearch

  const handleSearch = (e) => {
    e.preventDefault();
    // Later you can filter foodList using these values
    // console.log(category, searchText);
  };

  if (loading) return null;

  return (
    <>
      {showTableModal && (
        <div className="table-modal-overlay">
          <div className="table-modal">
            <h2>🍽 Enter Table Number</h2>
            <p>Please enter your table number to continue</p>

            <input
              type="number"
              placeholder="Table No"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
            />

            <button onClick={handleSaveTable}>Continue</button>
          </div>
        </div>
      )}

      <div className={`explore-page ${showTableModal ? "blurred" : ""}`}>
        <div className="explore-ui">
          {/* Header Section */}
          <div className="header-container">
            <div>
              {/* <small className="table-text">🍽 Table {tableNo || "-"}</small> */}
              <h4 className="brand-name">🍽 Table {tableNo || "-"}</h4>
            </div>

            <div className="header-icons">
              <div className="icon-circle">🌐</div>
              <Link to="/cart">
                <div className="icon-circle">🛒</div>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="custom-search-input"
              placeholder="Search for dishes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>

          {/* Category Pills */}
          <div className="category-scroll-wrapper">
            {[
              "All",
              "Starters",
              "Main Course",
              "Pizza",
              "Burgers",
              "Desserts",
              "Drinks",
            ].map((cat) => (
              <button
                key={cat}
                className={`category-pill ${
                  category === cat || (cat === "All" && category === "")
                    ? "active"
                    : ""
                }`}
                onClick={() => setCategory(cat === "All" ? "" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Food Grid ===== */}
        <FoodDisplay category={category} searchText={searchText} />
      </div>

      <CartFooter />
    </>
  );
};

export default ExploreFood;
