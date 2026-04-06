import { useState ,useEffect} from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import "./styles/booking.css";
import BookingConfirmed from "./BookingConfirmed";
import { useNavigate } from "react-router-dom";


const BookingCard = ({setTab }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [bookingData, setBookingData] = useState(null);

const [form, setForm] = useState({
  restaurantId: "",
  date: "",
  time: "",
  guests: "",
  table: null,
  name: "",
  phone: "",
});

 useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="booking-wrapper">
      {step === 1 && (
        <StepOne form={form} setForm={setForm} onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <StepTwo
          form={form}
          setForm={setForm}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

   {step === 3 && (
  <StepThree
    form={form}
    setForm={setForm}
    onBack={() => setStep(2)}
    onBook={(data) => {
      setBookingData(data);
      setStep(4);
    }}
  />
)}

      {step === 4 && (
        <BookingConfirmed
          form={form}
           bookingData={bookingData}
          onNew={() => {
            setForm({
              date: "",
              time: "",
              guests: "",
              table: null,
              name: "",
              phone: "",
            });
            setStep(1);
          }}
           onMyBookings={() => setTab("my")} 
        />
      )}

    </div>
    
  );
};

export default BookingCard;
