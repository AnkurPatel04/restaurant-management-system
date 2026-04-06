import React from "react";
import { categories } from "../../assets/assets";
import "./ExploreMenu.css";
import { useRef } from "react";


const ExploreMenu = ({ category, setCategory }) => {

    const menuRef = useRef(null);
    const scrollLeft = () => {
        menuRef.current.scrollLeft -= 200;
    }
    const scrollRight = () => {
        menuRef.current.scrollLeft += 200;
    }
  return (
    <div className="explore-menu">
      {/* Header */}
      <div className="explore-header">
        <div>
          <h2 className="explore-title">Explore Our Menu</h2>
          <p className="explore-subtitle">
            Explore curated lists of dishes from top categories
          </p>
        </div>

        {/* Arrows (UI only) */}
        <div className="explore-arrows">
          <button className="arrow-btn" onClick={scrollLeft}>←</button>
          <button className="arrow-btn" onClick={scrollRight}>→</button>
        </div>
      </div>

      {/* Categories */}
      <div className="explore-categories" ref={menuRef}>
        {categories.map((item, index) => (
          <div className="category-card" key={index} onClick={() => setCategory(item.category === category ? "All" : item.category)}>
            <img
              src={item.icon}
              alt={item.category}
              // className="category-image"
              className={category === item.category ? "category-image active" : "category-image"}

            />
            <p className="category-name">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMenu;
