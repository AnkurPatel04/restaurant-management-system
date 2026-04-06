import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, searchText }) => {
  const { foodList } = useContext(StoreContext);

  if (!foodList) {
    return <div>Loading...</div>;
  }


  const filteredFoodList =  foodList.filter((food) => 
    (category === "" || category === "All" || food.category === category) &&
    (searchText === "" || food.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="food-container">
        {filteredFoodList && filteredFoodList.length > 0 ? (
          filteredFoodList.map((food) => (
            <FoodItem
                key={food.id}
              id={food.id}
              name={food.name}
              description={food.description}
              price={food.price}
              imageUrl={food.imageUrl}
            />
          ))
        ) : (
           <div className="no-food">
            <h4>No food found.</h4>
          </div>
        )}
      </div>

  );
};

export default FoodDisplay;
