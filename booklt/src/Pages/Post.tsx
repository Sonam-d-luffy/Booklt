import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Timing {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Slot {
  date: string;
  timings: Timing[];
}

interface FormDataType {
  title: string;
  description: string;
  price: string;
}

const Post: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [slots, setSlots] = useState<Slot[]>([
    { date: "", timings: [{ startTime: "", endTime: "", available: true }] },
  ]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleDateChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const updated = [...slots];
    updated[index].date = e.target.value;
    setSlots(updated);
  };

  const handleTimeChange = (
    dateIndex: number,
    timeIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...slots];
    (updated[dateIndex].timings[timeIndex] as any)[e.target.name] =
      e.target.value;
    setSlots(updated);
  };

  const toggleAvailability = (dateIndex: number, timeIndex: number) => {
    const updated = [...slots];
    updated[dateIndex].timings[timeIndex].available =
      !updated[dateIndex].timings[timeIndex].available;
    setSlots(updated);
  };

  const addDate = () => {
    setSlots([
      ...slots,
      { date: "", timings: [{ startTime: "", endTime: "", available: true }] },
    ]);
  };

  const addTiming = (dateIndex: number) => {
    const updated = [...slots];
    updated[dateIndex].timings.push({
      startTime: "",
      endTime: "",
      available: true,
    });
    setSlots(updated);
  };

  const removeTiming = (dateIndex: number, timeIndex: number) => {
    const updated = [...slots];
    updated[dateIndex].timings.splice(timeIndex, 1);
    setSlots(updated);
  };

  const removeDate = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (image) data.append("image", image);

      const formattedSlots = slots.map((slot) => ({
        date: slot.date,
        timings: slot.timings.map((t) => ({
          startTime: t.startTime,
          endTime: t.endTime,
          available: t.available,
        })),
      }));

      data.append("slots", JSON.stringify(formattedSlots));

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/exp/post`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("Experience posted successfully ✅");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error posting experience ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-6 sm:py-10">
          {/* 🔹 Add Promo Code Button */}
      <button
        onClick={() => navigate("/promo")}
        className="mb-6 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
      >
        ➕ Add Promo Code
      </button>
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-yellow-500 text-center flex-1">
          Post New Experience
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 text-black font-semibold px-3 sm:px-5 py-1 sm:py-2 rounded-full hover:bg-yellow-500 text-xs sm:text-sm ml-2 transition"
        >
          Home
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 text-sm sm:text-base"
        >
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Title"
            title="Title"
            aria-label="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
          />

          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            title="Description"
            aria-label="Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="border rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-yellow-400 outline-none resize-none text-sm sm:text-base"
          />

          <label htmlFor="price" className="sr-only">
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            placeholder="Price (₹)"
            title="Price"
            aria-label="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
          />

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Available Dates & Timings
            </h3>

            {slots.map((slot, dateIndex) => (
              <div
                key={dateIndex}
                className="border p-3 sm:p-4 rounded-lg mb-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={`date-${dateIndex}`} className="sr-only">
                    Date
                  </label>
                  <input
                    id={`date-${dateIndex}`}
                    type="date"
                    value={slot.date}
                    onChange={(e) => handleDateChange(dateIndex, e)}
                    required
                    className="border rounded-lg p-2 flex-1 text-sm sm:text-base"
                  />
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDate(dateIndex)}
                      className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg ml-2 text-xs sm:text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {slot.timings.map((timing, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="flex flex-col sm:flex-row items-center gap-2 mb-2 border p-2 rounded-lg"
                  >
                    <label
                      htmlFor={`startTime-${dateIndex}-${timeIndex}`}
                      className="sr-only"
                    >
                      Start Time
                    </label>
                    <input
                      id={`startTime-${dateIndex}-${timeIndex}`}
                      type="time"
                      name="startTime"
                      value={timing.startTime}
                      onChange={(e) =>
                        handleTimeChange(dateIndex, timeIndex, e)
                      }
                      required
                      className="border rounded-lg p-2 flex-1 text-sm sm:text-base"
                    />

                    <label
                      htmlFor={`endTime-${dateIndex}-${timeIndex}`}
                      className="sr-only"
                    >
                      End Time
                    </label>
                    <input
                      id={`endTime-${dateIndex}-${timeIndex}`}
                      type="time"
                      name="endTime"
                      value={timing.endTime}
                      onChange={(e) =>
                        handleTimeChange(dateIndex, timeIndex, e)
                      }
                      required
                      className="border rounded-lg p-2 flex-1 text-sm sm:text-base"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleAvailability(dateIndex, timeIndex)
                        }
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          timing.available
                            ? "bg-green-400 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {timing.available ? "Available" : "Unavailable"}
                      </button>
                      {slot.timings.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeTiming(dateIndex, timeIndex)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addTiming(dateIndex)}
                  className="text-yellow-500 font-semibold text-xs sm:text-sm hover:underline"
                >
                  + Add Another Timing
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addDate}
              className="text-yellow-500 font-semibold text-xs sm:text-sm hover:underline"
            >
              + Add Another Date
            </button>
          </div>

          <label htmlFor="image" className="sr-only">
            Upload Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            title="Upload image"
            aria-label="Upload image"
            onChange={handleImageChange}
            required
            className="border rounded-lg p-2 sm:p-3 bg-gray-50 text-sm sm:text-base"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base"
          >
            {loading ? "Uploading..." : "Post Experience"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium text-sm sm:text-base ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Post;
