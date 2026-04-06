import React from "react";
import "./FoodItem.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";


const FoodItem = ({id, name, description, price, imageUrl }) => {
  const { quantities, increseQuantity, decreaseQuantity } = useContext(StoreContext);
  return (
    <div to={`/food/${id}`} className="food-card">
      <Link to={`/food/${id}`} >
      <img src={imageUrl} alt={name} className="food-image" />
      </Link>

      <div className="food-info">
        <h3>{name}</h3>
        <p>{description}</p>

        <div className="food-bottom">
          <span className="price">₹{price}</span>
          <span className="rating">⭐⭐⭐⭐☆ (4.5)</span>
        </div>

        <div className="food-actions">
          <Link to={`/food/${id}`} className="add-btn">View Food</Link>

          
          {
            quantities[id] > 0 ? (
              <div className="quantity-controls">
                <button className="fav-btn" onClick={() => decreaseQuantity(id)}>-</button>
                <span className="quantity">{quantities[id] || 0}</span>
                <button className="fav-btn" onClick={() => increseQuantity(id)}>+</button>
              </div>
            ) : (
              <button className="fav-btn" onClick={() => increseQuantity(id)}>+</button>
            )
          }
         
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
