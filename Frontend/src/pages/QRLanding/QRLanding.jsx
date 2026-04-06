import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QRLanding = () => {
  const { restaurantId, tableNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // save QR data
    localStorage.setItem("restaurantId", restaurantId);
    localStorage.setItem("tableNo", tableNumber);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/explore-food");
    }
  }, []);

  return <div>Loading restaurant...</div>;
};

export default QRLanding;