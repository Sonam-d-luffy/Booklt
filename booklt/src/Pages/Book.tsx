import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";

interface BookingState {
  expId: string;
  date: string;
  startTime: string;
  endTime: string;
  title?: string;
  price: number;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const Book: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext) as UserContextType;
  const location = useLocation() as { state?: BookingState };

  const booking = location.state;

  const [discountPercent] = useState(0);
  const [finalPrice] = useState(booking?.price || 0);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-700 text-lg mb-4">
          ⚠️ No booking details found. Please select a slot first.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { expId, date, startTime, endTime, title, price } = booking;

  const handleConfirmBooking = async () => {
    if (!currentUser?._id) {
      alert("Please log in to confirm your booking.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/book/exp`, {
        userId: currentUser._id,
        expId,
        date,
        startTime,
        endTime,
        finalPrice,
      });

      alert(res.data.message || "✅ Booking confirmed successfully!");
      navigate(`/yourBookings/${currentUser._id}`);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to confirm booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-500 text-center mb-6">
          Confirm Your Booking
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Experience ID:</strong> {expId}
          </p>
          {title && (
            <p>
              <strong>Experience Name:</strong> {title}
            </p>
          )}
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Start Time:</strong> {startTime}
          </p>
          <p>
            <strong>End Time:</strong> {endTime}
          </p>
          <p>
            <strong>Base Price:</strong> ₹{price}
          </p>
          {discountPercent > 0 && (
            <p className="text-green-600 font-semibold mt-2">
              ✅ Discount Applied: {discountPercent}% off
            </p>
          )}
          <p className="text-lg font-bold text-gray-900 mt-3">
            Final Price: ₹{finalPrice.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleConfirmBooking}
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
        >
          Confirm Booking
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Book;
