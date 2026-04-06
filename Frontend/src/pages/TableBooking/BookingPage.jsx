import { useState } from "react";
import TableHeroSection from "../../components/Table/TableHeroSection";
import BookingCard from "../../components/Table/BookingCard";
import Features from "../../components/Table/Features";
import MyBookings from "../../components/Table/MyBookings";

const BookingPage = () => {
  const [tab, setTab] = useState("book");

  return (
    <>
      <TableHeroSection tab={tab} setTab={setTab} />
      {tab === "book" && <BookingCard setTab={setTab} />}
      {tab === "my" && <MyBookings setTab={setTab} />}
      <div className="why-section">
        <h2 className="why-title">Why Book With Us?</h2>
        <Features />
      </div>
    </>
  );
};

export default BookingPage;
