import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to your User model
    required: true,
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experience", // reference to Experience model
    required: true,
  },
  date: {
    type: String, // e.g. "2025-11-05"
    required: true,
  },
  timing: {
    startTime: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    endTime: {
      type: String, // e.g. "12:00 PM"
      required: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking
