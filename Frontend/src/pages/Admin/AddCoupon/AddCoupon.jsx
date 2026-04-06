import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddCoupon.css";
import { toast } from "react-toastify";

const restaurantId = localStorage.getItem("restaurantId");
const token = localStorage.getItem("token");

const API_BASE = `${import.meta.env.VITE_API_URL}/api/coupons`;

const AddCoupon = () => {

  const [coupons,setCoupons] = useState([]);
  const [showModal,setShowModal] = useState(false);

  const [form,setForm] = useState({
    code:"",
    discount:"",
    type:"PERCENT",
    expiryDate:"",
    active:true
  });

  // ================= FETCH COUPONS =================
  const fetchCoupons = async () => {

    try{

      const res = await axios.get(
        `${API_BASE}/${restaurantId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setCoupons(res.data);

    }catch(err){
      console.log("Failed to fetch coupons",err);
    }

  };

  useEffect(()=>{
    fetchCoupons();
  },[]);

  // ================= CREATE COUPON =================
  const createCoupon = async () => {

    try{

      const res = await axios.post(
        `${API_BASE}/create`,
        {
          ...form,
          restaurantId
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setCoupons(prev=>[...prev,res.data]);

      toast.success("Coupon created");

      setShowModal(false);

      setForm({
        code:"",
        discount:"",
        type:"PERCENT",
        expiryDate:"",
        active:true
      });

    }catch(err){
      toast.error("Failed to create coupon");
    }

  };

  // ================= DELETE =================
  const deleteCoupon = async (id) => {

    if(!window.confirm("Delete this coupon?")) return;

    try{

      await axios.delete(
        `${API_BASE}/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setCoupons(prev=>prev.filter(c=>c.id!==id));

    }catch(err){
      console.log(err);
    }

  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (id,currentStatus) => {

    try{

      await axios.patch(
        `${API_BASE}/${id}/status`,
        null,
        {
          params:{active:!currentStatus},
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setCoupons(prev =>
        prev.map(c =>
          c.id === id ? {...c,active:!currentStatus} : c
        )
      );

    }catch(err){
      console.log(err);
    }

  };

  return (
    <div className="coupon-page">

      {/* ===== ACTION BAR ===== */}

      <div className="coupon-actions">

        <h2>Coupons</h2>

        <button
          className="add-btn"
          onClick={()=>setShowModal(true)}
        >
          + Add Coupon
        </button>

      </div>

      {/* ===== TABLE ===== */}

      <div className="coupon-table">

        <table>

          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Type</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {coupons.map(coupon=>(
              <tr key={coupon.id}>

                <td><strong>{coupon.code}</strong></td>

                <td>{coupon.discount}</td>

                <td>{coupon.type}</td>

                <td>{coupon.expiryDate}</td>

                <td>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={coupon.active}
                      onChange={()=>toggleStatus(coupon.id,coupon.active)}
                    />

                    <span className="slider"></span>

                  </label>

                </td>

                <td className="actions">

                  <span
                    onClick={()=>deleteCoupon(coupon.id)}
                  >
                    🗑️
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* ===== CREATE MODAL ===== */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Create Coupon</h2>

            <input
              placeholder="Coupon Code (SAVE5)"
              value={form.code}
              onChange={(e)=>setForm({...form,code:e.target.value})}
            />

            <input
              type="number"
              placeholder="Discount"
              value={form.discount}
              onChange={(e)=>setForm({...form,discount:e.target.value})}
            />

            <select
              value={form.type}
              onChange={(e)=>setForm({...form,type:e.target.value})}
            >
              <option value="PERCENT">Percent</option>
              <option value="FLAT">Flat</option>
            </select>

            <input
              type="date"
              value={form.expiryDate}
              onChange={(e)=>setForm({...form,expiryDate:e.target.value})}
            />

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={()=>setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={createCoupon}
              >
                Create Coupon
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AddCoupon;