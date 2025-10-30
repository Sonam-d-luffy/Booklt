import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Timing {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Slot {
  date: string;
  timings: Timing[];
}

interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  slots?: Slot[];
}

interface Promo {
  _id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  isActive: boolean;
}

interface RouteParams extends Record<string, string | undefined> {
  expId?: string;
}


const Details: React.FC = () => {
  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const { expId } = useParams<RouteParams>(); // ✅ now type-safe
  const [promos, setPromos] = useState<Promo[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch Experience
  useEffect(() => {
    const fetchExp = async () => {
      try {
        const res = await axios.get<{ exp: Experience }>(
          `${import.meta.env.VITE_API_URL}/exp/${expId}/details`
        );
        setExp(res.data.exp);
      } catch (error) {
        console.error(error);
        setError("Unable to load experience details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, [expId]);

  // Fetch Promo Codes
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await axios.get<{ promos: Promo[] }>(
          `${import.meta.env.VITE_API_URL}/promo/promos`
        );
        setPromos(res.data.promos);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPromo();
  }, []);

  // Apply Promo Code
  const handlePromoApply = async () => {
    if (!promoCode.trim()) {
      alert("Please enter a promo code first!");
      return;
    }

    try {
      const res = await axios.post<{ discountPercent: number }>(
        `${import.meta.env.VITE_API_URL}/promo/apply`,
        { code: promoCode }
      );
      const discountPercent = res.data.discountPercent || 0;
      setDiscount(discountPercent);
      if (exp) {
        setFinalPrice(exp.price - (exp.price * discountPercent) / 100);
      }
      alert(`Promo applied! You got ${discountPercent}% off 🎉`);
    } catch (error) {
      alert("Invalid or expired promo code ❌");
      console.log(error);
    }
  };

  const handleSlotSelect = (date: string, timing: Timing) => {
    setSelectedSlot({ date, ...timing });
  };

  const handleBooking = () => {
    if (!selectedSlot || !exp) {
      alert("Please select a slot first!");
      return;
    }

    navigate("/book", {
      state: {
        expId,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        title: exp.title,
        price: finalPrice || exp.price,
        discount,
        promoCode,
      },
    });
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading experience details...
      </p>
    );
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!exp)
    return (
      <p className="text-center mt-10 text-gray-500">
        No experience details found.
      </p>
    );

  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-5xl w-full bg-white shadow-lg p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SECTION */}
          <div className="md:w-1/2 flex flex-col items-center">
            {exp?.image && (
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-80 object-cover rounded-xl shadow-md"
              />
            )}

            {/* SLOTS */}
            <div className="mt-6 w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Available Slots
              </h3>

              {exp.slots?.length ? (
                exp.slots.map((slot, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50"
                  >
                    <p className="font-medium text-gray-700 mb-2">
                      📅 Date:{" "}
                      <span className="text-gray-900">{slot.date}</span>
                    </p>

                    {slot.timings?.length ? (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {slot.timings.map((timing, i) => {
                          const isSelected =
                            selectedSlot?.date === slot.date &&
                            selectedSlot?.startTime === timing.startTime &&
                            selectedSlot?.endTime === timing.endTime;

                          return (
                            <li
                              key={i}
                              onClick={() => handleSlotSelect(slot.date, timing)}
                              className={`cursor-pointer border rounded-lg p-2 flex justify-between items-center transition ${
                                isSelected
                                  ? "bg-yellow-100 border-yellow-500 shadow-md"
                                  : "hover:bg-gray-100"
                              } ${
                                timing.available
                                  ? "border-green-300"
                                  : "opacity-50 pointer-events-none border-gray-300"
                              }`}
                            >
                              <span className="text-gray-800">
                                🕒 {timing.startTime} - {timing.endTime}
                              </span>
                              <span
                                className={`font-semibold ${
                                  timing.available
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {timing.available ? "Available" : "Booked"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No time slots added for this date.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No slots available.</p>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-yellow-500 mb-4">
              {exp.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {exp.description}
            </p>

            <p className="text-lg font-semibold text-gray-800 mb-2">
              💰 Base Price: ₹{exp.price}
            </p>
            {discount > 0 && (
              <p className="text-lg text-green-600 font-semibold">
                ✅ After Discount: ₹{finalPrice}
              </p>
            )}

            {/* PROMO CODE APPLY SECTION */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="border px-3 py-2 rounded-md w-2/3 focus:outline-yellow-400"
              />
              <button
                onClick={handlePromoApply}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Apply
              </button>
            </div>

            {/* 🧾 LIST ALL PROMOS */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Available Promo Codes
              </h3>
              {promos.length > 0 ? (
                <div className="space-y-3">
                  {promos.map((promo) => (
                    <div
                      key={promo._id}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-yellow-600">
                          🎟️ {promo.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          Discount: {promo.discountPercent}% | Expiry:{" "}
                          {new Date(
                            promo.expiryDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          promo.isActive
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {promo.isActive ? "Active" : "Expired"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No promo codes available right now.
                </p>
              )}
            </div>

            {/* Selected Slot */}
            {selectedSlot && (
              <div className="mt-6 border border-yellow-300 bg-yellow-50 p-3 rounded-lg">
                <p className="font-semibold text-gray-800">Selected Slot:</p>
                <p className="text-gray-700">
                  📅 {selectedSlot.date} — 🕒 {selectedSlot.startTime} -{" "}
                  {selectedSlot.endTime}
                </p>
              </div>
            )}

            {/* Booking Button */}
            <div className="mt-6">
              <button
                onClick={handleBooking}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                {selectedSlot
                  ? "Confirm Booking"
                  : "Select a Slot to Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
