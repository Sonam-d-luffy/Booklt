import express from "express";
import Booking from "../models/book.js";


const router = express.Router();
router.post("/exp", async (req, res) => {
  try {
    const { userId, expId, date, startTime, endTime, finalPrice } = req.body;

    if (!userId || !expId || !date || !startTime || !endTime || !finalPrice) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    // Convert time strings to comparable Date objects
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    // 🧩 Check if the user already booked the same slot
    const userExistingBooking = await Booking.findOne({
      user: userId,
      experience: expId,
      date,
      $and: [
        { "timing.startTime": { $lt: endTime } },
        { "timing.endTime": { $gt: startTime } },
      ],
    });

    if (userExistingBooking) {
      return res.status(400).json({
        message: "❌ You’ve already booked this experience for the selected time slot.",
      });
    }

    // // 🧩 Check if any user has booked this same slot
    // const existingBooking = await Booking.findOne({
    //   experience: expId,
    //   date,
    //   $and: [
    //     { "timing.startTime": { $lt: endTime } },
    //     { "timing.endTime": { $gt: startTime } },
    //   ],
    // });

    // if (existingBooking) {
    //   return res.status(400).json({
    //     message: "❌ This slot is already booked by another user.",
    //   });
    // }

    // ✅ Proceed with booking
    const newBooking = new Booking({
      user: userId,
      experience: expId,
      date,
      timing: { startTime, endTime },
      price: finalPrice,
    });

    await newBooking.save();

    res.status(200).json({
      message: "✅ Booking created successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Error in POST /book/exp:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/yourBooking/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("experience", "title price image") // fetch title, price, image from Experience model
      .populate("user", "name email") // fetch basic user details
      .sort({ createdAt: -1 }); // latest first

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({
      message: "✅ Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("❌ Error in GET /yourBooking:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
