import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./FoodDetails.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

//food details page based on id from url 
const FoodDetails = () => {
  const { id } = useParams();
  const [data, setdata] = useState({});
  const {increseQuantity} = useContext(StoreContext);
  const navigate = useNavigate();
 const token = localStorage.getItem("token");

  const featchFoodDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/foods/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setdata(res.data);
        // console.log(data);
        // console.log("Food details fetched successfully11111111");
        // console.log(res.data.imageUrl);
      }
    } catch (error) {
      console.log("Error while fetching food details", error);
    }
  };

  useEffect(() => {
    featchFoodDetails();
  }, [id]);

  if (!data) {
    return <h3>Loading...</h3>;
  }

  const addToCart = () => {
 
  
      const token = localStorage.getItem("token");
        // 🔐 If user not logged in
        if (!token) {
          toast.warning("Please login to add items to cart.");
          navigate("/login");
          return;
        }

    increseQuantity(data.id);
    navigate('/cart');

  };

  return (
    <div className="food-details-wrapper">
      <div className="food-details">
       {data.imageUrl && (
  <img
    src={data.imageUrl}
    alt={data.name}
    className="food-details-image"
  />
)}


        <div className="food-details-content">
             <span className="category-badge">
    Category: {data.category}
  </span>
          <h2>{data.name}</h2>
          <p>{data.description}</p>
          <h3>₹{data.price}</h3>

          <button className="add-cart-btn" onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
