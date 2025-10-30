import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Experience {
  image?: string;
  title?: string;
}

interface Timing {
  startTime?: string;
  endTime?: string;
}

interface Booking {
  _id: string;
  experience?: Experience;
  date?: string;
  timing?: Timing;
  finalPrice?: number;
  price?: number;
  status?: string;
  createdAt: string;
}

const YourBookings: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;
      try {
        const res = await axios.get<{ bookings: Booking[] }>(
          `${import.meta.env.VITE_API_URL}/book/yourBooking/${userId}`
        );
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userId]);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600 text-base sm:text-lg">
        Loading bookings...
      </div>
    );

  if (bookings.length === 0) {
    return (
      <div className="text-center mt-20 px-4 text-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          You have no bookings yet 📭
        </h2>

        {/* Buttons on empty state */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-400 transition text-xs sm:text-sm"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md hover:bg-yellow-600 transition text-xs sm:text-sm"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-6">
      {/* Header Buttons and Title */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-400 transition text-xs sm:text-sm"
        >
          Back
        </button>

        <h2 className="text-lg sm:text-2xl font-bold text-yellow-500 text-center">
          Your Bookings
        </h2>

        <button
          onClick={() => navigate("/")}
          className="bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 transition text-xs sm:text-sm"
        >
          Home
        </button>
      </div>

      {/* Bookings Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-100 hover:shadow-lg transition"
          >
            {b.experience?.image && (
              <img
                src={b.experience.image}
                alt={b.experience.title}
                className="w-full h-36 sm:h-48 object-cover rounded-lg mb-3"
              />
            )}

            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
              {b.experience?.title || "Experience"}
            </h3>

            <p className="text-gray-600 text-xs sm:text-sm">
              <strong>Date:</strong> {b.date}
            </p>

            <p className="text-gray-600 text-xs sm:text-sm">
              <strong>Time:</strong> {b.timing?.startTime} - {b.timing?.endTime}
            </p>

            <p className="text-gray-800 font-medium text-xs sm:text-sm mt-2">
              <strong>Price:</strong> ₹{b.finalPrice ?? b.price}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              <strong>Status:</strong> {b.status || "Confirmed"}
            </p>

            <p className="text-[11px] text-gray-400 mt-2">
              Booked on {new Date(b.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBookings;
