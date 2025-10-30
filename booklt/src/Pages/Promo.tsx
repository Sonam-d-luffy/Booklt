import React, { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Promo: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreatePromo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/promo/create`, {
        code,
        discountPercent,
        expiryDate,
      });

      setMessage(res.data.message || "Promo code created successfully!");
      alert("Promo Code created");
      setCode("");
      setDiscountPercent("");
      setExpiryDate("");
      navigate(-1);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to create promo code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6 py-16">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center uppercase tracking-wide">
          Create Promo Code
        </h2>

        <form onSubmit={handleCreatePromo} className="space-y-4">
          {/* Promo Code */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">
              Promo Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20"
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none"
              required
            />
          </div>

          {/* Discount Percent */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">
              Discount (%)
            </label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 20"
              min="1"
              max="90"
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none"
              required
            />
          </div>

         {/* Expiry Date */}
<div>
  <label
    htmlFor="expiryDate"
    className="block text-gray-300 mb-2 font-semibold"
  >
    Expiry Date
  </label>
  <input
    id="expiryDate"
    name="expiryDate"
    type="date"
    value={expiryDate}
    onChange={(e) => setExpiryDate(e.target.value)}
    className="w-full px-4 py-2 rounded-lg text-black focus:outline-none"
    required
    aria-label="Expiry Date"
  />
</div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Promo"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-white font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Promo;
